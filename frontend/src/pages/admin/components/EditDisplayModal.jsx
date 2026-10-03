import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, ZoomIn, ZoomOut, RotateCcw, Check, Move, Maximize2, Minimize2, Eye, Sparkles } from 'lucide-react';
import { getApiUrl } from '../../../utils/api';
import { useAdminAuth } from '../context/AdminAuthContext';
import { DEFAULT_DISPLAY, getFramingStyle } from '../../../utils/mediaFraming';
import '../AdminDashboard.css';

const ASPECT_RATIOS = [
  { id: 'master', label: 'Master Frame (16:10.8)', ratio: '16 / 10.8', class: 'aspect-[16/10.8]' },
  { id: 'thumb', label: 'Gallery Grid (4:3)', ratio: '4 / 3', class: 'aspect-[4/3]' },
  { id: 'ribbon', label: 'Category Card (3:4)', ratio: '3 / 4', class: 'aspect-[3/4]' },
];

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

export default function EditDisplayModal({
  isOpen,
  mediaItem,
  onClose,
  onSuccess,
}) {
  const { getAuthHeaders } = useAdminAuth();

  const [fit, setFit] = useState('cover');
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [zoom, setZoom] = useState(1);
  const [activeAspect, setActiveAspect] = useState('master');
  const [showFocalCrosshair, setShowFocalCrosshair] = useState(true);

  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [error, setError] = useState('');

  // Dragging state
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ startX: 0, startY: 0, initialPosX: 50, initialPosY: 50 });
  const previewBoxRef = useRef(null);

  // Initialize display settings when modal opens or item changes
  useEffect(() => {
    if (isOpen && mediaItem) {
      const existing = mediaItem.display || DEFAULT_DISPLAY;
      setFit(existing.fit === 'contain' || existing.fit === 'fit' ? 'contain' : 'cover');
      setPosition({
        x: typeof existing.position?.x === 'number' ? existing.position.x : 50,
        y: typeof existing.position?.y === 'number' ? existing.position.y : 50,
      });
      setZoom(typeof existing.zoom === 'number' && existing.zoom >= 1 ? existing.zoom : 1);
      setError('');
      setSaveStatus('');
      setSaving(false);
    }
  }, [isOpen, mediaItem]);

  // Handle Dragging to adjust position
  const handleDragStart = (clientX, clientY) => {
    setIsDragging(true);
    dragStartRef.current = {
      startX: clientX,
      startY: clientY,
      initialPosX: position.x,
      initialPosY: position.y,
    };
  };

  const handleDragMove = useCallback((clientX, clientY) => {
    if (!isDragging || !previewBoxRef.current) return;
    const rect = previewBoxRef.current.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    // Inverting drag movement so pulling down moves the image down (revealing top)
    const deltaX = clientX - dragStartRef.current.startX;
    const deltaY = clientY - dragStartRef.current.startY;

    // Multiplier adjusted by zoom for natural tactile feel
    const sensitivity = (100 / rect.width) * (1 / Math.max(1, zoom * 0.7));

    let nextX = dragStartRef.current.initialPosX - deltaX * sensitivity;
    let nextY = dragStartRef.current.initialPosY - deltaY * sensitivity;

    nextX = Math.max(0, Math.min(100, Math.round(nextX * 10) / 10));
    nextY = Math.max(0, Math.min(100, Math.round(nextY * 10) / 10));

    setPosition({ x: nextX, y: nextY });
  }, [isDragging, zoom]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Global mouse/touch up listeners during active drag
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

  if (!isOpen || !mediaItem) return null;

  const currentDisplay = { fit, position, zoom };
  const currentRatioObj = ASPECT_RATIOS.find((r) => r.id === activeAspect) || ASPECT_RATIOS[0];
  const isVideo = mediaItem.type === 'video';
  const mediaUrl = getApiUrl(mediaItem.url || mediaItem.image);

  // Reset to default standard framing
  const handleReset = () => {
    setFit(DEFAULT_DISPLAY.fit);
    setPosition({ ...DEFAULT_DISPLAY.position });
    setZoom(DEFAULT_DISPLAY.zoom);
    setError('');
  };

  // Preset button click
  const handlePresetSelect = (preset) => {
    setPosition({ x: preset.x, y: preset.y });
  };

  // Zoom adjustments
  const handleZoomChange = (e) => {
    const val = parseFloat(e.target.value);
    setZoom(Math.round(val * 100) / 100);
  };

  const handleZoomStep = (delta) => {
    setZoom((prev) => Math.max(1, Math.min(2.0, Math.round((prev + delta) * 10) / 10)));
  };

  // Save display framing settings
  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSaveStatus('');

    try {
      const targetId = mediaItem._id || mediaItem.id || mediaItem.baselineId;
      const headers = {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      };

      const payload = {
        display: {
          fit,
          position: {
            x: Math.round(position.x * 10) / 10,
            y: Math.round(position.y * 10) / 10,
          },
          zoom: Math.round(zoom * 100) / 100,
        },
        url: mediaItem.url || mediaItem.image,
        type: mediaItem.type || 'photo',
        category: mediaItem.category || 'weddings',
        title: mediaItem.title || '',
        caption: mediaItem.caption || '',
        meta: mediaItem.meta || '',
      };

      const res = await fetch(`/api/media/${targetId}/display`, {
        method: 'PATCH',
        headers,
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorJson = await res.json().catch(() => null);
        throw new Error(errorJson?.message || `Server responded with ${res.status}`);
      }

      const json = await res.json();
      setSaveStatus('Display settings saved successfully');

      if (onSuccess) {
        onSuccess(json.data || { ...mediaItem, display: payload.display });
      }

      setTimeout(() => {
        onClose();
      }, 350);
    } catch (err) {
      console.error('Failed to save display framing:', err);
      setError(err.message || 'Failed to save framing settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Computed framing styles for the preview element
  const imageFramingStyle = getFramingStyle(currentDisplay);

  return (
    <div className="admin-modal-overlay">
      <div
        className="admin-modal-container max-w-[1040px] w-[95vw] max-h-[92vh] flex flex-col overflow-hidden"
        style={{
          borderRadius: '16px',
          boxShadow: '0 30px 70px -15px rgba(20, 18, 15, 0.35)',
          border: '1px solid #E2DACD',
          backgroundColor: '#FAF8F5',
        }}
      >
        {/* ─── Header ─── */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-[#E8E2D6] bg-white/70 backdrop-blur-xs shrink-0">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="text-[10px] tracking-[0.2em] uppercase font-mono font-semibold text-[#8E887E]">
                DISPLAY &amp; FRAMING CONTROLS
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#101010]" />
              <span className="text-[11px] font-sans font-medium text-[#5C5852] truncate max-w-[280px]">
                {mediaItem.title || `${mediaItem.category || 'Collection'} specimen`}
              </span>
            </div>
            <h3 className="font-serif text-[22px] sm:text-[24px] font-normal text-[#181818] leading-tight mt-0.5">
              Edit Public Display
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#7A756D] hover:text-[#181818] hover:bg-[#EFEAE2] transition-colors cursor-pointer"
              title="Close editor"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* ─── Modal Body: 2-Column Responsive Layout ─── */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 lg:p-7">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-8 items-start">

            {/* ─── LEFT: Live Public-Frame Preview (7 Cols) ─── */}
            <div className="lg:col-span-7 flex flex-col gap-3.5">
              {/* Aspect Ratio Switcher Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-[11px] font-mono tracking-[0.14em] uppercase text-[#7A756D] flex items-center gap-1.5">
                  <Eye size={12} />
                  <span>PUBLIC FRAME SIMULATOR</span>
                </span>

                <div className="flex items-center gap-1 bg-[#ECE7DC]/80 p-0.5 rounded-lg border border-[#E0D8CA]">
                  {ASPECT_RATIOS.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setActiveAspect(r.id)}
                      className={`text-[11px] font-sans px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                        activeAspect === r.id
                          ? 'bg-white text-[#181818] font-semibold shadow-xs'
                          : 'text-[#6B655B] hover:text-[#181818]'
                      }`}
                    >
                      {r.id === 'master' ? 'Master (16:10)' : r.id === 'thumb' ? 'Thumb (4:3)' : 'Card (3:4)'}
                    </button>
                  ))}
                </div>
              </div>

              {/* The Live Interactive Preview Frame Container */}
              <div className="relative w-full rounded-xl overflow-hidden bg-[#ECE7DC] border border-[#DDD5C7] shadow-[0_12px_32px_-10px_rgba(20,18,15,0.12)] p-2 sm:p-3">
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
                  className={`relative w-full ${currentRatioObj.class} overflow-hidden rounded-lg select-none transition-shadow ${
                    isDragging ? 'cursor-grabbing ring-2 ring-[#101010]' : 'cursor-grab'
                  }`}
                  style={{
                    backgroundColor: fit === 'contain' ? '#FAF8F5' : '#141414',
                  }}
                  title="Click and drag to position image"
                >
                  {/* The Framed Media Element */}
                  {isVideo ? (
                    <video
                      src={mediaUrl}
                      muted
                      loop
                      playsInline
                      autoPlay
                      className="w-full h-full pointer-events-none select-none transition-transform duration-100 ease-out"
                      style={imageFramingStyle}
                    />
                  ) : (
                    <img
                      src={mediaUrl}
                      alt="Framing preview"
                      draggable={false}
                      className="w-full h-full pointer-events-none select-none transition-transform duration-100 ease-out"
                      style={imageFramingStyle}
                    />
                  )}

                  {/* Focal Point Indicator Crosshair Overlay */}
                  {showFocalCrosshair && (
                    <div
                      className="absolute pointer-events-none transition-all duration-75 z-20"
                      style={{
                        left: `${position.x}%`,
                        top: `${position.y}%`,
                        transform: 'translate(-50%, -50%)',
                      }}
                    >
                      {/* Subtle editorial circular target */}
                      <div className="w-8 h-8 rounded-full border-2 border-white/90 shadow-[0_0_8px_rgba(0,0,0,0.6)] flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white shadow-xs" />
                      </div>
                    </div>
                  )}

                  {/* Drag Gesture Floating Hint Tag */}
                  <div className="absolute top-2.5 right-2.5 pointer-events-none z-30">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xs text-white text-[10px] font-mono tracking-wider shadow-sm">
                      <Move size={10} />
                      <span>DRAG TO RE-CENTER</span>
                    </span>
                  </div>

                  {/* Aspect Ratio Badge */}
                  <div className="absolute bottom-2.5 left-2.5 pointer-events-none z-30">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/85 backdrop-blur-xs text-[#181818] text-[9.5px] font-mono font-medium shadow-xs">
                      {currentRatioObj.label}
                    </span>
                  </div>
                </div>

                {/* Interactive helper row under preview */}
                <div className="mt-2.5 flex items-center justify-between text-[11px] text-[#7A756D] px-1 font-sans">
                  <span>
                    Focal position: <strong className="font-mono text-[#181818]">X: {Math.round(position.x)}%</strong>, <strong className="font-mono text-[#181818]">Y: {Math.round(position.y)}%</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowFocalCrosshair(!showFocalCrosshair)}
                    className="hover:text-[#181818] transition-colors underline cursor-pointer"
                  >
                    {showFocalCrosshair ? 'Hide focal crosshair' : 'Show focal crosshair'}
                  </button>
                </div>
              </div>
            </div>

            {/* ─── RIGHT: Framing & Display Controls (5 Cols) ─── */}
            <div className="lg:col-span-5 flex flex-col gap-5 bg-white p-5 sm:p-6 rounded-xl border border-[#E8E2D6] shadow-xs">
              
              {/* 1. Fit Mode Toggle */}
              <div>
                <label className="block text-[11px] font-mono tracking-[0.16em] uppercase text-[#7A756D] font-medium mb-2">
                  FIT MODE
                </label>
                <div className="grid grid-cols-2 gap-2 bg-[#F6F3EC] p-1 rounded-lg border border-[#E4DDD1]">
                  <button
                    type="button"
                    onClick={() => setFit('cover')}
                    className={`py-2 px-3 rounded-md text-[12px] font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      fit === 'cover'
                        ? 'bg-[#101010] text-white shadow-xs font-semibold'
                        : 'text-[#5C5852] hover:text-[#181818]'
                    }`}
                  >
                    <Maximize2 size={13} />
                    <span>COVER (Fill)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFit('contain')}
                    className={`py-2 px-3 rounded-md text-[12px] font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      fit === 'contain'
                        ? 'bg-[#101010] text-white shadow-xs font-semibold'
                        : 'text-[#5C5852] hover:text-[#181818]'
                    }`}
                  >
                    <Minimize2 size={13} />
                    <span>FIT (Contain)</span>
                  </button>
                </div>
                <p className="text-[11px] text-[#8E887E] mt-1.5">
                  {fit === 'cover'
                    ? 'Fills frame seamlessly. Adjust position/zoom below to safeguard faces.'
                    : 'Shows entire image without cropping against warm neutral background.'}
                </p>
              </div>

              {/* 2. Position 3x3 Presets Matrix */}
              <div>
                <div className="flex items-baseline justify-between mb-2">
                  <label className="text-[11px] font-mono tracking-[0.16em] uppercase text-[#7A756D] font-medium">
                    POSITION PRESETS
                  </label>
                  <span className="text-[10px] text-[#8E887E]">9 focal points</span>
                </div>

                <div className="grid grid-cols-3 gap-1.5 bg-[#FAF8F5] p-2 rounded-lg border border-[#E8E2D6]">
                  {PRESETS.map((preset) => {
                    const isSelected =
                      Math.abs(position.x - preset.x) < 5 && Math.abs(position.y - preset.y) < 5;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handlePresetSelect(preset)}
                        className={`h-9 rounded-md text-[12px] font-mono font-medium transition-all flex items-center justify-center gap-1 cursor-pointer border ${
                          isSelected
                            ? 'bg-[#101010] text-white border-[#101010] shadow-xs'
                            : 'bg-white text-[#4A463F] border-[#E2DACD] hover:bg-[#F2ECE1] hover:border-[#CFC5B4]'
                        }`}
                        title={preset.label}
                      >
                        <span className="text-[13px]">{preset.symbol}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Zoom Slider */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[11px] font-mono tracking-[0.16em] uppercase text-[#7A756D] font-medium">
                    ZOOM
                  </label>
                  <span className="font-mono text-[12px] font-semibold text-[#181818] bg-[#F5EFE6] px-2 py-0.5 rounded-sm">
                    {zoom.toFixed(2)}x
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleZoomStep(-0.1)}
                    disabled={zoom <= 1.0}
                    className="w-8 h-8 rounded-full border border-[#DCD3C4] bg-white flex items-center justify-center text-[#5C5852] hover:bg-[#F2ECE1] hover:text-[#181818] disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer transition-colors shrink-0"
                    title="Zoom out"
                  >
                    <ZoomOut size={14} />
                  </button>

                  <input
                    type="range"
                    min="1.0"
                    max="2.0"
                    step="0.02"
                    value={zoom}
                    onChange={handleZoomChange}
                    className="w-full h-1.5 bg-[#E4DDD1] rounded-lg appearance-none cursor-pointer accent-[#101010]"
                  />

                  <button
                    type="button"
                    onClick={() => handleZoomStep(0.1)}
                    disabled={zoom >= 2.0}
                    className="w-8 h-8 rounded-full border border-[#DCD3C4] bg-white flex items-center justify-center text-[#5C5852] hover:bg-[#F2ECE1] hover:text-[#181818] disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer transition-colors shrink-0"
                    title="Zoom in"
                  >
                    <ZoomIn size={14} />
                  </button>
                </div>
              </div>

              {/* Status / Error Messages */}
              {error && (
                <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-[12px]">
                  {error}
                </div>
              )}
              {saveStatus && (
                <div className="p-2.5 rounded-lg bg-green-50 border border-green-200 text-green-700 text-[12px] flex items-center gap-1.5">
                  <Check size={14} />
                  <span>{saveStatus}</span>
                </div>
              )}

              {/* 4. Action Buttons (Reset, Cancel, Save Display) */}
              <div className="pt-2 border-t border-[#E8E2D6] flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full py-3 px-5 rounded-lg bg-[#101010] hover:bg-[#2A2A2A] text-white text-[13px] font-semibold tracking-wide transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <span>Saving Framing Settings...</span>
                  ) : (
                    <>
                      <Sparkles size={14} />
                      <span>SAVE DISPLAY</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleReset}
                    disabled={saving}
                    className="flex-1 py-2 px-3 rounded-lg border border-[#DCD3C4] text-[#5C5852] hover:text-[#181818] hover:bg-[#F5EFE6] text-[12px] font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw size={12} />
                    <span>RESET</span>
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    disabled={saving}
                    className="flex-1 py-2 px-3 rounded-lg border border-transparent text-[#7A756D] hover:text-[#181818] hover:bg-[#EFEAE2] text-[12px] font-medium transition-colors cursor-pointer"
                  >
                    CANCEL
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
