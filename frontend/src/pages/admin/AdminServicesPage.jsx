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
  AlertTriangle,
} from 'lucide-react';
import { useAdminAuth } from './context/AdminAuthContext';
import { useCategories } from '../../utils/categoryManager';
import AddEditServiceModal from './components/AddEditServiceModal';
import AddCategoryModal from './components/AddCategoryModal';
import CollectionTierCard from '../services/components/CollectionTierCard';
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
  const [allServices, setAllServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isReordering, setIsReordering] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLockCategory, setModalLockCategory] = useState(false);
  const [modalTargetCategory, setModalTargetCategory] = useState(activeCategory);
  const [addCategoryModalOpen, setAddCategoryModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Drag and drop state
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  // Canonical category matcher
  const toCanonicalKey = (str) =>
    (str || '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]/g, '')
      .replace(/s$/, '');

  // Fetch all services across all categories to compute service counts and track publication
  const fetchAllServices = async () => {
    try {
      const res = await fetch('/api/services?includeInactive=true');
      if (res.ok) {
        const json = await res.json();
        setAllServices(json.data || []);
      }
    } catch (err) {
      console.warn('Failed to fetch all services:', err);
    }
  };

  useEffect(() => {
    fetchAllServices();
  }, []);

  // Compute number of services per category
  const serviceCountsByCategory = React.useMemo(() => {
    const counts = {};
    categoriesList.forEach((cat) => {
      counts[cat.id] = 0;
    });
    allServices.forEach((s) => {
      const sKey = toCanonicalKey(s.category);
      const match = categoriesList.find((c) => toCanonicalKey(c.id) === sKey);
      if (match) {
        counts[match.id] = (counts[match.id] || 0) + 1;
      }
    });
    return counts;
  }, [allServices, categoriesList]);

  // Check if delete target is the last remaining service in its category
  const isLastServiceInCat = React.useMemo(() => {
    if (!deleteTarget) return false;
    const catKey = toCanonicalKey(deleteTarget.category || activeCategory);
    const servicesInCat = allServices.filter(
      (s) => toCanonicalKey(s.category) === catKey
    );
    return servicesInCat.length <= 1;
  }, [deleteTarget, allServices, activeCategory]);

  // Category name for delete target
  const deleteTargetCatName = React.useMemo(() => {
    if (!deleteTarget) return '';
    const catKey = toCanonicalKey(deleteTarget.category || activeCategory);
    const matched = categoriesList.find((c) => toCanonicalKey(c.id) === catKey);
    return matched ? matched.label : (deleteTarget.category || activeCategory);
  }, [deleteTarget, categoriesList, activeCategory]);

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
      const res = await fetch(`/api/services?category=${activeCategory}&includeInactive=true`);
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
        setAllServices((prev) => prev.filter((s) => s._id !== deleteTarget._id));
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
    fetchAllServices();
    if (editTarget) {
      // Edit
      setServices((prev) =>
        prev.map((s) => (s._id === savedService._id ? savedService : s))
      );
      showToast('Service tier updated successfully.');
    } else {
      // Add
      if (toCanonicalKey(savedCat) === toCanonicalKey(activeCategory)) {
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

  // Enforced category creation flow: automatically open Add New Service form locked to new category
  const handleCategoryCreated = (newCat) => {
    setAddCategoryModalOpen(false);
    if (refreshCategories) {
      refreshCategories();
    }
    fetchAllServices();
    const newSlug = (newCat?.slug || newCat?.name || '').toLowerCase().trim();
    if (newSlug) {
      handleCategorySelect(newSlug);
      // Immediately open Add New Service modal pre-selected and locked to this new category
      setEditTarget(null);
      setModalTargetCategory(newSlug);
      setModalLockCategory(true);
      setModalOpen(true);
      showToast(`Category "${newCat?.name || newSlug}" created! Add its first service package to publish it.`);
    }
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
    <div className="w-full pb-16">

      {/* =========================================================
          TOAST
      ========================================================= */}
      {toastMessage && (
        <div className="fixed bottom-7 right-7 z-50">
          <div className="flex items-center gap-3 px-5 py-3.5 bg-[#181818] text-[#FAF8F5] rounded-full shadow-[0_18px_50px_rgba(0,0,0,0.18)] border border-white/10">
            <CheckCircle2 size={15} className="text-[#C2A378]" />

            <span
              className="text-[11px] tracking-wide"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              {toastMessage}
            </span>
          </div>
        </div>
      )}


      {/* =========================================================
          HERO / PAGE HEADER
      ========================================================= */}
      <section className="pb-12 lg:pb-14">

        <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-10 xl:gap-16">

          {/* LEFT CONTENT */}
          <div className="max-w-[720px]">

            <div className="flex items-center gap-3 mb-6">
              <span className="w-9 h-px bg-[#B6A58D]" />

              <span
                className="text-[9px] uppercase tracking-[0.3em] text-[#9A9287] font-semibold"
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                Studio Administration
              </span>
            </div>

            <h1
              className="text-[#181818] font-normal leading-[0.88] tracking-[-0.045em]"
              style={{
                fontFamily:
                  "'Cormorant Garamond', 'Cormorant', Georgia, serif",
                fontSize: "clamp(58px, 7vw, 92px)",
              }}
            >
              Management
            </h1>

            <p
              className="mt-7 max-w-[650px] text-[13px] sm:text-[14px] text-[#777168] leading-[1.9]"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              Curate and configure service packages, deliverables, pricing
              guidelines, and presentation order across all photographic
              disciplines.
            </p>
          </div>


          {/* =====================================================
              ACTION AREA
          ===================================================== */}
          <div className="flex flex-wrap items-center gap-3 xl:pb-1">
            {/* ADD CATEGORY */}
            <button
              type="button"
              onClick={() => setAddCategoryModalOpen(true)}
              className="h-12 inline-flex items-center gap-2 px-5 rounded-full border border-[#DCD5C9] bg-white text-[#181818] hover:bg-[#FAF8F5] transition-all duration-300 cursor-pointer shadow-2xs"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              <Plus size={14} />
              <span className="text-[9.5px] uppercase tracking-[0.18em] font-semibold">
                Add Category
              </span>
            </button>

            {/* ADD SERVICE (GENERAL ENTRY POINT) */}
            <button
              type="button"
              onClick={() => {
                setEditTarget(null);
                setModalTargetCategory(activeCategory);
                setModalLockCategory(false);
                setModalOpen(true);
              }}
              className="h-12 inline-flex items-center gap-2.5 px-6 rounded-full bg-[#181818] text-[#FAF8F5] hover:bg-[#303030] transition-all duration-300 cursor-pointer shadow-sm"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              <Plus size={14} />
              <span className="text-[9.5px] uppercase tracking-[0.18em] font-semibold">
                Add Service
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================
          CATEGORIES DIRECTORY & PUBLICATION STATUS AREA
      ========================================================= */}
      <section className="mb-10 p-6 sm:p-8 rounded-[24px] border border-[#E8E2D6] bg-white shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EAE4DA]">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <Layers size={17} className="text-[#8C8070]" />
              <h2
                className="text-[20px] sm:text-[23px] text-[#181818] font-normal tracking-[-0.01em]"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                Categories &amp; Live Publication
              </h2>
            </div>
            <p className="text-[12px] text-[#7A7367]">
              Only categories with at least one active service appear on the public site. Empty categories remain safely unpublished.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setAddCategoryModalOpen(true)}
              className="h-9 px-4 inline-flex items-center gap-1.5 rounded-full border border-[#DCD5C9] bg-[#FAF8F5] hover:bg-white text-[#181818] text-[9.5px] uppercase tracking-[0.16em] font-semibold transition-all cursor-pointer"
            >
              <Plus size={12} />
              <span>New Category</span>
            </button>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-6">
          {categoriesList.map((cat) => {
            const count = serviceCountsByCategory[cat.id] || 0;
            const isZero = count === 0;
            const isCurrent = toCanonicalKey(activeCategory) === toCanonicalKey(cat.id);

            return (
              <div
                key={cat.id}
                className={`p-4 rounded-[16px] border transition-all ${isCurrent
                    ? 'border-[#181818] bg-[#FAF8F4] shadow-2xs'
                    : 'border-[#EAE4DA] bg-[#FCFAF7] hover:border-[#D0C7B9]'
                  } flex flex-col justify-between gap-3`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[13.5px] font-semibold text-[#181818]">
                        {cat.label}
                      </span>
                      {isCurrent && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#181818]" />
                      )}
                    </div>
                    <span className="text-[11px] text-[#8C857A] mt-0.5 block font-mono">
                      {count} {count === 1 ? 'service package' : 'service packages'}
                    </span>
                  </div>

                  {isZero ? (
                    <span className="px-2.5 py-1 rounded-full bg-[#FFF5E6] border border-[#F2D7B2] text-[#9E6319] text-[9px] uppercase tracking-[0.12em] font-semibold shrink-0">
                      Not published — add a service
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full bg-[#EBF7EE] border border-[#C5E8CE] text-[#1E7438] text-[9px] uppercase tracking-[0.12em] font-semibold shrink-0">
                      Published Live
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2.5 border-t border-[#EAE4DA]/70">
                  <button
                    type="button"
                    onClick={() => handleCategorySelect(cat.id)}
                    className="text-[9.5px] uppercase tracking-[0.14em] font-semibold text-[#7A7367] hover:text-[#181818] transition-colors cursor-pointer"
                  >
                    View Packages →
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEditTarget(null);
                      setModalTargetCategory(cat.id);
                      setModalLockCategory(true);
                      setModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1 text-[9.5px] uppercase tracking-[0.14em] font-semibold text-[#181818] hover:text-[#9E8159] transition-colors cursor-pointer"
                  >
                    <Plus size={11} />
                    <span>Add Service</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================
          CATEGORY BAR
      ========================================================= */}
      <section className="border-y border-[#E7E1D7]">
        <div className="flex items-center min-h-[64px] overflow-x-auto no-scrollbar">
          {/* DRAG HANDLE */}
          <div className="flex items-center justify-center w-10 shrink-0 text-[#B7B0A6]">
            <GripVertical size={14} />
          </div>

          {/* CATEGORIES */}
          <div className="flex items-center gap-x-6 sm:gap-x-9 h-full">
            {categoriesList.map((cat) => {
              const isActive = toCanonicalKey(activeCategory) === toCanonicalKey(cat.id);
              const count = serviceCountsByCategory[cat.id] || 0;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategorySelect(cat.id)}
                  className={`relative h-[64px] flex items-center gap-2 shrink-0 text-[9.5px] uppercase tracking-[0.22em] transition-all duration-300 cursor-pointer ${isActive
                      ? "text-[#181818] font-bold"
                      : "text-[#918A80] font-medium hover:text-[#181818]"
                    }`}
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                >
                  <span>{cat.label}</span>
                  {count === 0 ? (
                    <span className="px-1.5 py-0.5 rounded-full text-[8px] tracking-normal bg-[#FFF3E0] text-[#B2620A] border border-[#F5D4A6]">
                      0
                    </span>
                  ) : (
                    <span className="text-[8.5px] opacity-60">
                      ({count})
                    </span>
                  )}

                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#181818]" />
                  )}
                </button>
              );
            })}

            {/* NEW CATEGORY */}
            <button
              type="button"
              onClick={() => setAddCategoryModalOpen(true)}
              className="h-[64px] shrink-0 flex items-center text-[9.5px] uppercase tracking-[0.22em] font-medium text-[#918A80] hover:text-[#181818] transition-colors cursor-pointer"
              title="Add a new collection category to the studio"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              + New Category
            </button>
          </div>
        </div>
      </section>


      {/* =========================================================
          SECTION META
      ========================================================= */}
      <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-8 lg:py-9">

        <div className="flex items-center gap-2.5">

          <GripVertical
            size={13}
            className="text-[#B7B0A6]"
          />

          <span
            className="text-[10.5px] text-[#918A80] leading-relaxed"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            Drag packages to rearrange their live display order.
          </span>

        </div>


        {isReordering && (
          <span
            className="text-[9.5px] uppercase tracking-[0.2em] text-[#9E8159] font-semibold animate-pulse"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            Saving order...
          </span>
        )}

      </section>


      {/* =========================================================
          CONTENT
      ========================================================= */}

      {loading ? (

        /* =======================================================
           LOADING
        ======================================================= */
        <div className="min-h-[480px] flex flex-col items-center justify-center">

          <div className="w-7 h-7 border-2 border-[#181818] border-t-transparent rounded-full animate-spin mb-5" />

          <p
            className="text-[9.5px] uppercase tracking-[0.24em] text-[#918A80]"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            Loading {activeCategoryObj.label} Packages...
          </p>

        </div>

      ) : filteredServices.length === 0 ? (

        /* =======================================================
           EMPTY STATE
        ======================================================= */
        <div className="min-h-[480px] flex items-center justify-center py-10">

          <div className="w-full max-w-[680px] px-8 sm:px-14 lg:px-20 py-16 sm:py-20 text-center rounded-[28px] border border-dashed border-[#DDD5C9] bg-white/60">

            <div className="w-[60px] h-[60px] mx-auto mb-7 rounded-full border border-[#E5DED3] bg-[#FAF8F4] flex items-center justify-center">
              <Layers
                size={25}
                className="text-[#AAA197] stroke-[1.2]"
              />
            </div>

            <h3
              className="text-[28px] sm:text-[32px] text-[#181818] font-normal leading-[1.1] mb-4"
              style={{
                fontFamily:
                  "'Cormorant Garamond', Georgia, serif",
              }}
            >
              {searchQuery
                ? `No packages match "${searchQuery}"`
                : `No service packages found for ${activeCategoryObj.label}`}
            </h3>

            <p
              className="max-w-[460px] mx-auto mb-8 text-[12px] text-[#8A8278] leading-[1.85]"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              {searchQuery
                ? "Try searching for a different keyword, category, or tier name."
                : "Create your first package tier for this category to present transparent deliverables and luxury booking options."}
            </p>

            {searchQuery ? (

              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="inline-flex items-center px-6 py-3 rounded-full bg-white border border-[#D8D1C5] text-[#181818] text-[9.5px] uppercase tracking-[0.18em] font-semibold hover:bg-[#F3EFE8] transition-all cursor-pointer"
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                Clear Search
              </button>

            ) : (

              <button
                type="button"
                onClick={() => {
                  setEditTarget(null);
                  setModalTargetCategory(activeCategory);
                  setModalLockCategory(true);
                  setModalOpen(true);
                }}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#181818] text-[#FAF8F5] text-[9.5px] uppercase tracking-[0.18em] font-semibold hover:bg-[#2A2A2A] transition-all cursor-pointer"
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                <Plus size={14} />
                <span>
                  Add First Package for {activeCategoryObj.label}
                </span>
              </button>

            )}

          </div>
        </div>

      ) : (

        /* =======================================================
           PACKAGE GRID
        ======================================================= */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-7 lg:gap-x-9 gap-y-9 lg:gap-y-11 items-stretch">

          {filteredServices.map((service, index) => {

            const isDragging = draggedIndex === index;
            const isOver = dragOverIndex === index;

            return (
              <div
                key={service._id || service.id}
                className={`relative rounded-[26px] transition-all duration-300 ${isDragging
                    ? "opacity-40 scale-[0.985]"
                    : isOver
                      ? "ring-1 ring-[#9E8159] scale-[1.005]"
                      : "hover:-translate-y-[3px]"
                  }`}
              >

                <CollectionTierCard
                  collection={{
                    ...service,
                    id: service._id || service.tier,
                    _id: service._id,
                    title:
                      service.eyebrow ||
                      service.title ||
                      "Collection",
                    subtitle: service.subtitle,
                    image: service.imageUrl || service.image,
                    imageUrl:
                      service.imageUrl || service.image,
                    imageLabel:
                      service.imageTag || "Archive Specimen",
                    price: service.price,
                    priceNote: service.priceNote,
                    deliverables:
                      service.deliverables || [],
                    isRecommended:
                      service.isRecommended,
                    isActive: service.isActive,
                    tier: service.tier,
                  }}
                  isAdmin={true}
                  index={index}
                  isDragging={isDragging}
                  isOver={isOver}
                  onEdit={() => {
                    setEditTarget(service);
                    setModalOpen(true);
                  }}
                  onDelete={() => {
                    setDeleteTarget(service);
                  }}
                  onToggleActive={(item, e) =>
                    handleToggleActive(service, e)
                  }
                  dragProps={{
                    draggable: true,
                    onDragStart: (e) =>
                      handleDragStart(e, index),
                    onDragOver: (e) =>
                      handleDragOver(e, index),
                    onDragEnd: handleDragEnd,
                    onDrop: (e) =>
                      handleDrop(e, index),
                  }}
                />

              </div>
            );
          })}

        </div>
      )}


      {/* =========================================================
          MODALS
          FUNCTIONALITY COMPLETELY UNCHANGED
      ========================================================= */}

      <AddEditServiceModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditTarget(null);
          setModalLockCategory(false);
        }}
        onSuccess={handleModalSuccess}
        initialData={editTarget}
        serviceToEdit={editTarget}
        category={modalTargetCategory || activeCategory}
        initialCategory={modalTargetCategory || activeCategory}
        availableCategories={categoriesList}
        lockCategory={modalLockCategory}
      />

      {/* Delete Confirmation Modal with Courtesy Warning for Last Service */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-5 sm:p-7">
          <div
            onClick={() => !isDeleting && setDeleteTarget(null)}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          />

          <div
            className="relative z-10 w-full max-w-md rounded-[24px] shadow-2xl text-center overflow-hidden bg-[#FAF8F5] border border-[#E3DBCC] p-7 sm:p-9"
          >
            {isLastServiceInCat ? (
              <>
                <div
                  className="w-14 h-14 rounded-full mx-auto mb-5 flex items-center justify-center bg-[#FEF3C7] border border-[#FCD34D] text-[#B45309]"
                >
                  <AlertTriangle size={24} />
                </div>

                <h3
                  className="text-[24px] sm:text-[26px] text-[#181818] font-normal leading-[1.2] mb-3"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                  Delete Last Service in {deleteTargetCatName}?
                </h3>

                {/* Courtesy warning banner */}
                <div className="mb-5 p-4 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] text-left">
                  <p
                    className="text-[12.5px] leading-[1.65] text-[#92400E] font-medium"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    This is the last service in <strong className="font-semibold text-[#78350F]">{deleteTargetCatName}</strong> — deleting it will remove this category from the site until a new service is added.
                  </p>
                </div>

                {deleteTarget && (
                  <div className="py-2.5 px-4 mb-6 rounded-lg bg-[#EFEAE1] font-mono text-[11.5px] text-[#55493A] truncate">
                    {deleteTarget.eyebrow || deleteTarget.title || 'Package'} — {deleteTarget.subtitle} ({deleteTarget.tier})
                  </div>
                )}

                <div className="pt-5 border-t border-[#E3DBCC]/60 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    disabled={isDeleting}
                    onClick={() => setDeleteTarget(null)}
                    className="px-5 py-2.5 rounded-full border border-[#D5CEC2] text-[#55493A] text-[11px] uppercase tracking-[0.14em] font-medium hover:bg-[#EFEAE1] transition-all cursor-pointer"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    Keep Service
                  </button>
                  <button
                    type="button"
                    disabled={isDeleting}
                    onClick={handleDeleteConfirm}
                    className="px-6 py-2.5 rounded-full bg-[#B91C1C] hover:bg-[#991B1B] text-white text-[11px] uppercase tracking-[0.14em] font-semibold transition-all cursor-pointer disabled:opacity-50"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    {isDeleting ? 'Deleting...' : 'Delete Service'}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div
                  className="w-14 h-14 rounded-full mx-auto mb-5 flex items-center justify-center bg-[#FEE2E2] border border-[#FECACA] text-[#DC2626] font-bold text-xl"
                >
                  !
                </div>

                <h3
                  className="text-[24px] sm:text-[26px] text-[#181818] font-normal leading-[1.2] mb-3"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                  Delete Service Package?
                </h3>

                <p
                  className="text-[13px] text-[#7A7770] leading-[1.7] mb-5 px-2"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  This action cannot be undone. This tier will be permanently removed from your service catalog.
                </p>

                {deleteTarget && (
                  <div className="py-2.5 px-4 mb-6 rounded-lg bg-[#EFEAE1] font-mono text-[11.5px] text-[#55493A] truncate">
                    {deleteTarget.eyebrow || deleteTarget.title || 'Package'} — {deleteTarget.subtitle} ({deleteTarget.tier})
                  </div>
                )}

                <div className="pt-5 border-t border-[#E3DBCC]/60 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    disabled={isDeleting}
                    onClick={() => setDeleteTarget(null)}
                    className="px-5 py-2.5 rounded-full border border-[#D5CEC2] text-[#55493A] text-[11px] uppercase tracking-[0.14em] font-medium hover:bg-[#EFEAE1] transition-all cursor-pointer"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={isDeleting}
                    onClick={handleDeleteConfirm}
                    className="px-6 py-2.5 rounded-full bg-[#B91C1C] hover:bg-[#991B1B] text-white text-[11px] uppercase tracking-[0.14em] font-semibold transition-all cursor-pointer disabled:opacity-50"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    {isDeleting ? 'Deleting...' : 'Delete Package'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <AddCategoryModal
        isOpen={addCategoryModalOpen}
        onClose={() => setAddCategoryModalOpen(false)}
        onSuccess={handleCategoryCreated}
        onCategoryCreated={handleCategoryCreated}
      />

    </div>
  );
}