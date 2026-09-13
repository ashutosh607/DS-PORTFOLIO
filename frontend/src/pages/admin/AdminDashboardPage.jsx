import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CATEGORIES } from '../collections/data/collectionsData';
import AddMediaModal from './components/AddMediaModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import { useAdminAuth } from './context/AdminAuthContext';

export default function AdminDashboardPage() {
  const { getAuthHeaders } = useAdminAuth();
  const navigate = useNavigate();

  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch all media
  const fetchMedia = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/media');
      if (res.ok) {
        const json = await res.json();
        setMediaList(json.data || []);
      }
    } catch (err) {
      console.error('Failed to load media:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

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
        setMediaList((prev) => prev.filter((m) => m._id !== deleteTarget._id));
        setDeleteTarget(null);
      }
    } catch (err) {
      console.error('Failed to delete media:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  // Compute category counts
  const categoryStats = CATEGORIES.map((cat) => {
    const catMedia = mediaList.filter(
      (m) => m.category?.toLowerCase() === cat.slug.toLowerCase()
    );
    const photosCount = catMedia.filter((m) => m.type !== 'video').length;
    const videosCount = catMedia.filter((m) => m.type === 'video').length;

    // Base seed count from collectionsData if no custom uploads yet
    const seedPhotosCount = (cat.supporting?.length || 0) + 1; // supporting + featured

    return {
      ...cat,
      photosCount: photosCount > 0 ? photosCount : seedPhotosCount,
      videosCount,
      customUploadsCount: catMedia.length,
    };
  });

  const totalPhotos = categoryStats.reduce((acc, cat) => acc + cat.photosCount, 0);
  const totalVideos = categoryStats.reduce((acc, cat) => acc + cat.videosCount, 0);
  const recentMedia = mediaList.slice(0, 8);

  return (
    <div className="space-y-[56px]">
      {/* 3. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-[28px] border-b border-[#E3DBCC]">
        <div>
          <span className="font-mono text-[11px] tracking-[0.25em] text-[#7A7770] uppercase block mb-3">
            STUDIO OVERVIEW
          </span>
          <h1
            style={{ fontFamily: 'var(--font-serif)' }}
            className="text-[28px] sm:text-[32px] lg:text-[38px] font-normal leading-tight text-[#101010] tracking-[-0.01em]"
          >
            Collections Dashboard
          </h1>
          <p className="font-sans text-xs sm:text-sm text-[#7A7770] mt-[14px]">
            Comprehensive archive metrics and collection media management.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setAddModalOpen(true)}
          className="h-[48px] px-[24px] rounded-full bg-[#101010] hover:bg-[#262422] text-[#FDFCF8] font-sans text-xs font-semibold tracking-[0.14em] uppercase transition-all duration-200 cursor-pointer shadow-sm hover:-translate-y-0.5 flex items-center justify-center gap-2 shrink-0"
        >
          <span>+ ADD MEDIA</span>
        </button>
      </div>

      {/* 7. Clean Statistics Grid */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[20px] lg:gap-[24px]">
          <div className="p-[24px] lg:p-[28px] bg-[#FAF8F5] border border-[#E3DBCC] rounded-[16px]">
            <span className="block font-mono text-[11px] tracking-[0.18em] text-[#7A7770] uppercase mb-[12px]">
              Total Collections
            </span>
            <span className="font-serif text-3xl sm:text-4xl text-[#101010] font-normal block leading-none mb-[8px]">
              {CATEGORIES.length}
            </span>
            <span className="block font-sans text-xs text-[#7A7770]">
              Active portfolio galleries
            </span>
          </div>

          <div className="p-[24px] lg:p-[28px] bg-[#FAF8F5] border border-[#E3DBCC] rounded-[16px]">
            <span className="block font-mono text-[11px] tracking-[0.18em] text-[#7A7770] uppercase mb-[12px]">
              Total Photos
            </span>
            <span className="font-serif text-3xl sm:text-4xl text-[#101010] font-normal block leading-none mb-[8px]">
              {totalPhotos}
            </span>
            <span className="block font-sans text-xs text-[#7A7770]">
              Curated &amp; custom stills
            </span>
          </div>

          <div className="p-[24px] lg:p-[28px] bg-[#FAF8F5] border border-[#E3DBCC] rounded-[16px]">
            <span className="block font-mono text-[11px] tracking-[0.18em] text-[#7A7770] uppercase mb-[12px]">
              Total Videos
            </span>
            <span className="font-serif text-3xl sm:text-4xl text-[#101010] font-normal block leading-none mb-[8px]">
              {totalVideos}
            </span>
            <span className="block font-sans text-xs text-[#7A7770]">
              Cinematic film clips
            </span>
          </div>

          <div className="p-[24px] lg:p-[28px] bg-[#FAF8F5] border border-[#E3DBCC] rounded-[16px]">
            <span className="block font-mono text-[11px] tracking-[0.18em] text-[#7A7770] uppercase mb-[12px]">
              Custom Uploads
            </span>
            <span className="font-serif text-3xl sm:text-4xl text-[#101010] font-normal block leading-none mb-[8px]">
              {mediaList.length}
            </span>
            <span className="block font-sans text-xs text-[#7A7770]">
              Uploaded database assets
            </span>
          </div>
        </div>
      </section>

      {/* 8. Manage Collections Section */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-[28px]">
          <div>
            <h2
              style={{ fontFamily: 'var(--font-serif)' }}
              className="text-[24px] sm:text-[28px] text-[#101010] font-normal"
            >
              Manage Collections
            </h2>
            <p className="font-sans text-xs sm:text-sm text-[#7A7770] mt-[10px]">
              Organized by the 6 live categories published on the portfolio.
            </p>
          </div>

          <Link
            to="/admin/collections"
            className="font-sans text-xs font-semibold tracking-[0.14em] uppercase text-[#101010] hover:text-[#7A7770] transition-colors pb-1 border-b border-[#101010] self-start sm:self-auto"
          >
            All Collections →
          </Link>
        </div>

        {/* 3 cols desktop, 2 tablet, 1 mobile; gap 24/20/16px */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[16px] md:gap-[20px] lg:gap-[24px]">
          {categoryStats.map((cat) => (
            <div
              key={cat.id}
              className="group p-[20px] md:p-[24px] lg:p-[28px] bg-[#FAF8F5] border border-[#E3DBCC] rounded-[16px] hover:shadow-xs transition-shadow flex flex-col justify-between"
            >
              {/* Card Image: Inset with padding, rounded, 20px bottom margin */}
              <div className="relative aspect-[16/10] bg-[#1A1917] rounded-[10px] overflow-hidden mb-[20px]">
                <img
                  src={cat.coverImage || cat.featured?.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <span className="absolute bottom-3 left-3.5 font-mono text-[10px] tracking-[0.2em] uppercase text-white/90">
                  Folio {cat.id}
                </span>
              </div>

              {/* Card Info */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-baseline justify-between gap-2 mb-[12px]">
                    <h3
                      style={{ fontFamily: 'var(--font-serif)' }}
                      className="text-[20px] sm:text-[22px] font-normal text-[#101010]"
                    >
                      {cat.name}
                    </h3>
                    <span className="font-mono text-[11px] tracking-wider text-[#7A7770]">
                      /{cat.slug}
                    </span>
                  </div>

                  {/* Counts: content -> content spacing */}
                  <div className="flex items-center gap-6 py-[14px] border-y border-[#E3DBCC]/60 font-mono text-xs text-[#55493A] mb-[24px]">
                    <div>
                      <span className="font-bold text-[#101010]">{cat.photosCount}</span>{' '}
                      <span className="text-[#7A7770]">Photos</span>
                    </div>
                    <div>
                      <span className="font-bold text-[#101010]">{cat.videosCount}</span>{' '}
                      <span className="text-[#7A7770]">Videos</span>
                    </div>
                  </div>
                </div>

                {/* Button */}
                <Link
                  to={`/admin/collections/${cat.slug}`}
                  className="w-full h-[48px] px-[20px] rounded-[8px] bg-[#FDFCF8] hover:bg-[#101010] text-[#101010] hover:text-[#FDFCF8] border border-[#E3DBCC] hover:border-[#101010] font-sans text-xs font-semibold tracking-[0.14em] uppercase transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>MANAGE MEDIA</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. Recently Added Media Grid (4 columns desktop, 3 tablet, 2 mobile, 20-24px gap) */}
      <section>
        <div className="flex items-baseline justify-between mb-[28px]">
          <div>
            <h2
              style={{ fontFamily: 'var(--font-serif)' }}
              className="text-[24px] sm:text-[28px] text-[#101010] font-normal"
            >
              Recently Added Media
            </h2>
            <p className="font-sans text-xs sm:text-sm text-[#7A7770] mt-[10px]">
              Latest assets uploaded to cloud storage and database.
            </p>
          </div>
          <span className="font-mono text-xs text-[#7A7770]">
            {mediaList.length} database assets
          </span>
        </div>

        {loading ? (
          <div className="py-16 text-center text-xs font-mono text-[#7A7770]">
            Loading media archive...
          </div>
        ) : recentMedia.length === 0 ? (
          <div className="p-[32px] sm:p-[40px] text-center bg-[#FAF8F5] border border-dashed border-[#D1C7B7] rounded-[16px]">
            <p className="font-sans text-sm text-[#55493A] mb-[16px]">
              No custom media uploaded yet. The public website is currently displaying the initial baseline portfolio.
            </p>
            <button
              type="button"
              onClick={() => setAddModalOpen(true)}
              className="h-[48px] px-[24px] rounded-full bg-[#101010] text-white font-sans text-xs tracking-wider uppercase cursor-pointer"
            >
              + Add First Media Item
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[20px] lg:gap-[24px]">
            {recentMedia.map((item) => (
              <div
                key={item._id}
                className="group p-[16px] sm:p-[20px] bg-[#FAF8F5] border border-[#E3DBCC] rounded-[16px] flex flex-col justify-between"
              >
                {/* Preview Box: Inset with breathing room */}
                <div className="relative aspect-square rounded-[10px] overflow-hidden bg-[#1A1917] mb-[14px]">
                  {item.type === 'video' ? (
                    <video src={item.url} className="w-full h-full object-cover" />
                  ) : (
                    <img src={item.url} alt={item.title || 'Media'} className="w-full h-full object-cover" />
                  )}

                  {/* Badge */}
                  <span className="absolute top-2.5 left-2.5 bg-black/75 text-white font-mono text-[9px] uppercase px-2 py-0.5 rounded-full tracking-wider">
                    {item.type}
                  </span>
                  <span className="absolute top-2.5 right-2.5 bg-white/90 text-[#101010] font-mono text-[9px] uppercase px-2 py-0.5 rounded-full tracking-wider">
                    {item.category}
                  </span>
                </div>

                {/* Metadata & Actions */}
                <div>
                  <h4 className="font-serif text-sm text-[#101010] font-medium truncate mb-1">
                    {item.title || 'Untitled Asset'}
                  </h4>
                  <span className="block font-mono text-[10px] text-[#A59C8F] mb-[14px]">
                    Added {new Date(item.createdAt).toLocaleDateString()}
                  </span>

                  <div className="pt-[12px] border-t border-[#E3DBCC]/60 flex items-center justify-between">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-sans text-[#7A7770] hover:text-[#101010] tracking-wider uppercase"
                    >
                      View ↗
                    </a>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(item)}
                      className="min-h-[36px] px-3.5 rounded-[6px] bg-[#FAF0F0] hover:bg-[#992E2E] text-[#992E2E] hover:text-white border border-[#E8C4C4] font-sans text-[11px] font-semibold tracking-wider uppercase transition-colors cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Add Media Modal */}
      <AddMediaModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSuccess={handleMediaAdded}
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
