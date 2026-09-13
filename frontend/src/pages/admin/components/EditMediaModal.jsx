import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Image, Film, Check, RotateCcw, Sparkles } from 'lucide-react';
import { CATEGORIES } from '../../collections/data/collectionsData';
import { useAdminAuth } from '../context/AdminAuthContext';
import '../AdminDashboard.css';

export default function EditMediaModal({
  isOpen,
  onClose,
  onSuccess,
  onResetBaseline,
  mediaItem,
}) {
  const { getAuthHeaders } = useAdminAuth();
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState('');
  const [directUrl, setDirectUrl] = useState('');
  const [mediaType, setMediaType] = useState('photo');
  const [category, setCategory] = useState('weddings');
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [meta, setMeta] = useState('');
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
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
      setResetting(false);
    }
  }, [isOpen, mediaItem]);

  if (!isOpen || !mediaItem) return null;

  const isBaseline = Boolean(mediaItem.isBaseline || mediaItem.id?.startsWith('seed-'));
  const isModifiedBaseline = Boolean(mediaItem.isModifiedBaseline || (isBaseline && mediaItem._id));

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
    try {
      const headers = getAuthHeaders();
      const targetId = mediaItem._id || mediaItem.id || mediaItem.baselineId;

      let res;
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('category', category);
        formData.append('type', mediaType);
        formData.append('title', title.trim());
        formData.append('caption', caption.trim());
        formData.append('meta', meta.trim());
        formData.append('isBaseline', isBaseline ? 'true' : 'false');
        formData.append('baselineId', mediaItem.baselineId || mediaItem.id || '');

        res = await fetch(`/api/media/${targetId}`, {
          method: 'PUT',
          headers,
          credentials: 'include',
          body: formData,
        });
      } else {
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
            isBaseline,
            baselineId: mediaItem.baselineId || mediaItem.id || '',
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
        isBaseline,
        isModifiedBaseline: true,
      });

      onClose();
    } catch (err) {
      setError(err.message || 'Error saving changes to media asset');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!onResetBaseline || !isBaseline) return;
    setResetting(true);
    setError('');
    try {
      await onResetBaseline(mediaItem);
      onClose();
    } catch (err) {
      setError(err.message || 'Error resetting baseline media asset');
    } finally {
      setResetting(false);
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
              {isBaseline ? 'PORTFOLIO SPECIMEN' : 'CUSTOM UPLOAD'}
            </span>
            {isBaseline && (
              <span className="text-[9px] tracking-[0.1em] uppercase font-medium text-[#7A756D] bg-[#EFEAE2] px-2 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles size={10} />
                Baseline {isModifiedBaseline ? '· Customized' : 'Photo'}
              </span>
            )}
          </div>

          <h3 className="admin-serif-title text-[28px] sm:text-[32px]">
            Edit Media Details
          </h3>
          <p className="admin-subtext text-[12px] sm:text-[13px] mt-2 max-w-[420px] mx-auto">
            {isBaseline
              ? 'Customize this baseline portfolio asset. Edits will sync across the repository and public gallery.'
              : 'Update metadata, title, and display properties for this uploaded media.'}
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
                accept={mediaType === 'video' ? 'video/*' : 'image/*'}
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="relative w-full p-4 bg-[#EFEAE2] rounded-[14px] flex flex-col items-center justify-center gap-3">
                <div className="relative max-h-56 max-w-full overflow-hidden rounded-[10px] flex items-center justify-center shadow-xs bg-black/5">
                  {mediaType === 'video' ? (
                    <video
                      src={filePreview || directUrl}
                      className="max-h-52 rounded-[8px]"
                      controls
                    />
                  ) : (
                    <img
                      src={filePreview || directUrl}
                      alt={title || 'Preview'}
                      className="max-h-52 object-contain rounded-[8px]"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800';
                      }}
                    />
                  )}
                </div>

                <div className="flex items-center gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 rounded-full bg-[#181818] text-white text-[11px] font-semibold uppercase tracking-[0.06em] hover:bg-[#2e2e2e] transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                  >
                    <Upload size={13} /> Replace with File
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
                    {CATEGORIES.map((cat) => (
                      <option key={cat.slug} value={cat.slug}>
                        {cat.name} ({cat.slug})
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
          </form>
        </div>

        {/* ─── Footer ─── */}
        <div className="admin-modal-footer">
          <div className="flex items-center gap-2">
            {isBaseline && isModifiedBaseline && (
              <button
                type="button"
                disabled={resetting || saving}
                onClick={handleReset}
                className="text-[11px] text-[#7A756D] hover:text-red-600 uppercase font-semibold tracking-wider flex items-center gap-1.5 px-3 py-2 rounded-[8px] hover:bg-[#FAF0F0] transition-colors cursor-pointer"
                title="Revert modifications and restore original baseline photo"
              >
                <RotateCcw size={13} />
                {resetting ? 'RESETTING...' : 'RESET TO ORIGINAL'}
              </button>
            )}
            <button
              type="button"
              disabled={saving || resetting}
              onClick={onClose}
              className="admin-btn-secondary"
            >
              CANCEL
            </button>
          </div>

          <button
            type="button"
            disabled={saving || resetting}
            onClick={handleSubmit}
            className="admin-btn-primary"
            title="Save changes to this media asset"
          >
            {saving ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>SAVING...</span>
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
