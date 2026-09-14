import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const VISIBLE_COUNT = 6;
const CARD_GAP = 18;

export default function CollectionsRibbon({
  categories = [],
  activeCategoryId,
  onSelectCategory,
  ribbonRef,
}) {
  const N = categories.length;
  const isCircular = N > VISIBLE_COUNT;

  // Tripled list for infinite circular looping
  const items = isCircular
    ? [...categories, ...categories, ...categories]
    : categories;

  // Center set starts at index N
  const [currentIndex, setCurrentIndex] = useState(isCircular ? N : 0);
  const [withTransition, setWithTransition] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  // Viewport container width tracking
  const viewportRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(1140);

  // Mouse & Touch Dragging State
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const hasDragged = useRef(false);

  // Update container width on resize
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const updateSize = () => {
      const w = el.getBoundingClientRect().width;
      if (w > 0) setContainerWidth(w);
    };
    updateSize();
    const ro = new ResizeObserver(updateSize);
    ro.observe(el);
    window.addEventListener('resize', updateSize);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  // Sync index if categories change
  useEffect(() => {
    if (isCircular) {
      setWithTransition(false);
      setCurrentIndex(N);
    } else {
      setCurrentIndex(0);
    }
  }, [N, isCircular]);

  // Restore transition after instantaneous teleport
  useEffect(() => {
    if (!withTransition) {
      const raf = requestAnimationFrame(() => {
        setWithTransition(true);
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [withTransition]);

  // Responsive sizing calculations
  const isMobile = containerWidth < 640;
  const isTablet = containerWidth >= 640 && containerWidth < 1024;
  const effectiveVisible = isMobile ? 2.2 : isTablet ? 3.8 : VISIBLE_COUNT;

  const cardWidth = isCircular
    ? (containerWidth - (effectiveVisible - 1) * CARD_GAP) / effectiveVisible
    : Math.min(175, (containerWidth - (N - 1) * CARD_GAP) / Math.max(1, N));

  const step = cardWidth + CARD_GAP;

  /* ── Navigation Handlers ── */
  const handleNext = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setWithTransition(true);
    setCurrentIndex((prev) => prev + 1);
  }, [isAnimating]);

  const handlePrev = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setWithTransition(true);
    setCurrentIndex((prev) => prev - 1);
  }, [isAnimating]);

  /* ── Infinite Teleport on Transition End ── */
  const handleTransitionEnd = () => {
    setIsAnimating(false);
    if (!isCircular) return;

    if (currentIndex >= 2 * N) {
      // Slid past the end of the middle set -> teleport seamlessly back by N
      setWithTransition(false);
      setCurrentIndex((prev) => prev - N);
    } else if (currentIndex < N) {
      // Slid before the start of the middle set -> teleport seamlessly forward by N
      setWithTransition(false);
      setCurrentIndex((prev) => prev + N);
    }
  };

  /* ── Drag / Swipe Handlers ── */
  const handleMouseDown = (e) => {
    if (e.button !== 0 || isAnimating || !isCircular) return;
    setIsDragging(true);
    dragStartX.current = e.pageX;
    hasDragged.current = false;
    setDragOffset(0);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const diff = e.pageX - dragStartX.current;
    if (Math.abs(diff) > 5) {
      hasDragged.current = true;
    }
    setDragOffset(diff);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const threshold = 40;
    if (dragOffset < -threshold) {
      handleNext();
    } else if (dragOffset > threshold) {
      handlePrev();
    }
    setDragOffset(0);
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      handleMouseUp();
    }
  };

  const handleTouchStart = (e) => {
    if (isAnimating || !isCircular) return;
    setIsDragging(true);
    dragStartX.current = e.touches[0].clientX;
    hasDragged.current = false;
    setDragOffset(0);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const diff = e.touches[0].clientX - dragStartX.current;
    if (Math.abs(diff) > 5) {
      hasDragged.current = true;
    }
    setDragOffset(diff);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const threshold = 40;
    if (dragOffset < -threshold) {
      handleNext();
    } else if (dragOffset > threshold) {
      handlePrev();
    }
    setDragOffset(0);
  };

  const handleCardClick = (catId) => {
    if (hasDragged.current) {
      hasDragged.current = false;
      return;
    }
    onSelectCategory(catId);
  };

  // Compute current translateX
  const currentTranslateX = -currentIndex * step + dragOffset;

  return (
    <section
      ref={ribbonRef}
      id="collection-categories-ribbon"
      className="relative w-full overflow-visible"
      style={{
        marginTop: 'clamp(2.5rem, 4.5vw, 4.5rem)',
        paddingTop: '1rem',
        paddingBottom: 'clamp(4rem, 6.5vw, 6.5rem)',
      }}
    >
      {/* Decorative undulating curved thread stroke behind cards */}
      <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 pointer-events-none select-none z-0 w-full hidden md:block">
        <svg className="w-full h-44" viewBox="0 0 1400 160" preserveAspectRatio="none" fill="none">
          <path
            d="M 32 112 C 8 92, 2 136, 48 136 C 82 136, 96 92, 72 72 C 52 52, 26 72, 36 96"
            stroke="#D2C8B8"
            strokeWidth="0.95"
            strokeDasharray="2 3"
          />
          <path
            d="M 42 96 C 160 140, 250 25, 410 80 C 570 135, 670 20, 830 75 C 970 130, 1070 30, 1210 70 C 1290 85, 1360 60, 1430 75"
            stroke="#D2C8B8"
            strokeWidth="1.1"
          />
        </svg>
      </div>

      {/* ── Outer Wrapper with Arrow Buttons ── */}
      <div
        style={{
          position: 'relative',
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 54px',
        }}
      >
        {/* Left Arrow Button (Infinite Rotation) */}
        {isCircular && (
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous categories"
            style={{
              position: 'absolute',
              left: 4,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 35,
              width: 44,
              height: 44,
              borderRadius: '50%',
              border: '1px solid rgba(210, 200, 184, 0.85)',
              backgroundColor: '#FFFFFF',
              color: '#1C1917',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 18px rgba(0,0,0,0.12)',
              transition: 'all 0.2s ease',
            }}
          >
            <ChevronLeft size={22} strokeWidth={2.4} />
          </button>
        )}

        {/* Right Arrow Button (Infinite Rotation) */}
        {isCircular && (
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next categories"
            style={{
              position: 'absolute',
              right: 4,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 35,
              width: 44,
              height: 44,
              borderRadius: '50%',
              border: '1px solid rgba(210, 200, 184, 0.85)',
              backgroundColor: '#FFFFFF',
              color: '#1C1917',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 18px rgba(0,0,0,0.12)',
              transition: 'all 0.2s ease',
            }}
          >
            <ChevronRight size={22} strokeWidth={2.4} />
          </button>
        )}

        {/* Viewport Window (clips exactly to 6 cards on laptop) */}
        <div
          ref={viewportRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            overflow: 'hidden',
            width: '100%',
            maxWidth: '1140px',
            margin: '0 auto',
            cursor: isDragging ? 'grabbing' : 'grab',
            userSelect: 'none',
            padding: '1.25rem 0.15rem',
          }}
        >
          {/* Continuous Sliding Track */}
          <div
            onTransitionEnd={handleTransitionEnd}
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: `${CARD_GAP}px`,
              width: 'max-content',
              transform: `translateX(${currentTranslateX}px)`,
              transition:
                isDragging || !withTransition
                  ? 'none'
                  : 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
              willChange: 'transform',
            }}
          >
            {items.map((cat, index) => {
              const isActive = cat.id === activeCategoryId;

              return (
                <div
                  key={`${cat.id}-slot-${index}`}
                  data-category-id={cat.id}
                  style={{
                    flex: `0 0 ${cardWidth}px`,
                    width: `${cardWidth}px`,
                  }}
                >
                  <motion.div
                    onClick={() => handleCardClick(cat.id)}
                    whileHover={{
                      y: -8,
                      scale: 1.025,
                      transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
                    }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative w-full overflow-hidden flex flex-col justify-end cursor-pointer select-none bg-[#1A1816] border transition-all duration-350"
                    style={{
                      borderRadius: '9999px 9999px 4px 4px',
                      height: 'clamp(280px, 24vw, 325px)',
                      padding:
                        'clamp(1.1rem, 1.5vw, 1.35rem) clamp(0.85rem, 1.2vw, 1.1rem) clamp(0.95rem, 1.3vw, 1.2rem)',
                      borderColor: isActive ? '#101010' : '#2A2622',
                      boxShadow: isActive
                        ? '0 24px 44px -10px rgba(18, 16, 14, 0.48), 0 0 0 2px #101010'
                        : '0 14px 32px -10px rgba(18, 16, 14, 0.22)',
                    }}
                  >
                    {/* Background Photograph */}
                    <img
                      src={cat.coverImage}
                      alt={`${cat.name} Collection`}
                      className="absolute inset-0 w-full h-full object-cover object-center transition-[transform] duration-500 ease-out group-hover:scale-105 pointer-events-none"
                      loading="lazy"
                      draggable={false}
                    />

                    {/* Dark gradient overlay for typography readability */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          'linear-gradient(to bottom, rgba(16, 16, 16, 0.05) 0%, rgba(16, 16, 16, 0.12) 40%, rgba(16, 16, 16, 0.68) 75%, rgba(16, 16, 16, 0.95) 100%)',
                      }}
                    />

                    {/* Bottom: Category Name & Arrow (NO ID anywhere) */}
                    <div className="relative z-10 pt-2 pb-0.5 pointer-events-none">
                      <h3
                        style={{
                          fontFamily: 'var(--font-serif)',
                          fontSize: 'clamp(1.15rem, 1.3vw, 1.35rem)',
                          color: '#FFFFFF',
                          fontWeight: 400,
                          lineHeight: 1.15,
                          marginBottom: '0.45rem',
                          textShadow: '0 2px 8px rgba(0,0,0,0.85)',
                        }}
                      >
                        {cat.name}
                      </h3>

                      <div className="flex items-center gap-1.5 text-white/80 group-hover:text-white group-hover:translate-x-1.5 transition-all duration-300">
                        <span
                          style={{
                            width: isActive ? 28 : 20,
                            height: '1.5px',
                            backgroundColor: isActive
                              ? '#FFFFFF'
                              : 'rgba(255,255,255,0.7)',
                            transition: 'all 0.3s ease',
                          }}
                        />
                        <span className="text-[10px] leading-none">→</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile Interactive Quick-Tabs */}
      <div className="flex lg:hidden items-center justify-center gap-1.5 mt-4 px-4 flex-wrap select-none">
        {categories.map((cat) => {
          const isActive = cat.id === activeCategoryId;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className={`font-sans text-[10px] uppercase tracking-[0.14em] px-2.5 py-1 rounded-full transition-all duration-300 cursor-pointer ${
                isActive
                  ? 'bg-[#101010] text-[#FDFCF8] font-medium shadow-sm'
                  : 'bg-[#EAE4D8] text-[#6B655B] hover:bg-[#DDD6C8]'
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Navigation Indicator Dots for all Categories */}
      {isCircular && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            marginTop: 20,
          }}
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              aria-label={cat.name}
              style={{
                width: cat.id === activeCategoryId ? 22 : 6,
                height: 6,
                borderRadius: 3,
                border: 'none',
                backgroundColor:
                  cat.id === activeCategoryId ? '#1C1917' : '#D2C8B8',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                padding: 0,
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}

