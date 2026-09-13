import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CATEGORIES } from '../collections/data/collectionsData';
import AddMediaModal from './components/AddMediaModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import { useAdminAuth } from './context/AdminAuthContext';

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

  const activeCategoryObj = CATEGORIES.find(
    (c) => c.slug.toLowerCase() === activeCategorySlug
  );

  // Extract seed baseline media for the active category if viewing a specific category
  const seedItems = activeCategoryObj
    ? [
        {
          _id: `seed-featured-${activeCategoryObj.slug}`,
          url: activeCategoryObj.featured.image,
          title: activeCategoryObj.featured.title,
          caption: activeCategoryObj.featured.caption,
          type: 'photo',
          category: activeCategoryObj.slug,
          isSeed: true,
        },
        ...(activeCategoryObj.supporting || []).map((sup) => ({
          _id: `seed-${sup.id}`,
          url: sup.image,
          title: sup.tag,
          caption: sup.meta,
          type: 'photo',
          category: activeCategoryObj.slug,
          isSeed: true,
        })),
      ]
    : [];

  return (
    <div className="space-y-[56px]">
      {/* 3. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-[28px] border-b border-[#E3DBCC]">
        <div>
          <span className="font-mono text-[11px] tracking-[0.25em] text-[#7A7770] uppercase block mb-3">
            COLLECTION REPOSITORY
          </span>
          <h1
            style={{ fontFamily: 'var(--font-serif)' }}
            className="text-[28px] sm:text-[32px] lg:text-[38px] font-normal leading-tight text-[#101010] tracking-[-0.01em]"
          >
            {activeCategoryObj ? `${activeCategoryObj.name} Collection` : 'All Collections'}
          </h1>
          <p className="font-sans text-xs sm:text-sm text-[#7A7770] mt-[14px]">
            {activeCategoryObj
              ? activeCategoryObj.tagline
              : 'Manage photos and videos across all portfolio collection categories.'}
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

      {/* Category Pills Bar */}
      <section>
        <div className="flex items-center gap-[10px] overflow-x-auto pb-3 no-scrollbar">
          <button
            type="button"
            onClick={() => handleCategorySelect('all')}
            className={`h-[42px] px-[20px] rounded-full font-sans text-xs font-semibold tracking-wider uppercase transition-colors shrink-0 cursor-pointer ${
              activeCategorySlug === 'all'
                ? 'bg-[#101010] text-[#FDFCF8]'
                : 'bg-[#FAF8F5] text-[#55493A] border border-[#E3DBCC] hover:border-[#101010]'
            }`}
          >
            All Collections
          </button>

          {CATEGORIES.map((cat) => {
            const isSelected = activeCategorySlug === cat.slug.toLowerCase();
            return (
              <button
                key={cat.slug}
                type="button"
                onClick={() => handleCategorySelect(cat.slug.toLowerCase())}
                className={`h-[42px] px-[20px] rounded-full font-sans text-xs font-semibold tracking-wider uppercase transition-colors shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-[#101010] text-[#FDFCF8]'
                    : 'bg-[#FAF8F5] text-[#55493A] border border-[#E3DBCC] hover:border-[#101010]'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </section>

      {/* Media Management Grid */}
      <section>
        {loading ? (
          <div className="py-20 text-center text-xs font-mono text-[#7A7770]">
            Loading collection media...
          </div>
        ) : (
          <div className="space-y-[48px]">
            {/* Custom Uploaded Media Grid */}
            <div>
              <div className="flex items-baseline justify-between mb-[24px]">
                <span className="font-mono text-xs text-[#55493A] font-semibold tracking-wider uppercase">
                  Custom Uploads ({mediaList.length})
                </span>
                <span className="font-mono text-[11px] text-[#7A7770]">
                  Stored in Cloudinary &amp; MongoDB
                </span>
              </div>

              {mediaList.length === 0 ? (
                <div className="p-[36px] sm:p-[48px] text-center bg-[#FAF8F5] border border-dashed border-[#D1C7B7] rounded-[16px]">
                  <p className="font-sans text-sm text-[#55493A] mb-[18px]">
                    No custom media uploaded for this collection yet.
                  </p>
                  <button
                    type="button"
                    onClick={() => setAddModalOpen(true)}
                    className="h-[48px] px-[24px] rounded-full bg-[#101010] text-white font-sans text-xs tracking-wider uppercase cursor-pointer"
                  >
                    + Add Media to {activeCategoryObj ? activeCategoryObj.name : 'Collections'}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[20px] lg:gap-[24px]">
                  {mediaList.map((item) => (
                    <div
                      key={item._id}
                      className="group p-[20px] sm:p-[24px] bg-[#FAF8F5] border border-[#E3DBCC] rounded-[16px] flex flex-col justify-between"
                    >
                      {/* Media Preview: Inset within card with rounded corners */}
                      <div className="relative aspect-[4/3] bg-[#1A1917] rounded-[10px] overflow-hidden mb-[16px]">
                        {item.type === 'video' ? (
                          <video
                            src={item.url}
                            className="w-full h-full object-cover"
                            controls
                          />
                        ) : (
                          <img
                            src={item.url}
                            alt={item.title || 'Collection item'}
                            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                          />
                        )}

                        {/* Type Badge */}
                        <span className="absolute top-2.5 left-2.5 bg-black/75 text-white font-mono text-[9px] uppercase px-2 py-0.5 rounded-full tracking-wider">
                          {item.type}
                        </span>

                        {/* Category Badge */}
                        <span className="absolute top-2.5 right-2.5 bg-white/90 text-[#101010] font-mono text-[9px] uppercase px-2 py-0.5 rounded-full tracking-wider">
                          {item.category}
                        </span>
                      </div>

                      {/* Metadata & Actions */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div className="mb-[16px]">
                          <h4 className="font-serif text-base text-[#101010] font-medium truncate mb-1">
                            {item.title || 'Untitled Archive Asset'}
                          </h4>
                          {item.caption && (
                            <p className="font-sans text-xs text-[#7A7770] line-clamp-2 mb-2 leading-relaxed">
                              {item.caption}
                            </p>
                          )}
                          <span className="block font-mono text-[10px] text-[#A59C8F]">
                            Added {new Date(item.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="pt-[14px] border-t border-[#E3DBCC]/60 flex items-center justify-between">
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] font-sans text-[#7A7770] hover:text-[#101010] tracking-wider uppercase"
                          >
                            View Full ↗
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
            </div>

            {/* Baseline Portfolio Reference Section */}
            {activeCategoryObj && (
              <div className="pt-[40px] border-t border-[#E3DBCC]">
                <div className="flex items-baseline justify-between mb-[24px]">
                  <div>
                    <span className="font-mono text-xs text-[#7A7770] font-semibold tracking-wider uppercase block">
                      Baseline Portfolio Specimens ({seedItems.length})
                    </span>
                    <span className="font-sans text-xs text-[#A59C8F] mt-1 block">
                      Curated defaults active on the public portfolio
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-[20px] lg:gap-[24px]">
                  {seedItems.map((seed) => (
                    <div
                      key={seed._id}
                      className="p-[16px] bg-[#FAF8F5] border border-[#E3DBCC] rounded-[16px]"
                    >
                      <div className="relative aspect-square rounded-[10px] overflow-hidden bg-[#1A1917] mb-[12px]">
                        <img
                          src={seed.url}
                          alt={seed.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      </div>
                      <span className="block font-serif text-sm text-[#101010] truncate">
                        {seed.title}
                      </span>
                      {seed.caption && (
                        <span className="block font-sans text-[11px] text-[#7A7770] truncate mt-0.5">
                          {seed.caption}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Add Media Modal */}
      <AddMediaModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSuccess={handleMediaAdded}
        defaultCategory={activeCategorySlug === 'all' ? '' : activeCategorySlug}
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
