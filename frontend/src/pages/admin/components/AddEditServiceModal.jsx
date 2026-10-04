import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  X,
  Upload,
  Image as ImageIcon,
  Sparkles,
  DollarSign,
  Plus,
  Trash2,
  Check,
  Star,
  FileText,
  Tag,
  AlignLeft,
  ZoomIn,
  ZoomOut,
  Move,
  RotateCcw,
  Maximize2,
  Minimize2,
  Crop,
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useCategories } from '../../../utils/categoryManager';
import { optimizeImageFile } from '../../../utils/imageOptimizer';
import { DEFAULT_DISPLAY, getFramingStyle } from '../../../utils/mediaFraming';
import '../AdminDashboard.css';

const PRESETS = [
  { id: 'tl', label: '↖ Top Left', x: 0, y: 0, symbol: '↖' },
  { id: 'tc', label: '↑ Top', x: 50, y: 0, symbol: '↑' },
  { id: 'tr', label: '↗ Top Right', x: 100, y: 0, symbol: '↗' },
  { id: 'ml', label: '← Left', x: 0, y: 50, symbol: '←' },
  { id: 'mc', label: '• Center', x: 50, y: 50, symbol: '•' },
  { id: 'mr', label: '→ Right', x: 100, y: 50, symbol: '→' },
  { id: 'bl', label: '↙ Bottom Left', x: 0, y: 100, symbol: '↙' },
  { id: 'bc', label: '↓ Bottom', x: 50, y: 100, symbol: '↓' },
  { id: 'br', label: '↘ Bottom Right', x: 100, y: 100, symbol: '↘' },
];

const DEFAULT_CATEGORIES = [
  { id: 'wedding', label: 'Wedding' },
  { id: 'pre-wedding', label: 'Pre-Wedding' },
  { id: 'birthday', label: 'Birthday' },
  { id: 'portrait', label: 'Portrait' },
  { id: 'event', label: 'Event' },
  { id: 'commercial', label: 'Commercial' },
];

export default function AddEditServiceModal({
  isOpen,
  onClose,
  service,
  serviceToEdit,
  initialData,
  targetCategory,
  initialCategory,
  category: categoryProp,
  categories = [],
  availableCategories = [],
  lockCategory = false,
  onSuccess,
}) {
  const effectiveCategory = (categoryProp || targetCategory || initialCategory || 'wedding').toLowerCase().trim();
  const effectiveServiceToEdit = service || serviceToEdit || initialData || null;
  const isEditMode = Boolean(effectiveServiceToEdit);

  const { getAuthHeaders } = useAdminAuth();
  const { categories: dynamicCategories } = useCategories();
  const fileInputRef = useRef(null);

  const categoriesOptions = React.useMemo(() => {
    const list = [...DEFAULT_CATEGORIES];
    const sourcePool = [...(categories || []), ...(availableCategories || []), ...(dynamicCategories || [])];

    sourcePool.forEach((c) => {
      const slug = (c.id || c.slug || c.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || '').toLowerCase().trim();
      const exists = list.some((existing) => existing.id === slug || existing.id === slug.replace(/s$/, ''));
      if (!exists && slug) {
        list.push({ id: slug, label: c.name || c.label || slug.charAt(0).toUpperCase() + slug.slice(1) });
      }
    });

    // Guarantee that effectiveCategory (e.g. 'baby') is always an option in the list
    if (effectiveCategory && !list.some((existing) => existing.id === effectiveCategory || existing.id === effectiveCategory.replace(/s$/, ''))) {
      list.push({
        id: effectiveCategory,
        label: effectiveCategory.charAt(0).toUpperCase() + effectiveCategory.slice(1),
      });
    }

    return list;
  }, [availableCategories, dynamicCategories, effectiveCategory]);

  const [category, setCategory] = useState(effectiveCategory);
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategoryInput, setCustomCategoryInput] = useState('');
  const [tier, setTier] = useState('');
  const [folioLabel, setFolioLabel] = useState('');
  const [eyebrow, setEyebrow] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [badge, setBadge] = useState('');
  const [imageTag, setImageTag] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isPriceToBeAdded, setIsPriceToBeAdded] = useState(true);
  const [price, setPrice] = useState('');
  const [priceNote, setPriceNote] = useState('');
  const [description, setDescription] = useState('');
  const [privilegesLabel, setPrivilegesLabel] = useState('INCLUDED DELIVERABLES');
  const [deliverables, setDeliverables] = useState(['']);
  const [isRecommended, setIsRecommended] = useState(false);
  const [isActive, setIsActive] = useState(true);

  // Image Resizing, Scaling & Framing State
  const [display, setDisplay] = useState(DEFAULT_DISPLAY);
  const [showFocalCrosshair, setShowFocalCrosshair] = useState(true);

  // Dragging state for live interactive framing canvas
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ startX: 0, startY: 0, initialPosX: 50, initialPosY: 50 });
  const previewBoxRef = useRef(null);

  const handleDragStart = (clientX, clientY) => {
    setIsDragging(true);
    dragStartRef.current = {
      startX: clientX,
      startY: clientY,
      initialPosX: typeof display.position?.x === 'number' ? display.position.x : 50,
      initialPosY: typeof display.position?.y === 'number' ? display.position.y : 50,
    };
  };

  const handleDragMove = useCallback((clientX, clientY) => {
    if (!isDragging || !previewBoxRef.current) return;
    const rect = previewBoxRef.current.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const deltaX = clientX - dragStartRef.current.startX;
    const deltaY = clientY - dragStartRef.current.startY;
    const currentZoom = typeof display.zoom === 'number' && display.zoom >= 1 ? display.zoom : 1;
    const sensitivity = (100 / rect.width) * (1 / Math.max(1, currentZoom * 0.7));

    let nextX = dragStartRef.current.initialPosX - deltaX * sensitivity;
    let nextY = dragStartRef.current.initialPosY - deltaY * sensitivity;

    nextX = Math.max(0, Math.min(100, Math.round(nextX * 10) / 10));
    nextY = Math.max(0, Math.min(100, Math.round(nextY * 10) / 10));

    setDisplay((prev) => ({
      ...prev,
      position: { x: nextX, y: nextY },
    }));
  }, [isDragging, display.zoom]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (!isDragging) return;
    const onMouseMove = (e) => handleDragMove(e.clientX, e.clientY);
    const onTouchMove = (e) => {
      if (e.touches[0]) handleDragMove(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onUp = () => handleDragEnd();

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onUp);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onUp);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  const handleResetFraming = () => {
    setDisplay({ fit: 'cover', position: { x: 50, y: 50 }, zoom: 1 });
  };

  const handleZoomStep = (delta) => {
    setDisplay((prev) => {
      const current = typeof prev.zoom === 'number' ? prev.zoom : 1;
      const next = Math.max(1, Math.min(2.5, Math.round((current + delta) * 10) / 10));
      return { ...prev, zoom: next };
    });
  };

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (effectiveServiceToEdit) {
        const itemCat = (effectiveServiceToEdit.category || effectiveCategory || 'wedding').toLowerCase().trim();
        setCategory(itemCat);
        setTier(effectiveServiceToEdit.tier || '');
        setFolioLabel(effectiveServiceToEdit.folioLabel || 'Folio 01');
        setEyebrow(effectiveServiceToEdit.eyebrow || effectiveServiceToEdit.title || '');
        setSubtitle(effectiveServiceToEdit.subtitle || '');
        setBadge(effectiveServiceToEdit.badge || '');
        setImageTag(effectiveServiceToEdit.imageTag || effectiveServiceToEdit.imageLabel || '');

        const photoUrl = effectiveServiceToEdit.imageUrl || effectiveServiceToEdit.image || '';
        setImageUrl(photoUrl);
        setImagePreview(photoUrl);
        setImageFile(null);

        if (effectiveServiceToEdit.display && typeof effectiveServiceToEdit.display === 'object') {
          setDisplay({
            fit: effectiveServiceToEdit.display.fit === 'contain' || effectiveServiceToEdit.display.fit === 'fit' ? 'contain' : 'cover',
            position: {
              x: typeof effectiveServiceToEdit.display.position?.x === 'number' ? effectiveServiceToEdit.display.position.x : 50,
              y: typeof effectiveServiceToEdit.display.position?.y === 'number' ? effectiveServiceToEdit.display.position.y : 50,
            },
            zoom: typeof effectiveServiceToEdit.display.zoom === 'number' && effectiveServiceToEdit.display.zoom >= 1 ? effectiveServiceToEdit.display.zoom : 1,
          });
        } else {
          setDisplay({ fit: 'cover', position: { x: 50, y: 50 }, zoom: 1 });
        }

        const rawPrice =
          effectiveServiceToEdit.price !== undefined && effectiveServiceToEdit.price !== null
            ? effectiveServiceToEdit.price
            : effectiveServiceToEdit.numericPrice;

        if (
          rawPrice !== undefined &&
          rawPrice !== null &&
          String(rawPrice).toLowerCase() !== 'null' &&
          String(rawPrice).trim() !== ''
        ) {
          setIsPriceToBeAdded(false);
          setPrice(String(rawPrice));
        } else {
          setIsPriceToBeAdded(true);
          setPrice('');
        }

        setPriceNote(effectiveServiceToEdit.priceNote || '');
        setDescription(effectiveServiceToEdit.description || '');
        setPrivilegesLabel(effectiveServiceToEdit.privilegesLabel || 'INCLUDED DELIVERABLES');

        const dList =
          Array.isArray(effectiveServiceToEdit.deliverables) && effectiveServiceToEdit.deliverables.length > 0
            ? effectiveServiceToEdit.deliverables
            : [''];
        setDeliverables(dList);

        setIsRecommended(Boolean(effectiveServiceToEdit.isRecommended));
        setIsActive(effectiveServiceToEdit.isActive !== undefined ? Boolean(effectiveServiceToEdit.isActive) : true);
      } else {
        setCategory(effectiveCategory);
        setIsCustomCategory(false);
        setCustomCategoryInput('');
        setTier('');
        setFolioLabel('Folio 01');
        setEyebrow('');
        setSubtitle('');
        setBadge('');
        setImageTag('');
        setImageUrl('');
        setImagePreview('');
        setImageFile(null);
        setDisplay({ fit: 'cover', position: { x: 50, y: 50 }, zoom: 1 });
        setIsPriceToBeAdded(true);
        setPrice('');
        setPriceNote('Exclusive of applicable state VAT / Art transport');
        setDescription('');
        setPrivilegesLabel('INCLUDED DELIVERABLES');
        setDeliverables(['']);
        setIsRecommended(false);
        setIsActive(true);
      }
    }
  }, [isOpen, effectiveServiceToEdit, effectiveCategory]);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl);
    }
  };

  const handleAddDeliverable = () => {
    setDeliverables((prev) => [...prev, '']);
  };

  const handleRemoveDeliverable = (index) => {
    setDeliverables((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDeliverableChange = (index, value) => {
    setDeliverables((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tier.trim()) {
      setError('Tier name is required');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const cleanDeliverables = deliverables.map((d) => d.trim()).filter(Boolean);

      const finalCategory = (isCustomCategory ? customCategoryInput : category).toLowerCase().trim();
      if (!finalCategory) {
        setError('Category is required');
        setSubmitting(false);
        return;
      }

      const formData = new FormData();
      formData.append('category', finalCategory);
      formData.append('tier', tier.trim());
      formData.append('folioLabel', folioLabel.trim());
      formData.append('eyebrow', eyebrow.trim());
      formData.append('subtitle', subtitle.trim());
      formData.append('badge', badge.trim());
      formData.append('imageTag', imageTag.trim());
      formData.append('price', isPriceToBeAdded ? 'null' : price.trim());
      formData.append('priceNote', priceNote.trim());
      formData.append('description', description.trim());
      formData.append('privilegesLabel', privilegesLabel.trim());
      formData.append('deliverables', JSON.stringify(cleanDeliverables));
      formData.append('isRecommended', String(isRecommended));
      formData.append('isActive', String(isActive));
      formData.append('display', JSON.stringify(display));

      if (imageFile) {
        let uploadImage = imageFile;
        const isImage = imageFile.type?.startsWith('image/') || /\.(jpg|jpeg|png|webp|avif|gif)$/i.test(imageFile.name);
        if (isImage) {
          uploadImage = await optimizeImageFile(imageFile);
        }
        formData.append('imageFile', uploadImage, imageFile.name || 'service.jpg');
      } else if (imageUrl.trim()) {
        formData.append('imageUrl', imageUrl.trim());
      }

      const targetId = effectiveServiceToEdit?._id || effectiveServiceToEdit?.id;
      const url = isEditMode && targetId
        ? `/api/services/${targetId}`
        : '/api/services';
      const method = isEditMode ? 'PUT' : 'POST';

      const authHeaders = getAuthHeaders ? getAuthHeaders() : {};
      delete authHeaders['Content-Type']; // Let browser set multipart boundary

      const res = await fetch(url, {
        method,
        headers: authHeaders,
        body: formData,
        credentials: 'include',
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || 'Failed to save service package');
      }

      if (onSuccess) {
        onSuccess(json.data);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'An unexpected error occurred while saving.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-10 bg-black/45 backdrop-blur-sm">
      {/* Modal Container (Form wrapper to enable standard submit from footer) */}
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-[1040px] max-h-[90vh] bg-[#FCFAF7] rounded-[26px] border border-[#E4DED3] shadow-[0_28px_80px_rgba(0,0,0,0.22)] overflow-hidden flex flex-col my-auto"
      >
        {/* =====================================================
            REGION 1: FIXED MODAL HEADER (Non-scrolling)
            - At least 32px padding on left/right (clamp(24px, 4vw, 36px))
            - At least 24px padding at the very top of modal
            - At least 16px between subtitle line and divider below it
           ===================================================== */}
        <header
          className="shrink-0 border-b border-[#EAE4DA] bg-[#FCFAF7]"
          style={{
            paddingTop: '24px',
            paddingBottom: '24px',
            paddingLeft: 'clamp(24px, 4vw, 36px)',
            paddingRight: 'clamp(24px, 4vw, 36px)',
          }}
        >
          <div className="flex items-start justify-between gap-6">
            <div className="flex items-center gap-4">
              {/* Icon Badge */}
              <div className="w-11 h-11 rounded-[14px] bg-[#F1ECE3] border border-[#E5DECFA] flex items-center justify-center text-[#2A2621] shrink-0">
                <Sparkles size={18} strokeWidth={1.4} />
              </div>

              {/* Title & Subtitle */}
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2
                    className="text-[#181818] font-normal leading-tight tracking-[-0.02em]"
                    style={{
                      fontFamily: "'Cormorant Garamond', 'Cormorant', Georgia, serif",
                      fontSize: 'clamp(26px, 3vw, 32px)',
                    }}
                  >
                    {isEditMode ? 'Edit Service Package' : 'Add New Service'}
                  </h2>

                  <span className="px-3 py-0.5 rounded-full bg-[#EDE6DC] border border-[#DDD5C9] text-[#786E64] text-[9.5px] uppercase tracking-[0.16em] font-semibold">
                    {isCustomCategory ? (customCategoryInput || 'Custom') : (category || effectiveCategory)}
                  </span>
                </div>

                <p className="text-[12.5px] text-[#7C766C] mt-1.5 font-sans leading-normal">
                  Configure the visual identity, pricing, deliverables and presentation of this collection.
                </p>
              </div>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-[#EDE6DC] hover:bg-[#E2D9CD] text-[#7A7266] hover:text-[#181818] flex items-center justify-center transition-colors cursor-pointer shrink-0"
              aria-label="Close modal"
            >
              <X size={16} />
            </button>
          </div>
        </header>

        {/* =====================================================
            REGION 2: SCROLLABLE MIDDLE CONTENT
            - Only part that scrolls internally
            - Exactly identical left/right padding (clamp(24px, 4vw, 36px))
            - At least 40px vertical space between sections (space-y-10)
            - At least 20px between section heading and first field row (mb-5)
            - Generous bottom padding to ensure clearance above footer
           ===================================================== */}
        <div
          className="flex-1 min-h-0 overflow-y-auto space-y-10"
          style={{
            paddingTop: '32px',
            paddingBottom: '48px',
            paddingLeft: 'clamp(24px, 4vw, 36px)',
            paddingRight: 'clamp(24px, 4vw, 36px)',
          }}
        >
          {/* Error Message */}
          {error && (
            <div className="p-4 rounded-[14px] bg-[#FFF3F0] border border-[#F3C4BA] text-xs text-[#C53030] leading-relaxed">
              {error}
            </div>
          )}

          {/* ═══════════════════════════════════════════════════
              01 — COLLECTION IDENTITY
             ═══════════════════════════════════════════════════ */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[12px] font-semibold text-[#8C857A]">01</span>
                <span className="w-6 h-px bg-[#DCD4C7]" />
                <h3
                  className="text-[#181818] font-normal leading-none"
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: '22px',
                  }}
                >
                  Collection Identity
                </h3>
              </div>
              <span className="text-[9.5px] uppercase tracking-[0.2em] font-semibold text-[#968F84]">
                ESSENTIAL DETAILS
              </span>
            </div>

            <div className="space-y-6">
              {/* Row 1: Category & Tier Name (>= 24px horizontal gap) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-[9.5px] font-semibold tracking-[0.18em] text-[#6E675D] uppercase block mb-2">
                    Category *
                  </label>
                  {lockCategory ? (
                    <div className="w-full h-12 px-4 rounded-[14px] border border-[#DCD5C9] bg-[#F1ECE3] flex items-center justify-between text-[12.5px] text-[#181818] select-none">
                      <span className="font-medium">
                        {categoriesOptions.find((c) => c.id === category)?.label || category.charAt(0).toUpperCase() + category.slice(1)}
                      </span>
                      <span className="text-[9.5px] uppercase tracking-[0.14em] font-semibold text-[#8C857A]">
                        Category Locked
                      </span>
                    </div>
                  ) : (
                    <>
                      <select
                        value={isCustomCategory ? '__custom__' : category}
                        onChange={(e) => {
                          if (e.target.value === '__custom__') {
                            setIsCustomCategory(true);
                          } else {
                            setIsCustomCategory(false);
                            setCategory(e.target.value);
                          }
                        }}
                        className="w-full h-12 px-4 rounded-[14px] border border-[#DCD5C9] bg-[#FAF8F5] focus:bg-white text-[12.5px] text-[#181818] outline-none focus:border-[#181818] transition-all cursor-pointer"
                      >
                        {categoriesOptions.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.label}
                          </option>
                        ))}
                        <option value="__custom__">+ Custom Collection Category...</option>
                      </select>

                      {isCustomCategory && (
                        <input
                          type="text"
                          value={customCategoryInput}
                          onChange={(e) => {
                            setCustomCategoryInput(e.target.value);
                            setCategory(e.target.value.toLowerCase().trim());
                          }}
                          placeholder="Enter new category (e.g. Maternity)"
                          required
                          className="w-full h-11 px-4 mt-2.5 rounded-[12px] border border-[#DCD5C9] bg-white text-[12px] text-[#181818] outline-none focus:border-[#181818]"
                        />
                      )}
                    </>
                  )}
                </div>

                <div>
                  <label className="text-[9.5px] font-semibold tracking-[0.18em] text-[#6E675D] uppercase block mb-2">
                    Tier Name *
                  </label>
                  <input
                    type="text"
                    value={tier}
                    onChange={(e) => setTier(e.target.value)}
                    placeholder="e.g. Essential"
                    required
                    className="w-full h-12 px-4 rounded-[14px] border border-[#DCD5C9] bg-[#FAF8F5] focus:bg-white text-[12.5px] text-[#181818] outline-none focus:border-[#181818] transition-all"
                  />
                </div>
              </div>

              {/* Row 2: Eyebrow Tag & Folio Label (>= 24px horizontal gap) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-[9.5px] font-semibold tracking-[0.18em] text-[#6E675D] uppercase block mb-2">
                    Eyebrow Tag
                  </label>
                  <input
                    type="text"
                    value={eyebrow}
                    onChange={(e) => setEyebrow(e.target.value)}
                    placeholder="e.g. INTIMATE SINGLE DAY"
                    className="w-full h-12 px-4 rounded-[14px] border border-[#DCD5C9] bg-[#FAF8F5] focus:bg-white text-[12.5px] text-[#181818] outline-none focus:border-[#181818] transition-all"
                  />
                </div>

                <div>
                  <label className="text-[9.5px] font-semibold tracking-[0.18em] text-[#6E675D] uppercase block mb-2">
                    Folio Label
                  </label>
                  <input
                    type="text"
                    value={folioLabel}
                    onChange={(e) => setFolioLabel(e.target.value)}
                    placeholder="e.g. Folio 01"
                    className="w-full h-12 px-4 rounded-[14px] border border-[#DCD5C9] bg-[#FAF8F5] focus:bg-white text-[12.5px] text-[#181818] outline-none focus:border-[#181818] transition-all"
                  />
                </div>
              </div>

              {/* Row 3: Subtitle / Tagline */}
              <div>
                <label className="text-[9.5px] font-semibold tracking-[0.18em] text-[#6E675D] uppercase block mb-2">
                  Subtitle / Tagline
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="e.g. Single Day Gathering & Intimate Nuptials"
                  className="w-full h-12 px-4 rounded-[14px] border border-[#DCD5C9] bg-[#FAF8F5] focus:bg-white text-[12.5px] text-[#181818] outline-none focus:border-[#181818] transition-all"
                />
              </div>
            </div>
          </section>

          {/* ═══════════════════════════════════════════════════
              02 — COVER PHOTOGRAPH (3-Column Layout, visually top-aligned, >= 24px gap)
             ═══════════════════════════════════════════════════ */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[12px] font-semibold text-[#8C857A]">02</span>
                <span className="w-6 h-px bg-[#DCD4C7]" />
                <h3
                  className="text-[#181818] font-normal leading-none"
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: '22px',
                  }}
                >
                  Cover Photograph
                </h3>
              </div>
              <span className="text-[9.5px] uppercase tracking-[0.2em] font-semibold text-[#968F84]">
                VISUAL IDENTITY
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
              {/* Item 1: Upload Photograph Box */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="h-[148px] rounded-[16px] border-2 border-dashed border-[#DDD7CC] hover:border-[#968F84] bg-[#F6F2EC] hover:bg-[#F1EDE5] transition-all cursor-pointer flex flex-col items-center justify-center text-center p-4"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.jpg,.jpeg,.png,.webp,.avif,.gif"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="w-10 h-10 rounded-full bg-white border border-[#E2DBD0] flex items-center justify-center text-[#706A60] mb-2 shadow-2xs">
                  <Upload size={16} />
                </div>
                <span className="text-[12px] font-medium text-[#292622]">Upload photograph</span>
                <span className="text-[9.5px] text-[#9A9287] mt-0.5">PNG · JPG · WEBP</span>
              </div>

              {/* Item 2: Image Preview with framing applied */}
              {imagePreview ? (
                <div className="relative h-[148px] rounded-[16px] overflow-hidden border border-[#DED7CC] bg-[#EFEBE4] group">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full transition-transform duration-150 ease-out"
                    style={getFramingStyle(display)}
                  />
                  <div className="absolute top-2 left-2 pointer-events-none">
                    <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white text-[9px] font-mono tracking-wider">
                      {Math.round((display.zoom || 1) * 100)}% · {display.fit || 'cover'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview('');
                      setImageUrl('');
                      setImageFile(null);
                      setDisplay({ fit: 'cover', position: { x: 50, y: 50 }, zoom: 1 });
                    }}
                    className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-white/95 hover:bg-white text-[#222222] shadow-[0_2px_6px_rgba(0,0,0,0.12)] flex items-center justify-center transition-all cursor-pointer"
                    title="Remove image"
                  >
                    <X size={12} strokeWidth={2.5} />
                  </button>
                </div>
              ) : (
                <div className="h-[148px] rounded-[16px] border border-[#E8E2D6] bg-[#F8F6F2] flex items-center justify-center text-center p-4 text-[#A0998F] text-[11.5px]">
                  No image selected
                </div>
              )}

              {/* Item 3: URL and Badge Tag Inputs */}
              <div className="flex flex-col justify-between gap-3 h-[148px]">
                <div>
                  <label className="text-[9.5px] font-semibold tracking-[0.18em] text-[#6E675D] uppercase block mb-1.5">
                    IMAGE URL
                  </label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => {
                      setImageUrl(e.target.value);
                      if (!imageFile) setImagePreview(e.target.value);
                    }}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full h-10 px-3.5 rounded-[12px] border border-[#DCD5C9] bg-[#FAF8F5] focus:bg-white text-[11.5px] text-[#181818] outline-none focus:border-[#181818]"
                  />
                </div>

                <div>
                  <label className="text-[9.5px] font-semibold tracking-[0.18em] text-[#6E675D] uppercase block mb-1.5">
                    IMAGE BADGE TAG
                  </label>
                  <input
                    type="text"
                    value={imageTag}
                    onChange={(e) => setImageTag(e.target.value)}
                    placeholder="e.g. 120 Analog Film"
                    className="w-full h-10 px-3.5 rounded-[12px] border border-[#DCD5C9] bg-[#FAF8F5] focus:bg-white text-[11.5px] text-[#181818] outline-none focus:border-[#181818]"
                  />
                </div>
              </div>
            </div>

            {/* Live Interactive Framing & Resizing Studio Panel */}
            {Boolean(imagePreview || imageUrl) && (
              <div className="mt-6 rounded-[20px] border border-[#E2DACD] bg-[#F7F4EE] p-5 sm:p-6 shadow-xs">
                {/* Header with Title and Reset */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-[#E5DECFA]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-[10px] bg-[#EDE6DC] border border-[#DDD5C9] flex items-center justify-center text-[#2A2621]">
                      <Crop size={14} />
                    </div>
                    <div>
                      <h4 className="text-[13px] font-semibold text-[#181818] tracking-tight flex items-center gap-2">
                        <span>Image Resizing &amp; Framing Controls</span>
                        <span className="px-2 py-0.5 rounded-full bg-[#E5DECFA] text-[#6E675D] text-[9.5px] font-mono font-medium">
                          4:3 Tier Card Simulation
                        </span>
                      </h4>
                      <p className="text-[11px] text-[#7A7367] mt-0.5">
                        Scale, zoom and drag focal position to customize how this photo appears in public packages.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleResetFraming}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-[#FAF8F5] text-[#5C5852] hover:text-[#181818] border border-[#DDD5C9] text-[10.5px] font-medium transition-colors cursor-pointer shadow-2xs"
                  >
                    <RotateCcw size={11} />
                    <span>Reset Framing</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left (6 cols): Interactive 4:3 Drag & Pan Canvas */}
                  <div className="lg:col-span-6 flex flex-col gap-2.5">
                    <div className="flex items-center justify-between text-[10.5px] text-[#7A7367] px-1 font-mono uppercase tracking-wider">
                      <span>4:3 Live Framing Preview</span>
                      <span>
                        X: <strong className="text-[#181818]">{Math.round(display.position?.x ?? 50)}%</strong> · Y: <strong className="text-[#181818]">{Math.round(display.position?.y ?? 50)}%</strong>
                      </span>
                    </div>

                    <div className="relative w-full rounded-[14px] overflow-hidden bg-[#EAE4D8] border border-[#DCD5C7] shadow-inner p-2 sm:p-2.5">
                      <div
                        ref={previewBoxRef}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleDragStart(e.clientX, e.clientY);
                        }}
                        onTouchStart={(e) => {
                          if (e.touches[0]) {
                            handleDragStart(e.touches[0].clientX, e.touches[0].clientY);
                          }
                        }}
                        className={`relative w-full aspect-[4/3] overflow-hidden rounded-[10px] select-none transition-shadow ${
                          isDragging ? 'cursor-grabbing ring-2 ring-[#101010]' : 'cursor-grab'
                        }`}
                        style={{
                          backgroundColor: display.fit === 'contain' ? '#FAF8F5' : '#141414',
                        }}
                        title="Click and drag to position image"
                      >
                        <img
                          src={imagePreview || imageUrl}
                          alt="Framing preview"
                          draggable={false}
                          className="w-full h-full pointer-events-none select-none transition-transform duration-75 ease-out"
                          style={getFramingStyle(display)}
                        />

                        {/* Subtle focal crosshair */}
                        {showFocalCrosshair && (
                          <div
                            className="absolute pointer-events-none transition-all duration-75 z-20"
                            style={{
                              left: `${display.position?.x ?? 50}%`,
                              top: `${display.position?.y ?? 50}%`,
                              transform: 'translate(-50%, -50%)',
                            }}
                          >
                            <div className="w-7 h-7 rounded-full border-2 border-white/90 shadow-[0_0_6px_rgba(0,0,0,0.6)] flex items-center justify-center">
                              <div className="w-1.5 h-1.5 rounded-full bg-white shadow-xs" />
                            </div>
                          </div>
                        )}

                        {/* Drag Gesture Hint Tag */}
                        <div className="absolute top-2.5 right-2.5 pointer-events-none z-30">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xs text-white text-[9.5px] font-mono tracking-wider shadow-sm">
                            <Move size={9} />
                            <span>DRAG TO RE-CENTER</span>
                          </span>
                        </div>

                        {/* Badge */}
                        <div className="absolute bottom-2.5 left-2.5 pointer-events-none z-30">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/85 backdrop-blur-xs text-[#181818] text-[9px] font-mono font-medium shadow-xs">
                            {display.fit === 'contain' ? 'Fit · Contain' : 'Cover · Fill'}
                          </span>
                        </div>
                      </div>

                      <div className="mt-2 flex items-center justify-between text-[10.5px] text-[#7A7367] px-1 font-sans">
                        <span>Click and drag inside preview to reposition</span>
                        <button
                          type="button"
                          onClick={() => setShowFocalCrosshair(!showFocalCrosshair)}
                          className="hover:text-[#181818] underline cursor-pointer"
                        >
                          {showFocalCrosshair ? 'Hide crosshair' : 'Show crosshair'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right (6 cols): Scaling, Fit & Presets */}
                  <div className="lg:col-span-6 flex flex-col gap-4 bg-white p-4.5 sm:p-5 rounded-[14px] border border-[#E5DECFA]">
                    
                    {/* 1. Zoom / Scaling Slider */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-[10px] font-mono tracking-[0.16em] uppercase text-[#6E675D] font-semibold flex items-center gap-1.5">
                          <ZoomIn size={12} />
                          <span>IMAGE RESIZE / ZOOM</span>
                        </label>
                        <span className="font-mono text-[11px] font-semibold text-[#181818] bg-[#F4EFEA] px-2 py-0.5 rounded-md border border-[#E3DBD0]">
                          {Math.round((display.zoom || 1) * 100)}%
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleZoomStep(-0.1)}
                          className="w-8 h-8 rounded-lg bg-[#FAF8F5] border border-[#DCD5C9] hover:bg-[#F0EBE3] flex items-center justify-center text-[#554E44] transition-colors cursor-pointer shrink-0"
                          title="Zoom out"
                        >
                          <ZoomOut size={13} />
                        </button>

                        <input
                          type="range"
                          min="1"
                          max="2.5"
                          step="0.05"
                          value={display.zoom || 1}
                          onChange={(e) => setDisplay((prev) => ({ ...prev, zoom: parseFloat(e.target.value) }))}
                          className="w-full accent-[#181818] cursor-pointer"
                        />

                        <button
                          type="button"
                          onClick={() => handleZoomStep(0.1)}
                          className="w-8 h-8 rounded-lg bg-[#FAF8F5] border border-[#DCD5C9] hover:bg-[#F0EBE3] flex items-center justify-center text-[#554E44] transition-colors cursor-pointer shrink-0"
                          title="Zoom in"
                        >
                          <ZoomIn size={13} />
                        </button>
                      </div>
                      <div className="flex justify-between text-[9px] font-mono text-[#9C9488] mt-1 px-1">
                        <span>1.0x (Normal)</span>
                        <span>1.75x</span>
                        <span>2.5x (Close-up)</span>
                      </div>
                    </div>

                    {/* 2. Fit Mode Toggle */}
                    <div>
                      <label className="text-[10px] font-mono tracking-[0.16em] uppercase text-[#6E675D] font-semibold block mb-1.5">
                        FIT MODE
                      </label>
                      <div className="grid grid-cols-2 gap-2 bg-[#F6F3EC] p-1 rounded-lg border border-[#E4DDD1]">
                        <button
                          type="button"
                          onClick={() => setDisplay((prev) => ({ ...prev, fit: 'cover' }))}
                          className={`py-1.5 px-3 rounded-md text-[11px] font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                            display.fit !== 'contain'
                              ? 'bg-[#101010] text-white shadow-xs font-semibold'
                              : 'text-[#5C5852] hover:text-[#181818]'
                          }`}
                        >
                          <Maximize2 size={11} />
                          <span>Cover (Fill Card)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setDisplay((prev) => ({ ...prev, fit: 'contain' }))}
                          className={`py-1.5 px-3 rounded-md text-[11px] font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                            display.fit === 'contain'
                              ? 'bg-[#101010] text-white shadow-xs font-semibold'
                              : 'text-[#5C5852] hover:text-[#181818]'
                          }`}
                        >
                          <Minimize2 size={11} />
                          <span>Contain (No Crop)</span>
                        </button>
                      </div>
                    </div>

                    {/* 3. Focal Alignment Presets (9 points) */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-[10px] font-mono tracking-[0.16em] uppercase text-[#6E675D] font-semibold">
                          FOCAL ALIGNMENT
                        </label>
                        <span className="text-[9.5px] text-[#8E887E]">9 Presets</span>
                      </div>
                      <div className="grid grid-cols-3 gap-1.5 bg-[#FAF8F5] p-1.5 rounded-lg border border-[#E8E2D6]">
                        {PRESETS.map((preset) => {
                          const isSelected =
                            Math.abs((display.position?.x ?? 50) - preset.x) < 5 &&
                            Math.abs((display.position?.y ?? 50) - preset.y) < 5;
                          return (
                            <button
                              key={preset.id}
                              type="button"
                              onClick={() =>
                                setDisplay((prev) => ({
                                  ...prev,
                                  position: { x: preset.x, y: preset.y },
                                }))
                              }
                              className={`h-8 rounded-md text-[11px] font-mono font-medium transition-all flex items-center justify-center gap-1 cursor-pointer border ${
                                isSelected
                                  ? 'bg-[#101010] text-white border-[#101010] shadow-xs'
                                  : 'bg-white text-[#4A463F] border-[#E2DACD] hover:bg-[#F2ECE1]'
                              }`}
                              title={preset.label}
                            >
                              <span className="text-[12px]">{preset.symbol}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            )}
          </section>

          {/* ═══════════════════════════════════════════════════
              03 — INVESTMENT (At least 20px heading margin, 24px gaps, clean below-scroll spacing)
             ═══════════════════════════════════════════════════ */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[12px] font-semibold text-[#8C857A]">03</span>
                <span className="w-6 h-px bg-[#DCD4C7]" />
                <h3
                  className="text-[#181818] font-normal leading-none"
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: '22px',
                  }}
                >
                  Investment
                </h3>
              </div>
              <span className="text-[9.5px] uppercase tracking-[0.2em] font-semibold text-[#968F84]">
                PRICING DETAILS
              </span>
            </div>

            <div className="rounded-[18px] border border-[#E6DFD4] bg-[#F6F2EC] p-5 sm:p-6 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="text-[9.5px] font-semibold tracking-[0.18em] text-[#6E675D] uppercase">
                  PACKAGE PRICING
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-[11.5px] text-[#6E675D] hover:text-[#181818] transition-colors select-none">
                  <input
                    type="checkbox"
                    checked={isPriceToBeAdded}
                    onChange={(e) => setIsPriceToBeAdded(e.target.checked)}
                    className="w-4 h-4 rounded-[4px] border-[#CCC4B7] text-[#181818] focus:ring-0 cursor-pointer"
                  />
                  <span>Display as &quot;[PRICE TO BE ADDED]&quot;</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-end">
                {!isPriceToBeAdded ? (
                  <div>
                    <div className="flex rounded-[12px] border border-[#DDD6C8] bg-white overflow-hidden focus-within:border-[#181818] transition-colors h-11">
                      <div className="px-3.5 bg-[#F0EBE3] border-r border-[#DDD6C8] flex items-center justify-center text-[#554E44] text-[13px] font-semibold select-none">
                        $
                      </div>
                      <input
                        type="number"
                        min="0"
                        step="50"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="e.g. 8,400"
                        className="w-full h-full px-3.5 bg-white text-[12.5px] text-[#181818] outline-none placeholder-[#A8A196]"
                      />
                    </div>
                  </div>
                ) : null}

                <div className={isPriceToBeAdded ? 'sm:col-span-2' : ''}>
                  <label className="text-[9.5px] font-semibold tracking-[0.18em] text-[#6E675D] uppercase block mb-1.5">
                    PRICE NOTE
                  </label>
                  <input
                    type="text"
                    value={priceNote}
                    onChange={(e) => setPriceNote(e.target.value)}
                    placeholder="e.g. Priority atelier calendar allocation 2025–2026"
                    className="w-full h-11 px-4 rounded-[12px] border border-[#DDD6C8] bg-white text-[12.5px] text-[#181818] outline-none focus:border-[#181818] placeholder-[#A8A196] transition-colors"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* ═══════════════════════════════════════════════════
              04 — EDITORIAL NARRATIVE
             ═══════════════════════════════════════════════════ */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[12px] font-semibold text-[#8C857A]">04</span>
                <span className="w-6 h-px bg-[#DCD4C7]" />
                <h3
                  className="text-[#181818] font-normal leading-none"
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: '22px',
                  }}
                >
                  Editorial Narrative
                </h3>
              </div>
              <span className="text-[9.5px] uppercase tracking-[0.2em] font-semibold text-[#968F84]">
                STORY &amp; VISION
              </span>
            </div>

            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the experience, aesthetic and story behind this collection..."
              className="w-full p-4 rounded-[14px] border border-[#DCD5C9] bg-[#FAF8F5] focus:bg-white text-[12.5px] text-[#181818] placeholder-[#A8A196] outline-none focus:border-[#181818] leading-relaxed resize-none transition-all"
            />
          </section>

          {/* ═══════════════════════════════════════════════════
              05 — INCLUDED DELIVERABLES
             ═══════════════════════════════════════════════════ */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[12px] font-semibold text-[#8C857A]">05</span>
                <span className="w-6 h-px bg-[#DCD4C7]" />
                <h3
                  className="text-[#181818] font-normal leading-none"
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: '22px',
                  }}
                >
                  Included Deliverables
                </h3>
              </div>
              <button
                type="button"
                onClick={handleAddDeliverable}
                className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.16em] font-semibold text-[#181818] hover:text-[#7A7367] transition-colors cursor-pointer"
              >
                <Plus size={13} />
                <span>Add Bullet</span>
              </button>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                value={privilegesLabel}
                onChange={(e) => setPrivilegesLabel(e.target.value)}
                placeholder="Heading — e.g. INCLUDED DELIVERABLES"
                className="w-full h-11 px-4 rounded-[12px] border border-[#DCD5C9] bg-[#FAF8F5] focus:bg-white text-[12px] text-[#181818] outline-none focus:border-[#181818]"
              />

              {deliverables.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="shrink-0 w-7 h-7 rounded-full bg-[#EFEAE2] text-[#7A7367] flex items-center justify-center font-mono text-[10px]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleDeliverableChange(index, e.target.value)}
                    placeholder={`Deliverable ${index + 1}`}
                    className="flex-1 h-11 px-4 rounded-[12px] border border-[#DCD5C9] bg-[#FAF8F5] focus:bg-white text-[12.5px] text-[#181818] outline-none focus:border-[#181818]"
                  />
                  {deliverables.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveDeliverable(index)}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-[#A29A8F] hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      title="Remove"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* ═══════════════════════════════════════════════════
              06 — COLLECTION SETTINGS
             ═══════════════════════════════════════════════════ */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[12px] font-semibold text-[#8C857A]">06</span>
                <span className="w-6 h-px bg-[#DCD4C7]" />
                <h3
                  className="text-[#181818] font-normal leading-none"
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: '22px',
                  }}
                >
                  Collection Settings
                </h3>
              </div>
              <span className="text-[9.5px] uppercase tracking-[0.2em] font-semibold text-[#968F84]">
                LIVE VISIBILITY
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <label className="flex items-start gap-3.5 p-5 rounded-[16px] border border-[#E2DBD0] bg-[#F7F4EF] hover:bg-white transition-all cursor-pointer">
                <input
                  type="checkbox"
                  checked={isRecommended}
                  onChange={(e) => setIsRecommended(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded-[4px] border-[#CCC4B7] text-[#181818] focus:ring-0 cursor-pointer"
                />
                <div>
                  <span className="flex items-center gap-1.5 text-[12px] font-semibold text-[#181818]">
                    <Star size={13} className="text-[#8B806A] fill-[#8B806A]" />
                    Atelier Choice
                  </span>
                  <span className="block mt-1 text-[10.5px] text-[#7A7367] leading-relaxed">
                    Highlights this package as the recommended collection.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3.5 p-5 rounded-[16px] border border-[#E2DBD0] bg-[#F7F4EF] hover:bg-white transition-all cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded-[4px] border-[#CCC4B7] text-[#181818] focus:ring-0 cursor-pointer"
                />
                <div>
                  <span className="block text-[12px] font-semibold text-[#181818]">
                    Active Package
                  </span>
                  <span className="block mt-1 text-[10.5px] text-[#7A7367] leading-relaxed">
                    Visible to visitors on the public Services page.
                  </span>
                </div>
              </label>
            </div>
          </section>
        </div>

        {/* =====================================================
            REGION 3: FIXED MODAL FOOTER
            - Always sits below scrollable area, never overlaps
            - Exactly identical left/right padding (clamp(24px, 4vw, 36px))
            - At least 24px padding at very bottom of modal below buttons
            - At least 16px gap between helper text and buttons (gap-4)
            - At least 12px gap between Cancel and Save buttons (gap-3)
            - Both buttons fully visible and never clipped (shrink-0 whitespace-nowrap)
           ===================================================== */}
        <footer
          className="shrink-0 bg-[#FCFAF7] border-t border-[#EAE4DA] flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4"
          style={{
            paddingTop: '20px',
            paddingBottom: '24px',
            paddingLeft: 'clamp(24px, 4vw, 36px)',
            paddingRight: 'clamp(24px, 4vw, 36px)',
          }}
        >
          <p className="text-[11px] text-[#8C857A]">
            {isEditMode
              ? 'Changes will update the existing collection live.'
              : 'Your collection package will appear in this service category.'}
          </p>

          <div className="flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="h-11 px-6 rounded-full text-[11px] uppercase tracking-[0.14em] font-semibold text-[#7A7367] hover:text-[#181818] hover:bg-[#EFEAE2] transition-colors cursor-pointer disabled:opacity-50 shrink-0 whitespace-nowrap"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="h-11 px-7 rounded-full bg-[#181818] hover:bg-[#2F2C28] text-[#FAF8F5] text-[11px] uppercase tracking-[0.16em] font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50 shrink-0 whitespace-nowrap"
            >
              {submitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{isEditMode ? 'Save Changes' : 'Create Service'}</span>
              )}
            </button>
          </div>
        </footer>
      </form>
    </div>
  );
}