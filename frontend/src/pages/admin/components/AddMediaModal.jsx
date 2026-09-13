import React, { useState, useEffect, useRef } from 'react';
import { CATEGORIES } from '../../collections/data/collectionsData';
import { useAdminAuth } from '../context/AdminAuthContext';

export default function AddMediaModal({
  isOpen,
  onClose,
  onSuccess,
  defaultCategory = '',
}) {
  const { getAuthHeaders } = useAdminAuth();
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState('');
  const [directUrl, setDirectUrl] = useState('');
  const [mediaType, setMediaType] = useState('photo');
  const [category, setCategory] = useState(defaultCategory || CATEGORIES[0]?.slug || 'weddings');
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (defaultCategory) {
      setCategory(defaultCategory);
    }
  }, [defaultCategory]);

  useEffect(() => {
    if (!isOpen) {
      setFile(null);
      setFilePreview('');
      setDirectUrl('');
      setTitle('');
      setCaption('');
      setError('');
      setUploading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setError('');

    // Auto-detect type
    if (selectedFile.type.startsWith('video/')) {
      setMediaType('video');
      setFilePreview(URL.createObjectURL(selectedFile));
    } else {
      setMediaType('photo');
      const reader = new FileReader();
      reader.onload = (event) => {
        setFilePreview(event.target.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!file && !directUrl.trim()) {
      setError('Please select a photo/video file or enter a media URL.');
      return;
    }

    if (!category) {
      setError('Please select a collection category.');
      return;
    }

    setUploading(true);
    try {
      let res;
      const headers = getAuthHeaders();

      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('category', category);
        formData.append('type', mediaType);
        if (title.trim()) formData.append('title', title.trim());
        if (caption.trim()) formData.append('caption', caption.trim());

        res = await fetch('/api/media', {
          method: 'POST',
          headers,
          credentials: 'include',
          body: formData,
        });
      } else {
        res = await fetch('/api/media', {
          method: 'POST',
          headers: {
            ...headers,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            url: directUrl.trim(),
            category,
            type: mediaType,
            title: title.trim(),
            caption: caption.trim(),
          }),
        });
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to upload media');
      }

      onSuccess(data.data);
      onClose();
    } catch (err) {
      setError(err.message || 'Error uploading media asset');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-[20px] sm:p-[28px] overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/55 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Dialog: 28-32px padding, 16px radius, max-w-2xl */}
      <div className="relative z-10 w-full max-w-2xl bg-[#FAF8F5] border border-[#E3DBCC] rounded-[16px] p-[20px] sm:p-[28px] lg:p-[32px] shadow-2xl my-8">
        {/* Header: Header -> content 24-32px */}
        <div className="flex items-center justify-between pb-[20px] mb-[28px] border-b border-[#E3DBCC]">
          <div>
            <span className="font-mono text-[10px] tracking-[0.2em] text-[#7A7770] uppercase block mb-1">
              PORTFOLIO ARCHIVE
            </span>
            <h3
              style={{ fontFamily: 'var(--font-serif)' }}
              className="text-[24px] sm:text-[28px] font-normal text-[#101010] leading-tight"
            >
              Add Collection Media
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full border border-[#E3DBCC] hover:bg-[#101010] hover:text-[#FDFCF8] transition-colors flex items-center justify-center text-sm cursor-pointer"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-[24px] p-[14px] rounded-[8px] bg-[#FAF0F0] border border-[#E8C4C4] text-[#992E2E] font-sans text-xs leading-relaxed">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-[24px]">
          {/* Collection Category Select */}
          <div>
            <label className="block font-sans text-[11px] font-semibold tracking-[0.14em] uppercase text-[#55493A] mb-[8px]">
              Collection Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-[50px] px-[16px] rounded-[8px] bg-[#FDFCF8] border border-[#E3DBCC] text-sm text-[#101010] outline-none transition-colors focus:border-[#101010] cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.slug} value={cat.slug}>
                  {cat.name} ({cat.slug})
                </option>
              ))}
            </select>
          </div>

          {/* Media Type Toggle */}
          <div>
            <label className="block font-sans text-[11px] font-semibold tracking-[0.14em] uppercase text-[#55493A] mb-[8px]">
              Media Type
            </label>
            <div className="flex gap-[12px]">
              <button
                type="button"
                onClick={() => setMediaType('photo')}
                className={`flex-1 h-[48px] px-[16px] rounded-[8px] border font-sans text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer ${
                  mediaType === 'photo'
                    ? 'bg-[#101010] text-[#FDFCF8] border-[#101010]'
                    : 'bg-[#FDFCF8] text-[#55493A] border-[#E3DBCC] hover:border-[#101010]'
                }`}
              >
                Photo
              </button>
              <button
                type="button"
                onClick={() => setMediaType('video')}
                className={`flex-1 h-[48px] px-[16px] rounded-[8px] border font-sans text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer ${
                  mediaType === 'video'
                    ? 'bg-[#101010] text-[#FDFCF8] border-[#101010]'
                    : 'bg-[#FDFCF8] text-[#55493A] border-[#E3DBCC] hover:border-[#101010]'
                }`}
              >
                Video
              </button>
            </div>
          </div>

          {/* 13. Spacious Upload Area: min-height 180px, padding 32-40px */}
          <div>
            <label className="block font-sans text-[11px] font-semibold tracking-[0.14em] uppercase text-[#55493A] mb-[8px]">
              Upload Photo or Video File
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept={mediaType === 'video' ? 'video/*' : 'image/*'}
              onChange={handleFileChange}
              className="hidden"
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-full min-h-[180px] border-2 border-dashed border-[#D1C7B7] hover:border-[#101010] rounded-[12px] p-[32px] sm:p-[40px] flex flex-col items-center justify-center text-center bg-[#FDFCF8] cursor-pointer transition-colors group"
            >
              {filePreview ? (
                <div className="relative w-full max-h-52 flex items-center justify-center overflow-hidden rounded-[10px]">
                  {mediaType === 'video' ? (
                    <video
                      src={filePreview}
                      className="max-h-48 rounded-[8px]"
                      controls
                    />
                  ) : (
                    <img
                      src={filePreview}
                      alt="Preview"
                      className="max-h-48 object-contain rounded-[8px]"
                    />
                  )}
                  <span className="absolute bottom-2.5 right-2.5 bg-black/75 text-white text-[11px] px-3 py-1.5 rounded-full tracking-wider">
                    Click to replace
                  </span>
                </div>
              ) : (
                <>
                  {/* Upload icon ↓ 12px */}
                  <div className="w-12 h-12 rounded-full bg-[#F3F0E9] flex items-center justify-center text-[#55493A] text-xl mb-[12px] group-hover:scale-105 transition-transform">
                    ↑
                  </div>
                  {/* "Add photos or videos" ↓ 8px */}
                  <span className="font-sans text-sm font-semibold text-[#101010] block mb-[8px]">
                    Add photos or videos
                  </span>
                  {/* "Upload media for this collection" ↓ 20px */}
                  <span className="font-mono text-xs text-[#7A7770] block mb-[20px]">
                    Upload media for this collection (JPG, PNG, WEBP, MP4, MOV up to 100MB)
                  </span>
                  {/* [ SELECT FILE ] */}
                  <span className="inline-flex items-center justify-center h-[38px] px-[20px] rounded-full bg-[#101010] text-[#FDFCF8] font-sans text-xs font-semibold tracking-wider uppercase group-hover:bg-[#262422] transition-colors">
                    SELECT FILE
                  </span>
                </>
              )}
            </div>

            {file && (
              <div className="mt-[10px] flex items-center justify-between text-xs font-mono text-[#55493A] px-1">
                <span className="truncate max-w-[320px]">{file.name}</span>
                <span>{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
              </div>
            )}
          </div>

          {/* Or Direct URL Fallback */}
          <div>
            <label className="block font-sans text-[11px] font-semibold tracking-[0.14em] uppercase text-[#7A7770] mb-[8px]">
              Or External Media URL (Optional)
            </label>
            <input
              type="url"
              value={directUrl}
              onChange={(e) => {
                setDirectUrl(e.target.value);
                if (e.target.value) setError('');
              }}
              placeholder="https://images.unsplash.com/... or cloud URL"
              className="w-full h-[50px] px-[16px] rounded-[8px] bg-[#FDFCF8] border border-[#E3DBCC] text-xs text-[#101010] outline-none transition-colors focus:border-[#101010] placeholder-[#A59C8F]"
            />
          </div>

          {/* Title / Caption */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[20px]">
            <div>
              <label className="block font-sans text-[11px] font-semibold tracking-[0.14em] uppercase text-[#55493A] mb-[8px]">
                Title / Subject
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Lake Como Vows"
                className="w-full h-[50px] px-[16px] rounded-[8px] bg-[#FDFCF8] border border-[#E3DBCC] text-xs text-[#101010] outline-none transition-colors focus:border-[#101010]"
              />
            </div>

            <div>
              <label className="block font-sans text-[11px] font-semibold tracking-[0.14em] uppercase text-[#55493A] mb-[8px]">
                Caption / Notes
              </label>
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="e.g., Golden hour ceremony"
                className="w-full h-[50px] px-[16px] rounded-[8px] bg-[#FDFCF8] border border-[#E3DBCC] text-xs text-[#101010] outline-none transition-colors focus:border-[#101010]"
              />
            </div>
          </div>

          {/* Action Buttons: 24-32px top spacing, 10-12px gap */}
          <div className="pt-[28px] mt-[28px] border-t border-[#E3DBCC] flex items-center justify-end gap-[12px]">
            <button
              type="button"
              disabled={uploading}
              onClick={onClose}
              className="h-[48px] px-[20px] rounded-[8px] border border-[#E3DBCC] hover:bg-[#F3F0E9] text-[#55493A] font-sans text-xs font-semibold tracking-[0.14em] uppercase transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={uploading}
              className="h-[48px] px-[24px] rounded-[8px] bg-[#101010] hover:bg-[#262422] text-[#FDFCF8] font-sans text-xs font-semibold tracking-[0.14em] uppercase transition-all cursor-pointer shadow-sm disabled:opacity-50 flex items-center gap-2"
            >
              {uploading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>UPLOADING TO COLLECTION...</span>
                </>
              ) : (
                <span>UPLOAD TO COLLECTION</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
