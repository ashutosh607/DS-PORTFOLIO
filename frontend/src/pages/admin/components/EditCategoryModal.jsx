import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Check, Image as ImageIcon } from 'lucide-react';
import { updateCategory } from '../../../utils/categoryManager';
import { useAdminAuth } from '../context/AdminAuthContext';
import '../AdminDashboard.css';

export default function EditCategoryModal({ isOpen, onClose, onSuccess, category }) {
  const { getAuthHeaders } = useAdminAuth();

  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [quote, setQuote] = useState('');
  const [medium, setMedium] = useState('');
  const [location, setLocation] = useState('');
  
  // Cover photo state
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState('');
  const [directCoverUrl, setDirectCoverUrl] = useState('');
  const [useDirectUrl, setUseDirectUrl] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (category) {
      setName(category.name || '');
      setTagline(category.tagline || '');
      setQuote(category.quote || '');
      setMedium(category.medium || '');
      setLocation(category.location || '');
      setCoverPreview(category.coverImage || category.featured?.image || '');
      setDirectCoverUrl(category.coverImage || '');
      setCoverFile(null);
      setError('');
    }
  }, [category, isOpen]);

  if (!isOpen || !category) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPG, PNG, WEBP).');
      return;
    }

    setCoverFile(file);
    setError('');

    const reader = new FileReader();
    reader.onload = (event) => {
      setCoverPreview(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Category title cannot be empty.');
      return;
    }

    const effectiveCover = coverFile ? coverPreview : (useDirectUrl ? directCoverUrl.trim() : coverPreview);
    if (!effectiveCover) {
      setError('Category cover photo is required.');
      return;
    }

    setSubmitting(true);

    try {
      let payload;
      if (coverFile) {
        payload = new FormData();
        payload.append('name', name.trim());
        payload.append('coverFile', coverFile);
        payload.append('tagline', tagline.trim());
        payload.append('quote', quote.trim());
        payload.append('medium', medium.trim());
        payload.append('location', location.trim());
      } else {
        payload = {
          name: name.trim(),
          coverImage: useDirectUrl ? directCoverUrl.trim() : coverPreview,
          tagline: tagline.trim(),
          quote: quote.trim(),
          medium: medium.trim(),
          location: location.trim(),
        };
      }

      const updated = await updateCategory(
        category._id || category.id || category.slug,
        payload,
        getAuthHeaders()
      );

      if (onSuccess) {
        onSuccess(updated);
      }
      onClose();
    } catch (err) {
      console.error('Failed to update category:', err);
      setError(err.message || 'Failed to update category.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget && !submitting) onClose();
      }}
    >
      <div
        className="w-full max-w-[560px] bg-white rounded-2xl border border-[#E8E2D6] shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E8E2D6]">
          <div>
            <span className="admin-eyebrow block text-[10px] tracking-[0.2em] text-[#7A756D] uppercase font-semibold">
              EDIT COLLECTION
            </span>
            <h3 className="font-serif text-[22px] text-[#181818] font-normal mt-0.5">
              Edit {category.name}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="w-8 h-8 flex items-center justify-center rounded-full text-[#8E887E] hover:text-[#181818] hover:bg-[#F0EAE0] transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-[12px] rounded-lg">
              {error}
            </div>
          )}

          {/* 1. Category Cover Photo ("category ka photo") */}
          <div>
            <label className="block text-[12px] font-medium text-[#181818] uppercase tracking-[0.08em] mb-2">
              Category Cover Photo
            </label>

            <div className="relative rounded-xl overflow-hidden border border-[#E8E2D6] bg-black/5 mb-2">
              <div className="h-[180px] w-full">
                <img
                  src={useDirectUrl && directCoverUrl ? directCoverUrl : coverPreview}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-3 right-3 px-3 py-1.5 rounded-md bg-[#101010]/80 hover:bg-[#101010] text-white text-[11px] font-medium backdrop-blur-sm transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Upload size={13} />
                <span>Replace Photo</span>
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              onChange={handleFileChange}
              className="hidden"
            />

            {useDirectUrl ? (
              <div className="mt-2">
                <input
                  type="url"
                  placeholder="https://..."
                  value={directCoverUrl}
                  onChange={(e) => setDirectCoverUrl(e.target.value)}
                  className="w-full h-[40px] px-3.5 border border-[#E8E2D6] rounded-lg text-[13px] text-[#181818] bg-white outline-none focus:border-[#181818]"
                />
              </div>
            ) : null}

            <button
              type="button"
              onClick={() => setUseDirectUrl(!useDirectUrl)}
              className="text-[11px] text-[#8E887E] hover:text-[#181818] underline cursor-pointer mt-1"
            >
              {useDirectUrl ? '← Use uploaded photo file' : 'Or paste a direct image URL →'}
            </button>
          </div>

          {/* 2. Category Title */}
          <div>
            <label className="block text-[12px] font-medium text-[#181818] uppercase tracking-[0.08em] mb-1.5">
              Category Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full h-[42px] px-3.5 border border-[#E8E2D6] rounded-lg text-[13px] text-[#181818] bg-white outline-none focus:border-[#181818]"
            />
          </div>

          {/* 3. Tagline & Quote */}
          <div>
            <label className="block text-[12px] font-medium text-[#181818] uppercase tracking-[0.08em] mb-1.5">
              Tagline
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full h-[42px] px-3.5 border border-[#E8E2D6] rounded-lg text-[13px] text-[#181818] bg-white outline-none focus:border-[#181818]"
            />
          </div>

          <div>
            <label className="block text-[12px] font-medium text-[#181818] uppercase tracking-[0.08em] mb-1.5">
              Quote / Editorial Line
            </label>
            <input
              type="text"
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              className="w-full h-[42px] px-3.5 border border-[#E8E2D6] rounded-lg text-[13px] text-[#181818] bg-white outline-none focus:border-[#181818]"
            />
          </div>

          {/* 4. Medium & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-medium text-[#181818] uppercase tracking-[0.08em] mb-1.5">
                Medium (Optional)
              </label>
              <input
                type="text"
                value={medium}
                onChange={(e) => setMedium(e.target.value)}
                className="w-full h-[42px] px-3.5 border border-[#E8E2D6] rounded-lg text-[13px] text-[#181818] bg-white outline-none focus:border-[#181818]"
              />
            </div>

            <div>
              <label className="block text-[12px] font-medium text-[#181818] uppercase tracking-[0.08em] mb-1.5">
                Location (Optional)
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full h-[42px] px-3.5 border border-[#E8E2D6] rounded-lg text-[13px] text-[#181818] bg-white outline-none focus:border-[#181818]"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-[#E8E2D6] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 h-[38px] rounded-lg border border-[#E8E2D6] text-[#5C5852] hover:text-[#181818] hover:bg-[#FAF8F5] text-[12px] font-medium transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 h-[38px] rounded-lg bg-[#101010] text-white hover:bg-[#252525] text-[12px] font-medium transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check size={14} />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
