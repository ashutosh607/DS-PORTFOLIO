import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Search, ArrowLeft, MoreHorizontal, Trash2, Video, Upload, Plus } from 'lucide-react';
import { CATEGORIES } from '../collections/data/collectionsData';
import AddMediaModal from './components/AddMediaModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import { useAdminAuth } from './context/AdminAuthContext';
import './AdminDashboard.css';

export default function AdminCollectionsPage() {
  const { category: categoryParam } = useParams();
  const navigate = useNavigate();
  const { getAuthHeaders } = useAdminAuth();

  const [activeCategorySlug, setActiveCategorySlug] = useState(categoryParam || 'all');
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all'); // all, photo, video



  // Sync category param with active slug
  useEffect(() => {
    if (categoryParam) {
      setActiveCategorySlug(categoryParam.toLowerCase());
    } else {
      setActiveCategorySlug('all');
    }
  }, [categoryParam]);

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
        setDeleteTarget(null);
      }
    } catch (err) {
      console.error('Failed to delete media item:', err);
    } finally {
      setIsDeleting(false);
    }
  };



  // Active Category Data
  const currentCategoryObj = CATEGORIES.find(
    (c) => c.slug.toLowerCase() === activeCategorySlug.toLowerCase()
  );

  // Baseline items computation
  const getBaselineItems = () => {
    if (activeCategorySlug === 'all') {
      return CATEGORIES.flatMap((cat) => [
        {
          id: `seed-cover-${cat.id}`,
          title: `${cat.slug}-01.jpg`,
          category: cat.slug,
          type: 'photo',
          url: cat.coverImage,
          size: '2.4 MB',
          date: '2025',
        },
        ...(cat.supporting || []).map((sup, idx) => ({
          id: `seed-sup-${cat.id}-${idx}`,
          title: sup.title ? `${sup.title.toLowerCase().replace(/\s+/g, '-')}.jpg` : `${cat.slug}-0${idx + 2}.jpg`,
          category: cat.slug,
          type: sup.type || 'photo',
          url: sup.image,
          size: sup.type === 'video' ? '18.8 MB' : '2.8 MB',
          date: '2025',
        })),
      ]);
    }

    if (!currentCategoryObj) return [];

    return [
      {
        id: `seed-cover-${currentCategoryObj.id}`,
        title: `${currentCategoryObj.slug}-01.jpg`,
        category: currentCategoryObj.slug,
        type: 'photo',
        url: currentCategoryObj.coverImage,
        size: '2.3 MB',
        date: '2025',
      },
      ...(currentCategoryObj.supporting || []).map((sup, idx) => ({
        id: `seed-sup-${currentCategoryObj.id}-${idx}`,
        title: sup.title ? `${sup.title.toLowerCase().replace(/\s+/g, '-')}.jpg` : `${currentCategoryObj.slug}-0${idx + 2}.jpg`,
        category: currentCategoryObj.slug,
        type: sup.type || 'photo',
        url: sup.image,
        size: sup.type === 'video' ? '16.7 MB' : '2.5 MB',
        date: '2025',
      })),
    ];
  };

  const baselineItems = getBaselineItems();

  // Filter items by type and search query
  const filteredCustomMedia = mediaList.filter((item) => {
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    const matchesSearch =
      !searchQuery ||
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const filteredBaseline = baselineItems.filter((item) => {
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    const matchesSearch =
      !searchQuery ||
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  // Shared media card renderer with generous padding and framed presentation
  const renderMediaCard = (item, isBaseline = false) => (
    <div
      key={item._id || item.id}
      className="admin-media-card group"
    >
      {/* Framed Media Preview (Padded on all sides) */}
      <div className="photo-frame">
        {item.type === 'video' ? (
          <video src={item.url} className="w-full h-full object-cover" />
        ) : (
          <img
            src={item.url}
            alt={item.title || 'Media'}
            className="w-full h-full object-cover"
          />
        )}

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
            {isBaseline && (
              <span className="text-[9px] tracking-[0.1em] uppercase font-medium text-[#8E887E] bg-[#F0EAE0] px-2 py-0.5 rounded-full">
                Baseline
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="text-[#8E887E] hover:text-[#181818] transition-colors p-1"
              title="Options"
            >
              <MoreHorizontal size={15} />
            </button>
            <button
              type="button"
              onClick={() => !isBaseline && setDeleteTarget(item)}
              disabled={isBaseline}
              className={`p-1 transition-colors ${
                isBaseline
                  ? 'text-[#D4CCC0] cursor-not-allowed'
                  : 'text-[#8E887E] hover:text-red-600 cursor-pointer'
              }`}
              title={isBaseline ? 'Baseline assets are locked' : 'Delete asset'}
            >
              <Trash2 size={15} />
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
              : currentCategoryObj?.name || 'Category Gallery'}
          </h1>
          <p className="admin-subtext mt-2">
            {activeCategorySlug === 'all'
              ? 'Manage your media across all collections.'
              : currentCategoryObj?.tagline || `Timeless visual stories curated for ${currentCategoryObj?.name}.`}
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
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategorySelect(cat.slug)}
                className={`admin-tab ${activeCategorySlug === cat.slug ? 'active' : ''}`}
              >
                {cat.name}
              </button>
            ))}
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
      <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="flex items-baseline justify-between">
          <div>
            <h3 className="font-sans font-semibold text-[16px] text-[#181818]">
              Custom Uploads
            </h3>
            <p className="text-[12px] text-[#7A756D] mt-1">
              Media uploaded through the admin panel.
            </p>
          </div>
          <span className="text-[12px] text-[#7A756D] font-normal">
            {filteredCustomMedia.length} {filteredCustomMedia.length === 1 ? 'item' : 'items'}
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
        ) : filteredCustomMedia.length === 0 && activeCategorySlug === 'all' ? (
          <div className="p-10 text-center bg-white border border-dashed border-[#D4CCC0] rounded-[14px]">
            <p className="text-[13px] text-[#5C5852] mb-4">
              No custom uploads yet.
            </p>
            <button
              type="button"
              onClick={() => setAddModalOpen(true)}
              className="px-4 py-2 rounded-[8px] bg-[#101010] text-white text-[12px] font-medium inline-flex items-center gap-1.5 hover:bg-[#252525] transition-colors cursor-pointer"
            >
              <Plus size={14} /> Add Media
            </button>
          </div>
        ) : filteredCustomMedia.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredCustomMedia.map((item) => renderMediaCard(item, false))}
          </div>
        ) : null}
      </section>

      {/* ─── SECTION: Baseline Portfolio ─── */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div className="border-t border-[#E8E2D6] pt-10">
          <div className="flex items-baseline justify-between">
            <div>
              <h3 className="font-sans font-semibold text-[16px] text-[#181818]">
                {activeCategorySlug === 'all' ? 'Baseline Portfolio' : 'Baseline Portfolio Specimens'}
              </h3>
              <p className="text-[12px] text-[#7A756D] mt-1">
                Default media from the original portfolio.
              </p>
            </div>
            <span className="text-[12px] text-[#7A756D] font-normal">
              {filteredBaseline.length} {filteredBaseline.length === 1 ? 'item' : 'items'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredBaseline.map((item) => renderMediaCard(item, true))}
        </div>
      </section>

      {/* Add Media Modal */}
      <AddMediaModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSuccess={handleMediaAdded}
        defaultCategory={activeCategorySlug !== 'all' ? activeCategorySlug : 'weddings'}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
        mediaItem={deleteTarget}
      />
    </div>
  );
}
