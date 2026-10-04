import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Image as ImageIcon } from 'lucide-react';
import TextBlurReveal from '../../../components/common/TextBlurReveal';
import { getFramingStyle, getFramingContainerStyle } from '../../../utils/mediaFraming';

/**
 * Shared-element FLIP Flying Clone Component
 * Renders into document.body to ensure position:fixed is always relative to viewport.
 * Uses GPU-accelerated transforms (translate & scale) with counter-scale on the inner
 * image to preserve aspect-ratio without distortion.
 *
 * zIndex is set to 40 (strictly lower than the site navbar's zIndex: 1000) so it never
 * overlaps the navigation bar.
 * Initial transform is defined directly in inline styles so the element begins at the
 * exact thumbnail position on frame 0 with zero flash, overshoot, or black background.
 */
function FlipFlyingClone({ flipState, onFinish }) {
  const outerRef = useRef(null);
  const innerRef = useRef(null);

  const { masterRect, item, deltaX, deltaY, scaleX, scaleY, counterRatio } = flipState;

  useEffect(() => {
    if (!outerRef.current || !innerRef.current) return;

    const outerEl = outerRef.current;
    const innerEl = innerRef.current;

    // Outer animation: translate, scale, border-radius, shadow
    const outerAnim = outerEl.animate(
      [
        {
          transform: `translate(${deltaX}px, ${deltaY}px) scale(${scaleX}, ${scaleY})`,
          borderRadius: '2px',
          boxShadow: '0 8px 20px -4px rgba(20, 18, 15, 0.25)',
        },
        {
          transform: 'translate(0px, 0px) scale(1, 1)',
          borderRadius: '6px',
          boxShadow: '0 20px 45px -12px rgba(20, 18, 15, 0.16)',
        },
      ],
      {
        duration: 480,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
        fill: 'forwards',
      }
    );

    // Inner animation: counter-scale to prevent image distortion during aspect ratio transition
    const innerAnim = innerEl.animate(
      [
        {
          transform: `scale(${counterRatio}, 1)`,
        },
        {
          transform: 'scale(1, 1)',
        },
      ],
      {
        duration: 480,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
        fill: 'forwards',
      }
    );

    let finished = false;
    outerAnim.onfinish = () => {
      if (finished) return;
      finished = true;
      onFinish();
    };

    return () => {
      finished = true;
      try {
        outerAnim.cancel();
        innerAnim.cancel();
      } catch (err) { }
    };
  }, [deltaX, deltaY, scaleX, scaleY, counterRatio, onFinish]);

  return createPortal(
    <div
      ref={outerRef}
      style={{
        position: 'fixed',
        top: `${masterRect.top}px`,
        left: `${masterRect.left}px`,
        width: `${masterRect.width}px`,
        height: `${masterRect.height}px`,
        transformOrigin: 'top left',
        transform: `translate(${deltaX}px, ${deltaY}px) scale(${scaleX}, ${scaleY})`,
        borderRadius: '2px',
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 40, // STRICTLY below navbar (zIndex: 1000)
        backgroundColor: 'transparent', // Transparent, never solid black
        border: '1px solid #E0D8CA',
        willChange: 'transform, border-radius, box-shadow',
      }}
    >
      <div
        ref={innerRef}
        style={{
          width: '100%',
          height: '100%',
          transformOrigin: 'center center',
          transform: `scale(${counterRatio}, 1)`,
          backgroundColor: 'transparent',
          willChange: 'transform',
        }}
      >
        {item.type === 'video' ? (
          <video
            src={item.image}
            className="w-full h-full object-cover filter brightness-[0.98] contrast-[1.02]"
            style={getFramingStyle(item.display, { disableZoom: true })}
            autoPlay
            muted
            loop
            playsInline
          />
        ) : (
          <img
            src={item.image}
            alt=""
            className="w-full h-full object-cover filter brightness-[0.98] contrast-[1.02]"
            style={getFramingStyle(item.display, { disableZoom: true })}
            loading="eager"
            decoding="sync"
          />
        )}
      </div>

      {/* Subtle bottom gradient to blend seamlessly into master frame overlay upon landing */}
      <div className="absolute inset-0 bg-gradient-to-t from-[rgba(16,16,16,0.85)] via-[rgba(16,16,16,0.2)] to-transparent pointer-events-none" />
    </div>,
    document.body
  );
}

export default function CollectionsGallery({
  activeCategory,
  onPrevCategory,
  onNextCategory,
  galleryRef,
}) {
  // All media items for this collection (featured + supporting + dynamic uploads)
  const allMedia = activeCategory.allMedia || [
    activeCategory.featured,
    ...(activeCategory.supporting || []),
  ];

  // Selected item displayed in the large left master frame
  const [selectedItem, setSelectedItem] = useState(allMedia[0] || activeCategory.featured);

  // Outgoing item to fade out underneath in master frame while expanding
  const [outgoingItem, setOutgoingItem] = useState(null);
  const [isExpanding, setIsExpanding] = useState(false);

  // State for FLIP animation flying clone: { item, masterRect, thumbRect }
  const [flipState, setFlipState] = useState(null);

  // Refs for bounding box measurement and animation cancellation
  const masterFrameRef = useRef(null);
  const thumbnailRefs = useRef(new Map());
  const activeAnimRef = useRef(null);

  // Scroll container ref for right side
  const scrollContainerRef = useRef(null);

  // Reset selected item and scroll to top when category changes
  useEffect(() => {
    const firstItem = allMedia[0] || activeCategory.featured;
    if (activeAnimRef.current) {
      activeAnimRef.current.cancel();
      activeAnimRef.current = null;
    }
    setFlipState(null);
    setIsExpanding(false);
    setOutgoingItem(null);
    setSelectedItem(firstItem);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [activeCategory.id]);

  // Find index of selected item in the collection
  const selectedIndex = allMedia.findIndex(
    (item) =>
      (item.id && selectedItem?.id && item.id === selectedItem.id) ||
      item.image === selectedItem?.image
  );

  const displayIndex = selectedIndex >= 0 ? selectedIndex + 1 : 1;
  const totalCount = allMedia.length;

  const handleFlipFinish = useCallback(() => {
    activeAnimRef.current = null;
    setIsExpanding(false);
    setFlipState(null);
    setOutgoingItem(null);
  }, []);

  const handleThumbnailClick = (item, idx) => {
    const isCurrent =
      (item.id && selectedItem?.id && item.id === selectedItem.id) ||
      item.image === selectedItem?.image;

    // Already viewing this item
    if (isCurrent) return;

    // Accessibility: Respect prefers-reduced-motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      if (activeAnimRef.current) {
        activeAnimRef.current.cancel();
        activeAnimRef.current = null;
      }
      setFlipState(null);
      setIsExpanding(false);
      setOutgoingItem(null);
      setSelectedItem(item);
      return;
    }

    // Cancel any currently running animation cleanly
    if (activeAnimRef.current) {
      activeAnimRef.current.cancel();
      activeAnimRef.current = null;
    }

    const masterEl = masterFrameRef.current;
    const itemKey = item.id || `thumb-${idx}`;
    const thumbEl = thumbnailRefs.current.get(itemKey);

    if (!masterEl || !thumbEl) {
      setSelectedItem(item);
      return;
    }

    const masterRect = masterEl.getBoundingClientRect();
    const thumbRect = thumbEl.getBoundingClientRect();

    if (masterRect.width === 0 || thumbRect.width === 0) {
      setSelectedItem(item);
      return;
    }

    const deltaX = thumbRect.left - masterRect.left;
    const deltaY = thumbRect.top - masterRect.top;
    const scaleX = thumbRect.width / masterRect.width;
    const scaleY = thumbRect.height / masterRect.height;
    const counterRatio = scaleY / scaleX;

    const startFlip = () => {
      // Store outgoing item for underneath display during flight
      setOutgoingItem(selectedItem);
      // Update selected item immediately so frame counter and title update in sync
      setSelectedItem(item);
      setIsExpanding(true);

      activeAnimRef.current = {
        cancel: () => {
          setFlipState(null);
          setIsExpanding(false);
          setOutgoingItem(null);
        },
      };

      // Trigger FLIP animation with pre-computed transform geometry
      setFlipState({
        item,
        masterRect,
        thumbRect,
        deltaX,
        deltaY,
        scaleX,
        scaleY,
        counterRatio,
      });
    };

    // Ensure photo is fully loaded and decoded before starting animation
    if (item.type === 'video') {
      startFlip();
    } else {
      const img = new Image();
      img.src = item.image;
      if (img.complete && img.naturalWidth > 0) {
        startFlip();
      } else {
        img.onload = () => startFlip();
        img.onerror = () => startFlip();
      }
    }
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
      <div className="container mx-auto px-6 sm:px-10 md:px-12 max-w-[1280px] relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* ─── Header: Category Title & Frame Count ─── */}
            <div
              className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-5 border-b border-[#E2DACD]"
              style={{
                marginBottom: 'clamp(1.75rem, 3vw, 2.5rem)',
              }}
            >
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: 'clamp(2.4rem, 4vw, 3.25rem)',
                      fontWeight: 400,
                      color: '#141414',
                      lineHeight: 1,
                    }}
                  >
                    <TextBlurReveal text={activeCategory.name} delay={0.05} />
                  </h2>
                </div>

                <div
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: 'clamp(0.875rem, 1vw, 0.975rem)',
                    color: '#5C5852',
                    maxWidth: '520px',
                  }}
                >
                  <TextBlurReveal text={activeCategory.tagline} delay={0.15} />
                </div>
              </div>

              {/* Minimal Frame Count Indicator */}
              <div className="flex items-center gap-3 font-mono text-[0.72rem] tracking-[0.2em] uppercase text-[#7A756D]">
                <span className="w-2 h-2 rounded-full bg-[#101010]/40 inline-block animate-pulse" />
                <span>
                  {displayIndex < 10 ? `0${displayIndex}` : displayIndex}—
                  {totalCount < 10 ? `0${totalCount}` : totalCount} / {totalCount} FRAMES
                </span>
              </div>
            </div>

            {/* ─── MAIN SHOWCASE: Sticky Large Left Photo + Scrollable Right Grid ─── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-10 items-start">

              {/* ─── LEFT: Stationary Large Master Frame (7 Cols) ─── */}
              <div className="lg:col-span-7 lg:sticky lg:top-24">
                <div
                  ref={masterFrameRef}
                  className="group relative w-full aspect-[16/10.8] rounded-[6px] overflow-hidden bg-[#1D1C19] border border-[#E0D8CA] shadow-[0_20px_45px_-12px_rgba(20,18,15,0.16)]"
                  style={getFramingContainerStyle(selectedItem?.display)}
                >
                  {/* 1. Outgoing photo held visible underneath during expand flight so frame is never black */}
                  {outgoingItem && isExpanding && (
                    <div className="absolute inset-0 z-0 pointer-events-none">
                      {outgoingItem.type === 'video' ? (
                        <video
                          src={outgoingItem.image}
                          className="w-full h-full object-cover filter brightness-[0.98] contrast-[1.02]"
                          style={getFramingStyle(outgoingItem.display)}
                          autoPlay
                          muted
                          loop
                          playsInline
                        />
                      ) : (
                        <img
                          src={outgoingItem.image}
                          alt=""
                          className="w-full h-full object-cover filter brightness-[0.98] contrast-[1.02]"
                          style={getFramingStyle(outgoingItem.display)}
                        />
                      )}
                    </div>
                  )}

                  {/* 2. Active Master Photo: swaps smoothly when flying card docks */}
                  <div
                    className="w-full h-full relative z-0"
                    style={{
                      opacity: isExpanding ? 0 : 1,
                    }}
                  >
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={selectedItem?.image || selectedItem?.id}
                        initial={{ opacity: 0.95 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0.4 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="w-full h-full"
                      >
                        {selectedItem?.type === 'video' ? (
                          <video
                            src={selectedItem.image}
                            className="w-full h-full object-cover filter brightness-[0.98] contrast-[1.02]"
                            style={getFramingStyle(selectedItem.display)}
                            autoPlay
                            muted
                            loop
                            playsInline
                          />
                        ) : (
                          <img
                            src={selectedItem?.image}
                            alt={`${selectedItem?.title || selectedItem?.tag || activeCategory.name} — ${activeCategory.name} photography in Mumbai by DS Photography & Films`}
                            width="800"
                            height="600"
                            className="w-full h-full object-cover filter brightness-[0.98] contrast-[1.02] group-hover:scale-[1.015] transition-all duration-700 ease-out"
                            style={getFramingStyle(selectedItem?.display)}
                            loading="eager"
                          />
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Gradient Overlay at Bottom */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[rgba(16,16,16,0.85)] via-[rgba(16,16,16,0.2)] to-transparent pointer-events-none z-10" />

                  {/* Bottom Metadata Overlay inside Master Frame */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 flex items-end justify-between text-white pointer-events-none z-20">
                    {/* Left: Frame Badge & Progress */}
                    <div className="flex items-center gap-2.5 bg-[rgba(16,16,16,0.7)] backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20">
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
                      {selectedItem?.caption ||
                        selectedItem?.meta ||
                        selectedItem?.title ||
                        activeCategory.quote}
                    </p>
                  </div>
                </div>

                {/* Sub-label under master photo on mobile */}
                <div className="mt-3 flex items-center justify-between text-[11px] font-sans text-[#7A756D] px-1 lg:hidden">
                  <span>Selected: {selectedItem?.tag || selectedItem?.title || 'Specimen'}</span>
                  <span>Tap any thumbnail below to preview</span>
                </div>
              </div>

              {/* ─── RIGHT: Independently Scrollable Grid of All Collection Photos (5 Cols) ─── */}
              <div className="lg:col-span-5 flex flex-col">
                {/* Scroll pane header */}
                <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-[#E2DACD]/60 text-[#7A756D]">
                  <span className="font-mono text-[0.68rem] tracking-[0.18em] uppercase flex items-center gap-1.5 font-medium">
                    <span>BROWSE COLLECTION</span>
                  </span>
                  <span className="font-mono text-[0.65rem] tracking-[0.12em] text-[#8C8578]">
                    {totalCount} ITEMS · SCROLL TO EXPLORE
                  </span>
                </div>

                {/* Scrollable Container with Custom Styled Scrollbar */}
                <div
                  ref={scrollContainerRef}
                  className="max-h-[480px] sm:max-h-[540px] lg:max-h-[580px] xl:max-h-[620px] overflow-y-auto pr-2 overscroll-contain"
                  style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#C4B8A6 rgba(227, 219, 204, 0.3)',
                  }}
                >
                  <div className="grid grid-cols-2 gap-3.5 sm:gap-4 pb-2">
                    {allMedia.map((item, idx) => {
                      const isCurrent =
                        (item.id && selectedItem?.id && item.id === selectedItem.id) ||
                        item.image === selectedItem?.image;
                      const globalIdx = idx + 1;
                      const itemKey = item.id || `thumb-${idx}`;

                      return (
                        <motion.div
                          key={itemKey}
                          initial={{ opacity: 0, y: 16, scale: 0.96 }}
                          whileInView={{ opacity: 1, y: 0, scale: 1 }}
                          viewport={{ once: true, margin: '-20px' }}
                          transition={{
                            duration: 0.45,
                            delay: (idx % 6) * 0.05,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          onClick={() => handleThumbnailClick(item, idx)}
                          className={`group relative bg-white rounded-[4px] border overflow-hidden cursor-pointer transition-all duration-250 ${isCurrent
                              ? 'border-[#101010] ring-2 ring-[#101010] shadow-[0_16px_32px_-8px_rgba(20,18,15,0.22)] -translate-y-0.5'
                              : 'border-[#E2DACD] shadow-[0_6px_16px_-4px_rgba(20,18,15,0.06)] hover:border-[#101010]/60 hover:-translate-y-0.5 hover:shadow-[0_12px_24px_-6px_rgba(20,18,15,0.12)]'
                            }`}
                          style={{
                            padding: '6px',
                          }}
                        >
                          <div
                            ref={(el) => {
                              if (el) {
                                thumbnailRefs.current.set(itemKey, el);
                              } else {
                                thumbnailRefs.current.delete(itemKey);
                              }
                            }}
                            className="relative w-full aspect-[4/3] overflow-hidden rounded-[2px] bg-[#ECE7DC]"
                            style={getFramingContainerStyle(item.display)}
                          >
                            {item.type === 'video' ? (
                              <video
                                src={item.image}
                                className="w-full h-full filter brightness-[0.98] contrast-[1.02]"
                                style={getFramingStyle(item.display)}
                                preload="metadata"
                                muted
                                loop
                                playsInline
                              />
                            ) : (
                              <img
                                src={item.image}
                                alt={`${item.tag || item.title || `Specimen ${globalIdx}`} — ${activeCategory.name} photography in Mumbai`}
                                width="300"
                                height="225"
                                className="w-full h-full filter brightness-[0.98] contrast-[1.02] group-hover:scale-105 transition-transform duration-500 ease-out"
                                style={getFramingStyle(item.display)}
                                loading="lazy"
                              />
                            )}

                            {/* Active Selection Glow/Indicator with smooth layoutId animation */}
                            {isCurrent && (
                              <motion.div
                                layoutId="active-viewing-badge"
                                transition={{
                                  type: 'spring',
                                  stiffness: 380,
                                  damping: 32,
                                }}
                                className="absolute top-1.5 left-1.5 bg-[#101010] text-white text-[9px] font-mono px-1.5 py-0.5 rounded-xs tracking-wider uppercase z-10"
                              >
                                VIEWING
                              </motion.div>
                            )}

                            {/* Video Indicator */}
                            {item.type === 'video' && (
                              <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-black/65 backdrop-blur-xs flex items-center justify-center text-white">
                                <Play size={9} fill="white" className="ml-0.5" />
                              </div>
                            )}

                            {/* Subtle hover overlay with metadata */}
                            <div className="absolute inset-0 bg-[rgba(16,16,16,0.6)] backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-2 text-white pointer-events-none">
                              <span className="font-mono text-[0.55rem] tracking-[0.14em] uppercase text-[#E3DBCC]">
                                Frame {globalIdx < 10 ? `0${globalIdx}` : globalIdx} /{' '}
                                {totalCount < 10 ? `0${totalCount}` : totalCount}
                              </span>
                              <p
                                style={{
                                  fontFamily: 'var(--font-serif)',
                                  fontSize: '0.78rem',
                                  lineHeight: 1.2,
                                }}
                                className="mt-0.5 line-clamp-1 text-white/95"
                              >
                                {item.tag || item.title || 'Specimen'}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* ─── FOOTER BAR: Collection Archive Information ─── */}
            <div className="mt-8 sm:mt-10 pt-5 border-t border-[#E2DACD] flex flex-col sm:flex-row items-center justify-between gap-4 text-[#7A756D]">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[0.7rem] tracking-[0.2em] uppercase text-[#141414] font-semibold">
                  COLLECTION ARCHIVE
                </span>
                <span className="text-[#C5BCAB] text-[0.75rem]">/</span>
                <span className="font-mono text-[0.68rem] tracking-[0.15em] uppercase text-[#7A756D]">
                  {activeCategory.name}
                </span>
                <span className="font-mono text-[0.62rem] tracking-[0.14em] text-[#5C5852] bg-[#EBE4D8] px-2.5 py-0.5 rounded-full font-medium">
                  {totalCount} SPECIMENS RECORDED
                </span>
              </div>

              <div className="flex items-center gap-3 font-mono text-[0.68rem] tracking-[0.16em] uppercase text-[#7A756D]">
                <span>CLICK ANY THUMBNAIL TO SPOTLIGHT</span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Shared-element expand FLIP portal */}
      {flipState && (
        <FlipFlyingClone flipState={flipState} onFinish={handleFlipFinish} />
      )}
    </section>
  );
}

