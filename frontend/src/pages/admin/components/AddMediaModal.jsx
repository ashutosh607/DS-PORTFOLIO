import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Image, Film } from 'lucide-react';
import { CATEGORIES } from '../../collections/data/collectionsData';
import { useAdminAuth } from '../context/AdminAuthContext';
import '../AdminDashboard.css';

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
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity"
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-[540px] bg-white border border-[#E8E2D6] rounded-[20px] p-6 sm:p-8 shadow-2xl my-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <span className="admin-eyebrow block mb-1">
              PORTFOLIO ARCHIVE
            </span>
            <h3 className="admin-serif-title text-[28px] sm:text-[30px]">
              Add Collection Media
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#7A756D] hover:text-[#181818] hover:bg-[#F0EAE0] transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={18} strokeWidth={1.8} />
          </button>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-5 p-3 rounded-[8px] bg-[#FAF0F0] border border-[#E8C4C4] text-[#992E2E] text-[12px] leading-relaxed">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Collection Category */}
          <div>
            <label className="block text-[10px] font-semibold tracking-[0.14em] uppercase text-[#7A756D] mb-2">
              COLLECTION CATEGORY *
            </label>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-[46px] px-3.5 rounded-[10px] bg-white border border-[#E8E2D6] text-[13px] text-[#181818] outline-none focus:border-[#181818] cursor-pointer appearance-none"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>
                    {cat.name} ({cat.slug})
                  </option>
                ))}
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#8E887E]">
                ▼
              </div>
            </div>
          </div>

          {/* Media Type Toggle */}
          <div>
            <label className="block text-[10px] font-semibold tracking-[0.14em] uppercase text-[#7A756D] mb-2">
              MEDIA TYPE
            </label>
            <div className="inline-flex p-1 bg-[#EFEAE2] rounded-[10px] gap-1">
              <button
                type="button"
                onClick={() => setMediaType('photo')}
                className={`h-[34px] px-4 rounded-[8px] text-[12px] font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  mediaType === 'photo'
                    ? 'bg-[#181818] text-white shadow-xs'
                    : 'text-[#5C5852] hover:text-[#181818]'
                }`}
              >
                <Image size={13} strokeWidth={1.8} />
                PHOTO
              </button>
              <button
                type="button"
                onClick={() => setMediaType('video')}
                className={`h-[34px] px-4 rounded-[8px] text-[12px] font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  mediaType === 'video'
                    ? 'bg-[#181818] text-white shadow-xs'
                    : 'text-[#5C5852] hover:text-[#181818]'
                }`}
              >
                <Film size={13} strokeWidth={1.8} />
                VIDEO
              </button>
            </div>
          </div>

          {/* Upload Drop Area */}
          <div>
            <label className="block text-[10px] font-semibold tracking-[0.14em] uppercase text-[#7A756D] mb-2">
              UPLOAD PHOTO OR VIDEO FILE
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
              className="w-full min-h-[150px] border-2 border-dashed border-[#D4CCC0] hover:border-[#181818] rounded-[14px] p-6 flex flex-col items-center justify-center text-center bg-[#FAF8F5] cursor-pointer transition-colors group"
            >
              {filePreview ? (
                <div className="relative w-full max-h-40 flex items-center justify-center overflow-hidden rounded-[8px]">
                  {mediaType === 'video' ? (
                    <video
                      src={filePreview}
                      className="max-h-36 rounded-[8px]"
                      controls
                    />
                  ) : (
                    <img
                      src={filePreview}
                      alt="Preview"
                      className="max-h-36 object-contain rounded-[8px]"
                    />
                  )}
                  <span className="absolute bottom-2 right-2 bg-black/75 text-white text-[10px] px-2 py-0.5 rounded-full">
                    Change file
                  </span>
                </div>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-full bg-[#EFEAE2] flex items-center justify-center mb-2.5 text-[#5C5852] group-hover:scale-105 transition-transform">
                    <Upload size={18} strokeWidth={1.5} />
                  </div>
                  <span className="text-[13px] font-semibold text-[#181818] block mb-1">
                    Add photos or videos
                  </span>
                  <span className="text-[11px] text-[#7A756D] block mb-3.5">
                    Upload media for this collection (JPG, PNG, WEBP, MP4, MOV up to 100MB)
                  </span>
                  <span className="inline-flex items-center justify-center h-[34px] px-4 rounded-[8px] bg-[#101010] text-white text-[11px] font-medium group-hover:bg-[#252525] transition-colors">
                    SELECT FILE
                  </span>
                </>
              )}
            </div>

            {file && (
              <div className="mt-2 flex items-center justify-between text-[11px] text-[#5C5852] px-1">
                <span className="truncate max-w-[300px]">{file.name}</span>
                <span>{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
              </div>
            )}
          </div>

          {/* External URL */}
          <div>
            <label className="block text-[10px] font-semibold tracking-[0.14em] uppercase text-[#7A756D] mb-2">
              OR EXTERNAL MEDIA URL (optional)
            </label>
            <input
              type="url"
              value={directUrl}
              onChange={(e) => {
                setDirectUrl(e.target.value);
                if (e.target.value) setError('');
              }}
              placeholder="https://images.unsplash.com/... or cloud URL"
              className="w-full h-[44px] px-3.5 rounded-[10px] bg-white border border-[#E8E2D6] text-[13px] text-[#181818] outline-none focus:border-[#181818] placeholder:text-[#8E887E]"
            />
          </div>

          {/* Title & Caption */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[10px] font-semibold tracking-[0.14em] uppercase text-[#7A756D] mb-2">
                TITLE / SUBJECT
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Lake Como Vows"
                className="w-full h-[44px] px-3.5 rounded-[10px] bg-white border border-[#E8E2D6] text-[13px] text-[#181818] outline-none focus:border-[#181818] placeholder:text-[#8E887E]"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold tracking-[0.14em] uppercase text-[#7A756D] mb-2">
                CAPTION / NOTES
              </label>
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="e.g., Golden hour ceremony"
                className="w-full h-[44px] px-3.5 rounded-[10px] bg-white border border-[#E8E2D6] text-[13px] text-[#181818] outline-none focus:border-[#181818] placeholder:text-[#8E887E]"
              />
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-[#E8E2D6] flex items-center justify-end gap-3">
            <button
              type="button"
              disabled={uploading}
              onClick={onClose}
              className="h-[40px] px-4 rounded-[8px] text-[11px] font-semibold tracking-[0.1em] uppercase text-[#5C5852] hover:bg-[#F0EAE0] transition-colors cursor-pointer disabled:opacity-50"
            >
              CANCEL
            </button>

            <button
              type="submit"
              disabled={uploading}
              className="h-[40px] px-5 rounded-[8px] bg-[#101010] hover:bg-[#252525] text-white text-[11px] font-semibold tracking-[0.1em] uppercase transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              {uploading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>UPLOADING...</span>
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
