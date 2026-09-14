import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Image, Film } from 'lucide-react';
import { CATEGORIES as DEFAULT_CATEGORIES } from '../../collections/data/collectionsData';
import { useCategories } from '../../../utils/categoryManager';
import { useAdminAuth } from '../context/AdminAuthContext';
import '../AdminDashboard.css';

export default function AddMediaModal({
  isOpen,
  onClose,
  onSuccess,
  defaultCategory = '',
}) {
  const { getAuthHeaders } = useAdminAuth();
  const { categories: dynamicCategories } = useCategories();
  const availableCategories = (dynamicCategories && dynamicCategories.length > 0) ? dynamicCategories : DEFAULT_CATEGORIES;

  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState('');
  const [directUrl, setDirectUrl] = useState('');
  const [mediaType, setMediaType] = useState('photo');
  const [category, setCategory] = useState(defaultCategory || availableCategories[0]?.slug || 'weddings');
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
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Card with Scrollable Body and Fixed Header/Footer */}
      <div className="admin-modal-card">

        {/* ─── Header: Centered & Fixed at Top ─── */}
        <div className="admin-modal-header">
          <button
            type="button"
            onClick={onClose}
            className="admin-modal-close-btn"
            aria-label="Close"
          >
            <X size={18} strokeWidth={1.8} />
          </button>

          <span className="admin-eyebrow block mb-2">
            PORTFOLIO ARCHIVE
          </span>
          <h3 className="admin-serif-title text-[28px] sm:text-[32px]">
            Add Collection Media
          </h3>
          <p className="admin-subtext text-[12px] sm:text-[13px] mt-2 max-w-[400px] mx-auto">
            Upload or link high-resolution visual stories for your collection.
          </p>
        </div>

        {/* ─── Form Body: Scrollable with Generous Padding ─── */}
        <div className="admin-modal-body">
          {/* Error Notification */}
          {error && (
            <div className="mb-7 p-4 rounded-[12px] bg-[#FAF0F0] border border-[#E8C4C4] text-[#992E2E] text-[12px] leading-relaxed text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>

            {/* Collection Category */}
            <div className="admin-form-group">
              <label className="admin-form-label">
                COLLECTION CATEGORY *
              </label>
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="admin-form-select cursor-pointer appearance-none"
                >
                  {availableCategories.map((cat) => (
                    <option key={cat.slug || cat.id} value={cat.slug || cat.id}>
                      {cat.name} ({cat.slug || cat.id})
                    </option>
                  ))}
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-[#8E887E] text-[11px]">
                  ▼
                </div>
              </div>
            </div>

            {/* Media Type Toggle: Centered & Padded */}
            <div className="admin-form-group items-center text-center">
              <label className="admin-form-label">
                MEDIA TYPE
              </label>
              <div className="inline-flex p-1.5 bg-[#EFEAE2] rounded-[12px] gap-1.5 mt-1">
                <button
                  type="button"
                  onClick={() => setMediaType('photo')}
                  className={`h-[40px] px-6 rounded-[9px] text-[11px] font-semibold tracking-[0.08em] uppercase transition-all cursor-pointer flex items-center gap-2 ${mediaType === 'photo'
                      ? 'bg-[#181818] text-white shadow-sm'
                      : 'text-[#5C5852] hover:text-[#181818]'
                    }`}
                >
                  <Image size={14} strokeWidth={1.8} />
                  PHOTO
                </button>
                <button
                  type="button"
                  onClick={() => setMediaType('video')}
                  className={`h-[40px] px-6 rounded-[9px] text-[11px] font-semibold tracking-[0.08em] uppercase transition-all cursor-pointer flex items-center gap-2 ${mediaType === 'video'
                      ? 'bg-[#181818] text-white shadow-sm'
                      : 'text-[#5C5852] hover:text-[#181818]'
                    }`}
                >
                  <Film size={14} strokeWidth={1.8} />
                  VIDEO
                </button>
              </div>
            </div>

            {/* Upload Drop Area: Centered, Padded, Never Touching Borders */}
            <div className="admin-form-group">
              <label className="admin-form-label text-center">
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
                className="admin-upload-dropzone group"
              >
                {filePreview ? (
                  <div className="relative w-full p-4 bg-[#EFEAE2] rounded-[14px] flex items-center justify-center">
                    <div className="relative max-h-52 overflow-hidden rounded-[10px] flex items-center justify-center">
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
                    </div>
                    <span className="absolute bottom-3.5 right-3.5 bg-black/85 backdrop-blur-xs text-white text-[10px] px-3.5 py-1.5 rounded-full tracking-wider font-semibold uppercase shadow-sm">
                      Change file
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-full bg-[#EFEAE2] flex items-center justify-center mb-3.5 text-[#5C5852] group-hover:scale-105 transition-transform">
                      <Upload size={20} strokeWidth={1.5} />
                    </div>
                    <span className="text-[14px] font-semibold text-[#181818] block mb-1.5">
                      Add photos or videos
                    </span>
                    <span className="text-[12px] text-[#7A756D] block mb-5 leading-relaxed max-w-[340px]">
                      Upload media for this collection (JPG, PNG, WEBP, MP4 up to 100MB)
                    </span>
                    <span className="admin-btn-upload-select group-hover:bg-[#252525]">
                      SELECT FILE
                    </span>
                  </>
                )}
              </div>

              {file && (
                <div className="mt-2.5 flex items-center justify-between text-[11px] text-[#5C5852] px-2">
                  <span className="truncate max-w-[340px]">{file.name}</span>
                  <span>{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                </div>
              )}
            </div>

            {/* External URL */}
            <div className="admin-form-group">
              <label className="admin-form-label">
                OR EXTERNAL MEDIA URL <span className="font-normal lowercase tracking-normal">(optional)</span>
              </label>
              <input
                type="url"
                value={directUrl}
                onChange={(e) => {
                  setDirectUrl(e.target.value);
                  if (e.target.value) setError('');
                }}
                placeholder="https://images.unsplash.com/... or direct media link"
                className="admin-form-input"
              />
            </div>

            {/* Title & Caption */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="admin-form-group">
                <label className="admin-form-label">
                  TITLE / SUBJECT
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Lake Como Vows"
                  className="admin-form-input"
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">
                  CAPTION / NOTES
                </label>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="e.g., Golden hour ceremony"
                  className="admin-form-input"
                />
              </div>
            </div>
          </form>
        </div>

        {/* ─── Footer Buttons: High-Contrast & Clearly Visible "SEND / UPLOAD" ─── */}
        <div className="admin-modal-footer">
          <button
            type="button"
            disabled={uploading}
            onClick={onClose}
            className="admin-btn-secondary"
          >
            CANCEL
          </button>

          <button
            type="button"
            disabled={uploading}
            onClick={handleSubmit}
            className="admin-btn-primary"
            title="Upload and send media to collection"
          >
            {uploading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>SENDING...</span>
              </>
            ) : (
              <>
                <Upload size={15} strokeWidth={2} />
                <span>SEND / UPLOAD</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
