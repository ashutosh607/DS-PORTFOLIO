import React, { useState, useEffect, useRef } from 'react';
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

  const fileInputRef = useRef(null);

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

  // Quick file upload handler for dropzone
  const handleQuickUpload = async (e) => {
    const files = e.target.files;
    if (!files?.length) return;

    const file = files[0];
    const isVideo = file.type.startsWith('video/');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', activeCategorySlug === 'all' ? 'weddings' : activeCategorySlug);
    formData.append('type', isVideo ? 'video' : 'photo');

    try {
      const res = await fetch('/api/media', {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        handleMediaAdded(data.data);
      }
    } catch (err) {
      console.error('Quick upload failed:', err);
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
          date: '16 Sep 2025',
        },
        ...(cat.supporting || []).map((sup, idx) => ({
          id: `seed-sup-${cat.id}-${idx}`,
          title: sup.title ? `${sup.title.toLowerCase().replace(/\s+/g, '-')}.jpg` : `${cat.slug}-0${idx + 2}.jpg`,
          category: cat.slug,
          type: sup.type || 'photo',
          url: sup.image,
          size: sup.type === 'video' ? '18.8 MB' : '2.8 MB',
          date: `${14 - idx} Sep 2025`,
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
        size: '2.4 MB',
        date: '16 Sep 2025',
      },
      ...(currentCategoryObj.supporting || []).map((sup, idx) => ({
        id: `seed-sup-${currentCategoryObj.id}-${idx}`,
        title: sup.title ? `${sup.title.toLowerCase().replace(/\s+/g, '-')}.jpg` : `${currentCategoryObj.slug}-0${idx + 2}.jpg`,
        category: currentCategoryObj.slug,
        type: sup.type || 'photo',
        url: sup.image,
        size: sup.type === 'video' ? '18.8 MB' : '2.8 MB',
        date: `${14 - idx} Sep 2025`,
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

  return (
    <div className="space-y-8 w-full">
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="admin-eyebrow block mb-2">
            COLLECTION REPOSITORY
          </span>
          <h1 className="admin-serif-title text-[36px] sm:text-[40px] lg:text-[42px]">
            {activeCategorySlug === 'all'
              ? 'Collection Repository'
              : currentCategoryObj?.name || 'Category Gallery'}
          </h1>
          <p className="admin-subtext mt-1.5">
            {activeCategorySlug === 'all'
              ? 'Manage your media across all collections.'
              : currentCategoryObj?.subtitle || `Timeless visual stories curated for ${currentCategoryObj?.name}.`}
          </p>
        </div>

        {/* Right Actions: Search + Add Media Button */}
        <div className="flex items-center gap-3">
          {/* Back button if in category detail */}
          {activeCategorySlug !== 'all' && (
            <button
              type="button"
              onClick={() => handleCategorySelect('all')}
              className="admin-link text-[12px] mr-2"
            >
              <ArrowLeft size={14} /> Back to Collections
            </button>
          )}

          {/* Search Box */}
          <div className="flex items-center gap-2 px-3.5 h-[38px] border border-[#E8E2D6] rounded-[8px] bg-white text-[13px] w-[200px] sm:w-[260px] focus-within:border-[#181818] transition-colors">
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

      {/* Category Navigation Tabs */}
      <div className="border-b border-[#E8E2D6] pb-0">
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

      {/* Type Filter Pills (when inside a single category) */}
      {activeCategorySlug !== 'all' && (
        <div className="flex items-center gap-2">
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

      {/* Quick Upload Dropzone (When inside a specific category) */}
      {activeCategorySlug !== 'all' && (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="admin-dropzone cursor-pointer"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            className="hidden"
            onChange={handleQuickUpload}
          />
          <div className="w-10 h-10 rounded-full bg-[#EFEAE2] flex items-center justify-center mx-auto mb-3 text-[#5C5852]">
            <Upload size={18} strokeWidth={1.5} />
          </div>
          <h4 className="font-sans font-semibold text-[14px] text-[#181818] mb-1">
            Add photos or videos
          </h4>
          <p className="text-[12px] text-[#7A756D] mb-4">
            Upload media for this collection (JPG, PNG, WEBP, MP4, MOV up to 100MB)
          </p>
          <button
            type="button"
            className="px-5 py-2 rounded-full bg-[#101010] text-white text-[12px] font-medium inline-flex items-center gap-1.5 hover:bg-[#252525] transition-colors"
          >
            Choose Files
          </button>
        </div>
      )}

      {/* SECTION 1: Custom Uploads */}
      <section className="space-y-4">
        <div className="flex items-baseline justify-between">
          <div>
            <h3 className="font-sans font-semibold text-[15px] text-[#181818]">
              Custom Uploads
            </h3>
            <p className="text-[12px] text-[#7A756D] mt-0.5">
              Media uploaded through the admin panel.
            </p>
          </div>
          <span className="text-[12px] text-[#7A756D] font-normal">
            {filteredCustomMedia.length} {filteredCustomMedia.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-[#7A756D]">
            Loading media items...
          </div>
        ) : filteredCustomMedia.length === 0 ? (
          <div className="p-8 text-center bg-white border border-dashed border-[#D4CCC0] rounded-[14px]">
            <p className="text-[13px] text-[#5C5852] mb-3">
              No custom uploads yet in this view.
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredCustomMedia.map((item) => (
              <div
                key={item._id}
                className="admin-card rounded-[14px] overflow-hidden group flex flex-col justify-between"
              >
                {/* Media Preview Box */}
                <div className="relative aspect-[16/10] bg-[#EFEAE2] overflow-hidden">
                  {item.type === 'video' ? (
                    <video src={item.url} className="w-full h-full object-cover" />
                  ) : (
                    <img
                      src={item.url}
                      alt={item.title || 'Custom media'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}

                  {/* Video Play Badge */}
                  {item.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-9 h-9 rounded-full bg-white/80 backdrop-blur-xs flex items-center justify-center text-[#181818] shadow-sm">
                        <Video size={14} className="ml-0.5" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Info & Actions */}
                <div className="p-3.5 bg-white">
                  <div className="flex items-center justify-between text-[#7A756D]">
                    <span className="text-[10px] tracking-[0.14em] uppercase font-bold">
                      {item.type === 'video' ? 'VIDEO' : 'PHOTO'}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="text-[#8E887E] hover:text-[#181818] transition-colors p-0.5"
                        title="Options"
                      >
                        <MoreHorizontal size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(item)}
                        className="text-[#8E887E] hover:text-red-600 transition-colors p-0.5 cursor-pointer"
                        title="Delete asset"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <h5 className="font-sans font-semibold text-[13px] text-[#181818] truncate mt-1">
                    {item.title || `${item.category || 'media'}-upload.jpg`}
                  </h5>

                  <p className="text-[11px] text-[#8E887E] mt-0.5">
                    {item.size || '2.4 MB'} · {item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '16 Sep 2025'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* SECTION 2: Baseline Portfolio */}
      <section className="space-y-4 pt-4">
        <div className="flex items-baseline justify-between">
          <div>
            <h3 className="font-sans font-semibold text-[15px] text-[#181818]">
              Baseline Portfolio
            </h3>
            <p className="text-[12px] text-[#7A756D] mt-0.5">
              Default media from the original portfolio.
            </p>
          </div>
          <span className="text-[12px] text-[#7A756D] font-normal">
            {filteredBaseline.length} {filteredBaseline.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredBaseline.map((item) => (
            <div
              key={item.id}
              className="admin-card rounded-[14px] overflow-hidden group flex flex-col justify-between"
            >
              {/* Media Preview Box */}
              <div className="relative aspect-[16/10] bg-[#EFEAE2] overflow-hidden">
                {item.type === 'video' ? (
                  <video src={item.url} className="w-full h-full object-cover" />
                ) : (
                  <img
                    src={item.url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                )}

                {/* Video Play Badge */}
                {item.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-9 h-9 rounded-full bg-white/80 backdrop-blur-xs flex items-center justify-center text-[#181818] shadow-sm">
                      <Video size={14} className="ml-0.5" />
                    </div>
                  </div>
                )}
              </div>

              {/* Card Info & Actions */}
              <div className="p-3.5 bg-white">
                <div className="flex items-center justify-between text-[#7A756D]">
                  <span className="text-[10px] tracking-[0.14em] uppercase font-bold">
                    {item.type === 'video' ? 'VIDEO' : 'PHOTO'}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="text-[#8E887E] hover:text-[#181818] transition-colors p-0.5"
                      title="Options"
                    >
                      <MoreHorizontal size={14} />
                    </button>
                    <button
                      type="button"
                      disabled
                      className="text-[#D4CCC0] p-0.5 cursor-not-allowed"
                      title="Baseline assets are locked"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <h5 className="font-sans font-semibold text-[13px] text-[#181818] truncate mt-1">
                  {item.title}
                </h5>

                <p className="text-[11px] text-[#8E887E] mt-0.5">
                  {item.size} · {item.date}
                </p>
              </div>
            </div>
          ))}
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
