import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Search, ArrowLeft, MoreHorizontal, Trash2, Video, Upload, Plus, Pencil, RotateCcw, Sparkles, FolderPlus } from 'lucide-react';
import { useCategories, findBaselineCategory, toCanonicalCategoryKey } from '../../utils/categoryManager';
import AddMediaModal from './components/AddMediaModal';
import EditMediaModal from './components/EditMediaModal';
import EditDisplayModal from './components/EditDisplayModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import AddCategoryModal from './components/AddCategoryModal';
import EditCategoryModal from './components/EditCategoryModal';
import DeleteCategoryModal from './components/DeleteCategoryModal';
import { useAdminAuth } from './context/AdminAuthContext';
import { getApiUrl } from '../../utils/api';
import { getFramingStyle, getFramingContainerStyle } from '../../utils/mediaFraming';
import './AdminDashboard.css';

export default function AdminCollectionsPage() {
  const { category: categoryParam } = useParams();
  const navigate = useNavigate();
  const { getAuthHeaders } = useAdminAuth();
  const { categories, refresh: refreshCategories } = useCategories();

  const [activeCategorySlug, setActiveCategorySlug] = useState(categoryParam || 'all');
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [displayModalTarget, setDisplayModalTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all'); // all, photo, video

  // Category Modals State
  const [addCategoryModalOpen, setAddCategoryModalOpen] = useState(false);
  const [editCategoryTarget, setEditCategoryTarget] = useState(null);
  const [deleteCategoryTarget, setDeleteCategoryTarget] = useState(null);

  // Sync category param with active slug
  useEffect(() => {
    if (categoryParam) {
      setActiveCategorySlug(categoryParam.toLowerCase());
    } else {
      setActiveCategorySlug('all');
    }
  }, [categoryParam]);

  // Canonical slug auto-redirect: if user accessed an old/legacy slug (e.g. /events)
  // for a category that now has a new slug (e.g. /engagement), automatically redirect!
  useEffect(() => {
    if (activeCategorySlug !== 'all' && categories.length > 0) {
      const baseline = findBaselineCategory(activeCategorySlug);
      if (baseline) {
        const liveCat = categories.find((c) => c.id === baseline.id);
        if (liveCat && liveCat.slug && liveCat.slug.toLowerCase() !== activeCategorySlug.toLowerCase()) {
          setActiveCategorySlug(liveCat.slug.toLowerCase());
          navigate(`/admin/collections/${liveCat.slug}`, { replace: true });
        }
      }
    }
  }, [activeCategorySlug, categories, navigate]);

  // Fetch media from backend
  const fetchMedia = async () => {
    try {
      setLoading(true);
      const url =
        activeCategorySlug === 'all'
          ? '/api/media'
          : `/api/media/${activeCategorySlug}`;

      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        setMediaList(json.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch media:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [activeCategorySlug]);

  const handleCategorySelect = (slug) => {
    setActiveCategorySlug(slug);
    setTypeFilter('all');
    setSearchQuery('');
    if (slug === 'all') {
      navigate('/admin/collections');
    } else {
      navigate(`/admin/collections/${slug}`);
    }
  };

  const handleMediaAdded = (newMedia) => {
    setMediaList((prev) => [newMedia, ...prev]);
  };

  const handleMediaUpdated = (updatedMedia) => {
    setMediaList((prev) => {
      const exists = prev.some(
        (m) =>
          m._id === updatedMedia._id ||
          (updatedMedia.baselineId && m.baselineId === updatedMedia.baselineId)
      );
      if (exists) {
        return prev.map((m) =>
          m._id === updatedMedia._id ||
          (updatedMedia.baselineId && m.baselineId === updatedMedia.baselineId)
            ? updatedMedia
            : m
        );
      }
      return [updatedMedia, ...prev];
    });
  };

  const handleResetBaseline = async (item) => {
    try {
      const targetId = item._id || item.baselineId || item.id;
      const res = await fetch(`/api/media/${targetId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        credentials: 'include',
      });
      if (res.ok) {
        setMediaList((prev) =>
          prev.filter(
            (m) =>
              m._id !== item._id &&
              m.baselineId !== item.baselineId &&
              m.baselineId !== item.id
          )
        );
      }
    } catch (err) {
      console.error('Failed to reset baseline item:', err);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/media/${deleteTarget._id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        credentials: 'include',
      });

      if (res.ok) {
        setMediaList((prev) => prev.filter((item) => item._id !== deleteTarget._id));
        try {
          const cached = JSON.parse(localStorage.getItem('ds_portfolio_cached_media') || '[]');
          const updated = cached.filter((m) => m._id !== deleteTarget._id);
          localStorage.setItem('ds_portfolio_cached_media', JSON.stringify(updated));
        } catch {}
        window.dispatchEvent(new CustomEvent('ds_media_updated'));
        setDeleteTarget(null);
      }
    } catch (err) {
      console.error('Failed to delete media item:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  // Category handlers
  const handleCategoryAdded = async (newCat) => {
    await refreshCategories();
    if (newCat?.slug) {
      handleCategorySelect(newCat.slug);
    }
  };

  const handleCategoryUpdated = async (updatedCat) => {
    await refreshCategories();
    if (updatedCat?.slug && updatedCat.slug !== activeCategorySlug && activeCategorySlug !== 'all') {
      handleCategorySelect(updatedCat.slug);
    } else {
      fetchMedia();
    }
  };

  const handleCategoryDeleted = async (deletedCat) => {
    await refreshCategories();
    if (activeCategorySlug === deletedCat.slug || activeCategorySlug === deletedCat.id) {
      handleCategorySelect('all');
    }
  };

  // Active Category Data with canonical fallback
  const matchedBaseline = findBaselineCategory(activeCategorySlug);
  const currentCategoryObj =
    categories.find(
      (c) =>
        c.slug?.toLowerCase() === activeCategorySlug.toLowerCase() ||
        toCanonicalCategoryKey(c.slug) === toCanonicalCategoryKey(activeCategorySlug) ||
        c.id === activeCategorySlug ||
        (matchedBaseline && c.id === matchedBaseline.id)
    ) || matchedBaseline;

  // Filter media by active category, type, and search query
  const filteredMedia = mediaList
    .filter((item) => {
      if (activeCategorySlug === 'all') return true;
      const targetSlug = currentCategoryObj?.slug || activeCategorySlug;
      return (
        item.category?.toLowerCase() === targetSlug.toLowerCase() ||
        toCanonicalCategoryKey(item.category) === toCanonicalCategoryKey(targetSlug)
      );
    })
    .filter((item) => {
      const matchesType = typeFilter === 'all' || item.type === typeFilter;
      const matchesSearch =
        !searchQuery ||
        item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesSearch;
    });

  // Media card renderer
  const renderMediaCard = (item) => (
    <div
      key={item._id || item.id}
      className="admin-media-card group"
    >
      {/* Framed Media Preview (Padded on all sides) */}
      <div className="photo-frame" style={getFramingContainerStyle(item.display)}>
        {item.type === 'video' ? (
          <video
            src={getApiUrl(item.url)}
            preload="metadata"
            muted
            playsInline
            className="w-full h-full object-cover transition-transform duration-300"
            style={getFramingStyle(item.display)}
          />
        ) : (
          <img
            src={getApiUrl(item.url)}
            alt={item.title || 'Media'}
            className="w-full h-full object-cover transition-transform duration-300"
            style={getFramingStyle(item.display)}
            loading="lazy"
          />
        )}

        {/* Quick Edit Hover Overlay: Edit Photo Button */}
        <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center pointer-events-none z-10 px-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setEditTarget(item);
            }}
            className="pointer-events-auto inline-flex items-center gap-1.5 py-2 px-4 rounded-full border border-[#E3DBCC] bg-[#FAF7F2] hover:bg-[#F3EFE6] text-[11px] uppercase tracking-[0.14em] font-medium text-[#101010] shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
            title="Edit photo details, replace file, or adjust framing"
          >
            <Pencil size={11} />
            <span>EDIT PHOTO</span>
          </button>
        </div>

        {/* Video Play Badge */}
        {item.type === 'video' && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-10 h-10 rounded-full bg-white/85 backdrop-blur-xs flex items-center justify-center text-[#181818] shadow-md">
              <Video size={15} className="ml-0.5" />
            </div>
          </div>
        )}
      </div>

      {/* Card Meta with generous internal padding */}
      <div className="card-meta">
        {/* Type + Actions Row */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] tracking-[0.14em] uppercase font-bold text-[#7A756D]">
              {item.type === 'video' ? 'Video' : 'Photo'}
            </span>
            {activeCategorySlug === 'all' && item.category && (
              <span className="text-[9.5px] uppercase tracking-wider text-[#8E887E] bg-[#F0EAE0] px-2 py-0.5 rounded-full font-medium">
                {item.category}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setEditTarget(item)}
              className="inline-flex items-center gap-1.5 py-1.5 px-3.5 rounded-full border border-[#E3DBCC] bg-[#FAF7F2] hover:bg-[#F3EFE6] text-[11px] uppercase tracking-[0.14em] font-medium text-[#101010] transition-colors cursor-pointer"
              title="Edit photo, replace image, or adjust framing"
            >
              <Pencil size={11} />
              <span>EDIT</span>
            </button>
            <button
              type="button"
              onClick={() => setDeleteTarget(item)}
              className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-800 transition-colors cursor-pointer"
              title="Delete asset"
            >
              <Trash2 size={12} />
            </button>
          </div>
        </div>

        {/* Filename / Title */}
        <h5 className="font-sans font-semibold text-[13px] text-[#181818] truncate leading-snug">
          {item.title || `${item.category || 'media'}-upload.jpg`}
        </h5>

        {/* Size & Date */}
        <p className="text-[11px] text-[#8E887E] mt-1">
          {item.size || '2.4 MB'} · {item.createdAt
            ? new Date(item.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
            : item.date || '2025'}
        </p>
      </div>
    </div>
  );

  return (
    <div className="w-full" style={{ display: 'flex', flexDirection: 'column', gap: '52px' }}>

      {/* ─── Page Header ─── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="admin-eyebrow block mb-2">
            COLLECTION REPOSITORY
          </span>
          <h1 className="admin-serif-title text-[36px] sm:text-[40px] lg:text-[44px]">
            {activeCategorySlug === 'all'
              ? 'Collection Repository'
              : currentCategoryObj?.name || activeCategorySlug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
          </h1>
          <p className="admin-subtext mt-2">
            {activeCategorySlug === 'all'
              ? 'Manage your media across all collections.'
              : currentCategoryObj?.tagline || `Timeless visual stories curated for ${currentCategoryObj?.name || activeCategorySlug}.`}
          </p>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 shrink-0">
          {activeCategorySlug !== 'all' && (
            <button
              type="button"
              onClick={() => handleCategorySelect('all')}
              className="admin-link text-[12px] mr-1"
            >
              <ArrowLeft size={14} /> Back to Collections
            </button>
          )}

          {/* Search Box */}
          <div className="flex items-center gap-2 px-3.5 h-[38px] border border-[#E8E2D6] rounded-[8px] bg-white text-[13px] w-[200px] sm:w-[240px] focus-within:border-[#181818] transition-colors">
            <Search size={14} className="text-[#8E887E] shrink-0" />
            <input
              type="text"
              placeholder="Search collections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-[#181818] placeholder:text-[#8E887E] outline-none w-full text-[13px]"
            />
          </div>

          {/* + Add Category Button */}
          <button
            type="button"
            onClick={() => setAddCategoryModalOpen(true)}
            className="h-[38px] px-3.5 rounded-[8px] border border-[#E8E2D6] bg-white text-[#181818] hover:bg-[#FAF8F5] text-[12px] font-medium flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
            title="Create a new portfolio collection category"
          >
            <FolderPlus size={14} />
            <span>Add Category</span>
          </button>

          {/* + Add Media Button */}
          <button
            type="button"
            onClick={() => setAddModalOpen(true)}
            className="h-[38px] px-4 rounded-[8px] bg-[#101010] text-white text-[12px] font-medium flex items-center gap-1.5 hover:bg-[#252525] transition-colors cursor-pointer shrink-0"
          >
            <Plus size={14} strokeWidth={2.5} />
            <span>Add Media</span>
          </button>
        </div>
      </div>

      {/* ─── Category Banner (Single Category view with Edit & Delete Category) ─── */}
      {activeCategorySlug !== 'all' && currentCategoryObj && (
        <div className="p-5 rounded-2xl border border-[#E8E2D6] bg-white flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-xs -mt-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-16 h-16 rounded-xl overflow-hidden border border-[#E8E2D6] shrink-0 bg-[#FAF8F5]">
              <img
                src={currentCategoryObj.coverImage || currentCategoryObj.featured?.image}
                alt={currentCategoryObj.name}
                className="w-full h-full"
                style={getFramingStyle(currentCategoryObj.display || currentCategoryObj.coverDisplay)}
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-serif text-[22px] text-[#181818] font-normal">
                  {currentCategoryObj.name}
                </h3>
                <span className="text-[10px] tracking-[0.14em] uppercase text-[#7A756D] font-semibold bg-[#FAF8F5] border border-[#E8E2D6] px-2 py-0.5 rounded-full">
                  /{currentCategoryObj.slug}
                </span>
              </div>
              <p className="text-[12px] text-[#7A756D] mt-0.5 line-clamp-1">
                {currentCategoryObj.tagline || 'Custom Photography Collection'}
              </p>
            </div>
          </div>

          {/* Services, Edit & Delete Category Actions */}
          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              to={`/admin/services/${currentCategoryObj.slug}`}
              className="h-[34px] px-3.5 rounded-lg border border-[#181818] bg-[#181818] text-[#FAF8F5] hover:bg-[#333] text-[12px] font-medium flex items-center gap-1.5 transition-colors no-underline cursor-pointer"
              title={`Manage services and packages for ${currentCategoryObj.name}`}
            >
              <Sparkles size={13} className="text-[#C2A378]" />
              <span>Services ({currentCategoryObj.name})</span>
            </Link>

            <button
              type="button"
              onClick={() => setEditCategoryTarget(currentCategoryObj)}
              className="h-[34px] px-3.5 rounded-lg border border-[#E8E2D6] bg-[#FAF8F5] text-[#181818] hover:bg-[#F0EAE0] text-[12px] font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Edit category details and cover photo"
            >
              <Pencil size={13} />
              <span>Edit Category</span>
            </button>
            <button
              type="button"
              onClick={() => setDeleteCategoryTarget(currentCategoryObj)}
              className="h-[34px] px-3.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-[12px] font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Delete this category"
            >
              <Trash2 size={13} />
              <span>Delete Category</span>
            </button>
          </div>
        </div>
      )}

      {/* ─── Category Tabs (All view) OR Type Pill Filters (Single category) ─── */}
      {activeCategorySlug === 'all' ? (
        <div className="border-b border-[#E8E2D6] pb-0 -mt-2">
          <div className="flex items-center gap-7 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => handleCategorySelect('all')}
              className={`admin-tab ${activeCategorySlug === 'all' ? 'active' : ''}`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id || cat.slug}
                type="button"
                onClick={() => handleCategorySelect(cat.slug)}
                className={`admin-tab ${activeCategorySlug === cat.slug ? 'active' : ''}`}
              >
                {cat.name}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setAddCategoryModalOpen(true)}
              className="admin-tab text-[#7A756D] hover:text-[#181818] flex items-center gap-1 shrink-0 cursor-pointer"
              style={{ borderBottomColor: 'transparent' }}
              title="Add a new category"
            >
              <Plus size={13} />
              <span>New Category</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 -mt-2">
          {['all', 'photo', 'video'].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setTypeFilter(type)}
              className={`admin-pill capitalize ${typeFilter === type ? 'active' : ''}`}
            >
              {type === 'all' ? 'All' : type === 'photo' ? 'Photos' : 'Videos'}
            </button>
          ))}
        </div>
      )}

      {/* ─── SECTION: Custom Uploads ─── */}
      {/* ─── SECTION: Collection Media ─── */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="flex items-baseline justify-between">
          <div>
            <h3 className="font-sans font-semibold text-[16px] text-[#181818]">
              {activeCategorySlug === 'all'
                ? 'All Portfolio Media'
                : `${currentCategoryObj?.name || 'Collection'} Media`}
            </h3>
            <p className="text-[12px] text-[#7A756D] mt-1">
              Manage photography and video assets for this collection.
            </p>
          </div>
          <span className="text-[12px] text-[#7A756D] font-normal">
            {filteredMedia.length} {filteredMedia.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        {/* Upload Dropzone — opens the modal form (single-category view) */}
        {activeCategorySlug !== 'all' && (
          <div
            onClick={() => setAddModalOpen(true)}
            className="admin-dropzone cursor-pointer"
          >
            <div className="w-11 h-11 rounded-full bg-[#EFEAE2] flex items-center justify-center mx-auto mb-3 text-[#5C5852]">
              <Upload size={18} strokeWidth={1.5} />
            </div>
            <h4 className="font-sans font-semibold text-[14px] text-[#181818] mb-1">
              Add photos or videos
            </h4>
            <p className="text-[12px] text-[#7A756D] mb-5">
              Upload media for this collection
            </p>
            <button
              type="button"
              className="px-5 py-2.5 rounded-full bg-[#101010] text-white text-[12px] font-medium hover:bg-[#252525] transition-colors"
            >
              Choose Files
            </button>
          </div>
        )}

        {/* Uploaded media grid */}
        {loading ? (
          <div className="py-14 text-center text-xs text-[#7A756D]">
            Loading media items...
          </div>
        ) : filteredMedia.length === 0 ? (
          <div className="p-10 text-center bg-white border border-dashed border-[#D4CCC0] rounded-[14px]">
            <p className="text-[13px] text-[#5C5852] mb-4">
              {activeCategorySlug === 'all'
                ? 'No media uploaded to the portfolio yet.'
                : `No media uploaded for ${currentCategoryObj?.name || 'this collection'} yet.`}
            </p>
            <button
              type="button"
              onClick={() => setAddModalOpen(true)}
              className="px-4 py-2 rounded-[8px] bg-[#101010] text-white text-[12px] font-medium inline-flex items-center gap-1.5 hover:bg-[#252525] transition-colors cursor-pointer"
            >
              <Plus size={14} /> Add Media
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredMedia.map((item) => renderMediaCard(item))}
          </div>
        )}
      </section>

      {/* Add Media Modal */}
      <AddMediaModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSuccess={handleMediaAdded}
        defaultCategory={activeCategorySlug !== 'all' ? activeCategorySlug : 'weddings'}
      />

      {/* Edit Media Modal */}
      <EditMediaModal
        isOpen={!!editTarget}
        onClose={() => setEditTarget(null)}
        onSuccess={handleMediaUpdated}
        onOpenDisplay={(item) => setDisplayModalTarget(item)}
        mediaItem={editTarget}
      />

      {/* Edit Display Framing Modal */}
      <EditDisplayModal
        isOpen={!!displayModalTarget}
        mediaItem={displayModalTarget}
        onClose={() => setDisplayModalTarget(null)}
        onOpenEditMedia={(item) => {
          setDisplayModalTarget(null);
          setEditTarget(item);
        }}
        onSuccess={(updated) => {
          handleMediaUpdated(updated);
          setDisplayModalTarget(null);
        }}
      />

      {/* Delete Media Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
        mediaItem={deleteTarget}
      />

      {/* Add Category Modal */}
      <AddCategoryModal
        isOpen={addCategoryModalOpen}
        onClose={() => setAddCategoryModalOpen(false)}
        onSuccess={handleCategoryAdded}
      />

      {/* Edit Category Modal */}
      <EditCategoryModal
        isOpen={!!editCategoryTarget}
        category={editCategoryTarget}
        onClose={() => setEditCategoryTarget(null)}
        onSuccess={handleCategoryUpdated}
      />

      {/* Delete Category Modal */}
      <DeleteCategoryModal
        isOpen={!!deleteCategoryTarget}
        category={deleteCategoryTarget}
        onClose={() => setDeleteCategoryTarget(null)}
        onSuccess={handleCategoryDeleted}
      />
    </div>
  );
}
