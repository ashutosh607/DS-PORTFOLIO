import React, { useState, useEffect, useMemo } from 'react';
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
  LayoutGrid,
  Sun,
  Bell,
  ChevronDown,
  MoreHorizontal,
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

  const handleCategorySelect = (catId) => {
    setActiveCategory(catId);
    if (catId === 'all') {
      navigate('/admin/services');
    } else {
      navigate(`/admin/services/${catId}`);
    }
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
          TOP ACTION BAR (Sun, Bell with red dot, AS profile)
      ========================================================= */}
      <div className="flex items-center justify-end gap-5 pb-8 pt-1">
        <button
          type="button"
          className="text-[#6E675E] hover:text-[#181818] transition p-1.5 rounded-full hover:bg-black/5 cursor-pointer"
          title="Toggle Theme"
        >
          <Sun size={18} />
        </button>

        <button
          type="button"
          className="relative text-[#6E675E] hover:text-[#181818] transition p-1.5 rounded-full hover:bg-black/5 cursor-pointer"
          title="Notifications"
        >
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#E53E3E] ring-2 ring-[#FAF8F5]" />
        </button>

        <div className="flex items-center gap-2 pl-2 cursor-pointer select-none">
          <div className="w-7 h-7 rounded-full bg-[#DCD5C9] text-[#2C2925] text-[11px] font-semibold flex items-center justify-center">
            {adminUser?.name ? adminUser.name.slice(0, 2).toUpperCase() : 'AS'}
          </div>
          <span
            className="text-[12.5px] font-medium text-[#2C2925]"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            {adminUser?.name || 'Ashutosh'}
          </span>
          <ChevronDown size={13} className="text-[#888]" />
        </div>
      </div>

      {/* =========================================================
          HERO / PAGE HEADER WITH BOTANICAL BRANCH
      ========================================================= */}
      <section className="relative pb-10 lg:pb-12">
        {/* Background dried botanical illustration */}
        <div className="absolute top-[-35px] right-[-20px] w-[340px] sm:w-[420px] lg:w-[480px] h-[220px] sm:h-[260px] pointer-events-none select-none opacity-35 mix-blend-multiply overflow-hidden z-0">
          <img
            src={driedBotanical}
            alt=""
            className="w-full h-full object-contain object-top-right filter contrast-105"
          />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          {/* LEFT CONTENT */}
          <div className="max-w-[680px]">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-8 h-px bg-[#B6A58D]" />
              <span
                className="text-[9.5px] uppercase tracking-[0.28em] text-[#9A9287] font-semibold"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Studio Administration
              </span>
            </div>

            <h1
              className="text-[#181818] font-normal leading-[0.92] tracking-[-0.04em]"
              style={{
                fontFamily: "'Cormorant Garamond', 'Cormorant', Georgia, serif",
                fontSize: "clamp(54px, 6.8vw, 88px)",
              }}
            >
              Management
            </h1>

            <p
              className="mt-5 max-w-[620px] text-[13px] sm:text-[13.5px] text-[#777168] leading-[1.85]"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Curate and configure service packages, deliverables, pricing guidelines, and presentation order across all photographic disciplines.
            </p>
          </div>

          {/* RIGHT ACTION: SINGLE OBSIDIAN BUTTON "+ ADD CATEGORY" */}
          <div className="shrink-0 pb-1">
            <button
              type="button"
              onClick={() => setAddCategoryModalOpen(true)}
              className="h-11 px-6 rounded-full bg-[#181818] text-white hover:bg-[#2C2C2C] transition-all duration-300 cursor-pointer shadow-xs flex items-center gap-2"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              <Plus size={14} />
              <span className="text-[10px] uppercase tracking-[0.18em] font-semibold">
                Add Category
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================
          CATEGORIES & LIVE PUBLICATION CARD
      ========================================================= */}
      <section className="mb-8 p-6 sm:p-7 rounded-[24px] border border-[#E8E2D6] bg-white shadow-xs">
        <div className="pb-5 border-b border-[#EAE4DA]">
          <div className="flex items-center gap-2.5 mb-1.5">
            <LayoutGrid size={20} className="text-[#181818]" />
            <h2
              className="text-[22px] sm:text-[25px] text-[#181818] font-normal tracking-[-0.015em]"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              Categories &amp; Live Publication
            </h2>
          </div>
          <p
            className="text-[12px] text-[#7A7367]"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Only categories with at least one active service appear on the public site. Empty categories remain safely unpublished.
          </p>
        </div>

        {/* 4-COLUMN CATEGORIES GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
          {categoriesList.map((cat) => {
            const count = serviceCountsByCategory[cat.id] || 0;
            const isLive = count > 0 && (categoryLiveStatus[cat.id] ?? true);
            const thumb =
              CATEGORY_THUMBNAILS[cat.id] ||
              CATEGORY_THUMBNAILS[cat.slug] ||
              CATEGORY_THUMBNAILS.wedding;
            const isCurrent = activeCategory === cat.id;

            return (
              <div
                key={cat.id}
                className={`p-4 rounded-[18px] border transition-all duration-200 bg-[#FCFAF7] flex flex-col justify-between gap-4 ${
                  isCurrent
                    ? 'border-[#181818] shadow-2xs'
                    : 'border-[#EAE4DA] hover:border-[#D5CDC0]'
                }`}
              >
                {/* TOP ROW: Thumbnail + Details + More Options */}
                <div className="flex items-start justify-between gap-2.5">
                  <div className="flex items-start gap-3 min-w-0">
                    <img
                      src={thumb}
                      alt={cat.label}
                      className="w-14 h-14 rounded-[12px] object-cover shrink-0 border border-[#ECE5DB] shadow-2xs"
                    />
                    <div className="min-w-0">
                      <h3 className="text-[14px] font-semibold text-[#181818] tracking-[-0.01em] truncate leading-snug">
                        {cat.label}
                      </h3>
                      <span className="text-[11px] text-[#8C857A] block mt-0.5">
                        {count} {count === 1 ? 'service package' : 'service packages'}
                      </span>
                      {isLive ? (
                        <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-[#EBF7EE] text-[#1E7438] text-[8.5px] uppercase tracking-[0.08em] font-semibold border border-[#C5E8CE]">
                          Published Live
                        </span>
                      ) : (
                        <span className="inline-block mt-2 px-2 py-0.5 rounded-full bg-[#FFF4E5] text-[#A36015] text-[7.5px] sm:text-[8px] uppercase tracking-[0.05em] font-semibold border border-[#F6DCB8]">
                          Not published — add a service
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="relative shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCategoryMenuOpenId(categoryMenuOpenId === cat.id ? null : cat.id);
                      }}
                      className="p-1 rounded-md text-[#8C857A] hover:text-[#181818] hover:bg-black/5 transition cursor-pointer"
                      title="Category options"
                    >
                      <MoreHorizontal size={16} />
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
                          className="w-full px-3 py-1.5 text-left text-[11px] text-[#181818] hover:bg-[#F7F5F0] flex items-center gap-2 cursor-pointer font-medium"
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
                          className="w-full px-3 py-1.5 text-left text-[11px] text-[#181818] hover:bg-[#F7F5F0] flex items-center gap-2 cursor-pointer font-medium"
                        >
                          <Plus size={12} /> Add Service
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* BOTTOM ROW: View Packages -> & + Add Service */}
                <div className="flex items-center justify-between pt-3 border-t border-[#EAE4DA]/70">
                  <button
                    type="button"
                    onClick={() => handleCategorySelect(cat.id)}
                    className="text-[9px] uppercase tracking-[0.14em] font-semibold text-[#7A7367] hover:text-[#181818] transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <span>View Packages</span>
                    <ArrowRight size={10} />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEditTarget(null);
                      setModalTargetCategory(cat.id);
                      setModalLockCategory(true);
                      setModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1 text-[9px] uppercase tracking-[0.14em] font-semibold text-[#181818] hover:text-[#9E8159] transition-colors cursor-pointer"
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
          CATEGORY FILTER TABS BAR
      ========================================================= */}
      <section className="mb-4">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2">
          {/* All Categories pill */}
          <button
            type="button"
            onClick={() => handleCategorySelect('all')}
            className={`h-9 px-4 rounded-full inline-flex items-center gap-2 text-[11.5px] font-medium transition-all shrink-0 cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-[#181818] text-white shadow-xs'
                : 'bg-white border border-[#E4DDD3] text-[#554E45] hover:bg-[#FAF8F5]'
            }`}
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            <LayoutGrid size={14} />
            <span>All Categories ({categoriesList.length})</span>
          </button>

          <span className="h-5 w-px bg-[#D8D1C5] mx-1 shrink-0" />

          {categoriesList.map((cat) => {
            const count = serviceCountsByCategory[cat.id] || 0;
            const IconComponent = CATEGORY_ICONS[cat.id] || Sparkles;
            const isActive = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategorySelect(cat.id)}
                className={`h-9 px-4 rounded-full inline-flex items-center gap-2 text-[11.5px] font-medium transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-[#181818] text-white shadow-xs'
                    : 'bg-white border border-[#E4DDD3] text-[#554E45] hover:bg-[#FAF8F5]'
                }`}
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                <IconComponent size={13} className={isActive ? 'text-white' : 'text-[#7A7367]'} />
                <span>
                  {cat.label} ({count})
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* =========================================================
          SECTION META / REORDER NOTIFICATION
      ========================================================= */}
      <section className="mb-8">
        <div className="p-3.5 px-4 rounded-[14px] bg-[#FCFAF7] border border-[#EAE4DA] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <GripVertical size={13} className="text-[#B7B0A6]" />
            <span
              className="text-[11px] text-[#7A7367]"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Drag packages to rearrange their live display order.
            </span>
          </div>

          {isReordering && (
            <span
              className="text-[9.5px] uppercase tracking-[0.2em] text-[#9E8159] font-semibold animate-pulse"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Saving order...
            </span>
          )}
        </div>
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