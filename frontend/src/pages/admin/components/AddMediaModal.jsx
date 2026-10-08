import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  X, Upload, Image, Film, Crop, 
  ZoomIn, ZoomOut, Move, RotateCcw, 
  Maximize2, Minimize2 
} from 'lucide-react';
import { CATEGORIES as DEFAULT_CATEGORIES } from '../../collections/data/collectionsData';
import { useCategories } from '../../../utils/categoryManager';
import { useAdminAuth } from '../context/AdminAuthContext';
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
  const [uploadStatus, setUploadStatus] = useState('');
  const [error, setError] = useState('');

  // Framing, scale & focal state
  const [display, setDisplay] = useState(DEFAULT_DISPLAY);
  const [showFocalCrosshair, setShowFocalCrosshair] = useState(true);

  // Live drag to pan
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ startX: 0, startY: 0, initialPosX: 50, initialPosY: 50 });
  const previewBoxRef = useRef(null);

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
      setUploadStatus('');
      setDisplay(DEFAULT_DISPLAY);
    }
  }, [isOpen]);

  // Drag to pan handlers
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

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.size > 100 * 1024 * 1024) {
      const sizeMB = (selectedFile.size / (1024 * 1024)).toFixed(1);
      setError(`Selected file is ${sizeMB} MB. Maximum upload size is 100 MB. Please compress this video (20–50 MB is ideal for web streaming) or paste a direct video URL.`);
      return;
    }

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
    setUploadStatus('');
    try {
      let res;
      const headers = getAuthHeaders();

      if (file) {
        let uploadPayload = file;

        // Perform browser-side compression before sending to Cloudinary
        const isImage = file.type?.startsWith('image/') || /\.(jpg|jpeg|png|webp|avif|gif)$/i.test(file.name);
        if (isImage) {
          setUploadStatus('Optimizing image...');
          try {
            uploadPayload = await optimizeImageFile(file);
          } catch (compErr) {
            setError(compErr.message || 'Image optimization failed.');
            setUploading(false);
            setUploadStatus('');
            return;
          }
        }

        setUploadStatus('Uploading...');

        const formData = new FormData();
        formData.append('file', uploadPayload, file.name || 'photo.jpg');
        formData.append('category', category);
        formData.append('type', mediaType);
        if (title.trim()) formData.append('title', title.trim());
        if (caption.trim()) formData.append('caption', caption.trim());
        if (mediaType === 'photo') {
          formData.append('display', JSON.stringify(display));
        }

        res = await fetch('/api/media', {
          method: 'POST',
          headers,
          credentials: 'include',
          body: formData,
        });
      } else {
        setUploadStatus('Uploading...');
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
            ...(mediaType === 'photo' ? { display } : {}),
          }),
        });
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to upload media');
      }

      onSuccess(data.data);
      try {
        const cached = JSON.parse(localStorage.getItem('ds_portfolio_cached_media') || '[]');
        const updated = [data.data, ...cached.filter((m) => m._id !== data.data._id)];
        localStorage.setItem('ds_portfolio_cached_media', JSON.stringify(updated));
      } catch {}
      window.dispatchEvent(new CustomEvent('ds_media_updated', { detail: data.data }));
      onClose();
    } catch (err) {
      setError(err.message || 'Error uploading media asset');
    } finally {
      setUploading(false);
      setUploadStatus('');
    }
  };

  const activePhotoSrc = directUrl || filePreview;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Card with Scrollable Body and Fixed Header/Footer */}
      <div className="admin-modal-card" style={{ maxWidth: '640px', width: '100%', maxHeight: '92vh', display: 'flex', flexDirection: 'column' }}>

        {/* ─── Header: Centered & Fixed at Top ─── */}
        <div className="admin-modal-header" style={{ flexShrink: 0 }}>
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
        <div className="admin-modal-body" style={{ flex: 1, overflowY: 'auto' }}>
          {/* Error Notification */}
          {error && (
            <div className="mb-7 p-4 rounded-[12px] bg-[#FAF0F0] border border-[#E8C4C4] text-[#992E2E] text-[12px] leading-relaxed text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>

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

            {/* Media Type Toggle */}
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

            {/* Upload Drop Area */}
            <div className="admin-form-group">
              <label className="admin-form-label text-center">
                UPLOAD PHOTO OR VIDEO FILE
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept={mediaType === 'video' ? 'video/*,.mp4,.mov,.webm' : 'image/*,.jpg,.jpeg,.png,.webp,.avif,.gif'}
                onChange={handleFileChange}
                className="hidden"
              />

              {!activePhotoSrc ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="admin-upload-dropzone group"
                >
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
                </div>
              ) : mediaType === 'video' ? (
                /* Video Preview */
                <div className="relative w-full p-4 bg-[#EFEAE2] rounded-[14px] flex flex-col items-center justify-center gap-3">
                  <div className="relative max-h-56 overflow-hidden rounded-[10px] w-full flex items-center justify-center bg-black/5">
                    <video
                      src={activePhotoSrc}
                      className="max-h-52 rounded-[8px]"
                      controls
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white border border-[#DCD5C9] text-[11px] font-medium text-[#181818] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                  >
                    <Upload size={12} />
                    <span>Change Video File</span>
                  </button>
                </div>
              ) : (
                /* Photo Preview with Interactive Resizing & Framing Studio */
                <div style={{ borderRadius: 16, border: '1px solid #E2DACD', backgroundColor: '#F9F7F3', padding: 16 }}>
                  
                  {/* Studio Header */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, paddingBottom: 12, marginBottom: 14, borderBottom: '1px solid #EAE3D6' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: '#EDE6DC', border: '1px solid #DDD5C9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2A2621' }}>
                        <Crop size={14} />
                      </div>
                      <div>
                        <div style={{ fontSize: 12.5, fontWeight: 600, color: '#181818', display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span>Image Resizing &amp; Framing Controls</span>
                          <span style={{ padding: '2px 7px', borderRadius: 999, backgroundColor: '#EBE4D8', color: '#6E675D', fontSize: 9, fontFamily: 'monospace' }}>
                            Card Simulation
                          </span>
                        </div>
                        <div style={{ fontSize: 11, color: '#7A7367', marginTop: 2 }}>
                          Scale, zoom, and drag focal position to customize how this photo appears in the collection.
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <button
                        type="button"
                        onClick={handleResetFraming}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          padding: '4px 10px',
                          borderRadius: 999,
                          backgroundColor: '#fff',
                          color: '#5C5852',
                          border: '1px solid #DDD5C9',
                          fontSize: 10.5,
                          fontWeight: 500,
                          cursor: 'pointer',
                          flexShrink: 0,
                        }}
                        title="Reset to 100% zoom and center"
                      >
                        <RotateCcw size={11} />
                        <span>Reset</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          padding: '4px 10px',
                          borderRadius: 999,
                          backgroundColor: '#EBE6DD',
                          color: '#181818',
                          border: '1px solid #DCD5C9',
                          fontSize: 10.5,
                          fontWeight: 500,
                          cursor: 'pointer',
                          flexShrink: 0,
                        }}
                        title="Choose a different image file"
                      >
                        <Upload size={11} />
                        <span>Change</span>
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.15fr) minmax(0, 1fr)', gap: 16, alignItems: 'start' }}>
                    
                    {/* Left Column: Live Drag-and-Pan Canvas */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 10, color: '#7A7367', fontFamily: 'monospace', textTransform: 'uppercase', padding: '0 2px' }}>
                        <span>Live Framing Canvas</span>
                        <span>
                          X: <strong style={{ color: '#181818' }}>{Math.round(display.position?.x ?? 50)}%</strong> · Y: <strong style={{ color: '#181818' }}>{Math.round(display.position?.y ?? 50)}%</strong>
                        </span>
                      </div>

                      <div style={{ position: 'relative', width: '100%', borderRadius: 12, overflow: 'hidden', backgroundColor: '#E8E2D6', border: '1px solid #DCD5C7', padding: 6 }}>
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
                          style={{
                            position: 'relative',
                            width: '100%',
                            height: 160,
                            overflow: 'hidden',
                            borderRadius: 8,
                            userSelect: 'none',
                            cursor: isDragging ? 'grabbing' : 'grab',
                            backgroundColor: display.fit === 'contain' ? '#FAF8F5' : '#141414',
                            boxShadow: isDragging ? '0 0 0 2px #101010' : 'none',
                            transition: 'box-shadow 0.15s ease',
                          }}
                          title="Click and drag inside preview to position image"
                        >
                          <img
                            src={activePhotoSrc}
                            alt="Framing preview"
                            draggable={false}
                            style={{
                              width: '100%',
                              height: '100%',
                              pointerEvents: 'none',
                              userSelect: 'none',
                              transition: isDragging ? 'none' : 'transform 75ms ease-out',
                              ...getFramingStyle(display),
                            }}
                          />

                          {/* Subtle focal crosshair */}
                          {showFocalCrosshair && (
                            <div
                              style={{
                                position: 'absolute',
                                pointerEvents: 'none',
                                zIndex: 20,
                                left: `${display.position?.x ?? 50}%`,
                                top: `${display.position?.y ?? 50}%`,
                                transform: 'translate(-50%, -50%)',
                                transition: isDragging ? 'none' : 'all 75ms ease-out',
                              }}
                            >
                              <div style={{ width: 26, height: 26, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.9)', boxShadow: '0 0 6px rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: '#fff' }} />
                              </div>
                            </div>
                          )}

                          {/* Drag Gesture Hint Tag */}
                          <div style={{ position: 'absolute', top: 8, right: 8, pointerEvents: 'none', zIndex: 30 }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 999, backgroundColor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(3px)', color: '#fff', fontSize: 9, fontFamily: 'monospace', letterSpacing: '0.05em' }}>
                              <Move size={9} />
                              <span>DRAG TO PAN</span>
                            </span>
                          </div>

                          {/* Fit Mode Badge */}
                          <div style={{ position: 'absolute', bottom: 8, left: 8, pointerEvents: 'none', zIndex: 30 }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(3px)', color: '#181818', fontSize: 9, fontFamily: 'monospace', fontWeight: 600 }}>
                              {Math.round((display.zoom || 1) * 100)}% · {display.fit === 'contain' ? 'Contain' : 'Cover'}
                            </span>
                          </div>
                        </div>

                        <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 10, color: '#7A7367', padding: '0 2px' }}>
                          <span>Click &amp; drag preview to reposition</span>
                          <button
                            type="button"
                            onClick={() => setShowFocalCrosshair(!showFocalCrosshair)}
                            style={{ background: 'none', border: 'none', padding: 0, color: '#554E44', textDecoration: 'underline', cursor: 'pointer', fontSize: 10 }}
                          >
                            {showFocalCrosshair ? 'Hide target' : 'Show target'}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Zoom, Fit, and 9-Point Focal Presets */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, backgroundColor: '#fff', padding: 14, borderRadius: 12, border: '1px solid #E5DECFA' }}>
                      
                      {/* 1. Zoom Slider */}
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                          <label style={{ fontSize: 9.5, fontFamily: 'monospace', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#6E675D', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 5 }}>
                            <ZoomIn size={12} />
                            <span>IMAGE ZOOM / SCALE</span>
                          </label>
                          <span style={{ fontFamily: 'monospace', fontSize: 10.5, fontWeight: 700, color: '#181818', backgroundColor: '#F4EFEA', padding: '1px 6px', borderRadius: 6, border: '1px solid #E3DBD0' }}>
                            {Math.round((display.zoom || 1) * 100)}%
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <button
                            type="button"
                            onClick={() => handleZoomStep(-0.1)}
                            style={{ width: 28, height: 28, borderRadius: 6, backgroundColor: '#FAF8F5', border: '1px solid #DCD5C9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#554E44', cursor: 'pointer', flexShrink: 0 }}
                            title="Zoom out"
                          >
                            <ZoomOut size={12} />
                          </button>

                          <input
                            type="range"
                            min="1"
                            max="2.5"
                            step="0.05"
                            value={display.zoom || 1}
                            onChange={(e) => setDisplay((prev) => ({ ...prev, zoom: parseFloat(e.target.value) }))}
                            style={{ width: '100%', accentColor: '#181818', cursor: 'pointer' }}
                          />

                          <button
                            type="button"
                            onClick={() => handleZoomStep(0.1)}
                            style={{ width: 28, height: 28, borderRadius: 6, backgroundColor: '#FAF8F5', border: '1px solid #DCD5C9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#554E44', cursor: 'pointer', flexShrink: 0 }}
                            title="Zoom in"
                          >
                            <ZoomIn size={12} />
                          </button>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 8.5, fontFamily: 'monospace', color: '#9C9488', marginTop: 3, padding: '0 2px' }}>
                          <span>1.0x (Normal)</span>
                          <span>1.75x</span>
                          <span>2.5x (Close)</span>
                        </div>
                      </div>

                      {/* 2. Fit Mode Toggle */}
                      <div>
                        <label style={{ fontSize: 9.5, fontFamily: 'monospace', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#6E675D', fontWeight: 700, display: 'block', marginBottom: 5 }}>
                          FIT MODE
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, backgroundColor: '#F6F3EC', padding: 3, borderRadius: 8, border: '1px solid #E4DDD1' }}>
                          <button
                            type="button"
                            onClick={() => setDisplay((prev) => ({ ...prev, fit: 'cover' }))}
                            style={{
                              padding: '5px 8px',
                              borderRadius: 6,
                              fontSize: 10.5,
                              fontWeight: display.fit !== 'contain' ? 600 : 500,
                              backgroundColor: display.fit !== 'contain' ? '#101010' : 'transparent',
                              color: display.fit !== 'contain' ? '#fff' : '#5C5852',
                              border: 'none',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: 5,
                              transition: 'all 0.15s ease',
                            }}
                          >
                            <Maximize2 size={11} />
                            <span>Cover (Fill)</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setDisplay((prev) => ({ ...prev, fit: 'contain' }))}
                            style={{
                              padding: '5px 8px',
                              borderRadius: 6,
                              fontSize: 10.5,
                              fontWeight: display.fit === 'contain' ? 600 : 500,
                              backgroundColor: display.fit === 'contain' ? '#101010' : 'transparent',
                              color: display.fit === 'contain' ? '#fff' : '#5C5852',
                              border: 'none',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: 5,
                              transition: 'all 0.15s ease',
                            }}
                          >
                            <Minimize2 size={11} />
                            <span>Contain</span>
                          </button>
                        </div>
                      </div>

                      {/* 3. Focal Alignment Presets (9 points) */}
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                          <label style={{ fontSize: 9.5, fontFamily: 'monospace', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#6E675D', fontWeight: 700 }}>
                            FOCAL ALIGNMENT
                          </label>
                          <span style={{ fontSize: 9, color: '#8E887E' }}>9 Presets</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 5, backgroundColor: '#FAF8F5', padding: 5, borderRadius: 8, border: '1px solid #E8E2D6' }}>
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
                                style={{
                                  height: 28,
                                  borderRadius: 6,
                                  fontSize: 11,
                                  fontFamily: 'monospace',
                                  fontWeight: isSelected ? 700 : 500,
                                  backgroundColor: isSelected ? '#101010' : '#fff',
                                  color: isSelected ? '#fff' : '#4A463F',
                                  border: isSelected ? '1px solid #101010' : '1px solid #E2DACD',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  cursor: 'pointer',
                                  transition: 'all 0.15s ease',
                                }}
                                title={preset.label}
                              >
                                <span>{preset.symbol}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              )}

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

        {/* ─── Footer Buttons ─── */}
        <div className="admin-modal-footer" style={{ flexShrink: 0 }}>
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
                <span>{uploadStatus ? uploadStatus.toUpperCase() : 'UPLOADING...'}</span>
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
