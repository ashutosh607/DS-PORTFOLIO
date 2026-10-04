import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Image, Film, Check, RotateCcw, Sparkles, Crop } from 'lucide-react';
import { CATEGORIES as DEFAULT_CATEGORIES } from '../../collections/data/collectionsData';
import { useCategories } from '../../../utils/categoryManager';
import { useAdminAuth } from '../context/AdminAuthContext';
import { getApiUrl } from '../../../utils/api';
import { optimizeImageFile } from '../../../utils/imageOptimizer';
import '../AdminDashboard.css';

export default function EditMediaModal({
  isOpen,
  onClose,
  onSuccess,
  onOpenDisplay,
  mediaItem,
}) {
  const { getAuthHeaders } = useAdminAuth();
  const { categories: dynamicCategories } = useCategories();
  const availableCategories = (dynamicCategories && dynamicCategories.length > 0) ? dynamicCategories : DEFAULT_CATEGORIES;

  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState('');
  const [directUrl, setDirectUrl] = useState('');
  const [mediaType, setMediaType] = useState('photo');
  const [category, setCategory] = useState('weddings');
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [meta, setMeta] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [error, setError] = useState('');

  const fileInputRef = useRef(null);

  // Populate form fields whenever mediaItem changes or modal opens
  useEffect(() => {
    if (isOpen && mediaItem) {
      setTitle(mediaItem.title || '');
      setCategory(mediaItem.category?.toLowerCase() || 'weddings');
      setMediaType(mediaItem.type || 'photo');
      setDirectUrl(mediaItem.url || '');
      setFilePreview(mediaItem.url || '');
      setCaption(mediaItem.caption || '');
      setMeta(mediaItem.meta || '');
      setFile(null);
      setError('');
      setSaving(false);
      setSaveStatus('');
    }
  }, [isOpen, mediaItem]);

  if (!isOpen || !mediaItem) return null;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setError('');

    const isVideo = selectedFile.type?.startsWith('video/') || /\.(mp4|mov|webm)$/i.test(selectedFile.name);
    if (isVideo) {
      setMediaType('video');
      setFilePreview(URL.createObjectURL(selectedFile));
    } else {
      setMediaType('photo');
      const previewUrl = URL.createObjectURL(selectedFile);
      setFilePreview(previewUrl);
    }
  };

  const handleDirectUrlChange = (e) => {
    const val = e.target.value;
    setDirectUrl(val);
    if (!file) {
      setFilePreview(val);
    }
    if (val) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const targetUrl = file ? '' : (directUrl.trim() || mediaItem.url);
    if (!file && !targetUrl) {
      setError('Please provide a valid media file or direct image/video URL.');
      return;
    }

    setSaving(true);
    setSaveStatus('');
    try {
      const headers = getAuthHeaders();
      const targetId = mediaItem._id || mediaItem.id;

      let res;
      if (file) {
        let uploadPayload = file;

        // Perform browser-side compression before sending to Cloudinary
        const isImage = file.type?.startsWith('image/') || /\.(jpg|jpeg|png|webp|avif|gif)$/i.test(file.name);
        if (isImage) {
          setSaveStatus('Optimizing image...');
          try {
            uploadPayload = await optimizeImageFile(file);
          } catch (compErr) {
            setError(compErr.message || 'Image optimization failed.');
            setSaving(false);
            setSaveStatus('');
            return;
          }
        }

        setSaveStatus('Uploading...');

        const formData = new FormData();
        formData.append('file', uploadPayload, file.name || 'photo.jpg');
        formData.append('url', directUrl.trim() || mediaItem.url || '');
        formData.append('category', category);
        formData.append('type', mediaType);
        formData.append('title', title.trim());
        formData.append('caption', caption.trim());
        formData.append('meta', meta.trim());

        res = await fetch(`/api/media/${targetId}`, {
          method: 'PUT',
          headers,
          credentials: 'include',
          body: formData,
        });
      } else {
        setSaveStatus('Saving...');
        res = await fetch(`/api/media/${targetId}`, {
          method: 'PUT',
          headers: {
            ...headers,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            url: targetUrl,
            category,
            type: mediaType,
            title: title.trim(),
            caption: caption.trim(),
            meta: meta.trim(),
          }),
        });
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to update media');
      }

      onSuccess(data.data || {
        ...mediaItem,
        title: title.trim(),
        category,
        type: mediaType,
        url: targetUrl || filePreview,
        caption: caption.trim(),
        meta: meta.trim(),
      });

      onClose();
    } catch (err) {
      setError(err.message || 'Error saving changes to media asset');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Card */}
      <div className="admin-modal-card">
        {/* ─── Header ─── */}
        <div className="admin-modal-header">
          <button
            type="button"
            onClick={onClose}
            className="admin-modal-close-btn"
            aria-label="Close"
          >
            <X size={18} strokeWidth={1.8} />
          </button>

          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="admin-eyebrow">
              MEDIA ASSET
            </span>
          </div>

          <h3 className="admin-serif-title text-[28px] sm:text-[32px]">
            Edit Media Details
          </h3>
          <p className="admin-subtext text-[12px] sm:text-[13px] mt-2 max-w-[420px] mx-auto">
            Update metadata, title, and display properties for this media asset.
          </p>
        </div>

        {/* ─── Body ─── */}
        <div className="admin-modal-body">
          {error && (
            <div className="mb-7 p-4 rounded-[12px] bg-[#FAF0F0] border border-[#E8C4C4] text-[#992E2E] text-[12px] leading-relaxed text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>

            {/* Media Preview & Replacement Frame */}
            <div className="admin-form-group">
              <label className="admin-form-label text-center">
                MEDIA PREVIEW & REPLACEMENT
              </label>

              <input
                ref={fileInputRef}
                type="file"
                accept={mediaType === 'video' ? 'video/*,.mp4,.mov,.webm' : 'image/*,.jpg,.jpeg,.png,.webp,.avif,.gif'}
                onChange={handleFileChange}
                className="hidden"
              />

              <div
                onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const dropped = e.dataTransfer.files?.[0];
                  if (dropped) {
                    handleFileChange({ target: { files: [dropped] } });
                  }
                }}
                className="relative w-full p-4 bg-[#EFEAE2] rounded-[14px] flex flex-col items-center justify-center gap-3 border-2 border-dashed border-transparent hover:border-[#C2A378]/50 transition-all"
              >
                {/* Clickable Image Box */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="group/img relative max-h-56 max-w-full overflow-hidden rounded-[10px] flex items-center justify-center shadow-xs bg-black/5 cursor-pointer"
                  title="Click to choose a replacement photo"
                >
                  {mediaType === 'video' ? (
                    <video
                      src={filePreview?.startsWith('blob:') ? filePreview : getApiUrl(filePreview || directUrl)}
                      className="max-h-52 rounded-[8px]"
                      preload="metadata"
                      controls
                    />
                  ) : (
                    <img
                      src={filePreview?.startsWith('blob:') ? filePreview : getApiUrl(filePreview || directUrl)}
                      alt={title || 'Preview'}
                      className="max-h-52 object-contain rounded-[8px] transition-transform duration-300 group-hover/img:scale-102"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800';
                      }}
                    />
                  )}

                  {/* Click to Replace Hover Badge */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-3 py-1.5 rounded-full bg-white text-[#181818] text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1.5 shadow-md">
                      <Upload size={13} className="text-[#C2A378]" /> Click to Replace
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 rounded-full bg-[#181818] text-white text-[11px] font-semibold uppercase tracking-[0.06em] hover:bg-[#2e2e2e] transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                  >
                    <Upload size={13} /> {file ? 'Change Selected File' : 'Replace with File'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      if (onOpenDisplay) {
                        onOpenDisplay(mediaItem);
                      }
                    }}
                    className="px-4 py-2 rounded-full bg-[#FAF8F5] text-[#181818] border border-[#C2A378] text-[11px] font-semibold uppercase tracking-[0.06em] hover:bg-[#F0EAE0] transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                  >
                    <Crop size={13} className="text-[#C2A378]" /> Adjust Framing &amp; Crop
                  </button>
                  {file && (
                    <button
                      type="button"
                      onClick={() => {
                        setFile(null);
                        setFilePreview(directUrl || mediaItem.url);
                      }}
                      className="text-[11px] text-[#7A756D] hover:text-[#181818] px-2 py-1 underline cursor-pointer"
                    >
                      Clear new file
                    </button>
                  )}
                </div>

                {file && (
                  <p className="text-[11px] text-[#5C5852]">
                    Selected replacement: <span className="font-medium text-[#181818]">{file.name}</span> ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                  </p>
                )}
              </div>
            </div>

            {/* Direct Image/Video URL */}
            <div className="admin-form-group">
              <label className="admin-form-label">
                DIRECT ASSET URL
              </label>
              <input
                type="url"
                value={directUrl}
                onChange={handleDirectUrlChange}
                placeholder="https://images.unsplash.com/... or media asset link"
                className="admin-form-input"
              />
            </div>

            {/* Collection Category & Media Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-end">
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

              <div className="admin-form-group">
                <label className="admin-form-label">
                  MEDIA TYPE
                </label>
                <div className="inline-flex p-1 bg-[#EFEAE2] rounded-[12px] gap-1">
                  <button
                    type="button"
                    onClick={() => setMediaType('photo')}
                    className={`h-[38px] px-5 rounded-[9px] text-[11px] font-semibold tracking-[0.08em] uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
                      mediaType === 'photo'
                        ? 'bg-[#181818] text-white shadow-sm'
                        : 'text-[#5C5852] hover:text-[#181818]'
                    }`}
                  >
                    <Image size={13} strokeWidth={1.8} />
                    PHOTO
                  </button>
                  <button
                    type="button"
                    onClick={() => setMediaType('video')}
                    className={`h-[38px] px-5 rounded-[9px] text-[11px] font-semibold tracking-[0.08em] uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
                      mediaType === 'video'
                        ? 'bg-[#181818] text-white shadow-sm'
                        : 'text-[#5C5852] hover:text-[#181818]'
                    }`}
                  >
                    <Film size={13} strokeWidth={1.8} />
                    VIDEO
                  </button>
                </div>
              </div>
            </div>

            {/* Title & Caption */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="admin-form-group">
                <label className="admin-form-label">
                  TITLE / DISPLAY SUBJECT
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Lake Como Ceremony"
                  className="admin-form-input"
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">
                  CAPTION / EDITORIAL NOTE
                </label>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="e.g., Candlelit reception beneath Tuscan skies"
                  className="admin-form-input"
                />
              </div>
            </div>

            {/* Technical Metadata */}
            <div className="admin-form-group">
              <label className="admin-form-label">
                TECHNICAL METADATA <span className="font-normal lowercase tracking-normal">(camera, lens, film stock)</span>
              </label>
              <input
                type="text"
                value={meta}
                onChange={(e) => setMeta(e.target.value)}
                placeholder="e.g., Leica M11 · 35mm Summilux · Natural Ambient Twilight"
                className="admin-form-input"
              />
            </div>

            {/* Display Framing & Focal Adjustments Option */}
            <div className="p-4 rounded-[14px] bg-[#FAF8F5] border border-[#E2DACD] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs mt-2">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Crop size={14} className="text-[#C2A378]" />
                  <span className="text-[10px] font-mono uppercase tracking-[0.16em] font-bold text-[#6B6358]">
                    Display Framing &amp; Focal Position
                  </span>
                </div>
                <p className="text-xs text-[#5C5852] max-w-md leading-relaxed">
                  Fine-tune zoom, aspect ratio crops (16:10, 4:3, 3:4), and focal center point for how this photo is framed on the public site.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onOpenDisplay) {
                    onOpenDisplay(mediaItem);
                  }
                }}
                className="shrink-0 px-4 py-2 rounded-full bg-[#181818] text-white text-[11px] font-sans font-bold uppercase tracking-[0.08em] hover:bg-[#333] transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs"
              >
                <Crop size={13} className="text-[#C2A378]" />
                <span>Adjust Framing</span>
              </button>
            </div>
          </form>
        </div>

        {/* ─── Footer ─── */}
        <div className="admin-modal-footer">
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={saving}
              onClick={onClose}
              className="admin-btn-secondary"
            >
              CANCEL
            </button>
          </div>

          <button
            type="button"
            disabled={saving}
            onClick={handleSubmit}
            className="admin-btn-primary"
            title="Save changes to this media asset"
          >
            {saving ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>{saveStatus ? saveStatus.toUpperCase() : 'SAVING...'}</span>
              </>
            ) : (
              <>
                <Check size={15} strokeWidth={2.2} />
                <span>SAVE CHANGES</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
