import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  X, Upload, Image as ImageIcon, Type, PenLine, 
  Quote, Camera, MapPin, Link2, ArrowRight,
  Crop, ZoomIn, ZoomOut, Move, RotateCcw,
  Maximize2, Minimize2
} from 'lucide-react';
import { updateCategory } from '../../../utils/categoryManager';
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

/* ── Inline style objects (guarantees spacing regardless of Tailwind) ── */
const styles = {
  overlay: {
    position: 'fixed', inset: 0, zIndex: 50,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.45)',
    backdropFilter: 'blur(4px)',
    overflowY: 'auto',
  },
  modal: {
    width: '100%', maxWidth: 640,
    maxHeight: '92vh',
    display: 'flex', flexDirection: 'column',
    backgroundColor: '#fff',
    borderRadius: 20,
    border: '1px solid #E8E2D8',
    boxShadow: '0 25px 60px rgba(0,0,0,0.18)',
    overflow: 'hidden',
    margin: 'auto',
  },
  header: {
    display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
    padding: '24px 28px 16px 28px',
    flexShrink: 0,
    borderBottom: '1px solid #F0ECE4',
  },
  closeBtn: {
    width: 36, height: 36, borderRadius: '50%', border: 'none',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'transparent', color: '#8E887E', cursor: 'pointer',
    flexShrink: 0, marginLeft: 12, transition: 'all 0.2s',
  },
  formBody: {
    padding: '20px 28px 24px 28px',
    overflowY: 'auto',
    flex: 1,
  },
  label: {
    display: 'block', fontSize: 10.5, fontWeight: 700,
    color: '#44403C', textTransform: 'uppercase',
    letterSpacing: '0.1em', marginBottom: 8,
  },
  inputRow: {
    display: 'flex', alignItems: 'center',
    width: '100%', height: 48, borderRadius: 12,
    border: '1px solid #E0DAD0', backgroundColor: '#F7F5F1',
    padding: '0 16px', gap: 14, transition: 'all 0.2s',
  },
  iconBadge: {
    width: 32, height: 32, borderRadius: 8,
    backgroundColor: '#EBE6DD', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0, color: '#6B6560',
  },
  input: {
    flex: 1, minWidth: 0, height: '100%',
    background: 'transparent', border: 'none', outline: 'none',
    fontSize: 13, color: '#1C1917', fontFamily: 'inherit',
  },
  fieldGap: { marginBottom: 18 },
  twoCol: {
    display: 'grid', gridTemplateColumns: '1fr 1fr',
    gap: 16, marginBottom: 18,
  },
  footer: {
    display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
    gap: 12, padding: '16px 28px', borderTop: '1px solid #EBE6DD',
    backgroundColor: '#fff',
    flexShrink: 0,
  },
  cancelBtn: {
    padding: '0 20px', height: 40, borderRadius: 10,
    border: 'none', background: 'transparent',
    fontSize: 13, fontWeight: 500, color: '#5C5852',
    cursor: 'pointer', transition: 'all 0.2s',
  },
  submitBtn: {
    padding: '0 22px', height: 40, borderRadius: 10,
    border: 'none', backgroundColor: '#1C1917',
    fontSize: 13, fontWeight: 500, color: '#fff',
    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
    transition: 'all 0.2s',
  },
  uploadArea: {
    border: '2px dashed #DDD8CD', borderRadius: 14,
    textAlign: 'center', cursor: 'pointer',
    padding: '32px 24px', backgroundColor: 'rgba(250,248,245,0.6)',
    transition: 'all 0.2s',
  },
};

export default function EditCategoryModal({ isOpen, onClose, onSuccess, category }) {
  const { getAuthHeaders } = useAdminAuth();

  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [quote, setQuote] = useState('');
  const [medium, setMedium] = useState('');
  const [location, setLocation] = useState('');
  
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState('');
  const [directCoverUrl, setDirectCoverUrl] = useState('');
  const [useDirectUrl, setUseDirectUrl] = useState(false);

  // Framing, scale & focal state
  const [display, setDisplay] = useState(DEFAULT_DISPLAY);
  const [showFocalCrosshair, setShowFocalCrosshair] = useState(true);

  // Live drag to pan
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ startX: 0, startY: 0, initialPosX: 50, initialPosY: 50 });
  const previewBoxRef = useRef(null);

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
      
      const photoUrl = category.coverImage || category.featured?.image || '';
      setCoverPreview(photoUrl);
      setDirectCoverUrl(category.coverImage || '');
      setCoverFile(null);
      setUseDirectUrl(false);
      setError('');

      const rawDisplay = category.display || category.coverDisplay || category.featured?.display;
      if (rawDisplay && typeof rawDisplay === 'object') {
        setDisplay({
          fit: rawDisplay.fit === 'contain' || rawDisplay.fit === 'fit' ? 'contain' : 'cover',
          position: {
            x: typeof rawDisplay.position?.x === 'number' ? rawDisplay.position.x : 50,
            y: typeof rawDisplay.position?.y === 'number' ? rawDisplay.position.y : 50,
          },
          zoom: typeof rawDisplay.zoom === 'number' && rawDisplay.zoom >= 1 ? rawDisplay.zoom : 1,
        });
      } else {
        setDisplay({ fit: 'cover', position: { x: 50, y: 50 }, zoom: 1 });
      }
    }
  }, [category, isOpen]);

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

  if (!isOpen || !category) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isImage = file.type?.startsWith('image/') || /\.(jpg|jpeg|png|webp|avif|gif)$/i.test(file.name);
    if (!isImage) {
      setError('Please select a valid image file (JPG, JPEG, PNG, WEBP).');
      return;
    }
    setCoverFile(file);
    setError('');
    const reader = new FileReader();
    reader.onload = (ev) => setCoverPreview(ev.target.result);
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
        let uploadCover = coverFile;
        const isImage = coverFile.type?.startsWith('image/') || /\.(jpg|jpeg|png|webp|avif|gif)$/i.test(coverFile.name);
        if (isImage) {
          uploadCover = await optimizeImageFile(coverFile);
        }
        payload = new FormData();
        payload.append('name', name.trim());
        payload.append('coverFile', uploadCover, coverFile.name || 'cover.jpg');
        payload.append('tagline', tagline.trim());
        payload.append('quote', quote.trim());
        payload.append('medium', medium.trim());
        payload.append('location', location.trim());
        payload.append('display', JSON.stringify(display));
        payload.append('coverDisplay', JSON.stringify(display));
        if (Array.isArray(category.supporting) && category.supporting.length > 0) {
          payload.append('supporting', JSON.stringify(category.supporting));
        }
        if (category.featured) {
          payload.append('featured', JSON.stringify({
            ...category.featured,
            display,
          }));
        }
      } else {
        payload = {
          name: name.trim(),
          coverImage: useDirectUrl ? directCoverUrl.trim() : coverPreview,
          tagline: tagline.trim(),
          quote: quote.trim(),
          medium: medium.trim(),
          location: location.trim(),
          display,
          coverDisplay: display,
          supporting: category.supporting || [],
          featured: {
            ...(category.featured || {}),
            display,
          },
        };
      }
      const targetCatId = category.slug || category._id || category.id;
      const updated = await updateCategory(targetCatId, payload, getAuthHeaders());
      if (onSuccess) onSuccess(updated);
      onClose();
    } catch (err) {
      console.error('Failed to update category:', err);
      setError(err.message || 'Failed to update category.');
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Reusable input field ── */
  const InputField = ({ icon: Icon, placeholder, value, onChange, type = 'text', required = false }) => (
    <div
      style={styles.inputRow}
      onFocus={(e) => { e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.borderColor = '#1C1917'; }}
      onBlur={(e) => { e.currentTarget.style.backgroundColor = '#F7F5F1'; e.currentTarget.style.borderColor = '#E0DAD0'; }}
    >
      <div style={styles.iconBadge}>
        <Icon size={14} />
      </div>
      <input
        type={type} placeholder={placeholder}
        value={value} onChange={onChange} required={required}
        style={styles.input}
      />
    </div>
  );

  const activePhotoSrc = useDirectUrl ? directCoverUrl : coverPreview;

  return (
    <div style={styles.overlay} onClick={(e) => { if (e.target === e.currentTarget && !submitting) onClose(); }}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>

        {/* ─── Header ─── */}
        <div style={styles.header}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: '0.2em', color: '#8E887E', textTransform: 'uppercase', fontWeight: 600, marginBottom: 4 }}>
              EDIT COLLECTION
            </div>
            <h3 style={{ fontSize: 24, color: '#1C1917', fontWeight: 400, lineHeight: 1.2, margin: 0, fontFamily: "'Playfair Display', Georgia, serif" }}>
              Edit Category
            </h3>
            <p style={{ fontSize: 12.5, color: '#8E887E', marginTop: 4, marginBottom: 0 }}>
              Update category settings, editorial notes, framing, and cover artwork.
            </p>
          </div>
          <button
            type="button" onClick={onClose} disabled={submitting}
            style={styles.closeBtn}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F0EBE3'; e.currentTarget.style.color = '#1C1917'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#8E887E'; }}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* ─── Form ─── */}
        <form onSubmit={handleSubmit} style={styles.formBody}>

          {error && (
            <div style={{ marginBottom: 16, padding: 12, backgroundColor: '#FEF2F2', border: '1px solid #FECACA', color: '#B91C1C', fontSize: 12, borderRadius: 10 }}>
              {error}
            </div>
          )}

          {/* ── 1. Cover Photo & Image Resizing Studio ── */}
          <div style={styles.fieldGap}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <label style={styles.label}>
                Cover Artwork &amp; Resizing <span style={{ color: '#EF4444' }}>*</span>
              </label>
              {activePhotoSrc && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      fontSize: 11.5,
                      color: '#1C1917',
                      background: '#F0ECE3',
                      border: '1px solid #DCD5C9',
                      padding: '4px 10px',
                      borderRadius: 8,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 5,
                      fontWeight: 500,
                    }}
                  >
                    <Upload size={12} /> Replace Photo
                  </button>
                  <button
                    type="button"
                    onClick={() => setUseDirectUrl(!useDirectUrl)}
                    style={{
                      fontSize: 11,
                      color: '#7A756D',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      padding: 0,
                    }}
                  >
                    {useDirectUrl ? 'Upload file' : 'Direct URL'}
                  </button>
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.jpg,.jpeg,.png,.webp,.avif"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />

            {!activePhotoSrc ? (
              !useDirectUrl ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  style={styles.uploadArea}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#AAA49A'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#DDD8CD'; }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: 42, height: 42, borderRadius: '50%', backgroundColor: '#EBE6DD', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B6560', marginBottom: 12 }}>
                      <ImageIcon size={20} strokeWidth={1.5} />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#1C1917' }}>Upload Category Cover Photo</span>
                    <span style={{ fontSize: 11, color: '#8E887E', marginTop: 4 }}>JPG, PNG, or WEBP (featured across public collections)</span>
                  </div>
                </div>
              ) : (
                <div>
                  <InputField icon={Link2} placeholder="https://..." value={directCoverUrl} onChange={(e) => setDirectCoverUrl(e.target.value)} type="url" />
                </div>
              )
            ) : (
              /* When image is present, show interactive Framing & Resizing Studio Panel */
              <div style={{ borderRadius: 16, border: '1px solid #E2DACD', backgroundColor: '#F9F7F3', padding: 16, marginTop: 4 }}>
                
                {/* Header with Title and Reset Framing */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, paddingBottom: 12, marginBottom: 14, borderBottom: '1px solid #EAE3D6' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: '#EDE6DC', border: '1px solid #DDD5C9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2A2621' }}>
                      <Crop size={14} />
                    </div>
                    <div>
                      <div style={{ fontSize: 12.5, fontWeight: 600, color: '#181818', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span>Image Resizing &amp; Framing Controls</span>
                        <span style={{ padding: '2px 7px', borderRadius: 999, backgroundColor: '#EBE4D8', color: '#6E675D', fontSize: 9, fontFamily: 'monospace' }}>
                          Banner Simulation
                        </span>
                      </div>
                      <div style={{ fontSize: 11, color: '#7A7367', marginTop: 2 }}>
                        Scale, zoom and drag focal position to customize how this photo appears in public ribbons and banners.
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleResetFraming}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 5,
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

                {useDirectUrl && (
                  <div style={{ marginTop: 12 }}>
                    <InputField icon={Link2} placeholder="https://..." value={directCoverUrl} onChange={(e) => setDirectCoverUrl(e.target.value)} type="url" />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── 2. Category Title ── */}
          <div style={styles.fieldGap}>
            <label style={styles.label}>Category Title <span style={{ color: '#EF4444' }}>*</span></label>
            <InputField icon={Type} value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          {/* ── 3. Tagline ── */}
          <div style={styles.fieldGap}>
            <label style={styles.label}>Tagline (Short Summary)</label>
            <InputField icon={PenLine} placeholder="e.g. Intimate moments and joyous new beginnings." value={tagline} onChange={(e) => setTagline(e.target.value)} />
          </div>

          {/* ── 4. Quote ── */}
          <div style={styles.fieldGap}>
            <label style={styles.label}>Quote / Editorial Note</label>
            <InputField icon={Quote} placeholder="e.g. Life celebrated in every quiet frame." value={quote} onChange={(e) => setQuote(e.target.value)} />
          </div>

          {/* ── 5. Medium + Location ── */}
          <div style={{ ...styles.twoCol, marginBottom: 16 }}>
            <div>
              <label style={styles.label}>Medium / Gear (Optional)</label>
              <InputField icon={Camera} placeholder="e.g. Leica M11 · 35mm Summilux" value={medium} onChange={(e) => setMedium(e.target.value)} />
            </div>
            <div>
              <label style={styles.label}>Location (Optional)</label>
              <InputField icon={MapPin} placeholder="e.g. Mumbai & Private Studios" value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>
          </div>

          {/* ── Footer ── */}
          <div style={styles.footer}>
            <button
              type="button" onClick={onClose} disabled={submitting}
              style={styles.cancelBtn}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F0EBE3'; e.currentTarget.style.color = '#1C1917'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#5C5852'; }}
            >
              Cancel
            </button>
            <button type="submit" disabled={submitting} style={{ ...styles.submitBtn, opacity: submitting ? 0.5 : 1 }}>
              {submitting ? (
                <>
                  <span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.6s linear infinite', display: 'inline-block' }} />
                  <span>Saving…</span>
                </>
              ) : (
                <>
                  <span>Save Changes</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
