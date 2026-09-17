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
  <div className="w-full min-h-screen bg-[#FAF9F6] pb-24">
    <div className="w-full max-w-[1680px] mx-auto px-5 sm:px-8 lg:px-12 xl:px-16">

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
      <section className="pt-10 sm:pt-14 lg:pt-16 pb-12 lg:pb-16">

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
          <div className="flex items-center xl:pb-1">

            {/* ADD PACKAGE */}
            <button
              type="button"
              onClick={() => {
                setEditTarget(null);
                setModalOpen(true);
              }}
              className="h-12 inline-flex items-center gap-2.5 px-6 rounded-full bg-[#181818] text-[#FAF8F5] hover:bg-[#303030] transition-all duration-300 cursor-pointer"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              <Plus size={14} />

              <span className="text-[9.5px] uppercase tracking-[0.18em] font-semibold">
                Add Package
              </span>
            </button>

          </div>
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
          <div className="flex items-center gap-x-8 sm:gap-x-11 h-full">

            {categoriesList.map((cat) => {
              const isActive = activeCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategorySelect(cat.id)}
                  className={`relative h-[64px] flex items-center shrink-0 text-[9.5px] uppercase tracking-[0.22em] transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "text-[#181818] font-bold"
                      : "text-[#918A80] font-medium hover:text-[#181818]"
                  }`}
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                >
                  {cat.label}

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
                className={`relative rounded-[26px] transition-all duration-300 ${
                  isDragging
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
        }}
        onSuccess={handleModalSuccess}
        initialData={editTarget}
        serviceToEdit={editTarget}
        category={activeCategory}
        initialCategory={activeCategory}
        availableCategories={categoriesList}
      />

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

      <AddCategoryModal
        isOpen={addCategoryModalOpen}
        onClose={() => setAddCategoryModalOpen(false)}
        onCategoryCreated={(newCat) => {
          setAddCategoryModalOpen(false);

          if (refreshCategories) {
            refreshCategories();
          }

          if (newCat?.slug) {
            handleCategorySelect(newCat.slug);
          }

          showToast(
            `Collection category "${newCat?.name || ""}" created! You can now add packages for it.`
          );
        }}
      />

    </div>
  </div>
  );
}