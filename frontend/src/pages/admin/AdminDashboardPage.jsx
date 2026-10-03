import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layers, ImageIcon, PlayCircle, Upload, ArrowRight, Video } from 'lucide-react';
import { CATEGORIES as DEFAULT_CATEGORIES } from '../collections/data/collectionsData';
import { useCategories } from '../../utils/categoryManager';
import AddMediaModal from './components/AddMediaModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import { useAdminAuth } from './context/AdminAuthContext';
import { getApiUrl } from '../../utils/api';
import './AdminDashboard.css';

export default function AdminDashboardPage() {
  const { getAuthHeaders } = useAdminAuth();
  const { categories } = useCategories();
  const currentCategories = (categories && categories.length > 0) ? categories : DEFAULT_CATEGORIES;
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
  const categoryStats = currentCategories.map((cat) => {
    const catSlug = (cat?.slug || cat?.id || '').toLowerCase();
    const catMedia = mediaList.filter(
      (m) => (m.category || '').toLowerCase() === catSlug
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
  const allSeedImages = currentCategories.flatMap((c) => [
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
      value: currentCategories.length,
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
    <div className="space-y-12 sm:space-y-14 w-full">
      {/* ─── Page Header ─── */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div>
            <span className="admin-eyebrow block mb-2.5">
              COLLECTIONS DASHBOARD
            </span>
            <h1 className="admin-serif-title text-[36px] sm:text-[42px] lg:text-[46px]">
              Studio Overview
            </h1>
            <p className="admin-subtext mt-2.5">
              Here's a quick look at your collections and media.
            </p>
          </div>
          <span className="text-[12px] text-[#7A756D] font-normal shrink-0 pt-2">
            {dateStr}
          </span>
        </div>

        <div className="border-b border-[#E8E2D6] mt-8" />
      </div>

      {/* ─── Statistics Grid ─── */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 sm:gap-6">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.label} className="admin-stat-card">
                <div className="stat-header">
                  <span className="stat-label">{card.label}</span>
                  <Icon size={18} strokeWidth={1.3} className="stat-icon" />
                </div>
                <div className="stat-value">{card.value}</div>
                <span className="stat-sub">{card.sub}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── Manage Collections ─── */}
      <section>
        <div className="flex items-baseline justify-between mb-6">
          <div>
            <h2 className="admin-serif-title text-[24px]">
              Manage Collections
            </h2>
            <p className="admin-subtext text-[12px] mt-1.5">
              Organized by the {currentCategories.length} live categories published on the portfolio.
            </p>
          </div>
          <Link to="/admin/collections" className="admin-link text-[12px]">
            View all <ArrowRight size={13} strokeWidth={2} />
          </Link>
        </div>

        {/* Horizontal collection row cards — 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
          {categoryStats.map((cat) => (
            <div
              key={cat.id}
              onClick={() => navigate(`/admin/collections/${cat.slug}`)}
              className="admin-collection-row"
            >
              {/* Thumbnail */}
              <div className="thumb">
                <img
                  src={cat.coverImage || cat.featured?.image}
                  alt={cat.name}
                />
              </div>

              {/* Info */}
              <div className="info">
                <h3>{cat.name}</h3>
                <p className="meta">
                  {cat.photosCount} Photos · {cat.videosCount} Videos
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="manage-link">
                    Media <ArrowRight size={11} strokeWidth={2} />
                  </span>
                  <span className="text-[#D4CCC0]">•</span>
                  <Link
                    to={`/admin/services/${cat.slug}`}
                    onClick={(e) => e.stopPropagation()}
                    className="manage-link text-[#5C5549] hover:text-[#181818]"
                  >
                    Services <ArrowRight size={11} strokeWidth={2} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Recently Added Media ─── */}
      <section>
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="admin-serif-title text-[22px]">
            Recently added media
          </h2>
          <Link to="/admin/collections" className="admin-link text-[12px]">
            View all <ArrowRight size={13} strokeWidth={2} />
          </Link>
        </div>

        {loading ? (
          <div className="py-16 text-center text-xs text-[#7A756D]">
            Loading media...
          </div>
        ) : (
          <div className="admin-recent-strip">
            {recentDisplayMedia.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate('/admin/collections')}
                className="admin-recent-card"
              >
                <div className="media-thumb">
                  {item.type === 'video' ? (
                    <video
                      src={getApiUrl(item.url)}
                      preload="metadata"
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={getApiUrl(item.url)}
                      alt={item.title || 'Media'}
                      loading="lazy"
                    />
                  )}
                  {item.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-xs flex items-center justify-center shadow-sm">
                        <Video size={13} className="text-[#181818] ml-0.5" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="pt-2.5 px-1 pb-0.5">
                  <p className="text-[11px] font-medium text-[#181818] truncate leading-tight">
                    {item.title || 'Portfolio Asset'}
                  </p>
                  <p className="text-[10px] text-[#8E887E] mt-0.5 uppercase tracking-wider">
                    {item.type === 'video' ? 'Video' : 'Photo'}
                  </p>
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
