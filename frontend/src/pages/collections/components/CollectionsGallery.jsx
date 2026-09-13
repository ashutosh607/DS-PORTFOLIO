import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';

export default function CollectionsGallery({
  activeCategory,
  onPrevCategory,
  onNextCategory,
  galleryRef,
}) {
  // All media items for this collection (featured + supporting + dynamic uploads)
  const allMedia = activeCategory.allMedia || [
    activeCategory.featured,
    ...activeCategory.supporting,
  ];

  // Divide allMedia into slides of 5 photos each (1 large + up to 4 thumbnails)
  const slides = [];
  for (let i = 0; i < allMedia.length; i += 5) {
    const chunk = allMedia.slice(i, i + 5);
    slides.push({
      slideIndex: Math.floor(i / 5),
      startIndex: i,
      endIndex: Math.min(i + 5, allMedia.length),
      featured: chunk[0],
      supporting: chunk.slice(1),
    });
  }

  // Active slide index (0 to slides.length - 1)
  const [currentSlide, setCurrentSlide] = useState(0);

  // Selected media map to allow in-place preview update on any slide
  const [selectedMediaMap, setSelectedMediaMap] = useState({});

  // Reset slide and selections when category changes
  useEffect(() => {
    setCurrentSlide(0);
    setSelectedMediaMap({});
  }, [activeCategory.id]);

  // Gallery drag gesture tracking
  const galleryDragStartX = useRef(0);
  const isGalleryDragging = useRef(false);
  const galleryHasDragged = useRef(false);

  // Slider track and thumb refs
  const trackRef = useRef(null);
  const isDraggingThumb = useRef(false);

  // Current active slide data
  const activeSlide = slides[currentSlide] || slides[0];

  // Active featured media for the current slide
  const currentFeatured =
    selectedMediaMap[currentSlide] || activeSlide?.featured || activeCategory.featured;

  // Active item index in total collection
  const currentTotalIndex = allMedia.findIndex(
    (item) =>
      (item.id && currentFeatured?.id && item.id === currentFeatured.id) ||
      item.image === currentFeatured?.image
  );
  const displayIndex = currentTotalIndex >= 0 ? currentTotalIndex + 1 : 1;
  const totalCount = allMedia.length;

  // Slider progress percent (0 to 100%)
  const sliderPercent =
    slides.length > 1 ? (currentSlide / (slides.length - 1)) * 100 : 0;

  // Navigation functions
  const handlePrevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  const handleNextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    }
  };

  // Gallery Mouse Drag Handler
  const handleGalleryMouseDown = (e) => {
    if (e.button !== 0) return;
    isGalleryDragging.current = true;
    galleryHasDragged.current = false;
    galleryDragStartX.current = e.clientX;
  };

  // Gallery Touch Handlers for Mobile
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      isGalleryDragging.current = true;
      galleryHasDragged.current = false;
      galleryDragStartX.current = e.touches[0].clientX;
    }
  };

  const handleTouchEnd = (e) => {
    if (!isGalleryDragging.current) return;
    isGalleryDragging.current = false;
    const endX = e.changedTouches[0]?.clientX || 0;
    const delta = endX - galleryDragStartX.current;
    if (delta < -45 && currentSlide < slides.length - 1) {
      handleNextSlide();
    } else if (delta > 45 && currentSlide > 0) {
      handlePrevSlide();
    }
  };

  // Global mousemove & mouseup for gallery and slider thumb dragging
  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      if (isGalleryDragging.current) {
        const delta = e.clientX - galleryDragStartX.current;
        if (Math.abs(delta) > 10) {
          galleryHasDragged.current = true;
        }
      }

      if (isDraggingThumb.current && trackRef.current && slides.length > 1) {
        const rect = trackRef.current.getBoundingClientRect();
        const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
        const targetSlide = Math.round(ratio * (slides.length - 1));
        if (targetSlide !== currentSlide) {
          setCurrentSlide(targetSlide);
        }
      }
    };

    const handleGlobalMouseUp = (e) => {
      if (isGalleryDragging.current) {
        isGalleryDragging.current = false;
        const delta = e.clientX - galleryDragStartX.current;
        if (delta < -50 && currentSlide < slides.length - 1) {
          handleNextSlide();
        } else if (delta > 50 && currentSlide > 0) {
          handlePrevSlide();
        }
      }
      isDraggingThumb.current = false;
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [currentSlide, slides.length]);

  // Click on slider track to scrub
  const handleTrackClick = (e) => {
    if (!trackRef.current || slides.length <= 1) return;
    const rect = trackRef.current.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    const targetSlide = Math.round(ratio * (slides.length - 1));
    setCurrentSlide(targetSlide);
  };

  // Slider thumb mouse down
  const handleThumbMouseDown = (e) => {
    e.stopPropagation();
    isDraggingThumb.current = true;
  };

  // Select photo in current slide
  const handleSelectPhotoInSlide = (slideIndex, item) => {
    if (galleryHasDragged.current) return;
    setSelectedMediaMap((prev) => ({
      ...prev,
      [slideIndex]: item,
    }));
  };

  return (
    <section
      ref={galleryRef}
      id="collection-gallery-detail"
      className="relative w-full [scroll-margin-top:100px]"
      style={{
        paddingTop: 'clamp(2rem, 3.5vw, 3rem)',
        paddingBottom: 'clamp(4rem, 6vw, 6rem)',
      }}
    >
      <div className="container mx-auto px-6 sm:px-10 md:px-12 max-w-[1260px] relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* ─── Header: Category Title & Frame Count (Replaces "VIEW ALL →") ─── */}
            <div
              className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-5 border-b border-[#E2DACD]"
              style={{
                marginBottom: 'clamp(1.75rem, 3vw, 2.5rem)',
              }}
            >
              <div>
                <div className="flex items-center gap-4 mb-2">
                  <span
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.25rem',
                      color: '#101010',
                      fontWeight: 400,
                    }}
                  >
                    {activeCategory.id}
                  </span>
                  <span
                    className="h-[1px] bg-[#D1C8B8]"
                    style={{
                      width: 'clamp(36px, 5vw, 64px)',
                    }}
                  />
                  <h2
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: 'clamp(2.4rem, 4vw, 3.25rem)',
                      fontWeight: 400,
                      color: '#141414',
                      lineHeight: 1,
                    }}
                  >
                    {activeCategory.name}
                  </h2>
                </div>

                <p
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: 'clamp(0.875rem, 1vw, 0.975rem)',
                    color: '#5C5852',
                    maxWidth: '480px',
                  }}
                >
                  {activeCategory.tagline}
                </p>
              </div>

              {/* Minimal Frame Count Indicator */}
              <div className="flex items-center gap-3 font-mono text-[0.72rem] tracking-[0.2em] uppercase text-[#7A756D]">
                <span className="w-2 h-2 rounded-full bg-[#101010]/35 inline-block" />
                <span>
                  {displayIndex < 10 ? `0${displayIndex}` : displayIndex}—
                  {totalCount < 10 ? `0${totalCount}` : totalCount} / {totalCount} FRAMES
                </span>
              </div>
            </div>

            {/* ─── SLIDING GALLERY WRAPPER (This slide moves horizontally!) ─── */}
            <div
              className="relative w-full overflow-hidden select-none cursor-grab active:cursor-grabbing"
              onMouseDown={handleGalleryMouseDown}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <motion.div
                animate={{ x: `-${currentSlide * 100}%` }}
                transition={{ type: 'spring', stiffness: 260, damping: 28 }}
                className="flex w-full"
              >
                {slides.map((slide, sIdx) => {
                  const activeFeaturedInThisSlide =
                    selectedMediaMap[sIdx] || slide.featured;

                  return (
                    <div
                      key={sIdx}
                      className="w-full shrink-0 grid grid-cols-1 lg:[grid-template-columns:7fr_5fr] items-start"
                      style={{
                        gap: 'clamp(1.75rem, 3vw, 3rem)',
                        paddingRight: sIdx < slides.length - 1 ? '16px' : '0',
                      }}
                    >
                      {/* LEFT: Large Master Hero Photograph */}
                      <div>
                        <div className="group relative w-full aspect-[16/10.5] rounded-[4px] overflow-hidden bg-[#1D1C19] border border-[#E0D8CA] shadow-[0_20px_45px_-12px_rgba(20,18,15,0.16)]">
                          <AnimatePresence mode="wait">
                            <motion.div
                              key={activeFeaturedInThisSlide?.image || activeFeaturedInThisSlide?.id}
                              initial={{ opacity: 0.5 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0.5 }}
                              transition={{ duration: 0.28, ease: 'easeOut' }}
                              className="w-full h-full"
                            >
                              {activeFeaturedInThisSlide?.type === 'video' ? (
                                <video
                                  src={activeFeaturedInThisSlide.image}
                                  className="w-full h-full object-cover object-center filter brightness-[0.98] contrast-[1.02]"
                                  autoPlay
                                  muted
                                  loop
                                  playsInline
                                />
                              ) : (
                                <img
                                  src={activeFeaturedInThisSlide?.image}
                                  alt={activeFeaturedInThisSlide?.title || activeFeaturedInThisSlide?.tag}
                                  className="w-full h-full object-cover object-center filter brightness-[0.98] contrast-[1.02] group-hover:scale-[1.015] transition-transform duration-700 ease-out"
                                  loading="lazy"
                                />
                              )}
                            </motion.div>
                          </AnimatePresence>

                          {/* Gradient Overlay at Bottom */}
                          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(16,16,16,0.85)] via-[rgba(16,16,16,0.2)] to-transparent pointer-events-none" />

                          {/* Bottom Metadata inside Master Frame */}
                          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 flex items-end justify-between text-white pointer-events-none">
                            {/* Left: Frame Badge */}
                            <div className="flex items-center gap-2.5 bg-[rgba(16,16,16,0.65)] backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20">
                              <span className="w-4.5 h-4.5 rounded-full border border-white/40 flex items-center justify-center font-mono text-[0.55rem] text-white">
                                {activeCategory.id}
                              </span>
                              <span className="font-mono text-[0.62rem] tracking-[0.16em] text-white/95">
                                {displayIndex < 10 ? `0${displayIndex}` : displayIndex} /{' '}
                                {totalCount < 10 ? `0${totalCount}` : totalCount}
                              </span>
                              <span className="w-8 h-[1.5px] bg-white/30 relative overflow-hidden rounded-full">
                                <span
                                  className="absolute left-0 top-0 bottom-0 bg-white transition-all duration-300"
                                  style={{ width: `${(displayIndex / totalCount) * 100}%` }}
                                />
                              </span>
                            </div>

                            {/* Right: Caption / Title */}
                            <p
                              style={{
                                fontFamily: 'var(--font-serif)',
                                fontStyle: 'italic',
                                fontSize: 'clamp(0.9rem, 1.2vw, 1.15rem)',
                                color: '#FFFFFF',
                                textShadow: '0 2px 6px rgba(0,0,0,0.6)',
                                maxWidth: '380px',
                              }}
                              className="hidden sm:block truncate text-right"
                            >
                              {activeFeaturedInThisSlide?.caption ||
                                activeFeaturedInThisSlide?.title ||
                                activeCategory.quote}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* RIGHT: Supporting Photographs in 2x2 Grid (Clicking updates master frame) */}
                      <div
                        className="grid grid-cols-2"
                        style={{
                          gap: 'clamp(14px, 1.8vw, 22px)',
                        }}
                      >
                        {slide.supporting.map((item, idx) => {
                          const isCurrent =
                            (item.id && activeFeaturedInThisSlide?.id && item.id === activeFeaturedInThisSlide.id) ||
                            item.image === activeFeaturedInThisSlide?.image;
                          const globalIdx = slide.startIndex + idx + 1;

                          return (
                            <motion.div
                              key={item.id || idx}
                              initial={{ opacity: 0, y: 12 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.4, delay: 0.05 + idx * 0.04 }}
                              whileHover={{ scale: 1.02 }}
                              onClick={() => handleSelectPhotoInSlide(sIdx, item)}
                              className={`group relative bg-white rounded-[4px] border overflow-hidden cursor-pointer transition-all duration-300 ${
                                isCurrent
                                  ? 'border-[#101010] ring-2 ring-[#101010]/90 shadow-[0_16px_32px_-8px_rgba(20,18,15,0.22)] -translate-y-1'
                                  : 'border-[#E2DACD] shadow-[0_10px_24px_-8px_rgba(20,18,15,0.08)] hover:-translate-y-1 hover:shadow-[0_16px_32px_-10px_rgba(20,18,15,0.15)]'
                              }`}
                              style={{
                                padding: 'clamp(6px, 0.8vw, 8px)',
                              }}
                            >
                              <div className="relative w-full aspect-[4/3] overflow-hidden rounded-[2px] bg-[#ECE7DC]">
                                {item.type === 'video' ? (
                                  <video
                                    src={item.image}
                                    className="w-full h-full object-cover object-center filter brightness-[0.98] contrast-[1.02]"
                                    muted
                                    loop
                                    playsInline
                                    onMouseEnter={(e) => e.target.play().catch(() => {})}
                                    onMouseLeave={(e) => e.target.pause()}
                                  />
                                ) : (
                                  <img
                                    src={item.image}
                                    alt={item.tag}
                                    className="w-full h-full object-cover object-center filter brightness-[0.98] contrast-[1.02] group-hover:scale-105 transition-transform duration-500 ease-out"
                                    loading="lazy"
                                  />
                                )}

                                {/* Video Indicator */}
                                {item.type === 'video' && (
                                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-black/60 backdrop-blur-xs flex items-center justify-center text-white">
                                    <Play size={9} fill="white" className="ml-0.5" />
                                  </div>
                                )}

                                {/* Subtle hover overlay */}
                                <div className="absolute inset-0 bg-[rgba(16,16,16,0.65)] backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-2.5 sm:p-3 text-white">
                                  <span className="font-mono text-[0.55rem] tracking-[0.16em] uppercase text-[#E3DBCC]">
                                    Frame {globalIdx < 10 ? `0${globalIdx}` : globalIdx} /{' '}
                                    {totalCount < 10 ? `0${totalCount}` : totalCount}
                                  </span>
                                  <p
                                    style={{
                                      fontFamily: 'var(--font-serif)',
                                      fontSize: '0.8rem',
                                      lineHeight: 1.25,
                                    }}
                                    className="mt-0.5 line-clamp-2 text-white/95"
                                  >
                                    {item.tag || item.title}
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            </div>

            {/* ─── HORIZONTAL DRAGGABLE SLIDER BAR BELOW THE GALLERY ─── */}
            <div className="mt-8 sm:mt-10 pt-6 border-t border-[#E2DACD]">
              {/* Controls Header */}
              <div className="flex items-center justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[0.7rem] tracking-[0.2em] uppercase text-[#141414] font-semibold">
                    COLLECTION ARCHIVE
                  </span>
                  <span className="text-[#C5BCAB] text-[0.75rem]">/</span>
                  <span className="font-mono text-[0.68rem] tracking-[0.15em] uppercase text-[#7A756D]">
                    {activeCategory.name}
                  </span>
                  <span className="font-mono text-[0.62rem] tracking-[0.14em] text-[#5C5852] bg-[#EBE4D8] px-2.5 py-0.5 rounded-full font-medium">
                    SLIDE {currentSlide + 1} OF {slides.length} · {totalCount} SPECIMENS
                  </span>
                </div>

                {/* Right controls: Prev / Next Buttons + Drag notice */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handlePrevSlide}
                      disabled={currentSlide === 0}
                      className="w-7 h-7 rounded-full border border-[#D5CDBC] bg-white flex items-center justify-center text-[12px] text-[#101010] hover:bg-[#101010] hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                      title="Previous photo set"
                      aria-label="Previous photo set"
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      onClick={handleNextSlide}
                      disabled={currentSlide === slides.length - 1}
                      className="w-7 h-7 rounded-full border border-[#D5CDBC] bg-white flex items-center justify-center text-[12px] text-[#101010] hover:bg-[#101010] hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                      title="Next photo set"
                      aria-label="Next photo set"
                    >
                      →
                    </button>
                  </div>

                  <div className="hidden sm:flex items-center gap-2 font-mono text-[0.68rem] tracking-[0.22em] uppercase text-[#7A756D]">
                    <span>DRAG TO SLIDE</span>
                    <span className="text-[#101010] font-bold">──→</span>
                  </div>
                </div>
              </div>

              {/* Draggable Minimal Slider Bar: [───────●────────] */}
              <div
                ref={trackRef}
                onClick={handleTrackClick}
                className="relative w-full h-7 flex items-center cursor-pointer select-none py-2"
                title="Click or drag thumb to slide between collection photos"
              >
                {/* Track Line */}
                <div className="w-full h-[2px] bg-[#DCD4C7] rounded-full relative overflow-visible">
                  {/* Progress Fill */}
                  <div
                    className="absolute left-0 top-0 bottom-0 bg-[#101010] rounded-full transition-all duration-150"
                    style={{ width: `${sliderPercent}%` }}
                  />
                </div>

                {/* Draggable Slider Thumb */}
                <div
                  onMouseDown={handleThumbMouseDown}
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#101010] border-2 border-[#F6F3EC] shadow-md cursor-grab active:cursor-grabbing hover:scale-125 transition-transform"
                  style={{
                    left: `calc(${sliderPercent}% - 8px)`,
                  }}
                />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
