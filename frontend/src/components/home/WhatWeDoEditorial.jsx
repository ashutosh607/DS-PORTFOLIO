import React, { useRef, useState, useEffect } from 'react';

import img01 from '../../assets/landing-down-animation/612A9674.webp';
import img01_300 from '../../assets/landing-down-animation/612A9674-300w.webp';
import img02 from '../../assets/landing-down-animation/DSP09982.webp';
import img02_300 from '../../assets/landing-down-animation/DSP09982-300w.webp';
import img03 from '../../assets/landing-down-animation/IMG_1186.webp';
import img03_300 from '../../assets/landing-down-animation/IMG_1186-300w.webp';
import img04 from '../../assets/landing-down-animation/IMG_7783.webp';
import img04_300 from '../../assets/landing-down-animation/IMG_7783-300w.webp';
import img05 from '../../assets/landing-down-animation/IMG_7785.webp';
import img05_300 from '../../assets/landing-down-animation/IMG_7785-300w.webp';
import img06 from '../../assets/landing-down-animation/_0005916.webp';
import img06_300 from '../../assets/landing-down-animation/_0005916-300w.webp';
import img07 from '../../assets/landing-down-animation/_0006027.webp';
import img07_300 from '../../assets/landing-down-animation/_0006027-300w.webp';

/**
 * 7 Curated atelier photographs from assets/landing-down-animation with responsive sizes.
 */
const PHOTOS = [
  { full: img01, w300: img01_300 },
  { full: img02, w300: img02_300 },
  { full: img03, w300: img03_300 },
  { full: img04, w300: img04_300 },
  { full: img05, w300: img05_300 },
  { full: img06, w300: img06_300 },
  { full: img07, w300: img07_300 },
];

const PHOTO_TITLES = [
  'Fine Art Bridal Photography in Mumbai – DS Photography & Films',
  'Candid Wedding Photographer in Mumbai – Dishant Shelar',
  'Intimate Pre-Wedding Photography Shoot in Mumbai',
  'Editorial Bridal Portrait Details – Mumbai Wedding Photographer',
  'Emotional Wedding Photography Moments in Mumbai',
  'Atmospheric Celebration & Event Photography in Mumbai',
  'Sunset Couple Portrait Photography in Mumbai – DS Photography',
];

const PHOTO_METADATA = [
  'Fine art bridal portrait and wedding ceremony in Mumbai by DS Photography',
  'Candid wedding monograph and bridal moment in Maharashtra by Dishant Shelar',
  'Intimate pre-wedding couple monograph captured in natural sunlight',
  'Editorial bridal heirloom and vintage veil detail in Mumbai',
  'Emotional wedding vows and sacred moments preserved with fine art framing',
  'Atmospheric celebration and joyful evening toast by DS Photography',
  'Romantic couple portrait at twilight dusk across Mumbai coastal estates',
];

/**
 * REFINED EDITORIAL RESTING POSITIONS
 * Proportionally scaled for refined, smaller card dimensions.
 * Creates an exquisite, airy, balanced layout with ample negative space.
 */
const DESKTOP_RESTING = [
  { x: -260, y: -120, rotate: -3.0 }, // 0: Top-Left
  { x: 250, y: -130, rotate: 2.5 },  // 1: Top-Right
  { x: -150, y: 55, rotate: 1.5 },  // 2: Center-Left
  { x: 145, y: 65, rotate: -2.0 }, // 3: Center-Right
  { x: -300, y: 130, rotate: -3.5 }, // 4: Far-Left Lower
  { x: 295, y: 120, rotate: 3.0 },  // 5: Far-Right Lower
  { x: 0, y: -15, rotate: -0.5 }, // 6: Center Finale
];

const MOBILE_RESTING = [
  // 0: Top-Left (Woman in blue saree) - increased size to close gap
  { x: -75, y: -178, rotate: 0, scale: 1.18, zIndex: 12, vwX: -19.0, vhY: -21.0 },
  // 1: Top-Right (Mehendi hands photo) - increased size to close gap
  { x: 78, y: -168, rotate: 0, scale: 1.18, zIndex: 12, vwX: 20.0, vhY: -20.0 },
  // 2: Middle-Left (Toddler boy photo)
  { x: -125, y: 10, rotate: 0, scale: 0.88, zIndex: 10, vwX: -32.0, vhY: 1.2 },
  // 3: Middle-Right (Hand with ring & henna)
  { x: 128, y: 10, rotate: 0, scale: 0.88, zIndex: 10, vwX: 32.5, vhY: 1.2 },
  // 4: Bottom-Left (Couple standing outdoors) - increased size to close gap
  { x: -75, y: 198, rotate: 0, scale: 1.18, zIndex: 14, vwX: -19.0, vhY: 23.5 },
  // 5: Bottom-Right (Couple on wooden balcony) - increased size to close gap
  { x: 78, y: 198, rotate: 0, scale: 1.18, zIndex: 14, vwX: 20.0, vhY: 23.5 },
  // 6: Hero Center Finale (Couple in white holding hands: large centerpiece, highest z-index)
  { x: 0, y: 0, rotate: 0, scale: 1.26, zIndex: 25, vwX: 0.0, vhY: 0.0 },
];

/**
 * QUINTIC SMOOTHERSTEP EASING
 * First and second derivatives are zero at both ends (zero jerk / silky start & deceleration).
 */
function smootherStep(t) {
  const c = Math.max(0, Math.min(1, t));
  return c * c * c * (c * (c * 6 - 15) + 10);
}


// Harmonious, overlapping card flight schedule across 0.02 to 0.90 scroll progress.
// Overlapping intervals guarantee continuous, liquid motion with ZERO frozen pause gaps.
const CARD_SCHEDULE = [
  { start: 0.02, end: 0.19 }, // 0: Top-Left
  { start: 0.14, end: 0.31 }, // 1: Top-Right
  { start: 0.26, end: 0.43 }, // 2: Center-Left
  { start: 0.38, end: 0.55 }, // 3: Center-Right
  { start: 0.50, end: 0.67 }, // 4: Far-Left Lower
  { start: 0.62, end: 0.79 }, // 5: Far-Right Lower
  { start: 0.74, end: 0.90 }, // 6: Center Finale
];
const BLUR_START = 0.93;

export default function WhatWeDoEditorial() {
  const containerRef = useRef(null);
  const stageRef = useRef(null);
  const matRef = useRef(null);
  // Direct element references for 60fps GPU mutations without React re-renders
  const cardRefs = useRef([]);

  // Animation values & metrics
  const cachedMetrics = useRef({ top: 0, height: 0, totalScroll: 0 });
  const latestScrollY = useRef(0);
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);

  // Mouse Parallax coordinates (normalized -0.5 to 0.5)
  const targetMouseRef = useRef({ x: 0, y: 0 });
  const currentMouseRef = useRef({ x: 0, y: 0 });

  const rafIdRef = useRef(null);
  const isMobileRef = useRef(typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );

  // Viewport & Reduced Motion Detection
  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionChange = (e) => setPrefersReducedMotion(e.matches);
    if (motionQuery.addEventListener) {
      motionQuery.addEventListener('change', handleMotionChange);
    }
    return () => {
      if (motionQuery.removeEventListener) {
        motionQuery.removeEventListener('change', handleMotionChange);
      }
    };
  }, []);

  // Optimized rAF-driven scroll & mouse animation loop with direct DOM updates
  useEffect(() => {
    if (prefersReducedMotion) return;

    let isRunning = true;

    // Cache layout metrics once on mount/resize — NEVER on raw scroll events!
    const measureLayout = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const scrollY = (window.lenis && typeof window.lenis.scroll === 'number')
        ? window.lenis.scroll
        : (window.scrollY || window.pageYOffset || 0);
      const top = rect.top + scrollY;
      const height = rect.height;
      const totalScroll = height - window.innerHeight;
      cachedMetrics.current = { top, height, totalScroll };
      latestScrollY.current = scrollY;
      isMobileRef.current = window.innerWidth < 768;
    };

    // Direct GPU DOM style updater: runs once per animation frame with zero React re-render overhead
    const updateDOM = (progress, mouse) => {
      const isMobile = isMobileRef.current;
      const restingPositions = isMobile ? MOBILE_RESTING : DESKTOP_RESTING;

      // 1. Stage Defocus & Dissolve at end of section
      if (stageRef.current) {
        const endBlur = progress >= BLUR_START
          ? smootherStep((progress - BLUR_START) / (1 - BLUR_START))
          : 0;
        const stageOpacity = 1 - endBlur * 0.85;
        const stageScale = 1 - endBlur * 0.04;
        stageRef.current.style.opacity = stageOpacity;
        stageRef.current.style.transform = stageScale < 0.999 ? `scale(${stageScale.toFixed(3)})` : 'none';
      }

      // 2. Mat Base Offset
      if (matRef.current) {
        matRef.current.style.transform = `translate3d(${mouse.x * 4}px, ${mouse.y * 3}px, 0)`;
      }


      // 5. Update 7 Cards with overlapping, continuous fluid flight
      for (let i = 0; i < PHOTOS.length; i++) {
        const cardEl = cardRefs.current[i];
        if (!cardEl) continue;

        const sched = CARD_SCHEDULE[i];
        const targetPos = restingPositions[i] || { x: 0, y: 0, rotate: 0 };

        let targetX = targetPos.x;
        let targetY = targetPos.y;
        if (isMobile) {
          const vw = window.innerWidth / 100;
          const vh = window.innerHeight / 100;
          if (targetPos.vwX !== undefined) {
            targetX = targetPos.vwX * vw;
          }
          if (targetPos.vhY !== undefined) {
            const maxOffset = vh * 32;
            const computedY = targetPos.vhY * vh;
            targetY = Math.max(-maxOffset, Math.min(maxOffset, computedY));
          }
        }
        const targetScale = isMobile ? (targetPos.scale ?? 1) : 1;
        const targetZ = isMobile ? (targetPos.zIndex ?? (10 + i)) : (10 + i);

        let currentX = 0;
        let currentY = 0;
        let currentRotate = 0;
        let currentOpacity = 0;
        let currentScale = 1;
        let zIndex = 20 + i;

        if (i === 0) {
          currentOpacity = 1;
          if (progress < sched.start) {
            currentX = 0;
            currentY = 0;
            currentRotate = 0;
            currentScale = 1;
            zIndex = 50;
          } else if (progress <= sched.end) {
            const rawT = (progress - sched.start) / (sched.end - sched.start);
            const easedT = smootherStep(rawT);
            currentX = targetX * easedT;
            currentY = targetY * easedT;
            currentRotate = targetPos.rotate * easedT;
            const liftArc = Math.sin(easedT * Math.PI);
            currentScale = (1 + (targetScale - 1) * easedT) + liftArc * 0.045;
            zIndex = 45;
          } else {
            currentX = targetX;
            currentY = targetY;
            currentRotate = targetPos.rotate;
            currentScale = targetScale;
            zIndex = targetZ;
          }
        } else {
          // Soft pre-materialization onto deck so the card appears gracefully before taking flight
          const appearStart = Math.max(0, sched.start - 0.08);
          if (progress < appearStart) {
            currentOpacity = 0;
            currentX = 0;
            currentY = 0;
            currentRotate = 0;
            currentScale = 0.92;
          } else if (progress < sched.start) {
            const fadeProgress = (progress - appearStart) / (sched.start - appearStart);
            const easedFade = smootherStep(fadeProgress);
            currentOpacity = easedFade;
            currentScale = 0.92 + easedFade * (targetScale * 0.08);
            currentX = 0;
            currentY = 0;
            currentRotate = 0;
            zIndex = 35 + i;
          } else if (progress <= sched.end) {
            currentOpacity = 1;
            const rawT = (progress - sched.start) / (sched.end - sched.start);
            const easedT = smootherStep(rawT);
            currentX = targetX * easedT;
            currentY = targetY * easedT;
            currentRotate = targetPos.rotate * easedT;
            const liftArc = Math.sin(easedT * Math.PI);
            currentScale = (1 + (targetScale - 1) * easedT) + liftArc * 0.045;
            zIndex = 45;
          } else {
            currentOpacity = 1;
            currentX = targetX;
            currentY = targetY;
            currentRotate = targetPos.rotate;
            currentScale = targetScale;
            zIndex = targetZ;
          }
        }

        const parallaxWeight = isMobile ? 0 : 8 + i * 2;
        const parallaxX = mouse.x * parallaxWeight;
        const parallaxY = mouse.y * (parallaxWeight * 0.7);

        cardEl.style.transform = `translate3d(${(currentX + parallaxX).toFixed(2)}px, ${(currentY + parallaxY).toFixed(2)}px, 0) rotate(${currentRotate.toFixed(2)}deg) scale(${currentScale.toFixed(3)})`;
        cardEl.style.opacity = currentOpacity.toFixed(3);
        cardEl.style.zIndex = zIndex;
      }


    };

    // Continuous, buttery-smooth 60fps-120fps animation loop
    const loop = () => {
      if (!isRunning) return;

      // Real-time animated scroll sync from Lenis
      const scrollY = (window.lenis && typeof window.lenis.scroll === 'number')
        ? window.lenis.scroll
        : (window.scrollY || window.pageYOffset || 0);

      const { top, totalScroll } = cachedMetrics.current;
      if (totalScroll > 0) {
        const currentScroll = scrollY - top;
        const progress = Math.max(0, Math.min(1, currentScroll / totalScroll));
        targetProgressRef.current = progress;
      }

      // Responsive, fluid LERP damping synchronized with Lenis
      const isLenis = !!(window.lenis && typeof window.lenis.scroll === 'number');
      const lerpSpeed = isLenis ? 0.16 : 0.07;
      const scrollDiff = targetProgressRef.current - currentProgressRef.current;
      if (Math.abs(scrollDiff) > 0.000008) {
        currentProgressRef.current += scrollDiff * lerpSpeed;
      } else {
        currentProgressRef.current = targetProgressRef.current;
      }

      // Mouse Parallax Damping (0.06)
      const mouseDiffX = targetMouseRef.current.x - currentMouseRef.current.x;
      const mouseDiffY = targetMouseRef.current.y - currentMouseRef.current.y;
      if (Math.abs(mouseDiffX) > 0.0002 || Math.abs(mouseDiffY) > 0.0002) {
        currentMouseRef.current.x += mouseDiffX * 0.06;
        currentMouseRef.current.y += mouseDiffY * 0.06;
      }

      // Only mutate DOM elements if section is near viewport or state is actively changing
      const isOutOfView = typeof window !== 'undefined' && (
        scrollY < top - window.innerHeight || scrollY > top + totalScroll + window.innerHeight
      );
      const isProgressSettled = Math.abs(scrollDiff) <= 0.000008;
      const isMouseSettled = Math.abs(mouseDiffX) <= 0.0002 && Math.abs(mouseDiffY) <= 0.0002;

      if (!isOutOfView || !isProgressSettled || !isMouseSettled) {
        updateDOM(currentProgressRef.current, currentMouseRef.current);
      }

      rafIdRef.current = requestAnimationFrame(loop);
    };

    measureLayout();
    currentProgressRef.current = targetProgressRef.current;
    updateDOM(currentProgressRef.current, currentMouseRef.current);

    rafIdRef.current = requestAnimationFrame(loop);

    // Passive scroll handler + Lenis scroll sync
    const handleScroll = () => {
      latestScrollY.current = (window.lenis && typeof window.lenis.scroll === 'number')
        ? window.lenis.scroll
        : (window.scrollY || window.pageYOffset);
    };

    let unsubLenis = null;
    if (window.lenis && typeof window.lenis.on === 'function') {
      unsubLenis = window.lenis.on('scroll', (e) => {
        latestScrollY.current = e.scroll !== undefined ? e.scroll : window.scrollY;
      });
    }

    const handleResize = () => {
      measureLayout();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      isRunning = false;
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      if (typeof unsubLenis === 'function') unsubLenis();
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [prefersReducedMotion]);

  const handleMouseMove = (e) => {
    if (isMobileRef.current) return;
    const { clientX, clientY } = e;
    targetMouseRef.current = {
      x: clientX / window.innerWidth - 0.5,
      y: clientY / window.innerHeight - 0.5,
    };
  };

  const handleMouseLeave = () => {
    targetMouseRef.current = { x: 0, y: 0 };
  };

  // PHASE 8 — ACCESSIBILITY: Reduced Motion fallback
  if (prefersReducedMotion) {
    return (
      <section
        id="what-we-do"
        className="w-full bg-[#FDFCF8] py-20 px-6 sm:px-12 flex items-center justify-center min-h-screen"
      >
        <div className="max-w-[1200px] w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-center justify-center">
          {PHOTOS.map((src, idx) => (
            <div
              key={idx}
              className="aspect-[3/4] bg-[#F3F0E9] p-2 border-[1.5px] border-[#101010] shadow-[0_12px_28px_-8px_rgba(16,14,12,0.16)] rounded-[2px]"
            >
              <div className="w-full h-full overflow-hidden border border-[#E3DBCC]">
                <img
                  src={src}
                  alt={PHOTO_METADATA[idx] || `Editorial Print ${idx + 1}`}
                  title={PHOTO_TITLES[idx] || `Photography in Mumbai – Frame 0${idx + 1}`}
                  width="190"
                  height="253"
                  className="w-full h-full object-cover select-none"
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      id="what-we-do"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full bg-[#FDFCF8] select-none"
      style={{
        height: '650vh',
      }}
    >
      <div className="sr-only">
        <h2>Our Photography Portfolio</h2>
        <p>Curated fine-art wedding, pre-wedding, and portrait monographs captured in Mumbai by Dishant Shelar.</p>
      </div>
      {/* Keyframes for subtle organic floating drift once in resting position */}
      <style>{`
        @keyframes editorialDrift {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-4px) rotate(0.4deg);
          }
        }
        @keyframes editorialDriftAlt {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-5px) rotate(-0.4deg);
          }
        }
        @media (max-width: 768px) {
          .editorial-photo-card {
            width: clamp(100px, min(29vw, 21vh), 136px) !important;
            box-shadow: 0 10px 25px -4px rgba(0, 0, 0, 0.12), 0 4px 10px -2px rgba(0, 0, 0, 0.08) !important;
            border-radius: 18px !important;
            border: none !important;
            outline: none !important;
            -webkit-box-reflect: none !important;
          }
          .editorial-photo-card > div,
          .editorial-photo-card img {
            border-radius: 18px !important;
          }
          .editorial-photo-card > div {
            animation: none !important;
          }
          .editorial-photo-card::before,
          .editorial-photo-card::after,
          .editorial-photo-card *::before,
          .editorial-photo-card *::after {
            display: none !important;
            content: none !important;
          }
        }
      `}</style>

      {/* Pinned 100vh Sticky Stage with End Defocus Blur */}
      <div
        ref={stageRef}
        className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden px-4 sm:px-8 will-change-transform"
        style={{
          transition: 'opacity 0.2s ease-out, transform 0.2s ease-out',
        }}
      >
        {/* CENTRAL DECK STAGE CONTAINER */}
        <div className="relative w-full max-w-[1600px] h-[390px] sm:h-[460px] md:h-[620px] flex items-center justify-center overflow-visible px-2 sm:px-4">
          {/* Deck Physical Stack Base / Mat Outline */}
          <div
            ref={matRef}
            className="hidden md:block absolute w-[100px] sm:w-[145px] md:w-[190px] aspect-[3/4] rounded-lg bg-[#E3DBCC]/20 pointer-events-none -z-10 shadow-[0_8px_24px_-8px_rgba(16,14,12,0.08)] will-change-transform"
          />

          {/* Cards 0 through 6 */}
          {PHOTOS.map((src, i) => {
            const floatAnimation = `${i % 2 === 0 ? 'editorialDrift' : 'editorialDriftAlt'} ${5.5 + i * 0.6}s ease-in-out infinite`;
            const normalShadow = '0 24px 50px -10px rgba(16, 14, 12, 0.32), 0 12px 24px -6px rgba(16, 14, 12, 0.2), 0 3px 8px rgba(16, 14, 12, 0.1)';
            const mobileShadow = '0 6px 16px rgba(0, 0, 0, 0.12)';
            const hoverShadow = '0 38px 75px -12px rgba(16, 14, 12, 0.44), 0 18px 36px -6px rgba(16, 14, 12, 0.28), 0 4px 12px rgba(16, 14, 12, 0.15)';

            return (
              <div
                key={i}
                ref={(el) => (cardRefs.current[i] = el)}
                onMouseEnter={(e) => {
                  if (!isMobileRef.current) {
                    e.currentTarget.style.zIndex = '65';
                    e.currentTarget.style.boxShadow = hoverShadow;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isMobileRef.current) {
                    e.currentTarget.style.zIndex = `${10 + i}`;
                    e.currentTarget.style.boxShadow = normalShadow;
                  }
                }}
                className="editorial-photo-card absolute w-[clamp(100px,min(29vw,21vh),136px)] sm:w-[145px] md:w-[190px] aspect-[3/4] rounded-[18px] overflow-hidden will-change-[transform,opacity] group cursor-pointer border-0 outline-none"
                style={{
                  opacity: i === 0 ? 1 : 0,
                  transform: 'translate3d(0, 0, 0)',
                  boxShadow: isMobileRef.current ? mobileShadow : normalShadow,
                  transition: 'box-shadow 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                  WebkitBoxReflect: 'none',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* Inner Breathing/Floating Drift Wrapper */}
                <div
                  className="w-full h-full relative overflow-hidden rounded-xl"
                  style={{ animation: floatAnimation }}
                >
                  {/* Clean Borderless Archival Photograph with responsive srcset */}
                  <div className="w-full h-full overflow-hidden rounded-xl relative">
                    <img
                      src={src.w300}
                      srcSet={`${src.w300} 300w, ${src.full} 600w`}
                      sizes="(max-width: 768px) 140px, 190px"
                      alt={PHOTO_METADATA[i] || `Atelier Portfolio Print ${i + 1}`}
                      title={PHOTO_TITLES[i] || `Wedding & Portrait Photography in Mumbai – Frame 0${i + 1}`}
                      width="190"
                      height="253"
                      style={{ aspectRatio: '3 / 4' }}
                      className="w-full h-full object-cover select-none pointer-events-none transition-transform duration-700 ease-out group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                      draggable={false}
                    />

                    {/* Subtle Vignette on Hover */}
                    <div className="hidden md:block absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none" />
                  </div>

                  {/* Editorial Frame Index on Hover */}
                  <div className="hidden md:flex absolute bottom-1.5 left-2 right-2 items-center justify-between text-[0.45rem] font-mono tracking-widest text-white/90 uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <span>FRAME 0{i + 1}</span>
                    <span>ARCHIVE</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
