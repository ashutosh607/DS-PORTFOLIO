import React, { useRef, useState, useEffect } from 'react';

import img01 from '../../assets/landing-down-animation/612A9674.jpg';
import img02 from '../../assets/landing-down-animation/DSP09982.jpg';
import img03 from '../../assets/landing-down-animation/IMG_1186.jpg';
import img04 from '../../assets/landing-down-animation/IMG_7783.jpg';
import img05 from '../../assets/landing-down-animation/IMG_7785.JPG';
import img06 from '../../assets/landing-down-animation/_0005916.JPG';
import img07 from '../../assets/landing-down-animation/_0006027.jpg';

/**
 * 7 Curated atelier photographs from assets/landing-down-animation.
 */
const PHOTOS = [
  img01,
  img02,
  img03,
  img04,
  img05,
  img06,
  img07,
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
  { x: -290, y: -120, rotate: -3.0 }, // 0: Top-Left
  { x: 280, y: -130, rotate: 2.5 },  // 1: Top-Right
  { x: -170, y: 55, rotate: 1.5 },  // 2: Center-Left
  { x: 165, y: 65, rotate: -2.0 }, // 3: Center-Right
  { x: -350, y: 130, rotate: -3.5 }, // 4: Far-Left Lower
  { x: 345, y: 120, rotate: 3.0 },  // 5: Far-Right Lower
  { x: 0, y: -15, rotate: -0.5 }, // 6: Center Finale
];

const MOBILE_RESTING = [
  { x: -62, y: -70, rotate: -2.5 }, // 0: Upper-Left
  { x: 62, y: -60, rotate: 2.5 },  // 1: Upper-Right
  { x: -60, y: 0, rotate: 1.5 },  // 2: Mid-Left
  { x: 60, y: 10, rotate: -1.5 }, // 3: Mid-Right
  { x: -62, y: 70, rotate: -2.5 }, // 4: Lower-Left
  { x: 62, y: 80, rotate: 2.5 },  // 5: Lower-Right
  { x: 0, y: 105, rotate: 0.0 },  // 6: Bottom Center
];

/**
 * QUINTIC SMOOTHERSTEP EASING
 * First and second derivatives are zero at both ends (zero jerk / silky start & deceleration).
 */
function smootherStep(t) {
  const c = Math.max(0, Math.min(1, t));
  return c * c * c * (c * (c * 6 - 15) + 10);
}

/**
 * EDITORIAL SCROLL BEATS (Zero-Overlap Phased Typography)
 * Each beat defines strictly segregated start, peak, and end scroll windows.
 * Guaranteed buffer gaps ensure one beat completely fades out before the next begins.
 */
const EDITORIAL_BEATS = [
  {
    id: 1,
    start: 0.00,
    peakStart: 0.04,
    peakEnd: 0.28,
    end: 0.34,
    left: {
      eyebrow: '01 · VISION',
      title: 'We capture the real,',
      italic: 'the unscripted.',
      subtitle: 'Honest emotion suspended between quiet breaths.',
    },
    right: {
      eyebrow: 'ATELIER CRAFT',
      title: 'Natural ambient light,',
      italic: 'held in time.',
      subtitle: 'Photographed in 35mm & medium format stillness.',
    },
  },
  {
    id: 2,
    start: 0.32,
    peakStart: 0.38,
    peakEnd: 0.62,
    end: 0.68,
    left: {
      eyebrow: '02 · DISCIPLINE',
      title: 'Every single frame holds an',
      italic: 'enduring story.',
      subtitle: 'Moments that outlast fleeting fashion and trend.',
    },
    right: {
      eyebrow: 'ARCHIVAL STANDARD',
      title: 'Fine art monographs in',
      italic: 'silver & tone.',
      subtitle: 'Pure fiber prints crafted with museum longevity.',
    },
  },
  {
    id: 3,
    start: 0.66,
    peakStart: 0.72,
    peakEnd: 0.94,
    end: 1.00,
    left: {
      eyebrow: '03 · ESSENCE',
      title: 'Framed in light,',
      italic: 'held in memory.',
      subtitle: 'Artistic direction rooted in timeless presence.',
    },
    right: {
      eyebrow: 'FOLIO ARCHIVE',
      title: 'Your legacy in silver',
      italic: '& shadow.',
      subtitle: 'Curated proofs ready for bespoke presentation.',
    },
  },
];

/**
 * Calculates optical lens blur-to-real transition values strictly tied to scroll progress.
 * Returns { opacity, blur, y, visible }
 */
function calculateBeatStyle(progress, start, peakStart, peakEnd, end) {
  if (progress < start || progress > end) {
    return {
      opacity: 0,
      blur: 16,
      y: 18,
      visible: false,
    };
  }

  // Smooth lens entry: blur slides from 16px down to 0px, opacity 0 to 1
  if (progress < peakStart) {
    const t = (progress - start) / (peakStart - start);
    const eased = smootherStep(t);
    return {
      opacity: eased,
      blur: (1 - eased) * 16,
      y: (1 - eased) * 18,
      visible: true,
    };
  }

  // Peak clarity: pin-sharp, perfectly legible
  if (progress <= peakEnd) {
    return {
      opacity: 1,
      blur: 0,
      y: 0,
      visible: true,
    };
  }

  // Soft dissolution exit: blurs out to 14px as opacity drops to 0
  const t = (progress - peakEnd) / (end - peakEnd);
  const eased = smootherStep(t);
  return {
    opacity: 1 - eased,
    blur: eased * 14,
    y: -eased * 14,
    visible: true,
  };
}

const PAUSE_DURATION = 0.035;
const MOVE_DURATION = 0.095;
const CARD_CYCLE = PAUSE_DURATION + MOVE_DURATION; // 0.13
const BLUR_START = 0.925;

export default function WhatWeDoEditorial() {
  const containerRef = useRef(null);
  const stageRef = useRef(null);
  const matRef = useRef(null);
  const counterRef = useRef(null);

  // Direct element references for 60fps GPU mutations without React re-renders
  const cardRefs = useRef([]);
  const leftBeatRefs = useRef({});
  const rightBeatRefs = useRef({});
  const mobileTopBeatRefs = useRef({});
  const mobileBottomBeatRefs = useRef({});

  // Animation values & metrics
  const cachedMetrics = useRef({ top: 0, height: 0, totalScroll: 0 });
  const latestScrollY = useRef(0);
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const currentActiveCount = useRef(1);

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
      const scrollY = window.scrollY || window.pageYOffset;
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

      // 4. Odometer Card Count
      const activeCount = Math.min(7, Math.max(1, Math.floor(progress / CARD_CYCLE) + 1));
      if (counterRef.current && currentActiveCount.current !== activeCount) {
        currentActiveCount.current = activeCount;
        counterRef.current.textContent = `0${activeCount}`;
      }

      // 5. Update 7 Cards
      for (let i = 0; i < PHOTOS.length; i++) {
        const cardEl = cardRefs.current[i];
        if (!cardEl) continue;

        const startCycle = i * CARD_CYCLE;
        const startMove = startCycle + PAUSE_DURATION;
        const endMove = startCycle + CARD_CYCLE;
        const targetPos = restingPositions[i] || { x: 0, y: 0, rotate: 0 };

        let currentX = 0;
        let currentY = 0;
        let currentRotate = 0;
        let currentOpacity = 0;
        let currentScale = 1;
        let zIndex = 20 + i;

        if (i === 0) {
          currentOpacity = 1;
          if (progress < startMove) {
            currentX = 0;
            currentY = 0;
            currentRotate = 0;
            currentScale = 1;
            zIndex = 50;
          } else if (progress <= endMove) {
            const rawT = (progress - startMove) / MOVE_DURATION;
            const easedT = smootherStep(rawT);
            currentX = targetPos.x * easedT;
            currentY = targetPos.y * easedT;
            currentRotate = targetPos.rotate * easedT;
            const liftArc = Math.sin(rawT * Math.PI);
            currentScale = 1 + liftArc * 0.055;
            zIndex = 45;
          } else {
            currentX = targetPos.x;
            currentY = targetPos.y;
            currentRotate = targetPos.rotate;
            currentScale = 1;
            zIndex = 10 + i;
          }
        } else {
          const predStartMove = (i - 1) * CARD_CYCLE + PAUSE_DURATION;
          if (progress < predStartMove) {
            currentOpacity = 0;
            currentX = 0;
            currentY = 0;
            currentRotate = 0;
          } else if (progress < startMove) {
            const fadeWindow = 0.02;
            currentOpacity = progress < predStartMove + fadeWindow
              ? (progress - predStartMove) / fadeWindow
              : 1;
            currentX = 0;
            currentY = 0;
            currentRotate = 0;
            currentScale = 1;
            zIndex = 50;
          } else if (progress <= endMove) {
            currentOpacity = 1;
            const rawT = (progress - startMove) / MOVE_DURATION;
            const easedT = smootherStep(rawT);
            currentX = targetPos.x * easedT;
            currentY = targetPos.y * easedT;
            currentRotate = targetPos.rotate * easedT;
            const liftArc = Math.sin(rawT * Math.PI);
            currentScale = 1 + liftArc * 0.055;
            zIndex = 45;
          } else {
            currentOpacity = 1;
            currentX = targetPos.x;
            currentY = targetPos.y;
            currentRotate = targetPos.rotate;
            currentScale = 1;
            zIndex = 10 + i;
          }
        }

        const parallaxWeight = isMobile ? 0 : 8 + i * 2;
        const parallaxX = mouse.x * parallaxWeight;
        const parallaxY = mouse.y * (parallaxWeight * 0.7);

        cardEl.style.transform = `translate3d(${(currentX + parallaxX).toFixed(2)}px, ${(currentY + parallaxY).toFixed(2)}px, 0) rotate(${currentRotate.toFixed(2)}deg) scale(${currentScale.toFixed(3)})`;
        cardEl.style.opacity = currentOpacity.toFixed(3);
        cardEl.style.zIndex = zIndex;
      }

      // 6. Update Editorial Typography Beats (Desktop & Mobile)
      EDITORIAL_BEATS.forEach((beat) => {
        const beatStyle = calculateBeatStyle(progress, beat.start, beat.peakStart, beat.peakEnd, beat.end);

        const leftEl = leftBeatRefs.current[beat.id];
        if (leftEl) {
          leftEl.style.opacity = beatStyle.visible ? beatStyle.opacity.toFixed(3) : '0';
          leftEl.style.transform = beatStyle.visible ? `translateY(${beatStyle.y.toFixed(1)}px)` : 'translateY(18px)';
          leftEl.style.filter = beatStyle.visible && beatStyle.blur > 0.1 ? `blur(${beatStyle.blur.toFixed(1)}px)` : 'none';
        }

        const rightEl = rightBeatRefs.current[beat.id];
        if (rightEl) {
          rightEl.style.opacity = beatStyle.visible ? beatStyle.opacity.toFixed(3) : '0';
          rightEl.style.transform = beatStyle.visible ? `translateY(${beatStyle.y.toFixed(1)}px)` : 'translateY(18px)';
          rightEl.style.filter = beatStyle.visible && beatStyle.blur > 0.1 ? `blur(${beatStyle.blur.toFixed(1)}px)` : 'none';
        }

        const mobileTopEl = mobileTopBeatRefs.current[beat.id];
        if (mobileTopEl) {
          mobileTopEl.style.opacity = beatStyle.visible ? beatStyle.opacity.toFixed(3) : '0';
          mobileTopEl.style.transform = beatStyle.visible ? `translateY(${beatStyle.y.toFixed(1)}px)` : 'translateY(18px)';
          mobileTopEl.style.filter = beatStyle.visible && beatStyle.blur > 0.1 ? `blur(${beatStyle.blur.toFixed(1)}px)` : 'none';
        }

        const mobileBottomEl = mobileBottomBeatRefs.current[beat.id];
        if (mobileBottomEl) {
          mobileBottomEl.style.opacity = beatStyle.visible ? beatStyle.opacity.toFixed(3) : '0';
          mobileBottomEl.style.transform = beatStyle.visible ? `translateY(${-beatStyle.y.toFixed(1)}px)` : 'translateY(-18px)';
          mobileBottomEl.style.filter = beatStyle.visible && beatStyle.blur > 0.1 ? `blur(${beatStyle.blur.toFixed(1)}px)` : 'none';
        }
      });
    };

    // Smooth continuous animation frame loop
    const loop = () => {
      if (!isRunning) return;

      const { top, totalScroll } = cachedMetrics.current;
      if (totalScroll > 0) {
        const currentScroll = latestScrollY.current - top;
        const progress = Math.max(0, Math.min(1, currentScroll / totalScroll));
        targetProgressRef.current = progress;
      }

      // Responsive, fluid LERP damping (0.14 feels instantaneous yet silky smooth)
      const scrollDiff = targetProgressRef.current - currentProgressRef.current;
      if (Math.abs(scrollDiff) > 0.00004) {
        currentProgressRef.current += scrollDiff * 0.14;
      } else {
        currentProgressRef.current = targetProgressRef.current;
      }

      // Mouse Parallax Damping (0.08)
      const mouseDiffX = targetMouseRef.current.x - currentMouseRef.current.x;
      const mouseDiffY = targetMouseRef.current.y - currentMouseRef.current.y;
      if (Math.abs(mouseDiffX) > 0.0003 || Math.abs(mouseDiffY) > 0.0003) {
        currentMouseRef.current.x += mouseDiffX * 0.08;
        currentMouseRef.current.y += mouseDiffY * 0.08;
      }

      // Mutate DOM elements directly for buttery-smooth 60fps-120fps motion
      updateDOM(currentProgressRef.current, currentMouseRef.current);

      rafIdRef.current = requestAnimationFrame(loop);
    };

    measureLayout();
    currentProgressRef.current = targetProgressRef.current;
    updateDOM(currentProgressRef.current, currentMouseRef.current);

    rafIdRef.current = requestAnimationFrame(loop);

    // Passive scroll handler: records position without ANY layout reading!
    const handleScroll = () => {
      latestScrollY.current = window.scrollY || window.pageYOffset;
    };

    const handleResize = () => {
      measureLayout();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      isRunning = false;
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
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
      <h2 className="sr-only">
        What We Do — Fine Art Wedding &amp; Portrait Photography Atelier in Mumbai
      </h2>
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
      `}</style>

      {/* Pinned 100vh Sticky Stage with End Defocus Blur */}
      <div
        ref={stageRef}
        className="sticky top-0 h-screen w-full flex flex-col justify-between items-center overflow-hidden px-4 sm:px-8 pt-[86px] sm:pt-8 pb-5 sm:pb-8 will-change-transform"
        style={{
          transition: 'opacity 0.2s ease-out, transform 0.2s ease-out',
        }}
      >
        {/* =================================================================
            TOP ARCHIVAL HEADER BAR: Dynamic Print Counter & Minimal Mark
            ================================================================= */}
        <div className="w-full max-w-[1400px] flex items-center justify-between pointer-events-none z-30">
          <div className="flex items-center gap-3 font-mono text-[0.6rem] sm:text-[0.66rem] tracking-[0.24em] text-[#7A7770] uppercase">
            <span className="w-6 sm:w-10 h-[1px] bg-[#E3DBCC]" />
            <span className="text-[#101010] font-medium tracking-[0.28em]">WHAT WE DO</span>
            <span className="w-6 sm:w-10 h-[1px] bg-[#E3DBCC]" />
          </div>

          {/* Dynamic Card Deal Odometer Counter */}
          <div className="flex items-center gap-2 font-mono text-[0.62rem] sm:text-[0.68rem] tracking-[0.22em] text-[#7A7770] uppercase">
            <span
              ref={counterRef}
              className="text-[#101010] font-semibold text-xs tracking-[0.24em] transition-all duration-300"
            >
              01
            </span>
            <span className="w-3 h-[1px] bg-[#101010]/30" />
            <span>07 ARCHIVE</span>
          </div>
        </div>

        {/* =================================================================
            MOBILE TOP EDITORIAL TEXT (BLUR-TO-REAL SCROLL DRIVEN)
            ================================================================= */}
        <div className="md:hidden w-full max-w-[360px] px-3 text-center pointer-events-none select-none z-20 relative min-h-[92px] flex items-center justify-center mt-3 mb-1 translate-y-[58px]">
          {EDITORIAL_BEATS.map((beat) => (
            <div
              key={`mobile-top-${beat.id}`}
              ref={(el) => (mobileTopBeatRefs.current[beat.id] = el)}
              className="absolute inset-0 flex flex-col items-center justify-center transition-none will-change-[transform,opacity]"
              style={{ opacity: 0 }}
            >
              <div className="flex items-center gap-2 font-mono text-[0.6rem] sm:text-[0.62rem] tracking-[0.26em] text-[#7A7770] font-semibold uppercase mb-1">
                <span className="w-3 h-[1px] bg-[#E3DBCC]" />
                <span>{beat.left.eyebrow}</span>
                <span className="w-3 h-[1px] bg-[#E3DBCC]" />
              </div>
              <h4
                className="font-serif text-[clamp(1.3rem,4.8vw,1.65rem)] font-normal text-[#101010] leading-[1.18] tracking-[-0.02em]"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                {beat.left.title}{' '}
                <span className="italic font-light text-[#101010]">{beat.left.italic}</span>
              </h4>
              <p className="font-sans text-[clamp(0.76rem,2.6vw,0.88rem)] text-[#4A4844] font-normal leading-snug tracking-wide mt-1 max-w-[310px]">
                {beat.left.subtitle}
              </p>
            </div>
          ))}
        </div>

        {/* =================================================================
            CENTRAL DECK STAGE CONTAINER
            ================================================================= */}
        <div className="relative w-full max-w-[1400px] h-[300px] sm:h-[460px] md:h-[620px] flex items-center justify-center flex-1 my-auto">
          {/* Deck Physical Stack Base / Mat Outline */}
          <div
            ref={matRef}
            className="absolute w-[100px] sm:w-[145px] md:w-[190px] aspect-[3/4] rounded-lg bg-[#E3DBCC]/20 pointer-events-none -z-10 shadow-[0_8px_24px_-8px_rgba(16,14,12,0.08)] will-change-transform"
          />

          {/* Cards 0 through 6 */}
          {PHOTOS.map((src, i) => {
            const floatAnimation = `${i % 2 === 0 ? 'editorialDrift' : 'editorialDriftAlt'} ${5.5 + i * 0.6}s ease-in-out infinite`;
            const normalShadow = '0 24px 50px -10px rgba(16, 14, 12, 0.32), 0 12px 24px -6px rgba(16, 14, 12, 0.2), 0 3px 8px rgba(16, 14, 12, 0.1)';
            const hoverShadow = '0 38px 75px -12px rgba(16, 14, 12, 0.44), 0 18px 36px -6px rgba(16, 14, 12, 0.28), 0 4px 12px rgba(16, 14, 12, 0.15)';

            return (
              <div
                key={i}
                ref={(el) => (cardRefs.current[i] = el)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.zIndex = '65';
                  e.currentTarget.style.boxShadow = hoverShadow;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.zIndex = `${10 + i}`;
                  e.currentTarget.style.boxShadow = normalShadow;
                }}
                className="absolute w-[100px] sm:w-[145px] md:w-[190px] aspect-[3/4] rounded-xl overflow-hidden will-change-transform group cursor-pointer"
                style={{
                  opacity: i === 0 ? 1 : 0,
                  transform: 'translate3d(0, 0, 0)',
                  boxShadow: normalShadow,
                  transition: 'box-shadow 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                {/* Inner Breathing/Floating Drift Wrapper */}
                <div
                  className="w-full h-full relative overflow-hidden rounded-xl"
                  style={{ animation: floatAnimation }}
                >
                  {/* Clean Borderless Archival Photograph */}
                  <div className="w-full h-full overflow-hidden rounded-xl relative">
                    <img
                      src={src}
                      alt={PHOTO_METADATA[i] || `Atelier Portfolio Print ${i + 1}`}
                      width="190"
                      height="253"
                      className="w-full h-full object-cover select-none pointer-events-none transition-transform duration-700 ease-out group-hover:scale-105"
                      loading={i <= 1 ? 'eager' : 'lazy'}
                      draggable={false}
                    />

                    {/* Subtle Vignette on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none" />
                  </div>

                  {/* Subtle Minimal Archival Plate Watermark on Hover */}
                  <div className="absolute bottom-1.5 left-2 right-2 flex items-center justify-between text-[0.45rem] font-mono tracking-widest text-white/90 uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <span>PLATE 0{i + 1}</span>
                    <span>ATELIER PROOF</span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* =================================================================
              LEFT EDITORIAL TYPOGRAPHY FLANK (BLUR-TO-REAL SCROLL DRIVEN)
              ================================================================= */}
          <div className="hidden md:block absolute left-2 lg:left-6 xl:left-10 top-1/2 -translate-y-1/2 z-20 pointer-events-none select-none max-w-[210px] lg:max-w-[260px] xl:max-w-[280px] text-left">
            {EDITORIAL_BEATS.map((beat) => (
              <div
                key={`left-${beat.id}`}
                ref={(el) => (leftBeatRefs.current[beat.id] = el)}
                className="transition-none will-change-[transform,opacity]"
                style={{ opacity: 0 }}
              >
                <div className="flex items-center gap-2 font-mono text-[0.58rem] sm:text-[0.62rem] tracking-[0.24em] text-[#7A7770] uppercase mb-2">
                  <span className="w-4 h-[1px] bg-[#E3DBCC]" />
                  <span>{beat.left.eyebrow}</span>
                </div>
                <h3
                  className="font-serif text-[clamp(1.35rem,2.1vw,1.95rem)] font-normal text-[#101010] leading-[1.12] tracking-[-0.02em]"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  {beat.left.title}
                  <br />
                  <span className="italic font-light text-[#101010]">{beat.left.italic}</span>
                </h3>
                <p className="font-sans text-[clamp(0.72rem,0.9vw,0.84rem)] text-[#7A7770] leading-relaxed mt-2.5 font-light">
                  {beat.left.subtitle}
                </p>
              </div>
            ))}
          </div>

          {/* =================================================================
              RIGHT EDITORIAL TYPOGRAPHY FLANK (BLUR-TO-REAL SCROLL DRIVEN)
              ================================================================= */}
          <div className="hidden md:block absolute right-2 lg:right-6 xl:right-10 top-1/2 -translate-y-1/2 z-20 pointer-events-none select-none max-w-[210px] lg:max-w-[260px] xl:max-w-[280px] text-right">
            {EDITORIAL_BEATS.map((beat) => (
              <div
                key={`right-${beat.id}`}
                ref={(el) => (rightBeatRefs.current[beat.id] = el)}
                className="transition-none will-change-[transform,opacity]"
                style={{ opacity: 0 }}
              >
                <div className="flex items-center justify-end gap-2 font-mono text-[0.58rem] sm:text-[0.62rem] tracking-[0.24em] text-[#7A7770] uppercase mb-2">
                  <span>{beat.right.eyebrow}</span>
                  <span className="w-4 h-[1px] bg-[#E3DBCC]" />
                </div>
                <h3
                  className="font-serif text-[clamp(1.35rem,2.1vw,1.95rem)] font-normal text-[#101010] leading-[1.12] tracking-[-0.02em]"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  {beat.right.title}
                  <br />
                  <span className="italic font-light text-[#101010]">{beat.right.italic}</span>
                </h3>
                <p className="font-sans text-[clamp(0.72rem,0.9vw,0.84rem)] text-[#7A7770] leading-relaxed mt-2.5 font-light ml-auto">
                  {beat.right.subtitle}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* =================================================================
            MOBILE BOTTOM EDITORIAL TEXT (BLUR-TO-REAL SCROLL DRIVEN)
            ================================================================= */}
        <div className="md:hidden w-full max-w-[360px] px-3 text-center pointer-events-none select-none z-20 relative min-h-[92px] flex items-center justify-center mt-1 mb-8 -translate-y-[58px]">
          {EDITORIAL_BEATS.map((beat) => (
            <div
              key={`mobile-bottom-${beat.id}`}
              ref={(el) => (mobileBottomBeatRefs.current[beat.id] = el)}
              className="absolute inset-0 flex flex-col items-center justify-center transition-none will-change-[transform,opacity]"
              style={{ opacity: 0 }}
            >
              <h4
                className="font-serif text-[clamp(1.25rem,4.5vw,1.6rem)] font-normal text-[#101010] leading-[1.18] tracking-[-0.02em]"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                {beat.right.title}{' '}
                <span className="italic font-light text-[#101010]">{beat.right.italic}</span>
              </h4>
              <div className="flex items-center gap-2 font-mono text-[0.58rem] sm:text-[0.62rem] tracking-[0.26em] text-[#7A7770] font-semibold uppercase mt-1">
                <span className="w-3 h-[1px] bg-[#E3DBCC]" />
                <span>{beat.right.eyebrow}</span>
                <span className="w-3 h-[1px] bg-[#E3DBCC]" />
              </div>
              <p className="font-sans text-[clamp(0.74rem,2.5vw,0.86rem)] text-[#4A4844] font-normal leading-snug tracking-wide mt-1 max-w-[310px]">
                {beat.right.subtitle}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
