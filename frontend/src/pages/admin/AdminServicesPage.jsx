import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Plus,
  Pencil,
  GripVertical,
  Sparkles,
  Eye,
  CheckCircle2,
  Layers,
  Search,
  AlertTriangle,
  LayoutGrid,
  MoreVertical,
  Gem,
  Heart,
  Cake,
  User,
  Calendar,
  Briefcase,
  Baby,
} from 'lucide-react';
import { useAdminAuth } from './context/AdminAuthContext';
import { useCategories } from '../../utils/categoryManager';
import AddEditServiceModal from './components/AddEditServiceModal';
import AddCategoryModal from './components/AddCategoryModal';
import EditCategoryModal from './components/EditCategoryModal';
import CollectionTierCard from '../services/components/CollectionTierCard';
import driedBotanical from '../../assets/dried-botanical.jpg';
import './AdminDashboard.css';

const DEFAULT_CATEGORIES = [
  { id: 'wedding', label: 'Weddings', slug: 'weddings' },
  { id: 'pre-wedding', label: 'Pre-Wedding', slug: 'pre-wedding' },
  { id: 'birthday', label: 'Birthdays', slug: 'birthdays' },
  { id: 'portrait', label: 'Portraits', slug: 'portraits' },
  { id: 'event', label: 'Events', slug: 'events' },
  { id: 'commercial', label: 'Commercial', slug: 'commercial' },
  { id: 'baby', label: 'Baby', slug: 'baby' },
  { id: 'maternity', label: 'Maternity', slug: 'maternity' },
];

// Curated thumbnail images matching the editorial aesthetic
const CATEGORY_THUMBNAILS = {
  wedding: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=400&auto=format&fit=crop',
  weddings: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=400&auto=format&fit=crop',
  'pre-wedding': 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=400&auto=format&fit=crop',
  birthday: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=400&auto=format&fit=crop',
  birthdays: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=400&auto=format&fit=crop',
  portrait: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
  portraits: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
  event: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=400&auto=format&fit=crop',
  events: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=400&auto=format&fit=crop',
  commercial: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=400&auto=format&fit=crop',
  baby: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?q=80&w=400&auto=format&fit=crop',
  maternity: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=400&auto=format&fit=crop',
  bab: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?q=80&w=400&auto=format&fit=crop',
  yagyat: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=400&auto=format&fit=crop',
};

const CATEGORY_ICONS = {
  wedding: Gem,
  weddings: Gem,
  'pre-wedding': Heart,
  birthday: Cake,
  birthdays: Cake,
  portrait: User,
  portraits: User,
  event: Calendar,
  events: Calendar,
  commercial: Briefcase,
  baby: Baby,
  maternity: Sparkles,
};

export default function AdminServicesPage() {
  const { category: categoryParam } = useParams();
  const navigate = useNavigate();
  const { adminUser, getAuthHeaders } = useAdminAuth();
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
          image: cat.image || cat.imageUrl,
        });
      }
    });
    return base;
  }, [dynamicCategories, backendCategories]);

  const [activeCategory, setActiveCategory] = useState(categoryParam || 'all');
  const [services, setServices] = useState([]);
  const [allServices, setAllServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isReordering, setIsReordering] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Search states: categorySearch for categories card, searchQuery for services
  const [categorySearch, setCategorySearch] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal & menu states
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLockCategory, setModalLockCategory] = useState(false);
  const [modalTargetCategory, setModalTargetCategory] = useState(activeCategory === 'all' ? 'wedding' : activeCategory);
  const [addCategoryModalOpen, setAddCategoryModalOpen] = useState(false);
  const [editCategoryTarget, setEditCategoryTarget] = useState(null);
  const [categoryMenuOpenId, setCategoryMenuOpenId] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Close more menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setCategoryMenuOpenId(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

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

  // Compute live publication status (has at least 1 active service)
  const categoryLiveStatus = React.useMemo(() => {
    const status = {};
    categoriesList.forEach((cat) => {
      const sKey = toCanonicalKey(cat.id);
      const hasLive = allServices.some(
        (s) => toCanonicalKey(s.category) === sKey && s.isActive !== false
      );
      status[cat.id] = hasLive;
    });
    return status;
  }, [allServices, categoriesList]);

  // Filter categories by categorySearch input
  const filteredCategoriesList = useMemo(() => {
    if (!categorySearch.trim()) return categoriesList;
    const q = categorySearch.toLowerCase().trim();
    return categoriesList.filter((cat) => cat.label.toLowerCase().includes(q));
  }, [categoriesList, categorySearch]);

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
      if (normalizedParam === 'all') {
        setActiveCategory('all');
        return;
      }
      const matched = categoriesList.find(
        (c) => c.id === normalizedParam || c.id === normalizedParam.replace(/s$/, '')
      );
      if (matched) {
        setActiveCategory(matched.id);
      } else {
        setActiveCategory(normalizedParam);
      }
    } else {
      setActiveCategory('all');
    }
  }, [categoryParam, categoriesList]);

  // Fetch services for active category (or all if activeCategory === 'all')
  const fetchServices = async () => {
    try {
      setLoading(true);
      const url =
        activeCategory === 'all'
          ? '/api/services?includeInactive=true'
          : `/api/services?category=${activeCategory}&includeInactive=true`;
      const res = await fetch(url);
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

  const packagesSectionRef = useRef(null);

  const scrollToPackages = () => {
    setTimeout(() => {
      if (packagesSectionRef.current) {
        packagesSectionRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    }, 60);
  };

  const handleCategorySelect = (catId, shouldScroll = false) => {
    setActiveCategory(catId);
    if (catId === 'all') {
      navigate('/admin/services');
    } else {
      navigate(`/admin/services/${catId}`);
    }
    if (shouldScroll) {
      scrollToPackages();
    }
  };

  // Toggle active status
  const handleToggleActive = async (service, e) => {
    e.stopPropagation();
    try {
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
    <div className="w-full max-w-[1400px] px-8 lg:px-12 py-8 bg-[#FAF8F5]">

      {/* =========================================================
          TOAST
      ========================================================= */}
      {toastMessage && (
        <div className="fixed bottom-7 right-7 z-50">
          <div className="flex items-center gap-3 px-5 py-3.5 bg-[#181818] text-[#FAF8F5] rounded-full shadow-[0_18px_50px_rgba(0,0,0,0.18)] border border-white/10">
            <CheckCircle2 size={15} className="text-[#C2A378]" />
            <span className="text-[11px] tracking-wide font-medium">
              {toastMessage}
            </span>
          </div>
        </div>
      )}

      {/* =========================================================
          HERO SECTION
      ========================================================= */}
      <section className="relative pb-8 mb-8 overflow-hidden">
        {/* Decorative dried botanical background graphic on right */}
        <div
          className="absolute right-0 top-0 bottom-0 h-full w-[45%] max-w-[480px] pointer-events-none select-none z-0 overflow-hidden"
          style={{
            maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)',
            WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)',
          }}
        >
          <img
            src={driedBotanical}
            alt=""
            className="w-full h-full object-cover object-center opacity-40 mix-blend-multiply filter contrast-105"
          />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="max-w-[560px]">
            <h1 className="font-display text-[#181818] font-medium text-5xl lg:text-6xl tracking-[-0.02em] leading-none">
              Management
            </h1>
            <p className="mt-3 text-sm text-[#7A7367] leading-relaxed">
              Curate and configure service packages, deliverables, pricing guidelines, and presentation order across all photographic disciplines.
            </p>
          </div>

          <div className="shrink-0 pb-1">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#7A7367] font-medium">
              CREATE&nbsp;&nbsp;/&nbsp;&nbsp;CAPTURE&nbsp;&nbsp;/&nbsp;&nbsp;DELIVER
            </span>
          </div>
        </div>
      </section>

      {/* =========================================================
          3. CATEGORIES & LIVE PUBLICATION CARD
      ========================================================= */}
      <section className="bg-white border border-[#EAE4DA] rounded-2xl p-6 lg:p-8 shadow-xs mb-8">
        {/* Header Row: Title & Subtitle + Search & Add Category */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <LayoutGrid size={22} className="text-[#181818] shrink-0" />
              <h2 className="font-display text-3xl lg:text-[34px] font-normal text-[#181818] tracking-tight">
                Categories &amp; Live Publication
              </h2>
            </div>
            <p className="text-[13px] text-[#7A7367] font-light">
              Only categories with at least one active service appear on the public site. Empty categories remain safely unpublished.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Search Categories Input */}
            <div className="relative">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9A9287]" />
              <input
                type="text"
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
                placeholder="Search categories..."
                className="h-11 w-64 lg:w-72 pl-10 pr-4 rounded-lg border border-[#EAE4DA] bg-white text-[13px] text-[#181818] placeholder-[#9A9287] outline-none transition-colors focus:border-[#181818]"
              />
            </div>

            {/* + Add Category Button */}
            <button
              type="button"
              onClick={() => setAddCategoryModalOpen(true)}
              className="h-11 px-5 rounded-lg bg-[#181818] hover:bg-[#2C2C2C] text-white text-[13px] font-medium shadow-xs transition-colors flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Plus size={14} />
              <span>Add Category</span>
            </button>
          </div>
        </div>

        {/* 4-COLUMN CATEGORIES GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mt-6">
          {filteredCategoriesList.length === 0 ? (
            <div className="col-span-full py-12 text-center bg-[#FAF8F5] rounded-xl border border-[#EAE4DA]">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mx-auto mb-3 text-[#7A7367] border border-[#EAE4DA]">
                <LayoutGrid size={18} />
              </div>
              <p className="text-sm font-medium text-[#181818]">
                No categories found
              </p>
              <p className="text-xs text-[#7A7367] mt-1">
                Try adjusting your category search query
              </p>
            </div>
          ) : (
            filteredCategoriesList.map((cat) => {
              const count = serviceCountsByCategory[cat.id] || 0;
              const isLive = count > 0 && (categoryLiveStatus[cat.id] ?? true);
              const thumb =
                cat.image ||
                CATEGORY_THUMBNAILS[cat.id] ||
                CATEGORY_THUMBNAILS[cat.slug];
              const isCurrent = activeCategory === cat.id;
              const IconComponent = CATEGORY_ICONS[cat.id] || Sparkles;

              return (
                <div
                  key={cat.id}
                  className={`bg-white border rounded-xl p-5 transition-all flex flex-col justify-between group ${
                    isCurrent
                      ? 'border-[#181818] shadow-xs'
                      : 'border-[#EAE4DA] hover:border-[#D5CDC0]'
                  }`}
                >
                  <div>
                    {/* Top Row: Thumbnail + Details + 3-dot Menu */}
                    <div className="flex items-start justify-between gap-3">
                      <div
                        className="flex items-center gap-3.5 min-w-0 cursor-pointer flex-1"
                        onClick={() => handleCategorySelect(cat.id, true)}
                        title={`View ${cat.label} packages`}
                      >
                        {thumb ? (
                          <img
                            src={thumb}
                            alt={cat.label}
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                            className="w-14 h-14 rounded-lg object-cover shrink-0 border border-[#EAE4DA]"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-lg bg-[#F1ECE3] border border-[#EAE4DA] flex items-center justify-center shrink-0 text-[#7A7367]">
                            <IconComponent size={22} strokeWidth={1.5} />
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <h3 className="font-display text-[21px] font-normal text-[#181818] leading-tight truncate group-hover:text-black transition-colors">
                            {cat.label}
                          </h3>
                          <span className="text-[13px] text-[#7A7367] block mt-0.5 truncate">
                            {count} {count === 1 ? 'service package' : 'service packages'}
                          </span>
                        </div>
                      </div>

                      {/* Three-dot vertical options menu */}
                      <div className="relative shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCategoryMenuOpenId(categoryMenuOpenId === cat.id ? null : cat.id);
                          }}
                          className="text-[#7A7367] hover:text-[#181818] p-1 rounded-md transition-colors cursor-pointer"
                          title="Category options"
                          aria-label="Category options"
                        >
                          <MoreVertical size={16} />
                        </button>

                        {categoryMenuOpenId === cat.id && (
                          <div
                            className="absolute right-0 mt-1 w-36 bg-white rounded-xl shadow-lg border border-[#EAE4DA] py-1 z-30"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              type="button"
                              onClick={() => {
                                setCategoryMenuOpenId(null);
                                setEditCategoryTarget(cat);
                              }}
                              className="w-full px-3 py-1.5 text-left text-[12px] text-[#181818] hover:bg-[#FAF8F5] flex items-center gap-2 cursor-pointer font-medium"
                            >
                              <Pencil size={12} /> Edit Category
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setCategoryMenuOpenId(null);
                                setEditTarget(null);
                                setModalTargetCategory(cat.id);
                                setModalLockCategory(true);
                                setModalOpen(true);
                              }}
                              className="w-full px-3 py-1.5 text-left text-[12px] text-[#181818] hover:bg-[#FAF8F5] flex items-center gap-2 cursor-pointer font-medium"
                            >
                              <Plus size={12} /> Add Service
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Status Badge: Full-width row so it never clips or goes out of the box */}
                    <div className="mt-3 flex items-center">
                      {isLive ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10.5px] font-semibold tracking-wider uppercase bg-[#EBF7EE] text-[#1E7438] border border-[#C5E8CE]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#1E7438] shrink-0" />
                          PUBLISHED LIVE
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-[#FFF4E5] text-[#A36015] border border-[#F6DCB8] max-w-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#A36015] shrink-0" />
                          <span className="truncate">NOT PUBLISHED &ndash; ADD A SERVICE</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Bottom Links: View Packages & Add Service */}
                  <div className="border-t border-[#EAE4DA] pt-3 mt-4 flex items-center justify-between text-[13px]">
                    <button
                      type="button"
                      onClick={() => handleCategorySelect(cat.id, true)}
                      className="text-[#7A7367] hover:text-[#181818] flex items-center gap-1.5 transition-colors cursor-pointer text-[13px] font-normal"
                    >
                      <Eye size={14} className="text-[#7A7367]" />
                      <span>View Packages</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditTarget(null);
                        setModalTargetCategory(cat.id);
                        setModalLockCategory(true);
                        setModalOpen(true);
                      }}
                      className="text-[#181818] hover:text-[#9E8159] transition-colors cursor-pointer text-[13px] font-medium"
                    >
                      + Add Service
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* =========================================================
          4. FILTER BAR (ONE rounded container)
      ========================================================= */}
      <div className="bg-white border border-[#EAE4DA] rounded-xl px-3 py-2 flex items-center justify-between gap-3 shadow-xs mb-6 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
          {/* All Categories Pill */}
          <button
            type="button"
            onClick={() => handleCategorySelect('all', true)}
            className={`h-9 px-4 text-[13px] font-medium rounded-full inline-flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-[#181818] text-white shadow-xs'
                : 'bg-transparent text-[#554E45] hover:bg-[#FAF8F5]'
            }`}
          >
            <LayoutGrid size={14} />
            <span>All Categories ({categoriesList.length})</span>
          </button>

          {/* Individual Category Pills */}
          {categoriesList.map((cat) => {
            const count = serviceCountsByCategory[cat.id] || 0;
            const IconComponent = CATEGORY_ICONS[cat.id] || Sparkles;
            const isActive = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategorySelect(cat.id, true)}
                className={`h-9 px-4 text-[13px] font-medium rounded-full inline-flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#181818] text-white shadow-xs'
                    : 'bg-transparent text-[#554E45] hover:bg-[#FAF8F5]'
                }`}
              >
                <IconComponent size={13} className={isActive ? 'text-white' : 'text-[#7A7367]'} />
                <span>
                  {cat.label} ({count})
                </span>
              </button>
            );
          })}
        </div>

        {/* Far Right: Showing X categories with Eye icon */}
        <div className="hidden lg:flex items-center gap-1.5 text-[12px] text-[#7A7367] shrink-0 pl-3 border-l border-[#EAE4DA]">
          <Eye size={14} className="text-[#7A7367]" />
          <span>Showing {categoriesList.length} categories</span>
        </div>
      </div>

      {/* =========================================================
          5. REORDER HINT (Plain muted line when category selected & 2+ packages)
      ========================================================= */}
      {activeCategory !== 'all' && filteredServices.length >= 2 && (
        <div className="flex items-center gap-2 text-[12px] text-[#7A7367] mb-4">
          <GripVertical size={13} className="text-[#A39E95]" />
          <span>Drag packages to rearrange their live display order.</span>
          {isReordering && (
            <span className="text-[#9E8159] font-medium animate-pulse ml-2">Saving order...</span>
          )}
        </div>
      )}

      {/* =========================================================
          6. PACKAGE GRID & MANAGEMENT SECTION
      ========================================================= */}
      <div ref={packagesSectionRef} className="pt-6 border-t border-[#EAE4DA] scroll-mt-8">
        <div className="flex items-baseline justify-between mb-6">
          <h3 className="font-display text-2xl font-normal text-[#181818]">
            {activeCategoryObj.label} Packages
          </h3>
          <span className="text-[13px] text-[#7A7367]">
            {filteredServices.length} {filteredServices.length === 1 ? 'package' : 'packages'}
          </span>
        </div>

        {loading ? (
          /* LOADING STATE */
          <div className="min-h-[320px] flex flex-col items-center justify-center">
            <div className="w-7 h-7 border-2 border-[#181818] border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#7A7367] font-medium">
              Loading {activeCategoryObj.label} Packages...
            </p>
          </div>
        ) : filteredServices.length === 0 ? (
          /* EMPTY STATE */
          <div className="min-h-[320px] flex items-center justify-center py-8">
            <div className="w-full max-w-[560px] px-8 py-12 text-center rounded-2xl border border-dashed border-[#DDD5C9] bg-white/70">
              <div className="w-14 h-14 mx-auto mb-5 rounded-full border border-[#E5DED3] bg-[#FAF8F4] flex items-center justify-center">
                <Layers size={22} className="text-[#AAA197] stroke-[1.2]" />
              </div>

              <h4 className="font-display text-2xl text-[#181818] font-normal mb-3">
                {searchQuery
                  ? `No packages match "${searchQuery}"`
                  : `No service packages found for ${activeCategoryObj.label}`}
              </h4>

              <p className="max-w-[420px] mx-auto mb-6 text-[13px] text-[#7A7367] leading-relaxed">
                {searchQuery
                  ? "Try searching for a different keyword, category, or tier name."
                  : "Create your first package tier for this category to present transparent deliverables and luxury booking options."}
              </p>

              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="inline-flex items-center px-5 py-2.5 rounded-lg bg-white border border-[#D8D1C5] text-[#181818] text-xs font-semibold hover:bg-[#F3EFE8] transition-colors cursor-pointer"
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
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#181818] text-[#FAF8F5] text-xs font-semibold hover:bg-[#2A2A2A] transition-colors cursor-pointer"
                >
                  <Plus size={14} />
                  <span>Add First Package for {activeCategoryObj.label}</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          /* PACKAGE GRID */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-10 items-stretch">
            {filteredServices.map((service, index) => {
              const isDragging = draggedIndex === index;
              const isOver = dragOverIndex === index;

              return (
                <div
                  key={service._id || service.id}
                  className={`relative rounded-2xl transition-all duration-300 ${
                    isDragging
                      ? "opacity-40 scale-[0.985]"
                      : isOver
                        ? "ring-1 ring-[#9E8159] scale-[1.005]"
                        : "hover:-translate-y-1"
                  }`}
                >
                  <CollectionTierCard
                    collection={{
                      ...service,
                      id: service._id || service.tier,
                      _id: service._id,
                      title: service.eyebrow || service.title || "Collection",
                      subtitle: service.subtitle,
                      image: service.imageUrl || service.image,
                      imageUrl: service.imageUrl || service.image,
                      imageLabel: service.imageTag || "Archive Specimen",
                      price: service.price,
                      priceNote: service.priceNote,
                      deliverables: service.deliverables || [],
                      isRecommended: service.isRecommended,
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
                    onToggleActive={(item, e) => handleToggleActive(service, e)}
                    dragProps={{
                      draggable: true,
                      onDragStart: (e) => handleDragStart(e, index),
                      onDragOver: (e) => handleDragOver(e, index),
                      onDragEnd: handleDragEnd,
                      onDrop: (e) => handleDrop(e, index),
                    }}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* =========================================================
          MODALS & SYSTEM INTEGRATION (Wiring Unchanged)
      ========================================================= */}
      <AddEditServiceModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditTarget(null);
          setModalLockCategory(false);
        }}
        service={editTarget}
        targetCategory={modalTargetCategory}
        lockCategory={modalLockCategory}
        categories={categoriesList}
        onSuccess={handleModalSuccess}
      />

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
          onClick={() => setDeleteTarget(null)}
        >
          <div
            className="w-full max-w-[480px] bg-white rounded-2xl border border-[#E8E2D6] p-7 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {isLastServiceInCat ? (
              <>
                <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center bg-[#FEF3C7] border border-[#FDE68A] text-[#D97706]">
                  <AlertTriangle size={22} />
                </div>

                <h3 className="font-display text-2xl text-[#181818] font-normal leading-tight text-center mb-2">
                  Unpublish Category Warning
                </h3>

                <p className="text-[13px] text-[#7A7367] leading-relaxed text-center mb-5 px-2">
                  Deleting this service will leave{' '}
                  <strong className="text-[#181818] font-semibold">"{deleteTargetCatName}"</strong> with{' '}
                  <span className="text-[#B91C1C] font-semibold">0 active packages</span>.
                  The category will be hidden from the public navigation and pricing pages.
                </p>

                {deleteTarget && (
                  <div className="py-2 px-3.5 mb-5 rounded-lg bg-[#FAF8F5] border border-[#EAE4DA] font-mono text-[11px] text-[#554E45] truncate">
                    {deleteTarget.eyebrow || deleteTarget.title || 'Package'} — {deleteTarget.subtitle} ({deleteTarget.tier})
                  </div>
                )}

                <div className="pt-4 border-t border-[#EAE4DA] flex items-center justify-end gap-3">
                  <button
                    type="button"
                    disabled={isDeleting}
                    onClick={() => setDeleteTarget(null)}
                    className="px-4 py-2 rounded-lg border border-[#D5CEC2] text-[#554E45] text-xs font-medium hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                  >
                    Keep Service
                  </button>
                  <button
                    type="button"
                    disabled={isDeleting}
                    onClick={handleDeleteConfirm}
                    className="px-4 py-2 rounded-lg bg-[#B91C1C] hover:bg-[#991B1B] text-white text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isDeleting ? 'Deleting...' : 'Delete Service'}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center bg-[#FEE2E2] border border-[#FECACA] text-[#DC2626] font-bold text-xl">
                  !
                </div>

                <h3 className="font-display text-2xl text-[#181818] font-normal leading-tight text-center mb-2">
                  Delete Service Package?
                </h3>

                <p className="text-[13px] text-[#7A7367] leading-relaxed text-center mb-5 px-2">
                  This action cannot be undone. This tier will be permanently removed from your service catalog.
                </p>

                {deleteTarget && (
                  <div className="py-2 px-3.5 mb-5 rounded-lg bg-[#FAF8F5] border border-[#EAE4DA] font-mono text-[11px] text-[#554E45] truncate">
                    {deleteTarget.eyebrow || deleteTarget.title || 'Package'} — {deleteTarget.subtitle} ({deleteTarget.tier})
                  </div>
                )}

                <div className="pt-4 border-t border-[#EAE4DA] flex items-center justify-end gap-3">
                  <button
                    type="button"
                    disabled={isDeleting}
                    onClick={() => setDeleteTarget(null)}
                    className="px-4 py-2 rounded-lg border border-[#D5CEC2] text-[#554E45] text-xs font-medium hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={isDeleting}
                    onClick={handleDeleteConfirm}
                    className="px-4 py-2 rounded-lg bg-[#B91C1C] hover:bg-[#991B1B] text-white text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
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

      {editCategoryTarget && (
        <EditCategoryModal
          isOpen={!!editCategoryTarget}
          onClose={() => setEditCategoryTarget(null)}
          category={editCategoryTarget}
          onSuccess={() => {
            setEditCategoryTarget(null);
            if (refreshCategories) refreshCategories();
            fetchAllServices();
            showToast('Category updated successfully.');
          }}
        />
      )}

    </div>
  );
}