import React, { useState, useEffect, useRef } from 'react';
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
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useCategories } from '../../../utils/categoryManager';
import '../AdminDashboard.css';

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
  initialCategory,
  category: categoryProp,
  serviceToEdit,
  initialData,
  availableCategories = [],
  onSuccess,
}) {
  const effectiveCategory = (categoryProp || initialCategory || 'wedding').toLowerCase().trim();
  const effectiveServiceToEdit = serviceToEdit || initialData || null;
  const isEditMode = Boolean(effectiveServiceToEdit);

  const { getAuthHeaders } = useAdminAuth();
  const { categories: dynamicCategories } = useCategories();
  const fileInputRef = useRef(null);

  const categoriesOptions = React.useMemo(() => {
    const list = [...DEFAULT_CATEGORIES];
    const sourcePool = [...(availableCategories || []), ...(dynamicCategories || [])];

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

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (effectiveServiceToEdit) {
        setCategory(effectiveServiceToEdit.category || effectiveCategory);
        setTier(effectiveServiceToEdit.tier || '');
        setFolioLabel(effectiveServiceToEdit.folioLabel || '');
        setEyebrow(effectiveServiceToEdit.eyebrow || '');
        setSubtitle(effectiveServiceToEdit.subtitle || '');
        setBadge(effectiveServiceToEdit.badge || '');
        setImageTag(effectiveServiceToEdit.imageTag || '');
        setImageUrl(effectiveServiceToEdit.imageUrl || '');
        setImagePreview(effectiveServiceToEdit.imageUrl || '');
        setImageFile(null);
        if (effectiveServiceToEdit.price !== null && effectiveServiceToEdit.price !== undefined) {
          setIsPriceToBeAdded(false);
          setPrice(String(effectiveServiceToEdit.price));
        } else {
          setIsPriceToBeAdded(true);
          setPrice('');
        }
        setPriceNote(effectiveServiceToEdit.priceNote || '');
        setDescription(effectiveServiceToEdit.description || '');
        setPrivilegesLabel(effectiveServiceToEdit.privilegesLabel || 'INCLUDED DELIVERABLES');
        setDeliverables(
          Array.isArray(effectiveServiceToEdit.deliverables) && effectiveServiceToEdit.deliverables.length > 0
            ? effectiveServiceToEdit.deliverables
            : ['']
        );
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

      if (imageFile) {
        formData.append('imageFile', imageFile);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl border border-[#E8E2D6] shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#EBE6DE] bg-[#FAF8F5]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#EBE6DE] flex items-center justify-center text-[#181818]">
              <Sparkles size={18} strokeWidth={1.5} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-[#181818] tracking-tight">
                  {isEditMode ? 'Edit Service Package' : 'Add New Service Package'}
                </h2>
                <span className="px-2.5 py-0.5 rounded-md bg-[#EBE6DE] text-[#181818] text-[10px] uppercase font-semibold tracking-wider">
                  {isCustomCategory ? (customCategoryInput || 'Custom') : (category || effectiveCategory)}
                </span>
              </div>
              <p className="text-xs text-[#7A756D]">
                Configure tier details, deliverables, pricing, and curation badge
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#7A756D] hover:text-[#181818] hover:bg-[#EBE6DE] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[78vh] overflow-y-auto">
          {error && (
            <div className="p-3.5 rounded-xl bg-[#FFF1F0] border border-[#FFA39E] text-xs text-[#CF1322]">
              {error}
            </div>
          )}

          {/* Row 1: Category & Tier Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-[#44403C] uppercase tracking-wider mb-2">
                Category *
              </label>
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
                className="w-full h-11 px-3.5 rounded-xl border border-[#E0DAD0] bg-[#F7F5F1] text-xs text-[#1C1917] outline-hidden focus:border-[#181818]"
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
                  className="w-full h-10 px-3.5 mt-2 rounded-xl border border-[#D4CCC0] bg-white text-xs text-[#1C1917] outline-hidden focus:border-[#181818]"
                />
              )}
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#44403C] uppercase tracking-wider mb-2">
                Tier Name * (e.g. Essential, Signature)
              </label>
              <input
                type="text"
                value={tier}
                onChange={(e) => setTier(e.target.value)}
                placeholder="e.g. SIGNATURE"
                required
                className="w-full h-11 px-3.5 rounded-xl border border-[#E0DAD0] bg-[#F7F5F1] text-xs text-[#1C1917] outline-hidden focus:border-[#181818]"
              />
            </div>
          </div>

          {/* Row 2: Eyebrow Tag & Folio Label */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-[#44403C] uppercase tracking-wider mb-2">
                Eyebrow Tag (e.g. ATELIER CHOICE)
              </label>
              <input
                type="text"
                value={eyebrow}
                onChange={(e) => setEyebrow(e.target.value)}
                placeholder="e.g. ATELIER SIGNATURE CHOICE"
                className="w-full h-11 px-3.5 rounded-xl border border-[#E0DAD0] bg-[#F7F5F1] text-xs text-[#1C1917] outline-hidden focus:border-[#181818]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#44403C] uppercase tracking-wider mb-2">
                Folio Label (e.g. Folio 01)
              </label>
              <input
                type="text"
                value={folioLabel}
                onChange={(e) => setFolioLabel(e.target.value)}
                placeholder="e.g. Folio 02"
                className="w-full h-11 px-3.5 rounded-xl border border-[#E0DAD0] bg-[#F7F5F1] text-xs text-[#1C1917] outline-hidden focus:border-[#181818]"
              />
            </div>
          </div>

          {/* Row 3: Subtitle */}
          <div>
            <label className="block text-[11px] font-semibold text-[#44403C] uppercase tracking-wider mb-2">
              Subtitle / Tagline
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="e.g. The Classic Multi-Event Journey"
              className="w-full h-11 px-3.5 rounded-xl border border-[#E0DAD0] bg-[#F7F5F1] text-xs text-[#1C1917] outline-hidden focus:border-[#181818]"
            />
          </div>

          {/* Row 4: Image Upload & URL */}
          <div className="space-y-3">
            <label className="block text-[11px] font-semibold text-[#44403C] uppercase tracking-wider">
              Cover Photograph (Upload file or paste image URL)
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#DDD8CD] hover:border-[#181818] rounded-xl p-4 text-center cursor-pointer bg-[#FAF8F5] transition-colors flex flex-col items-center justify-center min-h-[110px]"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Upload size={20} className="text-[#8E887E] mb-1.5" />
                <span className="text-xs font-medium text-[#181818]">Upload local image</span>
                <span className="text-[10px] text-[#7A756D] mt-0.5">PNG, JPG, WEBP</span>
              </div>

              <div>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    if (!imageFile) setImagePreview(e.target.value);
                  }}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full h-11 px-3.5 rounded-xl border border-[#E0DAD0] bg-[#F7F5F1] text-xs text-[#1C1917] outline-hidden focus:border-[#181818] mb-2"
                />
                <input
                  type="text"
                  value={imageTag}
                  onChange={(e) => setImageTag(e.target.value)}
                  placeholder="Image badge tag (e.g. 120 Analog Film)"
                  className="w-full h-11 px-3.5 rounded-xl border border-[#E0DAD0] bg-[#F7F5F1] text-xs text-[#1C1917] outline-hidden focus:border-[#181818]"
                />
              </div>
            </div>

            {imagePreview && (
              <div className="relative w-full h-36 rounded-xl overflow-hidden border border-[#E8E2D6] bg-[#F3EFEA]">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview('');
                    setImageUrl('');
                    setImageFile(null);
                  }}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white hover:bg-black/80 text-xs transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>

          {/* Row 5: Price & Price Note */}
          <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E2D6] space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-semibold text-[#44403C] uppercase tracking-wider">
                Investment / Pricing
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-xs text-[#5C5852]">
                <input
                  type="checkbox"
                  checked={isPriceToBeAdded}
                  onChange={(e) => setIsPriceToBeAdded(e.target.checked)}
                  className="rounded border-[#D0C9BE] text-[#181818] focus:ring-0"
                />
                <span>Display as "[PRICE TO BE ADDED]"</span>
              </label>
            </div>

            {!isPriceToBeAdded && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-[#181818]">$</span>
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. 8400"
                  className="w-full h-10 px-3.5 rounded-xl border border-[#E0DAD0] bg-white text-xs text-[#1C1917] outline-hidden focus:border-[#181818]"
                />
              </div>
            )}

            <input
              type="text"
              value={priceNote}
              onChange={(e) => setPriceNote(e.target.value)}
              placeholder="Price note (e.g. Priority atelier calendar allocation 2025–2026)"
              className="w-full h-10 px-3.5 rounded-xl border border-[#E0DAD0] bg-white text-xs text-[#1C1917] outline-hidden focus:border-[#181818]"
            />
          </div>

          {/* Row 6: Description */}
          <div>
            <label className="block text-[11px] font-semibold text-[#44403C] uppercase tracking-wider mb-2">
              Short Description / Editorial Narrative
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Comprehensive multi-event journey documented on analog medium format and digital raw..."
              className="w-full p-3.5 rounded-xl border border-[#E0DAD0] bg-[#F7F5F1] text-xs text-[#1C1917] outline-hidden focus:border-[#181818] leading-relaxed resize-none"
            />
          </div>

          {/* Row 7: Deliverables Heading & Dynamic Bullet List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-semibold text-[#44403C] uppercase tracking-wider">
                Included Deliverables & Privileges
              </label>
              <button
                type="button"
                onClick={handleAddDeliverable}
                className="flex items-center gap-1.5 text-xs text-[#181818] font-medium hover:underline cursor-pointer"
              >
                <Plus size={14} />
                <span>Add Bullet</span>
              </button>
            </div>

            <input
              type="text"
              value={privilegesLabel}
              onChange={(e) => setPrivilegesLabel(e.target.value)}
              placeholder="Heading (e.g. INCLUDED DELIVERABLES)"
              className="w-full h-10 px-3.5 rounded-xl border border-[#E0DAD0] bg-[#F7F5F1] text-xs text-[#1C1917] outline-hidden focus:border-[#181818]"
            />

            <div className="space-y-2.5">
              {deliverables.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-[#8E887E] text-xs">•</span>
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleDeliverableChange(index, e.target.value)}
                    placeholder={`Deliverable ${index + 1}`}
                    className="flex-1 h-10 px-3 rounded-xl border border-[#E0DAD0] bg-[#F7F5F1] text-xs text-[#1C1917] outline-hidden focus:border-[#181818]"
                  />
                  {deliverables.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveDeliverable(index)}
                      className="p-2 text-[#8E887E] hover:text-[#CF1322] rounded-lg transition-colors cursor-pointer"
                      title="Remove bullet"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Row 8: Toggles (Recommended & Active Status) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <label className="flex items-center gap-3 p-3.5 rounded-xl border border-[#E8E2D6] bg-[#FAF8F5] cursor-pointer hover:bg-[#F3EFEA] transition-colors">
              <input
                type="checkbox"
                checked={isRecommended}
                onChange={(e) => setIsRecommended(e.target.checked)}
                className="w-4 h-4 rounded border-[#D0C9BE] text-[#181818] focus:ring-0"
              />
              <div>
                <span className="block text-xs font-semibold text-[#181818] flex items-center gap-1.5">
                  <Star size={13} className="text-amber-500 fill-amber-500" />
                  Recommended / Atelier Choice
                </span>
                <span className="block text-[10.5px] text-[#7A756D]">
                  Highlights card with signature styling and recommended badge
                </span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3.5 rounded-xl border border-[#E8E2D6] bg-[#FAF8F5] cursor-pointer hover:bg-[#F3EFEA] transition-colors">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 rounded border-[#D0C9BE] text-[#181818] focus:ring-0"
              />
              <div>
                <span className="block text-xs font-semibold text-[#181818]">
                  Active Package
                </span>
                <span className="block text-[10.5px] text-[#7A756D]">
                  Visible to the public on the Services page
                </span>
              </div>
            </label>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#EBE6DE]">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2.5 rounded-xl text-xs font-medium text-[#5C5852] hover:bg-[#EBE6DE] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-[#181818] hover:bg-[#302B27] text-white text-xs font-medium tracking-wide transition-colors flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{isEditMode ? 'Save Changes' : 'Create Package'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
