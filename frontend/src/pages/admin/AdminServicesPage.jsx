import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Plus,
  Pencil,
  Trash2,
  GripVertical,
  Sparkles,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Layers,
  ArrowRight,
  Search,
} from 'lucide-react';
import { useAdminAuth } from './context/AdminAuthContext';
import { useCategories } from '../../utils/categoryManager';
import AddEditServiceModal from './components/AddEditServiceModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import AddCategoryModal from './components/AddCategoryModal';
import './AdminDashboard.css';

const DEFAULT_CATEGORIES = [
  { id: 'wedding', label: 'Weddings' },
  { id: 'pre-wedding', label: 'Pre-Wedding' },
  { id: 'birthday', label: 'Birthdays' },
  { id: 'portrait', label: 'Portraits' },
  { id: 'event', label: 'Events' },
  { id: 'commercial', label: 'Commercial' },
];

export default function AdminServicesPage() {
  const { category: categoryParam } = useParams();
  const navigate = useNavigate();
  const { getAuthHeaders } = useAdminAuth();
  const { categories: dynamicCategories, refresh: refreshCategories } = useCategories();
  const [backendCategories, setBackendCategories] = useState([]);

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((json) => {
        if (Array.isArray(json.data) && json.data.length > 0) {
          setBackendCategories(json.data);
        }
      })
      .catch((err) => console.warn('Categories fetch failed:', err));
  }, []);

  // Merge default categories with custom dynamic categories (strictly deduplicated)
  const categoriesList = React.useMemo(() => {
    const base = [...DEFAULT_CATEGORIES];
    const sourcePool = [...(dynamicCategories || []), ...(backendCategories || [])];

    // Canonical key generator for matching categories regardless of plurals or trailing dashes
    const toCanonicalKey = (str) =>
      (str || '')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]/g, '')
        .replace(/s$/, '');

    sourcePool.forEach((cat) => {
      const slug = (
        cat.slug ||
        cat.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') ||
        ''
      ).toLowerCase().trim();

      if (!slug) return;

      const key = toCanonicalKey(slug);
      const exists = base.some(
        (c) => toCanonicalKey(c.id) === key || toCanonicalKey(c.label) === key
      );

      if (!exists) {
        const rawName = (cat.name || slug).trim();
        base.push({
          id: slug,
          label: rawName.charAt(0).toUpperCase() + rawName.slice(1),
        });
      }
    });
    return base;
  }, [dynamicCategories, backendCategories]);

  const [activeCategory, setActiveCategory] = useState(categoryParam || 'wedding');
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isReordering, setIsReordering] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [addCategoryModalOpen, setAddCategoryModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Drag and drop state
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  // Sync category param
  useEffect(() => {
    if (categoryParam) {
      const normalizedParam = categoryParam.toLowerCase();
      const matched = categoriesList.find(
        (c) => c.id === normalizedParam || c.id === normalizedParam.replace(/s$/, '')
      );
      if (matched) {
        setActiveCategory(matched.id);
      } else {
        setActiveCategory(normalizedParam);
      }
    } else {
      setActiveCategory('wedding');
    }
  }, [categoryParam, categoriesList]);

  // Fetch services for active category
  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/services?category=${activeCategory}`);
      if (res.ok) {
        const json = await res.json();
        setServices(json.data || []);
      } else {
        console.error('Failed to fetch services:', res.statusText);
      }
    } catch (err) {
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [activeCategory]);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleCategorySelect = (catId) => {
    setActiveCategory(catId);
    navigate(`/admin/services/${catId}`);
  };

  // Toggle active status
  const handleToggleActive = async (service, e) => {
    e.stopPropagation();
    try {
      const updated = { ...service, isActive: !service.isActive };
      const res = await fetch(`/api/services/${service._id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify({ isActive: !service.isActive }),
      });

      if (res.ok) {
        setServices((prev) =>
          prev.map((s) => (s._id === service._id ? { ...s, isActive: !s.isActive } : s))
        );
        showToast(`Package ${service.isActive ? 'hidden from' : 'published to'} public site.`);
      }
    } catch (err) {
      console.error('Error toggling service status:', err);
    }
  };

  // HTML5 Drag and Drop handlers
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDrop = async (e, targetIndex) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const updated = [...services];
    const [movedItem] = updated.splice(draggedIndex, 1);
    updated.splice(targetIndex, 0, movedItem);

    // Update order locally immediately
    const reorderedList = updated.map((item, idx) => ({
      ...item,
      order: idx + 1,
    }));
    setServices(reorderedList);
    setDraggedIndex(null);
    setDragOverIndex(null);

    // Save to backend
    try {
      setIsReordering(true);
      const itemsPayload = reorderedList.map((item, idx) => ({
        id: item._id,
        order: idx + 1,
      }));

      const res = await fetch('/api/services/reorder', {
        method: 'PATCH',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify({ items: itemsPayload }),
      });

      if (res.ok) {
        showToast('Package order updated successfully.');
      }
    } catch (err) {
      console.error('Failed to save order:', err);
      // Revert on failure
      fetchServices();
    } finally {
      setIsReordering(false);
    }
  };

  // Handle Delete
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/services/${deleteTarget._id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        credentials: 'include',
      });

      if (res.ok) {
        setServices((prev) => prev.filter((s) => s._id !== deleteTarget._id));
        setDeleteTarget(null);
        showToast('Service tier deleted successfully.');
      }
    } catch (err) {
      console.error('Error deleting service:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleModalSuccess = (savedService) => {
    const savedCat = (savedService?.category || '').toLowerCase().trim();
    if (editTarget) {
      // Edit
      setServices((prev) =>
        prev.map((s) => (s._id === savedService._id ? savedService : s))
      );
      showToast('Service tier updated successfully.');
    } else {
      // Add
      if (savedCat === activeCategory.toLowerCase().trim()) {
        setServices((prev) => [...prev, savedService]);
      } else {
        // Automatically switch to the category that the package was created under
        handleCategorySelect(savedCat);
      }
      showToast(`New service tier created under "${savedCat}"!`);
    }
    setModalOpen(false);
    setEditTarget(null);
  };

  const [searchQuery, setSearchQuery] = useState('');

  const activeCategoryObj =
    categoriesList.find((c) => c.id === activeCategory) || {
      id: activeCategory,
      label: activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1),
    };

  const filteredServices = React.useMemo(() => {
    if (!searchQuery.trim()) return services;
    const q = searchQuery.toLowerCase().trim();
    return services.filter((service) => {
      const title = (service.subtitle || '').toLowerCase();
      const eyebrow = (service.eyebrow || '').toLowerCase();
      const tier = (service.tier || '').toLowerCase();
      const desc = (service.description || '').toLowerCase();
      const deliverables = (service.deliverables || []).join(' ').toLowerCase();
      return (
        title.includes(q) ||
        eyebrow.includes(q) ||
        tier.includes(q) ||
        desc.includes(q) ||
        deliverables.includes(q)
      );
    });
  }, [services, searchQuery]);

  return (
    <div className="admin-main-workspace">
      <div className="admin-content-inner">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-8 right-8 z-50 flex items-center gap-3 px-5 py-3.5 bg-[#181818] text-[#FAF8F5] rounded-xl shadow-2xl border border-[#333] transition-all transform animate-in fade-in slide-in-from-bottom-4">
            <CheckCircle2 size={16} className="text-[#C2A378] shrink-0" />
            <span className="text-[13px] font-medium tracking-wide">{toastMessage}</span>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════
            BAND 1: PAGE TITLE BLOCK
           ═══════════════════════════════════════════════════ */}
        <div className="mb-8 sm:mb-10">
          <h1
            className="text-[#181818] font-normal leading-[1.05] tracking-[-0.02em]"
            style={{
              fontFamily: "'Cormorant Garamond', 'Cormorant', Georgia, serif",
              fontSize: 'clamp(44px, 5.5vw, 64px)',
            }}
          >
            Management
          </h1>
          <p
            className="text-[13.5px] sm:text-[14px] text-[#7A756D] mt-3.5 sm:mt-4 leading-[1.8] max-w-2xl"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Curate and configure service packages, deliverables, pricing guidelines, and presentation order across all photographic disciplines.
          </p>
        </div>

        {/* ═══════════════════════════════════════════════════
            BAND 2: ACTION ROW (Search + Preview Live + Add Package)
           ═══════════════════════════════════════════════════ */}
        <div className="flex items-center justify-between flex-wrap gap-4 pb-8 mb-8 sm:mb-10 border-b border-[#E8E2D6]/70">
          {/* Left: Search input */}
          <div className="relative flex items-center">
            <Search size={14} className="absolute left-4 text-[#9E988E] pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search services..."
              className="h-11 pl-10 pr-5 bg-white border border-[#DCD5C9] rounded-full text-[12.5px] text-[#181818] placeholder-[#9E988E] focus:outline-none focus:border-[#181818] transition-colors w-52 sm:w-64 shadow-[0_1px_4px_rgba(0,0,0,0.02)]"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            />
          </div>

          {/* Right: Preview Live + Add Package */}
          <div className="flex items-center gap-3 shrink-0">
            <a
              href={`/services?category=${activeCategory}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 h-11 px-5 border border-[#DCD5C9] rounded-full text-[11px] uppercase tracking-[0.16em] font-semibold text-[#181818] bg-white hover:bg-[#F3EFE8] transition-colors shadow-[0_1px_4px_rgba(0,0,0,0.02)]"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              <ExternalLink size={13} className="text-[#6E675E]" />
              <span>Preview Live</span>
            </a>

            <button
              type="button"
              onClick={() => {
                setEditTarget(null);
                setModalOpen(true);
              }}
              className="inline-flex items-center gap-2 h-11 px-6 bg-[#181818] text-[#FAF8F5] rounded-full text-[11px] uppercase tracking-[0.16em] font-semibold hover:bg-[#2F2F2F] transition-colors shadow-[0_2px_8px_rgba(0,0,0,0.08)] cursor-pointer"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              <Plus size={14} />
              <span>Add Package</span>
            </button>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════
            BAND 3: CATEGORY NAVIGATION — Clean wrap, distinct tabs
           ═══════════════════════════════════════════════════ */}
        <div className="border-b border-[#E8E2D6] pb-1">
          <div className="flex flex-wrap items-center gap-x-7 sm:gap-x-9 gap-y-3.5 pb-3.5">
            <div className="flex items-center text-[#B5B0A6] shrink-0">
              <GripVertical size={14} />
            </div>

            {categoriesList.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategorySelect(cat.id)}
                  className={`text-[11px] uppercase tracking-[0.2em] transition-all shrink-0 cursor-pointer px-1 py-1 relative ${
                    isActive
                      ? 'text-[#181818] font-bold after:content-[""] after:absolute after:bottom-[-6px] after:left-0 after:right-0 after:h-[2px] after:bg-[#181818]'
                      : 'text-[#8C867D] font-medium hover:text-[#181818]'
                  }`}
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  {cat.label}
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => setAddCategoryModalOpen(true)}
              className="text-[11px] uppercase tracking-[0.2em] font-medium text-[#8C867D] hover:text-[#181818] transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer px-2 py-1"
              title="Add a new collection category to the studio"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              <Plus size={12} />
              <span>New Category</span>
            </button>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════
            BAND 4: REORDERING HELPER
           ═══════════════════════════════════════════════════ */}
        <div className="flex items-center justify-between py-6 text-[12.5px] text-[#8C867D]">
          <div className="flex items-center gap-2.5">
            <GripVertical size={13} className="text-[#B5B0A6]" />
            <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Drag packages to rearrange live display order on public pages.
            </span>
          </div>
          {isReordering && (
            <span className="text-[#9E8159] font-medium animate-pulse">Saving order...</span>
          )}
        </div>

        {/* ═══════════════════════════════════════════════════
            BAND 5: SERVICE CARDS GRID (Framed Inset Luxury Cards)
           ═══════════════════════════════════════════════════ */}
        {loading ? (
          <div className="py-28 text-center">
            <div className="inline-block w-8 h-8 border-2 border-[#181818] border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-[12px] uppercase tracking-[0.2em] text-[#8C867D]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Loading {activeCategoryObj.label} Packages...
            </p>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="mt-8 border-2 border-dashed border-[#E0D7C9] rounded-2xl p-16 text-center bg-[#FAF8F5]/50">
            <Layers size={36} className="mx-auto text-[#B5B0A6] mb-4 stroke-1" />
            <h3
              className="text-[22px] text-[#181818] font-normal mb-2"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              {searchQuery
                ? `No packages match "${searchQuery}"`
                : `No service packages found for ${activeCategoryObj.label}`}
            </h3>
            <p className="text-[13px] text-[#8C867D] max-w-md mx-auto mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {searchQuery
                ? 'Try searching for a different keyword, category, or tier name.'
                : 'Create your first package tier for this category to present transparent deliverables and luxury booking options.'}
            </p>
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-[#D8D1C5] text-[#181818] rounded-full text-[11px] uppercase tracking-[0.16em] font-semibold hover:bg-[#F3EFE8] transition-colors cursor-pointer"
              >
                <span>Clear Search</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setEditTarget(null);
                  setModalOpen(true);
                }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#181818] text-[#FAF8F5] rounded-full text-[11px] uppercase tracking-[0.16em] font-semibold hover:bg-[#2A2A2A] transition-all cursor-pointer"
              >
                <Plus size={14} />
                <span>Add First Package for {activeCategoryObj.label}</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 sm:gap-9 xl:gap-10 items-stretch">
            {filteredServices.map((service, index) => {
              const isDragging = draggedIndex === index;
              const isOver = dragOverIndex === index;

              return (
                <div
                  key={service._id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  onDrop={(e) => handleDrop(e, index)}
                  className={`relative flex flex-col transition-all duration-300 cursor-grab active:cursor-grabbing rounded-[20px] border overflow-hidden ${
                    isDragging
                      ? 'opacity-40 border-[#181818] shadow-lg'
                      : isOver
                      ? 'border-[#9E8159] shadow-md bg-[#FAF6F0]'
                      : 'border-[#E8E2D6] hover:border-[#D4CCC0] shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.06)]'
                  } ${!service.isActive ? 'opacity-75' : ''}`}
                  style={{ backgroundColor: service.isActive ? '#FFFFFF' : '#FDFBF8' }}
                >
                  {/* ── Framed Image Inset (Small Margin & Rounded Corners) ── */}
                  <div className="p-4 sm:p-5 pb-0">
                    <div className="relative aspect-[16/10] bg-[#E8E2D6] rounded-xl overflow-hidden group">
                      <img
                        src={service.imageUrl}
                        alt={service.subtitle || service.eyebrow}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                      />
                      {/* Subtle vignette for badge readability */}
                      <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/10 pointer-events-none" />

                      {/* Folio Badge — top-left with breathing room from corners */}
                      <div className="absolute top-3 left-3 z-10">
                        <div
                          className="flex items-center gap-1.5 px-3 py-1 bg-[#1F1F1E]/80 backdrop-blur-md rounded-md text-white border border-white/10"
                          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                        >
                          <GripVertical size={10} className="text-[#C8C0B4] opacity-80" />
                          <span className="text-[9.5px] uppercase tracking-[0.16em] font-medium">
                            Folio 0{index + 1}
                          </span>
                        </div>
                      </div>

                      {/* Right badges — FEATURED + ACTIVE with breathing room */}
                      <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
                        {service.isRecommended && (
                          <span
                            className="flex items-center gap-1 px-3 py-1 bg-[#EADBC4] text-[#3D3528] font-semibold text-[9px] uppercase tracking-[0.16em] rounded-md shadow-sm"
                            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                          >
                            <Sparkles size={10} />
                            <span>Featured</span>
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={(e) => handleToggleActive(service, e)}
                          className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[9px] uppercase tracking-[0.16em] font-medium backdrop-blur-md border border-white/10 transition-colors cursor-pointer ${
                            service.isActive
                              ? 'bg-[#1F1F1E]/80 text-white hover:bg-[#1F1F1E]'
                              : 'bg-red-800/85 text-white hover:bg-red-700'
                          }`}
                          title={service.isActive ? 'Visible on site' : 'Hidden from site'}
                          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                        >
                          {service.isActive ? (
                            <>
                              <Eye size={10} />
                              <span>Active</span>
                            </>
                          ) : (
                            <>
                              <EyeOff size={10} />
                              <span>Draft</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* ── Card Body (Consistent padding lining up with the image inset) ── */}
                  <div className="flex-1 flex flex-col p-5 sm:p-6 pt-5">
                    {/* Eyebrow / Category Label */}
                    <span
                      className="text-[10px] font-semibold tracking-[0.22em] text-[#8C867D] uppercase block mb-3"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                      {service.eyebrow || service.tier || activeCategoryObj.label}
                    </span>

                    {/* Service Title */}
                    <h3
                      className="text-[#181818] font-normal leading-[1.28] mb-6"
                      style={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        fontSize: '23px',
                      }}
                    >
                      {service.subtitle || service.name || service.eyebrow}
                    </h3>

                    {/* ─ Investment Section ─ */}
                    <div className="mb-6 pb-6 border-b border-[#F0EBE1]">
                      <div className="flex items-end justify-between gap-3">
                        <div>
                          <span
                            className="text-[9.5px] uppercase tracking-[0.22em] text-[#8C867D] font-bold block mb-1.5"
                            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                          >
                            Investment
                          </span>
                          <span
                            className="text-[#181818] font-normal leading-none block text-[21px]"
                            style={{
                              fontFamily: "'Cormorant Garamond', Georgia, serif",
                            }}
                          >
                            {service.price
                              ? `₹${service.price.toLocaleString('en-IN')}`
                              : 'Price to be added'}
                          </span>
                        </div>

                        {(service.priceNote || service.imageTag) && (
                          <span
                            className="text-[11px] text-[#8C867D] italic text-right max-w-[170px] leading-[1.4] shrink-0"
                            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                          >
                            {service.priceNote || service.imageTag}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* ─ Description (Increased line-height) ─ */}
                    <p
                      className="text-[13px] text-[#554C43] leading-[1.85] line-clamp-2 mb-7"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                      {service.description}
                    </p>

                    {/* ─ Deliverables (Increased line-height & spacing) ─ */}
                    <div className="mt-auto">
                      <span
                        className="block text-[9.5px] font-bold tracking-[0.22em] text-[#8C867D] uppercase mb-3.5"
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                      >
                        Deliverables ({service.deliverables?.length || 0})
                      </span>
                      <ul className="space-y-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        {(service.deliverables || []).slice(0, 3).map((item, dIdx) => (
                          <li key={dIdx} className="flex items-start gap-2.5 text-[12px] text-[#3D3730] leading-[1.65]">
                            <span className="text-[#B5AA9A] select-none text-[10px] mt-0.5">•</span>
                            <span className="line-clamp-1">{item}</span>
                          </li>
                        ))}
                      </ul>
                      {(service.deliverables || []).length > 3 && (
                        <span
                          className="text-[11px] text-[#9E988E] italic mt-4 block"
                          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                        >
                          +{service.deliverables.length - 3} more privileges included
                        </span>
                      )}
                    </div>
                  </div>

                  {/* ── Card Footer (ORDER / EDIT / DELETE with its own divider & padding) ── */}
                  <div
                    className="border-t border-[#F0EBE1] px-5 sm:px-6 py-4.5 flex items-center justify-between"
                    style={{ backgroundColor: 'rgba(250, 248, 245, 0.6)' }}
                  >
                    <span
                      className="text-[10px] tracking-[0.2em] uppercase text-[#8C867D] font-medium"
                      style={{ fontFamily: "'SF Mono', 'Fira Code', 'Courier New', monospace" }}
                    >
                      ORDER&nbsp;&nbsp;#{index + 1}
                    </span>

                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditTarget(service);
                          setModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em] font-semibold text-[#181818] hover:text-[#7A756D] transition-colors cursor-pointer"
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                      >
                        <Pencil size={11} />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteTarget(service);
                        }}
                        className="inline-flex items-center justify-center text-[#C45050] hover:text-[#992E2E] transition-colors cursor-pointer"
                        title="Delete package"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal: Add/Edit Service */}
        <AddEditServiceModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setEditTarget(null);
          }}
          onSuccess={handleModalSuccess}
          initialData={editTarget}
          serviceToEdit={editTarget}
          category={activeCategory}
          initialCategory={activeCategory}
          availableCategories={categoriesList}
        />

        {/* Modal: Delete Confirmation */}
        <DeleteConfirmModal
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDeleteConfirm}
          isDeleting={isDeleting}
          mediaItem={
            deleteTarget
              ? {
                  title: `${deleteTarget.eyebrow} — ${deleteTarget.subtitle} (${deleteTarget.tier})`,
                }
              : null
          }
        />

        {/* Modal: Add Collection Category */}
        <AddCategoryModal
          isOpen={addCategoryModalOpen}
          onClose={() => setAddCategoryModalOpen(false)}
          onCategoryCreated={(newCat) => {
            setAddCategoryModalOpen(false);
            if (refreshCategories) refreshCategories();
            if (newCat?.slug) {
              handleCategorySelect(newCat.slug);
            }
            showToast(`Collection category "${newCat?.name || ''}" created! You can now add packages for it.`);
          }}
        />
      </div>
    </div>
  );
}
