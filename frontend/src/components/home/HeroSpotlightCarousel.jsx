import React, { useState, useEffect, useRef, useCallback } from 'react';
import PhotoPlaceholder from '../common/PhotoPlaceholder';
import LetterAssembly from '../common/LetterAssembly';

// High-performance static webp assets with deterministic URLs for 100% preload matching
const PROJECTS = [
  {
    id: '01',
    title: 'Azure',
    subtitle: 'High Fashion & Spatial Study',
    category: 'Editorial',
    year: '2025',
    score: '★ 9.4',
    format: 'Hasselblad 100c · 80mm',
    image: '/images/landing/landing-01.webp',
    image400: '/images/landing/landing-01-400w.webp',
    alt: 'High fashion editorial monograph and candid bridal study in Mumbai by DS Photography',
    imgTitle: 'Editorial & Wedding Photographer in Mumbai – DS Photography & Films',
  },
  {
    id: '02',
    title: 'Velocity',
    subtitle: 'The Kinetic Monograph',
    category: 'Design',
    year: '2025',
    score: '★ 9.2',
    format: 'Medium Format 6x7',
    image: '/images/landing/landing-02.webp',
    image400: '/images/landing/landing-02-400w.webp',
    alt: 'Kinetic pre-wedding monograph and couple motion study in Mumbai by Dishant Shelar',
    imgTitle: 'Pre-Wedding Photographer in Mumbai – DS Photography & Films',
  },
  {
    id: '03',
    title: 'Vanta',
    subtitle: 'Chiaroscuro & Monoliths',
    category: 'Architecture',
    year: '2026',
    score: '★ 9.6',
    format: 'Large Format 4x5',
    image: '/images/landing/landing-03.webp',
    image400: '/images/landing/landing-03-400w.webp',
    alt: 'Fine art architectural chiaroscuro and spatial luxury monograph in Mumbai Maharashtra',
    imgTitle: 'Fine Art & Architecture Photographer in Mumbai – Dishant Shelar',
  },
  {
    id: '04',
    title: 'Sentinel',
    subtitle: 'The Atelier Solitude',
    category: 'Portraits',
    year: '2025',
    score: '★ 9.1',
    format: '35mm Tri-X 400',
    image: '/images/landing/landing-04.webp',
    image400: '/images/landing/landing-04-400w.webp',
    alt: '35mm monochrome candid portrait study by DS Photography & Films Mumbai',
    imgTitle: 'Professional Portrait Photographer in Mumbai – DS Photography',
  },
  {
    id: '05',
    title: 'Nova',
    subtitle: 'Light & Temporal Architecture',
    category: 'Portrait',
    year: '2025',
    score: '★ 9.0',
    format: 'Leica Summilux 50mm',
    image: '/images/landing/landing-05.webp',
    image400: '/images/landing/landing-05-400w.webp',
    alt: 'Fine art portrait framed in natural ambient light by Dishant Shelar in Mumbai',
    imgTitle: 'Portrait Photography in Mumbai – Dishant Shelar Studio',
  },
  {
    id: '06',
    title: 'Zane',
    subtitle: 'Subtle Geometry & Stillness',
    category: 'Editorial',
    year: '2026',
    score: '★ 9.5',
    format: 'Hasselblad H6D',
    image: '/images/landing/landing-06.webp',
    image400: '/images/landing/landing-06-400w.webp',
    alt: 'Editorial monograph capture and subtle tonal geometry by DS Photography in Mumbai',
    imgTitle: 'Commercial & Editorial Photographer in Mumbai – DS Photography',
  },
  {
    id: '07',
    title: 'Rael',
    subtitle: 'Archival Alpine Studies',
    category: 'Monograph',
    year: '2025',
    score: '★ 9.3',
    format: 'Platinotype Gelatin Silver',
    image: '/images/landing/landing-07.webp',
    image400: '/images/landing/landing-07-400w.webp',
    alt: 'Archival platinotype print monograph and fine-art photographic proof by Mumbai photographer',
    imgTitle: 'Fine Art Monograph Photography in Mumbai – DS Photography & Films',
  },
];

export default function HeroSpotlightCarousel() {
  const total = PROJECTS.length;

  // Continuous position for 60fps/120fps smooth continuous rotation and gesture tracking
  const [pos, setPos] = useState(1); // Start at 1 ('02 Velocity')
  const [isDragging, setIsDragging] = useState(false);

  const posRef = useRef(1);
  const targetPosRef = useRef(1);
  const isDraggingRef = useRef(false);
  const isCardHoveredRef = useRef(false);
  const hoverResumeTimerRef = useRef(null);
  const isSpringingRef = useRef(false);
  const lastTimeRef = useRef(performance.now());
  const dragStartXRef = useRef(0);
  const dragStartPosRef = useRef(1);
  const lastPointerXRef = useRef(0);
  const lastPointerTimeRef = useRef(0);
  const pointerVelocityRef = useRef(0);

  useEffect(() => {
    posRef.current = pos;
  }, [pos]);

  useEffect(() => {
    isDraggingRef.current = isDragging;
  }, [isDragging]);

  const handleCardMouseEnter = useCallback(() => {
    isCardHoveredRef.current = true;
    if (hoverResumeTimerRef.current) clearTimeout(hoverResumeTimerRef.current);
    // Auto-resume continuous turntable rotation after 2.5s even if cursor remains on card
    hoverResumeTimerRef.current = setTimeout(() => {
      isCardHoveredRef.current = false;
    }, 2500);
  }, []);

  const handleCardMouseLeave = useCallback(() => {
    if (hoverResumeTimerRef.current) clearTimeout(hoverResumeTimerRef.current);
    isCardHoveredRef.current = false;
  }, []);

  // Main continuous, buttery-smooth 60fps/120fps rotation loop across all devices (phone & desktop)
  useEffect(() => {
    let animId;
    lastTimeRef.current = performance.now();

    const loop = (now) => {
      const dt = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      // Safe clamp to avoid jumps after tab focus
      const clampedDt = Math.min(Math.max(dt, 0), 0.1);

      if (!isDraggingRef.current) {
        if (isSpringingRef.current) {
          // Smooth glide toward user-clicked target (arrows, dots, cards)
          const current = posRef.current;
          const target = targetPosRef.current;
          const diff = target - current;

          if (Math.abs(diff) < 0.0006) {
            posRef.current = target;
            setPos(target);
            isSpringingRef.current = false;
          } else {
            const nextPos = current + diff * 0.08;
            posRef.current = nextPos;
            setPos(nextPos);
          }
        } else if (!isCardHoveredRef.current && (typeof document === 'undefined' || !document.hidden)) {
          // Continuous, slow, proper, smooth rotation (turntable) - auto-rotates smoothly on phones and desktops
          // 0.18 cards per second = ~5.5s per image, serene and graceful
          const speed = 0.18;
          const nextPos = posRef.current + speed * clampedDt;
          posRef.current = nextPos;
          setPos(nextPos);
        }
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    const handleVisibility = () => {
      lastTimeRef.current = performance.now();
      if (document.hidden) {
        isCardHoveredRef.current = false;
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      cancelAnimationFrame(animId);
      document.removeEventListener('visibilitychange', handleVisibility);
      if (hoverResumeTimerRef.current) clearTimeout(hoverResumeTimerRef.current);
    };
  }, []);

  // Arrow navigation with fluid circular rotation
  const handlePrev = useCallback(() => {
    targetPosRef.current = Math.ceil(posRef.current) - 1;
    isSpringingRef.current = true;
  }, []);

  const handleNext = useCallback(() => {
    targetPosRef.current = Math.floor(posRef.current) + 1;
    isSpringingRef.current = true;
  }, []);

  // Shortest cyclic navigation to target dot index
  const goToIndex = useCallback((targetIndex) => {
    const currentRounded = Math.round(posRef.current);
    const currentNormalized = ((currentRounded % total) + total) % total;
    let diff = (targetIndex - currentNormalized) % total;
    while (diff > total / 2) diff -= total;
    while (diff < -total / 2) diff += total;
    targetPosRef.current = currentRounded + diff;
    isSpringingRef.current = true;
  }, [total]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext]);

  // Pointer drag & touch swipe
  const handlePointerDown = (e) => {
    isSpringingRef.current = false;
    isDraggingRef.current = true;
    setIsDragging(true);
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    dragStartXRef.current = clientX;
    dragStartPosRef.current = posRef.current;
    lastPointerXRef.current = clientX;
    lastPointerTimeRef.current = performance.now();
    pointerVelocityRef.current = 0;
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const deltaX = clientX - dragStartXRef.current;

    // Track instantaneous release velocity
    const now = performance.now();
    const dt = now - lastPointerTimeRef.current;
    if (dt > 12) {
      pointerVelocityRef.current = (clientX - lastPointerXRef.current) / dt;
      lastPointerXRef.current = clientX;
      lastPointerTimeRef.current = now;
    }

    // Direct 1:1 gesture sensitivity
    const spacing = typeof window !== 'undefined' && window.innerWidth < 768 ? 160 : 220;
    const newPos = dragStartPosRef.current - deltaX / spacing;
    posRef.current = newPos;
    setPos(newPos);
  };

  const handlePointerUp = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDragging(false);
    lastTimeRef.current = performance.now();

    // Natural flick inertia
    const v = pointerVelocityRef.current;
    if (Math.abs(v) > 0.4) {
      const flingDistance = Math.sign(-v) * Math.min(2, Math.max(1, Math.round(Math.abs(v) * 1.0)));
      targetPosRef.current = Math.round(posRef.current + flingDistance);
      isSpringingRef.current = true;
    }
  };

  // Active item synced to rounded carousel position
  const activeNormalizedIndex = ((Math.round(pos) % total) + total) % total;
  const activeProject = PROJECTS[activeNormalizedIndex];

  return (
    <section
      id="gallery"
      style={{
        position: 'relative',
        height: '100dvh',
        minHeight: '620px',
        maxHeight: '1080px',
        boxSizing: 'border-box',
        paddingTop: 'clamp(4.2rem, 6vh, 5.2rem)',
        paddingBottom: 'clamp(1rem, 2vh, 1.8rem)',
        overflow: 'hidden',
        backgroundColor: 'var(--color-off-white)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      {/* Ambient Radial Glow */}
      <div
        style={{
          position: 'absolute',
          top: '38%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'min(1200px, 95vw)',
          height: '480px',
          background: 'radial-gradient(ellipse at center, rgba(243, 240, 233, 0.9) 0%, rgba(253, 252, 248, 0) 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div
        className="container"
        style={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >

        {/* ===================================================================
            TOP SECTION: EYEBROW & HEADING
            =================================================================== */}
        <div
          className="pt-1 sm:pt-2 max-w-4xl mx-auto px-4"
          style={{ flexShrink: 0 }}
        >
          <LetterAssembly
            as="h1"
            immediate={true}
            delay={0.06}
            duration={0.65}
            charStagger={0.024}
            wordSpread={0.16}
            wordJitter={0.06}
            yOffset={0}
            blurAmount={4}
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(1.85rem, 3.2vw, 2.75rem)',
              fontWeight: 400,
              lineHeight: 1.15,
              letterSpacing: '-0.015em',
              color: 'var(--color-obsidian)',
              maxWidth: '860px',
              margin: '0 auto',
              display: 'block',
            }}
            text="Professional Photographer in Mumbai"
          />
          <LetterAssembly
            as="p"
            immediate={true}
            delay={0.18}
            duration={0.55}
            charStagger={0.02}
            wordSpread={0.36}
            wordJitter={0.12}
            yOffset={0}
            blurAmount={3.5}
            className="text-[14px] sm:text-[15.5px] text-[#2C2722] font-sans font-normal max-w-2xl mx-auto mt-2.5 sm:mt-3 leading-relaxed block"
            text="DS Photography & Films is led by Dishant Shelar, a professional photographer in Mumbai capturing candid weddings, intimate pre-wedding stories, and fine-art portraits across Mumbai and destination locations in Maharashtra."
          />
        </div>

        {/* ===================================================================
            MIDDLE SECTION: INWARD CONCAVE CURVED 3D GALLERY (CLEAN MINIMALIST)
            =================================================================== */}
        <div
          role="region"
          aria-roledescription="carousel"
          aria-label="Portfolio Spotlight Showcase"
          aria-live="polite"
          onMouseDown={handlePointerDown}
          onMouseMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onTouchStart={handlePointerDown}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
          style={{
            position: 'relative',
            width: '100%',
            height: 'clamp(290px, 35vh, 365px)',
            margin: '0.65rem auto 0.35rem auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            perspective: '950px',
            perspectiveOrigin: '50% 50%',
            cursor: isDragging ? 'grabbing' : 'grab',
            userSelect: 'none',
            touchAction: 'pan-y',
            flexShrink: 0,
          }}
        >
          {PROJECTS.map((item, idx) => {
            // Shortest cyclic angular distance around the circle
            let d = (idx - pos) % total;
            while (d > total / 2) d -= total;
            while (d < -total / 2) d += total;

            const absD = Math.abs(d);

            // ===============================================================
            // INWARD CONCAVE CYLINDER CURVE WITH SLIGHTLY INCREASED SIZE
            // ===============================================================
            // 1. Spacing along the horizontal axis (balanced for new card width)
            const spacing = typeof window !== 'undefined' && window.innerWidth < 768 ? 180 : 248;
            const translateX = d * spacing;

            // 2. Inward curve: center card sits inward at z = 0;
            // Side cards curve FORWARD towards viewer (+translateZ)
            const isVisible = absD < 2.65;
            const translateZ = isVisible ? Math.pow(absD, 1.4) * 64 : -600;

            // 3. Inward rotation
            const rotateY = -d * 16.5;

            // 4. Smooth fade out at the edges
            const opacity = absD >= 2.65 ? 0 : absD <= 1.85 ? 1 : Math.max(0, (2.65 - absD) / 0.8);

            // Z-index: outer cards that curve forward are layered cleanly
            const zIndex = isVisible ? Math.round(50 + translateZ * 0.2) : 0;
            const isActive = absD < 0.45;

            // 3D specular sheen reflecting the card's inward angle
            const sheenOpacity = Math.min(0.22, absD * 0.08);
            const sheenAngle = d > 0 ? '120deg' : '240deg';

            return (
              <div
                key={item.id}
                role="group"
                aria-roledescription="slide"
                aria-label={`${item.title} — Slide ${idx + 1} of ${total}`}
                onMouseEnter={handleCardMouseEnter}
                onMouseLeave={handleCardMouseLeave}
                onClick={() => {
                  if (absD >= 0.45 && isVisible) {
                    targetPosRef.current = Math.round(posRef.current + d);
                    isSpringingRef.current = true;
                  }
                }}
                style={{
                  position: 'absolute',
                  // Card size slightly increased ("thoda sa") for editorial presence without congestion
                  width: 'clamp(162px, 14vw, 198px)',
                  height: 'clamp(236px, 20.5vw, 290px)',
                  transformStyle: 'preserve-3d',
                  transform: `translateX(${translateX}px) translateY(0px) translateZ(${translateZ}px) rotateY(${rotateY}deg)`,
                  opacity,
                  visibility: isVisible ? 'visible' : 'hidden',
                  pointerEvents: isVisible ? 'auto' : 'none',
                  zIndex,
                  transition: isDragging ? 'none' : 'box-shadow 0.35s ease, border-color 0.35s ease',
                  cursor: isActive ? 'default' : 'pointer',
                  willChange: 'transform, opacity',
                }}
              >
                {/* Floating 3D Ground Shadow */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '-28px',
                    left: '9%',
                    width: '82%',
                    height: isActive ? '24px' : '18px',
                    borderRadius: '50%',
                    background: isActive
                      ? 'radial-gradient(ellipse at center, rgba(16, 16, 16, 0.42) 0%, rgba(16, 16, 16, 0.15) 45%, transparent 75%)'
                      : 'radial-gradient(ellipse at center, rgba(16, 16, 16, 0.28) 0%, rgba(16, 16, 16, 0.09) 45%, transparent 75%)',
                    filter: isActive ? 'blur(9px)' : 'blur(7px)',
                    transform: `scale(${1 + absD * 0.04})`,
                    opacity: opacity * 0.95,
                    pointerEvents: 'none',
                    transition: 'all 0.35s ease',
                    zIndex: -1,
                  }}
                />

                {/* Card Body - Pure Photography, Zero Distractions */}
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    borderRadius: '18px',
                    overflow: 'hidden',
                    backgroundColor: '#161616',
                    border: isActive ? '1.5px solid rgba(255, 255, 255, 0.35)' : '1px solid rgba(255, 255, 255, 0.08)',
                    boxShadow: isActive
                      ? `
                        inset 0 1px 1px 0 rgba(255, 255, 255, 0.3),
                        0 8px 22px -3px rgba(16, 16, 16, 0.38),
                        0 26px 52px -8px rgba(16, 16, 16, 0.48),
                        0 48px 90px -15px rgba(16, 16, 16, 0.52)
                      `
                      : `
                        inset 0 1px 1px 0 rgba(255, 255, 255, 0.15),
                        0 6px 18px -3px rgba(16, 16, 16, 0.3),
                        0 18px 42px -8px rgba(16, 16, 16, 0.36),
                        0 34px 70px -12px rgba(16, 16, 16, 0.4)
                      `,
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'box-shadow 0.35s ease, border-color 0.35s ease',
                  }}
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      srcSet={`${item.image400} 400w, ${item.image} 800w`}
                      sizes="(max-width: 768px) 180px, 200px"
                      alt={item.alt || `${item.title} — ${item.subtitle} by Dishant Shelar Mumbai`}
                      title={item.imgTitle || `${item.title} — Photographer in Mumbai | DS Photography & Films`}
                      width="200"
                      height="290"
                      style={{ aspectRatio: '200 / 290' }}
                      className="w-full h-full object-cover select-none pointer-events-none"
                      loading={Math.abs(d) < 0.5 ? 'eager' : 'lazy'}
                      fetchPriority={Math.abs(d) < 0.5 ? 'high' : 'auto'}
                      decoding={Math.abs(d) < 0.5 ? 'sync' : 'async'}
                      draggable={false}
                    />
                  ) : (
                    <PhotoPlaceholder
                      dark={true}
                      aspectRatio="auto"
                      showBadge={false}
                      className="w-full h-full"
                      style={{
                        borderRadius: '0',
                        border: 'none',
                        height: '100%',
                      }}
                    />
                  )}

                  {/* 3D Specular Light Sheen */}
                  {d !== 0 && (
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: `linear-gradient(${sheenAngle}, rgba(255, 255, 255, ${sheenOpacity}) 0%, transparent 60%)`,
                        pointerEvents: 'none',
                      }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Ambient Floor Stage Horizon Shadow */}
        <div
          style={{
            width: 'min(840px, 85vw)',
            height: '28px',
            margin: '-14px auto 0 auto',
            background: 'radial-gradient(ellipse at center, rgba(16, 16, 16, 0.1) 0%, rgba(16, 16, 16, 0.03) 55%, transparent 75%)',
            filter: 'blur(12px)',
            pointerEvents: 'none',
            flexShrink: 0,
          }}
        />

        {/* ===================================================================
            BOTTOM CONTROLS: 7 DOTS (CLEAN & MINIMAL)
            =================================================================== */}
        <div style={{ flexShrink: 0, paddingBottom: '0.75rem', paddingTop: '0.25rem' }}>

          {/* 7 Minimalist Pagination Dots with Touch-Friendly 44px Tap Targets */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.15rem' }}>
            {PROJECTS.map((_, i) => (
              <button
                type="button"
                key={i}
                onClick={() => goToIndex(i)}
                aria-label={`Go to slide ${i + 1} of ${total}`}
                aria-current={activeNormalizedIndex === i ? 'true' : undefined}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: '28px',
                  minHeight: '44px',
                  padding: '16px 2px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <span
                  style={{
                    display: 'block',
                    height: '5px',
                    width: activeNormalizedIndex === i ? '24px' : '5px',
                    borderRadius: '999px',
                    backgroundColor: activeNormalizedIndex === i ? 'var(--color-obsidian)' : '#8C8474',
                    transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                />
              </button>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
