import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layers, ImageIcon, PlayCircle, Upload, ArrowRight, Video } from 'lucide-react';
import { CATEGORIES } from '../collections/data/collectionsData';
import AddMediaModal from './components/AddMediaModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import { useAdminAuth } from './context/AdminAuthContext';
import './AdminDashboard.css';

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
    const customPhotosCount = catMedia.filter((m) => m.type !== 'video').length;
    const customVideosCount = catMedia.filter((m) => m.type === 'video').length;
    const seedPhotosCount = (cat.supporting?.length || 0) + 1;

    return {
      ...cat,
      photosCount: customPhotosCount > 0 ? customPhotosCount : seedPhotosCount,
      videosCount: customVideosCount,
      customUploadsCount: catMedia.length,
    };
  });

  const totalPhotos = categoryStats.reduce((acc, cat) => acc + cat.photosCount, 0);
  const totalVideos = categoryStats.reduce((acc, cat) => acc + cat.videosCount, 0);

  // Collect seed images for preview strip fallback so 5 items are always displayed
  const allSeedImages = CATEGORIES.flatMap((c) => [
    c.coverImage,
    ...(c.supporting?.map((s) => s.image) || []),
  ]).filter(Boolean);

  // Build 5 items for recently added media
  const recentDisplayMedia = [
    ...mediaList.map((m) => ({
      id: m._id,
      url: m.url,
      type: m.type,
      title: m.title || 'Media asset',
    })),
    ...allSeedImages.map((url, i) => ({
      id: `seed-${i}`,
      url,
      type: 'photo',
      title: 'Gallery still',
    })),
  ].slice(0, 5);

  // Format current date
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const statCards = [
    {
      label: 'TOTAL COLLECTIONS',
      value: CATEGORIES.length,
      sub: 'Active portfolio galleries',
      icon: Layers,
    },
    {
      label: 'TOTAL PHOTOS',
      value: totalPhotos,
      sub: 'Curated & custom stills',
      icon: ImageIcon,
    },
    {
      label: 'TOTAL VIDEOS',
      value: totalVideos,
      sub: 'Cinematic film clips',
      icon: PlayCircle,
    },
    {
      label: 'CUSTOM UPLOADS',
      value: mediaList.length,
      sub: 'Uploaded database assets',
      icon: Upload,
    },
  ];

  return (
    <div className="space-y-9 w-full">
      {/* Page Header */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <span className="admin-eyebrow block mb-2">
              COLLECTIONS DASHBOARD
            </span>
            <h1 className="admin-serif-title text-[36px] sm:text-[40px] lg:text-[42px]">
              Studio Overview
            </h1>
            <p className="admin-subtext mt-1.5">
              Here's a quick look at your collections and media.
            </p>
          </div>
          <span className="text-[12px] text-[#7A756D] font-normal shrink-0 pt-1">
            {dateStr}
          </span>
        </div>

        {/* Clean divider line under header matching screenshot */}
        <div className="border-b border-[#E8E2D6] mt-7" />
      </div>

      {/* Stats Grid — 4 cards */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className="admin-card p-6 flex flex-col justify-between"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-[10px] tracking-[0.16em] uppercase font-semibold text-[#7A756D]">
                    {card.label}
                  </span>
                  <Icon size={18} strokeWidth={1.3} className="text-[#8E887E]" />
                </div>
                <div className="admin-serif-title text-[38px] leading-none my-2">
                  {card.value}
                </div>
                <span className="block text-[11px] text-[#7A756D]">
                  {card.sub}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Manage Collections */}
      <section>
        <div className="flex items-baseline justify-between mb-5">
          <div>
            <h2 className="admin-serif-title text-[22px]">
              Manage Collections
            </h2>
            <p className="admin-subtext text-[12px] mt-1">
              Organized by the {CATEGORIES.length} live categories published on the portfolio.
            </p>
          </div>
          <Link to="/admin/collections" className="admin-link text-[12px]">
            View all <ArrowRight size={13} strokeWidth={2} />
          </Link>
        </div>

        {/* Horizontal collection cards — 3 cols */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {categoryStats.map((cat) => (
            <div
              key={cat.id}
              onClick={() => navigate(`/admin/collections/${cat.slug}`)}
              className="admin-card p-4 flex items-center gap-4 group cursor-pointer"
            >
              {/* Thumbnail */}
              <div className="w-[110px] h-[75px] rounded-[10px] overflow-hidden bg-[#EFEAE2] shrink-0">
                <img
                  src={cat.coverImage || cat.featured?.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="admin-serif-title text-[16px] mb-0.5">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-[#7A756D] mb-2 font-normal">
                  {cat.photosCount} Photos · {cat.videosCount} Videos
                </p>
                <span className="admin-link text-[11px]">
                  Manage media <ArrowRight size={11} strokeWidth={2} />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recently Added Media — horizontal strip */}
      <section>
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="admin-serif-title text-[20px]">
            Recently added media
          </h2>
          <Link to="/admin/collections" className="admin-link text-[12px]">
            View all <ArrowRight size={13} strokeWidth={2} />
          </Link>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-[#7A756D]">
            Loading media...
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3.5">
            {recentDisplayMedia.map((item) => (
              <div
                key={item.id}
                className="relative aspect-[16/10] rounded-[10px] overflow-hidden bg-[#E8E2D6] group"
              >
                {item.type === 'video' ? (
                  <video src={item.url} className="w-full h-full object-cover" />
                ) : (
                  <img
                    src={item.url}
                    alt={item.title || 'Media'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                )}
                {item.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-7 h-7 rounded-full bg-black/50 flex items-center justify-center">
                      <Video size={13} className="text-white ml-0.5" />
                    </div>
                  </div>
                )}
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
