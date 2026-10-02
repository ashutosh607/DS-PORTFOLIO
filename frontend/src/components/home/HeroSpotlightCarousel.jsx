import React, { useState, useEffect, useRef, useCallback } from 'react';
import PhotoPlaceholder from '../common/PhotoPlaceholder';
import TextBlurReveal from '../common/TextBlurReveal';

import img01 from '../../assets/landing-page-images/landing-01.png';
import img02 from '../../assets/landing-page-images/landing-02.png';
import img03 from '../../assets/landing-page-images/landing-03.png';
import img04 from '../../assets/landing-page-images/landing-04.png';
import img05 from '../../assets/landing-page-images/landing-05.png';
import img06 from '../../assets/landing-page-images/landing-06.png';
import img07 from '../../assets/landing-page-images/landing-07.png';

const PROJECTS = [
  {
    id: '01',
    title: 'Azure',
    subtitle: 'High Fashion & Spatial Study',
    category: 'Editorial',
    year: '2025',
    score: '★ 9.4',
    format: 'Hasselblad 100c · 80mm',
    image: img01,
  },
  {
    id: '02',
    title: 'Velocity',
    subtitle: 'The Kinetic Monograph',
    category: 'Design',
    year: '2025',
    score: '★ 9.2',
    format: 'Medium Format 6x7',
    image: img02,
  },
  {
    id: '03',
    title: 'Vanta',
    subtitle: 'Chiaroscuro & Monoliths',
    category: 'Architecture',
    year: '2026',
    score: '★ 9.6',
    format: 'Large Format 4x5',
    image: img03,
  },
  {
    id: '04',
    title: 'Sentinel',
    subtitle: 'The Parisian Solitude',
    category: 'Portraits',
    year: '2025',
    score: '★ 9.1',
    format: '35mm Tri-X 400',
    image: img04,
  },
  {
    id: '05',
    title: 'Nova',
    subtitle: 'Light & Temporal Architecture',
    category: 'Portrait',
    year: '2025',
    score: '★ 9.0',
    format: 'Leica Summilux 50mm',
    image: img05,
  },
  {
    id: '06',
    title: 'Zane',
    subtitle: 'Subtle Geometry & Stillness',
    category: 'Editorial',
    year: '2026',
    score: '★ 9.5',
    format: 'Hasselblad H6D',
    image: img06,
  },
  {
    id: '07',
    title: 'Rael',
    subtitle: 'Archival Alpine Studies',
    category: 'Monograph',
    year: '2025',
    score: '★ 9.3',
    format: 'Platinotype Gelatin Silver',
    image: img07,
  },
];

export default function HeroSpotlightCarousel() {
  const total = PROJECTS.length;

  // Continuous position for 60fps spring gesture tracking
  const [pos, setPos] = useState(1); // Start at 1 ('02 Velocity')
  const [isDragging, setIsDragging] = useState(false);
  const posRef = useRef(1);
  const targetPosRef = useRef(1);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartPosRef = useRef(1);
  const lastPointerXRef = useRef(0);
  const lastPointerTimeRef = useRef(0);
  const pointerVelocityRef = useRef(0);
  const animFrameIdRef = useRef(null);

  useEffect(() => {
    posRef.current = pos;
  }, [pos]);

  // Silky 60fps spring animation
  const startSpringAnimation = useCallback(() => {
    if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);

    const step = () => {
      if (isDraggingRef.current) return;

      const current = posRef.current;
      const target = targetPosRef.current;
      const diff = target - current;

      if (Math.abs(diff) < 0.0005) {
        posRef.current = target;
        setPos(target);
        animFrameIdRef.current = null;
        return;
      }

      // Smooth damped spring interpolation
      const nextPos = current + diff * 0.11;
      posRef.current = nextPos;
      setPos(nextPos);

      animFrameIdRef.current = requestAnimationFrame(step);
    };

    animFrameIdRef.current = requestAnimationFrame(step);
  }, []);

  // Arrow navigation with fluid circular rotation
  const handlePrev = useCallback(() => {
    targetPosRef.current = Math.round(targetPosRef.current) - 1;
    startSpringAnimation();
  }, [startSpringAnimation]);

  const handleNext = useCallback(() => {
    targetPosRef.current = Math.round(targetPosRef.current) + 1;
    startSpringAnimation();
  }, [startSpringAnimation]);

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
    if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
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

    // Natural flick inertia
    const v = pointerVelocityRef.current;
    let target = posRef.current;

    if (Math.abs(v) > 0.4) {
      const flingDistance = Math.sign(-v) * Math.min(2, Math.max(1, Math.round(Math.abs(v) * 1.0)));
      target = Math.round(posRef.current + flingDistance);
    } else {
      target = Math.round(posRef.current);
    }

    targetPosRef.current = target;
    startSpringAnimation();
  };

  // Active item synced to rounded carousel position
  const activeNormalizedIndex = ((Math.round(pos) % total) + total) % total;
  const activeProject = PROJECTS[activeNormalizedIndex];

  return (
    <section
      id="gallery"
      style={{
        position: 'relative',
        height: '100vh',
        minHeight: '660px',
        maxHeight: '1080px',
        boxSizing: 'border-box',
        paddingTop: 'clamp(4.25rem, 6.5vh, 5.25rem)',
        paddingBottom: 'clamp(1rem, 2vh, 1.75rem)',
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
        <div style={{ flexShrink: 0, paddingTop: '0.25rem' }}>
          <div style={{ marginBottom: '0.45rem' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.675rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'var(--color-obsidian-light)',
                fontWeight: 500,
              }}
            >
              <span style={{ width: '22px', height: '1px', backgroundColor: 'var(--color-nude)' }} />
              <TextBlurReveal text="The Spotlight Collection" blurAmount={6} delay={0.05} />
              <span style={{ width: '22px', height: '1px', backgroundColor: 'var(--color-nude)' }} />
            </div>
          </div>

          <TextBlurReveal
            as="h1"
            text="Selected works, framed in light"
            blurAmount={12}
            stagger={0.06}
            delay={0.12}
            style={{
              maxWidth: '720px',
              margin: '0 auto',
              lineHeight: 1.1,
              color: 'var(--color-obsidian)',
              fontSize: 'clamp(1.85rem, 3.2vw, 2.75rem)',
              letterSpacing: '-0.015em',
              fontWeight: 400,
            }}
          />
        </div>

        {/* ===================================================================
            MIDDLE SECTION: INWARD CONCAVE CURVED 3D GALLERY (CLEAN MINIMALIST)
            =================================================================== */}
        <div
          onMouseDown={handlePointerDown}
          onMouseMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onMouseLeave={handlePointerUp}
          onTouchStart={handlePointerDown}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
          style={{
            position: 'relative',
            width: '100%',
            height: 'clamp(310px, 37vh, 375px)',
            margin: '0.25rem auto',
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
                onClick={() => {
                  if (absD >= 0.45 && isVisible) {
                    targetPosRef.current = Math.round(targetPosRef.current + d);
                    startSpringAnimation();
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
                      alt="Portfolio showcase"
                      className="w-full h-full object-cover select-none pointer-events-none"
                      loading={Math.abs(d) <= 1 ? 'eager' : 'lazy'}
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
            BOTTOM CONTROLS: 7 DOTS, COUNTER & ARROWS (CLEAN & MINIMAL)
            =================================================================== */}
        <div style={{ flexShrink: 0, paddingBottom: '0.5rem' }}>

          {/* 7 Minimalist Pagination Dots */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem', marginBottom: '0.55rem' }}>
            {PROJECTS.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  targetPosRef.current = i;
                  startSpringAnimation();
                }}
                aria-label={`Go to photo ${i + 1}`}
                style={{
                  height: '5px',
                  width: activeNormalizedIndex === i ? '22px' : '5px',
                  borderRadius: '999px',
                  backgroundColor: activeNormalizedIndex === i ? '#2B579A' : 'var(--color-nude)',
                  transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                  padding: 0,
                  border: 'none',
                  cursor: 'pointer',
                }}
              />
            ))}
          </div>

          {/* Bottom Bar: Slide Counter (Left) & Minimal Circular Navigation Arrows (Right) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              maxWidth: '920px',
              margin: '0 auto',
              paddingTop: '0.2rem',
            }}
          >
            <div style={{ textAlign: 'left', minWidth: '100px' }}>
              <span
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.85rem',
                  fontWeight: 500,
                  color: 'var(--color-obsidian)',
                  lineHeight: 1,
                }}
              >
                {String(activeNormalizedIndex + 1).padStart(2, '0')}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.8rem',
                  color: 'var(--color-obsidian-light)',
                  marginLeft: '0.35rem',
                  fontWeight: 500,
                }}
              >
                / {String(total).padStart(2, '0')}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', minWidth: '100px', justifyContent: 'flex-end' }}>
              <button
                onClick={handlePrev}
                className="circle-nav-btn"
                aria-label="Previous photo"
                style={{ width: '38px', height: '38px' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                onClick={handleNext}
                className="circle-nav-btn"
                aria-label="Next photo"
                style={{ width: '38px', height: '38px' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
