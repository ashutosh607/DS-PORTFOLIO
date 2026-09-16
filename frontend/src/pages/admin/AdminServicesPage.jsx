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

  // Merge default categories with custom dynamic categories
  const categoriesList = React.useMemo(() => {
    const base = [...DEFAULT_CATEGORIES];
    const sourcePool = [...(dynamicCategories || []), ...(backendCategories || [])];

    sourcePool.forEach((cat) => {
      const slug = (cat.slug || cat.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || '').toLowerCase();
      const exists = base.some(
        (c) => c.id === slug || c.id === slug.replace(/s$/, '') || `${c.id}s` === slug
      );
      if (!exists && slug) {
        const rawName = cat.name || slug;
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

  const activeCategoryObj =
    categoriesList.find((c) => c.id === activeCategory) || {
      id: activeCategory,
      label: activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1),
    };

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

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#E8E2D6]">
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#181818]" />
              <span className="text-[11px] uppercase tracking-[0.22em] text-[#7A756D] font-semibold">
                BESPOKE COMMISSIONS &amp; TIERS
              </span>
            </div>
            <h1 className="text-[32px] sm:text-[38px] font-serif text-[#181818] font-normal leading-tight">
              Services Management
            </h1>
            <p className="text-[13px] text-[#7A756D] mt-2 max-w-2xl leading-relaxed">
              Curate and configure service packages, deliverables, pricing guidelines, and presentation order across all photographic disciplines.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`/services?category=${activeCategory}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-3 border border-[#E8E2D6] rounded-xl text-[12px] uppercase tracking-[0.14em] font-semibold text-[#55493A] hover:bg-[#F3EFE8] transition-colors"
            >
              <ExternalLink size={14} />
              <span>Preview Live</span>
            </a>
            <button
              type="button"
              onClick={() => {
                setEditTarget(null);
                setModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-5 py-3 bg-[#181818] text-[#FAF8F5] rounded-xl text-[12px] uppercase tracking-[0.14em] font-semibold hover:bg-[#333333] shadow-sm transition-all cursor-pointer"
            >
              <Plus size={15} />
              <span>Add Package ({activeCategoryObj.label})</span>
            </button>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="pt-8 pb-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categoriesList.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategorySelect(cat.id)}
                  className={`px-5 py-2.5 rounded-full text-[12px] uppercase tracking-[0.14em] font-medium transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-[#181818] text-[#FAF8F5] shadow-sm'
                      : 'bg-[#EFEAE2] text-[#5C5852] hover:text-[#181818] hover:bg-[#E5DFD5]'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}

            {/* Quick Add Collection Category Button */}
            <button
              type="button"
              onClick={() => setAddCategoryModalOpen(true)}
              className="px-4 py-2.5 rounded-full text-[11px] uppercase tracking-[0.14em] font-medium border border-dashed border-[#B8AE9F] text-[#6E675E] hover:text-[#181818] hover:border-[#181818] hover:bg-[#F3EFE8] transition-all shrink-0 flex items-center gap-1.5 cursor-pointer"
              title="Add a new collection category to the studio"
            >
              <Plus size={13} />
              <span>New Category</span>
            </button>
          </div>
        </div>

        {/* Reordering notice */}
        <div className="flex items-center justify-between py-2 text-[12px] text-[#7A756D]">
          <div className="flex items-center gap-2">
            <GripVertical size={14} className="text-[#A39D94]" />
            <span>Drag packages to rearrange live display order on public pages.</span>
          </div>
          {isReordering && (
            <span className="text-[#9E8159] font-medium animate-pulse">Saving order...</span>
          )}
        </div>

        {/* Services Listing */}
        {loading ? (
          <div className="py-24 text-center">
            <div className="inline-block w-8 h-8 border-2 border-[#181818] border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-[13px] uppercase tracking-[0.18em] text-[#7A756D]">
              Loading {activeCategoryObj.label} Packages...
            </p>
          </div>
        ) : services.length === 0 ? (
          <div className="mt-6 border-2 border-dashed border-[#E0D7C9] rounded-2xl p-16 text-center bg-[#FAF8F5]/50">
            <Layers size={36} className="mx-auto text-[#A39D94] mb-4 stroke-1" />
            <h3 className="text-[20px] font-serif text-[#181818] font-normal mb-2">
              No service packages found for {activeCategoryObj.label}
            </h3>
            <p className="text-[13px] text-[#7A756D] max-w-md mx-auto mb-6">
              Create your first package tier for this category to present transparent deliverables and luxury booking options.
            </p>
            <button
              type="button"
              onClick={() => {
                setEditTarget(null);
                setModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#181818] text-[#FAF8F5] rounded-xl text-[12px] uppercase tracking-[0.14em] font-semibold hover:bg-[#333333] transition-all cursor-pointer shadow-sm"
            >
              <Plus size={15} />
              <span>Add First Package for {activeCategoryObj.label}</span>
            </button>
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-stretch">
            {services.map((service, index) => {
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
                  className={`admin-card relative flex flex-col justify-between transition-all duration-200 cursor-grab active:cursor-grabbing border ${
                    isDragging
                      ? 'opacity-40 border-[#181818] shadow-lg scale-98'
                      : isOver
                      ? 'border-[#9E8159] shadow-md bg-[#FAF6F0]'
                      : 'border-[#E8E2D6] hover:border-[#D4CCC0] hover:shadow-sm'
                  } ${!service.isActive ? 'opacity-70 bg-[#F9F7F3]' : 'bg-white'}`}
                  style={{ borderRadius: '18px', overflow: 'hidden' }}
                >
                  {/* Card Header Media & Badges */}
                  <div>
                    {/* Media Frame */}
                    <div className="relative aspect-[16/10] bg-[#181818] overflow-hidden group">
                      <img
                        src={service.imageUrl}
                        alt={service.subtitle || service.eyebrow}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/30 pointer-events-none" />

                      {/* Top Bar inside Image: Drag handle + Status */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-md text-[10px] text-white tracking-[0.14em] uppercase font-semibold">
                          <GripVertical size={13} className="text-[#C2A378]" />
                          <span>Folio 0{index + 1}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          {service.isRecommended && (
                            <span className="flex items-center gap-1 px-2.5 py-1 bg-[#C2A378] text-black font-semibold text-[9.5px] uppercase tracking-[0.12em] rounded-md shadow-sm">
                              <Sparkles size={11} />
                              <span>Featured</span>
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={(e) => handleToggleActive(service, e)}
                            className={`flex items-center gap-1 px-2 py-1 rounded-md text-[9.5px] uppercase tracking-[0.12em] font-medium backdrop-blur-md transition-colors ${
                              service.isActive
                                ? 'bg-white/90 text-[#181818] hover:bg-white'
                                : 'bg-red-500/90 text-white hover:bg-red-600'
                            }`}
                            title={service.isActive ? 'Visible on site' : 'Hidden from site'}
                          >
                            {service.isActive ? (
                              <>
                                <Eye size={11} />
                                <span>Active</span>
                              </>
                            ) : (
                              <>
                                <EyeOff size={11} />
                                <span>Draft</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Bottom Info inside Image */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2 z-10 text-white">
                        <div>
                          <span className="block text-[10px] tracking-[0.18em] uppercase text-[#E8E2D6] font-medium">
                            {service.eyebrow}
                          </span>
                          <span className="block font-serif text-[18px] leading-tight text-white mt-0.5">
                            {service.subtitle}
                          </span>
                        </div>
                        {service.imageTag && (
                          <span className="text-[9.5px] uppercase tracking-[0.14em] px-2 py-0.5 bg-white/20 backdrop-blur-xs rounded text-white/90 font-mono">
                            {service.imageTag}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 sm:p-6 space-y-4">
                      {/* Price Section */}
                      <div className="pb-3 border-b border-[#F0EAE0] flex items-baseline justify-between">
                        <div>
                          <span className="text-[10px] uppercase tracking-[0.16em] text-[#7A756D] block font-medium">
                            Investment
                          </span>
                          <span className="text-[20px] font-serif font-medium text-[#181818]">
                            {service.price ? `₹${service.price.toLocaleString('en-IN')}` : 'Price to be added'}
                          </span>
                        </div>
                        {service.priceNote && (
                          <span className="text-[11px] text-[#7A756D] italic">
                            {service.priceNote}
                          </span>
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-[12.5px] text-[#55493A] leading-relaxed line-clamp-2">
                        {service.description}
                      </p>

                      {/* Deliverables summary */}
                      <div className="pt-1">
                        <span className="block text-[10px] uppercase tracking-[0.16em] text-[#7A756D] font-semibold mb-2">
                          Deliverables ({service.deliverables?.length || 0})
                        </span>
                        <ul className="space-y-1.5 text-[12px] text-[#42392F]">
                          {(service.deliverables || []).slice(0, 3).map((item, dIdx) => (
                            <li key={dIdx} className="flex items-start gap-2">
                              <span className="w-1 h-1 rounded-full bg-[#9E8159] mt-2 shrink-0" />
                              <span className="line-clamp-1">{item}</span>
                            </li>
                          ))}
                          {(service.deliverables || []).length > 3 && (
                            <li className="text-[11px] text-[#9E8159] font-medium pl-3">
                              +{service.deliverables.length - 3} more privileges included
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="p-4 sm:px-6 sm:py-4 bg-[#FAF8F5] border-t border-[#E8E2D6] flex items-center justify-between">
                    <span className="text-[10.5px] tracking-[0.14em] uppercase text-[#7A756D] font-mono">
                      ORDER #{index + 1}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditTarget(service);
                          setModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#D8D1C5] hover:border-[#181818] rounded-lg text-[11px] uppercase tracking-[0.12em] font-medium text-[#181818] transition-colors cursor-pointer"
                      >
                        <Pencil size={12} />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteTarget(service);
                        }}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-[#E8E2D6] bg-white text-[#992E2E] hover:bg-[#FAF0F0] hover:border-[#E8C4C4] transition-colors cursor-pointer"
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
