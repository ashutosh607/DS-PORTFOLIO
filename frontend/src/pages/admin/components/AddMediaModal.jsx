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
      <div className="relative z-10 w-full max-w-[560px] bg-white border border-[#E8E2D6] rounded-[20px] shadow-2xl my-8">

        {/* ─── Header ─── */}
        <div className="flex items-start justify-between px-7 sm:px-9 pt-8 pb-6 border-b border-[#E8E2D6]">
          <div>
            <span className="admin-eyebrow block mb-1.5">
              PORTFOLIO ARCHIVE
            </span>
            <h3 className="admin-serif-title text-[26px] sm:text-[30px]">
              Add Collection Media
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#7A756D] hover:text-[#181818] hover:bg-[#F0EAE0] transition-colors cursor-pointer mt-1"
            aria-label="Close"
          >
            <X size={18} strokeWidth={1.8} />
          </button>
        </div>

        {/* ─── Form Body ─── */}
        <div className="px-7 sm:px-9 py-7">
          {/* Error Notification */}
          {error && (
            <div className="mb-6 p-3.5 rounded-[10px] bg-[#FAF0F0] border border-[#E8C4C4] text-[#992E2E] text-[12px] leading-relaxed">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

            {/* Collection Category */}
            <div>
              <label className="block text-[10px] font-semibold tracking-[0.14em] uppercase text-[#7A756D] mb-2.5">
                COLLECTION CATEGORY *
              </label>
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-[46px] px-4 rounded-[10px] bg-white border border-[#E8E2D6] text-[13px] text-[#181818] outline-none focus:border-[#181818] cursor-pointer appearance-none transition-colors"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.slug} value={cat.slug}>
                      {cat.name} ({cat.slug})
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#8E887E] text-[10px]">
                  ▼
                </div>
              </div>
            </div>

            {/* Media Type Toggle */}
            <div>
              <label className="block text-[10px] font-semibold tracking-[0.14em] uppercase text-[#7A756D] mb-2.5">
                MEDIA TYPE
              </label>
              <div className="inline-flex p-1 bg-[#EFEAE2] rounded-[10px] gap-1">
                <button
                  type="button"
                  onClick={() => setMediaType('photo')}
                  className={`h-[36px] px-5 rounded-[8px] text-[11px] font-semibold tracking-[0.06em] uppercase transition-all cursor-pointer flex items-center gap-2 ${
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
                  className={`h-[36px] px-5 rounded-[8px] text-[11px] font-semibold tracking-[0.06em] uppercase transition-all cursor-pointer flex items-center gap-2 ${
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
              <label className="block text-[10px] font-semibold tracking-[0.14em] uppercase text-[#7A756D] mb-2.5">
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
                className="w-full min-h-[180px] border-2 border-dashed border-[#D4CCC0] hover:border-[#181818] rounded-[16px] p-8 sm:p-9 flex flex-col items-center justify-center text-center bg-[#FAFAF8] cursor-pointer transition-colors group"
              >
                {filePreview ? (
                  <div className="relative w-full p-4 bg-[#EFEAE2] rounded-[12px] flex items-center justify-center">
                    <div className="relative max-h-48 overflow-hidden rounded-[8px] flex items-center justify-center">
                      {mediaType === 'video' ? (
                        <video
                          src={filePreview}
                          className="max-h-44 rounded-[8px]"
                          controls
                        />
                      ) : (
                        <img
                          src={filePreview}
                          alt="Preview"
                          className="max-h-44 object-contain rounded-[8px]"
                        />
                      )}
                    </div>
                    <span className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-xs text-white text-[10px] px-3 py-1.5 rounded-full tracking-wider font-semibold uppercase shadow-sm">
                      Change file
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-full bg-[#EFEAE2] flex items-center justify-center mb-3.5 text-[#5C5852] group-hover:scale-105 transition-transform">
                      <Upload size={19} strokeWidth={1.5} />
                    </div>
                    <span className="text-[14px] font-semibold text-[#181818] block mb-1.5">
                      Add photos or videos
                    </span>
                    <span className="text-[11px] text-[#7A756D] block mb-5 leading-relaxed max-w-[340px]">
                      Upload media for this collection (JPG, PNG, WEBP, MP4, MOV up to 100MB)
                    </span>
                    <span className="inline-flex items-center justify-center h-[38px] px-6 rounded-[8px] bg-[#101010] text-white text-[11px] font-semibold tracking-[0.08em] uppercase group-hover:bg-[#252525] transition-colors">
                      SELECT FILE
                    </span>
                  </>
                )}
              </div>

              {file && (
                <div className="mt-2.5 flex items-center justify-between text-[11px] text-[#5C5852] px-1">
                  <span className="truncate max-w-[320px]">{file.name}</span>
                  <span>{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                </div>
              )}
            </div>

            {/* External URL */}
            <div>
              <label className="block text-[10px] font-semibold tracking-[0.14em] uppercase text-[#7A756D] mb-2.5">
                OR EXTERNAL MEDIA URL <span className="font-normal lowercase tracking-normal">(optional)</span>
              </label>
              <input
                type="url"
                value={directUrl}
                onChange={(e) => {
                  setDirectUrl(e.target.value);
                  if (e.target.value) setError('');
                }}
                placeholder="https://images.unsplash.com/... or cloud URL"
                className="w-full h-[46px] px-4 rounded-[10px] bg-white border border-[#E8E2D6] text-[13px] text-[#181818] outline-none focus:border-[#181818] placeholder:text-[#8E887E] transition-colors"
              />
            </div>

            {/* Title & Caption */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-semibold tracking-[0.14em] uppercase text-[#7A756D] mb-2.5">
                  TITLE / SUBJECT
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Lake Como Vows"
                  className="w-full h-[46px] px-4 rounded-[10px] bg-white border border-[#E8E2D6] text-[13px] text-[#181818] outline-none focus:border-[#181818] placeholder:text-[#8E887E] transition-colors"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold tracking-[0.14em] uppercase text-[#7A756D] mb-2.5">
                  CAPTION / NOTES
                </label>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="e.g., Golden hour ceremony"
                  className="w-full h-[46px] px-4 rounded-[10px] bg-white border border-[#E8E2D6] text-[13px] text-[#181818] outline-none focus:border-[#181818] placeholder:text-[#8E887E] transition-colors"
                />
              </div>
            </div>
          </form>
        </div>

        {/* ─── Footer Buttons ─── */}
        <div className="px-7 sm:px-9 py-5 border-t border-[#E8E2D6] flex items-center justify-end gap-3">
          <button
            type="button"
            disabled={uploading}
            onClick={onClose}
            className="h-[42px] px-5 rounded-[8px] text-[11px] font-semibold tracking-[0.1em] uppercase text-[#5C5852] hover:bg-[#F0EAE0] transition-colors cursor-pointer disabled:opacity-50"
          >
            CANCEL
          </button>

          <button
            type="button"
            disabled={uploading}
            onClick={handleSubmit}
            className="h-[42px] px-6 rounded-[8px] bg-[#101010] hover:bg-[#252525] text-white text-[11px] font-semibold tracking-[0.1em] uppercase transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
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
      </div>
    </div>
  );
}
