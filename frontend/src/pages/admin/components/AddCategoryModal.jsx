import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Image as ImageIcon, Sparkles } from 'lucide-react';
import { createCategory } from '../../../utils/categoryManager';
import { useAdminAuth } from '../context/AdminAuthContext';
import '../AdminDashboard.css';

export default function AddCategoryModal({ isOpen, onClose, onSuccess }) {
  const { getAuthHeaders } = useAdminAuth();

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [tagline, setTagline] = useState('');
  const [quote, setQuote] = useState('');
  const [medium, setMedium] = useState('');
  const [location, setLocation] = useState('');
  
  // Cover photo state ("category ka photo")
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState('');
  const [directCoverUrl, setDirectCoverUrl] = useState('');
  const [useDirectUrl, setUseDirectUrl] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fileInputRef = useRef(null);

  const handleNameChange = (e) => {
    const val = e.target.value;
    setName(val);
    const generatedSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    setSlug(generatedSlug);
  };

  useEffect(() => {
    if (!isOpen) {
      setName('');
      setSlug('');
      setTagline('');
      setQuote('');
      setMedium('');
      setLocation('');
      setCoverFile(null);
      setCoverPreview('');
      setDirectCoverUrl('');
      setUseDirectUrl(false);
      setError('');
      setSubmitting(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

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
      setError('Please enter a category title.');
      return;
    }

    const effectiveCover = coverFile ? coverPreview : directCoverUrl.trim();
    if (!effectiveCover) {
      setError('Please upload a category cover photo or enter an image URL.');
      return;
    }

    setSubmitting(true);

    try {
      let payload;
      if (coverFile) {
        payload = new FormData();
        payload.append('name', name.trim());
        payload.append('slug', slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
        payload.append('coverFile', coverFile);
        payload.append('tagline', tagline.trim());
        payload.append('quote', quote.trim());
        payload.append('medium', medium.trim());
        payload.append('location', location.trim());
      } else {
        payload = {
          name: name.trim(),
          slug: slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          coverImage: directCoverUrl.trim(),
          tagline: tagline.trim(),
          quote: quote.trim(),
          medium: medium.trim(),
          location: location.trim(),
        };
      }

      const created = await createCategory(payload, getAuthHeaders());
      if (onSuccess) {
        onSuccess(created);
      }
      onClose();
    } catch (err) {
      console.error('Failed to create category:', err);
      setError(err.message || 'Failed to create category.');
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
              COLLECTION SETUP
            </span>
            <h3 className="font-serif text-[22px] text-[#181818] font-normal mt-0.5">
              Add New Category
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
              Category Cover Photo <span className="text-red-500">*</span>
            </label>

            {!useDirectUrl ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-colors ${
                  coverPreview
                    ? 'border-[#181818] bg-[#FAF8F5]'
                    : 'border-[#E8E2D6] hover:border-[#181818] bg-[#FAF8F5]/50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {coverPreview ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="relative w-full h-[180px] rounded-lg overflow-hidden border border-[#E8E2D6] bg-black/5">
                      <img
                        src={coverPreview}
                        alt="Category Cover Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-[12px] text-[#181818] font-medium hover:underline">
                      Click to choose a different photo
                    </span>
                  </div>
                ) : (
                  <div className="py-6 flex flex-col items-center gap-2">
                    <div className="w-11 h-11 rounded-full bg-[#EFEAE2] flex items-center justify-center text-[#181818]">
                      <Upload size={18} />
                    </div>
                    <span className="text-[13px] font-medium text-[#181818]">
                      Upload Category Cover Photo
                    </span>
                    <span className="text-[11px] text-[#8E887E]">
                      JPG, PNG, or WEBP (featured on public collection ribbon)
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={directCoverUrl}
                  onChange={(e) => setDirectCoverUrl(e.target.value)}
                  className="w-full h-[42px] px-3.5 border border-[#E8E2D6] rounded-lg text-[13px] text-[#181818] bg-white outline-none focus:border-[#181818]"
                />
                {directCoverUrl && (
                  <div className="mt-2.5 h-[140px] rounded-lg overflow-hidden border border-[#E8E2D6]">
                    <img
                      src={directCoverUrl}
                      alt="Cover Preview"
                      className="w-full h-full object-cover"
                      onError={() => setError('Invalid image URL')}
                    />
                  </div>
                )}
              </div>
            )}

            <button
              type="button"
              onClick={() => setUseDirectUrl(!useDirectUrl)}
              className="text-[11px] text-[#8E887E] hover:text-[#181818] mt-2 underline cursor-pointer"
            >
              {useDirectUrl ? '← Upload photo file instead' : 'Or enter an image URL directly →'}
            </button>
          </div>

          {/* 2. Category Name & Slug */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-medium text-[#181818] uppercase tracking-[0.08em] mb-1.5">
                Category Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Maternity, Fashion"
                value={name}
                onChange={handleNameChange}
                required
                className="w-full h-[42px] px-3.5 border border-[#E8E2D6] rounded-lg text-[13px] text-[#181818] bg-white outline-none focus:border-[#181818]"
              />
            </div>

            <div>
              <label className="block text-[12px] font-medium text-[#181818] uppercase tracking-[0.08em] mb-1.5">
                URL Slug
              </label>
              <input
                type="text"
                placeholder="e.g. maternity"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase())}
                className="w-full h-[42px] px-3.5 border border-[#E8E2D6] rounded-lg text-[13px] text-[#181818] bg-white outline-none focus:border-[#181818]"
              />
            </div>
          </div>

          {/* 3. Tagline & Philosophy */}
          <div>
            <label className="block text-[12px] font-medium text-[#181818] uppercase tracking-[0.08em] mb-1.5">
              Tagline (Short Summary)
            </label>
            <input
              type="text"
              placeholder="e.g. Intimate moments and joyous new beginnings."
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full h-[42px] px-3.5 border border-[#E8E2D6] rounded-lg text-[13px] text-[#181818] bg-white outline-none focus:border-[#181818]"
            />
          </div>

          <div>
            <label className="block text-[12px] font-medium text-[#181818] uppercase tracking-[0.08em] mb-1.5">
              Quote / Editorial Note
            </label>
            <input
              type="text"
              placeholder="e.g. Life celebrated in every quiet frame."
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              className="w-full h-[42px] px-3.5 border border-[#E8E2D6] rounded-lg text-[13px] text-[#181818] bg-white outline-none focus:border-[#181818]"
            />
          </div>

          {/* 4. Medium & Location (Optional) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-medium text-[#181818] uppercase tracking-[0.08em] mb-1.5">
                Medium / Gear (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Leica M11 · 35mm Summilux"
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
                placeholder="e.g. Mumbai & Private Studios"
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
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Sparkles size={14} />
                  <span>Create Category</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
