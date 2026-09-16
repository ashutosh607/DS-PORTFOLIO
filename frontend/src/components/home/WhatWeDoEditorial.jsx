import React, { useRef, useState, useEffect } from 'react';

/**
 * PHASE 9 — PHOTO COUNT & ASSETS
 * 7 Curated atelier photographs, all identically cropped to 3:4 aspect ratio.
 */
const PHOTOS = [
  'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000&auto=format&fit=crop', // 0: Veil & Monolith
  'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=1000&auto=format&fit=crop', // 1: Coastal Promenade
  'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1000&auto=format&fit=crop', // 2: Fine Lace Study
  'https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=1000&auto=format&fit=crop', // 3: Intimate Gaze
  'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=1000&auto=format&fit=crop', // 4: Meadow Embrace
  'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1000&auto=format&fit=crop', // 5: Terrace Ceremony
  'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=1000&auto=format&fit=crop', // 6: Artisanal Bouquet
];

/**
 * REFINED EDITORIAL RESTING POSITIONS
 * Proportionally scaled for refined, smaller card dimensions.
 * Creates an exquisite, airy, balanced layout with ample negative space.
 */
const DESKTOP_RESTING = [
  { x: -290, y: -120, rotate: -3.0 }, // 0: Top-Left
  { x: 280,  y: -130, rotate: 2.5 },  // 1: Top-Right
  { x: -170, y: 55,   rotate: 1.5 },  // 2: Center-Left
  { x: 165,  y: 65,   rotate: -2.0 }, // 3: Center-Right
  { x: -350, y: 130,  rotate: -3.5 }, // 4: Far-Left Lower
  { x: 345,  y: 120,  rotate: 3.0 },  // 5: Far-Right Lower
  { x: 0,    y: -15,  rotate: -0.5 }, // 6: Center Finale
];

const MOBILE_RESTING = [
  { x: -62, y: -70, rotate: -2.5 }, // 0: Upper-Left
  { x: 62,  y: -60, rotate: 2.5 },  // 1: Upper-Right
  { x: -60, y: 0,   rotate: 1.5 },  // 2: Mid-Left
  { x: 60,  y: 10,  rotate: -1.5 }, // 3: Mid-Right
  { x: -62, y: 70,  rotate: -2.5 }, // 4: Lower-Left
  { x: 62,  y: 80,  rotate: 2.5 },  // 5: Lower-Right
  { x: 0,   y: 105, rotate: 0.0 },  // 6: Bottom Center
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
    // Phase 1: Active during cards 0 & 1 dealing (progress 0.00 to 0.34)
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
    // Phase 2: Active during cards 2 & 3 dealing (progress 0.32 to 0.68)
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
    // Phase 3: Active during cards 4, 5 & 6 dealing (progress 0.66 to 1.00)
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

export default function WhatWeDoEditorial() {
  const containerRef = useRef(null);
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const rafIdRef = useRef(null);

  // Mouse Parallax coordinates (normalized -0.5 to 0.5)
  const targetMouseRef = useRef({ x: 0, y: 0 });
  const currentMouseRef = useRef({ x: 0, y: 0 });
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  const [scrollProgress, setScrollProgress] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );

  // Viewport & Reduced Motion Detection
  useEffect(() => {
    const checkViewport = () => {
      setIsMobile(window.innerWidth < 768);
    };
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handleMotionChange = (e) => setPrefersReducedMotion(e.matches);
    if (motionQuery.addEventListener) {
      motionQuery.addEventListener('change', handleMotionChange);
    }

    window.addEventListener('resize', checkViewport, { passive: true });
    return () => {
      window.removeEventListener('resize', checkViewport);
      if (motionQuery.removeEventListener) {
        motionQuery.removeEventListener('change', handleMotionChange);
      }
    };
  }, []);

  // Smooth LERP Scrubbed Scroll & Mouse Parallax Loop
  useEffect(() => {
    let isRunning = true;

    const updateTargetProgress = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalScroll = rect.height - window.innerHeight;
      if (totalScroll <= 0) {
        targetProgressRef.current = 0;
      } else {
        const currentScroll = -rect.top;
        const progress = Math.max(0, Math.min(1, currentScroll / totalScroll));
        targetProgressRef.current = progress;
      }
    };

    const loop = () => {
      if (!isRunning) return;

      // Scroll Damping: 0.07 provides silky-smooth, calm momentum
      const scrollDiff = targetProgressRef.current - currentProgressRef.current;
      if (Math.abs(scrollDiff) > 0.00008) {
        currentProgressRef.current += scrollDiff * 0.07;
        setScrollProgress(currentProgressRef.current);
      }

      // Mouse Parallax Damping: 0.05 creates slow, dreamlike responsiveness
      const mouseDiffX = targetMouseRef.current.x - currentMouseRef.current.x;
      const mouseDiffY = targetMouseRef.current.y - currentMouseRef.current.y;
      if (Math.abs(mouseDiffX) > 0.0005 || Math.abs(mouseDiffY) > 0.0005) {
        currentMouseRef.current.x += mouseDiffX * 0.05;
        currentMouseRef.current.y += mouseDiffY * 0.05;
        setMouseOffset({
          x: currentMouseRef.current.x,
          y: currentMouseRef.current.y,
        });
      }

      rafIdRef.current = requestAnimationFrame(loop);
    };

    updateTargetProgress();
    currentProgressRef.current = targetProgressRef.current;
    setScrollProgress(targetProgressRef.current);

    rafIdRef.current = requestAnimationFrame(loop);

    const handleScroll = () => updateTargetProgress();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      isRunning = false;
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const handleMouseMove = (e) => {
    if (isMobile) return;
    const { clientX, clientY } = e;
    const normX = clientX / window.innerWidth - 0.5;
    const normY = clientY / window.innerHeight - 0.5;
    targetMouseRef.current = { x: normX, y: normY };
  };

  const handleMouseLeave = () => {
    targetMouseRef.current = { x: 0, y: 0 };
  };

  const restingPositions = isMobile ? MOBILE_RESTING : DESKTOP_RESTING;

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
                  alt={`Editorial Print ${idx + 1}`}
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

  // =========================================================================
  // SEQUENTIAL DECK REVEAL TIMELINE (CALM, DELIBERATE EDITORIAL PACE)
  // Total cards = 7.
  // Pause at center = 0.035
  // Move to resting spot = 0.095 (generous, slow travel distance)
  // Each card cycle = 0.035 + 0.095 = 0.130
  // 7 cards * 0.130 = 0.910
  // Final Hold: 0.910 -> 1.000 (generous stillness before release into next section)
  // =========================================================================
  const PAUSE_DURATION = 0.035;
  const MOVE_DURATION = 0.095;
  const CARD_CYCLE = PAUSE_DURATION + MOVE_DURATION; // 0.13

  // Current active cards dealt count for subtle archival indicator
  const activeCount = Math.min(
    7,
    Math.max(1, Math.floor(scrollProgress / CARD_CYCLE) + 1)
  );

  // Cinematic End-of-Section Defocus Blur (engages from 0.925 -> 1.000)
  const BLUR_START = 0.925;
  const endBlurProgress = scrollProgress >= BLUR_START
    ? smootherStep((scrollProgress - BLUR_START) / (1 - BLUR_START))
    : 0;
  const stageBlur = endBlurProgress * 16; // 0px to 16px soft lens defocus
  const stageOpacity = 1 - endBlurProgress * 0.85; // 1.0 to 0.15 dreamy dissolve
  const stageScale = 1 - endBlurProgress * 0.04; // subtle 1.0 to 0.96 scale breath

  return (
    <section
      id="what-we-do"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full bg-[#FDFCF8] select-none"
      style={{
        // 650vh pinned scroll distance allows cards to glide slowly and majestically
        height: '650vh',
      }}
    >
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
        className="sticky top-0 h-screen w-full flex flex-col justify-between items-center overflow-hidden px-4 sm:px-8 pt-[86px] sm:pt-8 pb-5 sm:pb-8 will-change-transform"
        style={{
          filter: stageBlur > 0.1 ? `blur(${stageBlur.toFixed(1)}px)` : 'none',
          opacity: stageOpacity,
          transform: stageScale < 0.999 ? `scale(${stageScale.toFixed(3)})` : 'none',
          transition: 'filter 0.12s ease-out, opacity 0.12s ease-out',
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
            <span className="text-[#101010] font-semibold text-xs tracking-[0.24em] transition-all duration-300">
              0{activeCount}
            </span>
            <span className="w-3 h-[1px] bg-[#101010]/30" />
            <span>07 ARCHIVE</span>
          </div>
        </div>

        {/* =================================================================
            MOBILE TOP EDITORIAL TEXT (BLUR-TO-REAL SCROLL DRIVEN)
            ================================================================= */}
        <div className="md:hidden w-full max-w-[360px] px-3 text-center pointer-events-none select-none z-20 relative min-h-[92px] flex items-center justify-center mt-3 mb-1 translate-y-[58px]">
          {EDITORIAL_BEATS.map((beat) => {
            const style = calculateBeatStyle(scrollProgress, beat.start, beat.peakStart, beat.peakEnd, beat.end);
            if (!style.visible) return null;

            return (
              <div
                key={`mobile-top-${beat.id}`}
                className="absolute inset-0 flex flex-col items-center justify-center transition-none will-change-[transform,opacity,filter]"
                style={{
                  opacity: style.opacity,
                  filter: style.blur > 0.05 ? `blur(${style.blur.toFixed(1)}px)` : 'none',
                  transform: `translateY(${style.y.toFixed(1)}px)`,
                }}
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
            );
          })}
        </div>

        {/* =================================================================
            CENTRAL DECK STAGE CONTAINER
            ================================================================= */}
        <div className="relative w-full max-w-[1400px] h-[300px] sm:h-[460px] md:h-[620px] flex items-center justify-center flex-1 my-auto">
          
          {/* Deck Physical Stack Base / Mat Outline with subtle pulsing glow */}
          <div
            className="absolute w-[100px] sm:w-[145px] md:w-[190px] aspect-[3/4] rounded-[2px] bg-[#E3DBCC]/25 border border-[#E3DBCC]/60 pointer-events-none -z-10 shadow-[0_8px_24px_-8px_rgba(16,14,12,0.08)]"
            style={{
              transform: `translate3d(${mouseOffset.x * 4}px, ${mouseOffset.y * 3}px, 0)`,
              transition: 'transform 0.2s ease-out',
            }}
          />

          {/* Cards 0 through 6 */}
          {PHOTOS.map((src, i) => {
            const startCycle = i * CARD_CYCLE;
            const startMove = startCycle + PAUSE_DURATION;
            const endMove = startCycle + CARD_CYCLE;
            const targetPos = restingPositions[i] || { x: 0, y: 0, rotate: 0 };

            let currentX = 0;
            let currentY = 0;
            let currentRotate = 0;
            let currentOpacity = 0;
            let currentScale = 1;
            let currentShadow = '0 14px 32px -10px rgba(16,14,12,0.18)';
            let isMoving = false;
            let isResting = false;
            let zIndex = 20 + i;

            if (i === 0) {
              // Card 0: Top card of the deck (visible right at entry)
              currentOpacity = 1;

              if (scrollProgress < startMove) {
                currentX = 0;
                currentY = 0;
                currentRotate = 0;
                currentScale = 1;
                zIndex = 50; // Focused top card
              } else if (scrollProgress <= endMove) {
                isMoving = true;
                const rawT = (scrollProgress - startMove) / MOVE_DURATION;
                const easedT = smootherStep(rawT);
                currentX = targetPos.x * easedT;
                currentY = targetPos.y * easedT;
                currentRotate = targetPos.rotate * easedT;

                // 3D Lift Arc: subtle scale lift up to 1.05 and deep elevation shadow mid-flight
                const liftArc = Math.sin(rawT * Math.PI);
                currentScale = 1 + liftArc * 0.055;
                currentShadow = `0 ${14 + liftArc * 24}px ${32 + liftArc * 28}px -${10 + liftArc * 6}px rgba(16,14,12,${0.18 + liftArc * 0.16})`;
                zIndex = 45;
              } else {
                isResting = true;
                currentX = targetPos.x;
                currentY = targetPos.y;
                currentRotate = targetPos.rotate;
                currentScale = 1;
                zIndex = 10 + i;
              }
            } else {
              // Cards 1 through 6:
              const predStartMove = (i - 1) * CARD_CYCLE + PAUSE_DURATION;

              if (scrollProgress < predStartMove) {
                currentOpacity = 0;
                currentX = 0;
                currentY = 0;
                currentRotate = 0;
              } else if (scrollProgress < startMove) {
                // Smoothly appears at center beneath the departing card
                const fadeWindow = 0.02;
                currentOpacity = scrollProgress < predStartMove + fadeWindow
                  ? (scrollProgress - predStartMove) / fadeWindow
                  : 1;
                currentX = 0;
                currentY = 0;
                currentRotate = 0;
                currentScale = 1;
                zIndex = 50; // Current focal deck card
              } else if (scrollProgress <= endMove) {
                isMoving = true;
                currentOpacity = 1;
                const rawT = (scrollProgress - startMove) / MOVE_DURATION;
                const easedT = smootherStep(rawT);
                currentX = targetPos.x * easedT;
                currentY = targetPos.y * easedT;
                currentRotate = targetPos.rotate * easedT;

                // 3D Lift Arc mid-flight
                const liftArc = Math.sin(rawT * Math.PI);
                currentScale = 1 + liftArc * 0.055;
                currentShadow = `0 ${14 + liftArc * 24}px ${32 + liftArc * 28}px -${10 + liftArc * 6}px rgba(16,14,12,${0.18 + liftArc * 0.16})`;
                zIndex = 45;
              } else {
                isResting = true;
                currentOpacity = 1;
                currentX = targetPos.x;
                currentY = targetPos.y;
                currentRotate = targetPos.rotate;
                currentScale = 1;
                zIndex = 10 + i;
              }
            }

            // Subtle layered mouse parallax offset (deeper for outer cards)
            const parallaxWeight = isMobile ? 0 : 8 + i * 2;
            const parallaxX = mouseOffset.x * parallaxWeight;
            const parallaxY = mouseOffset.y * (parallaxWeight * 0.7);

            // Hover state boosts
            const isHovered = hoveredIndex === i && isResting;
            const finalScale = isHovered ? currentScale * 1.045 : currentScale;
            const finalZIndex = isHovered ? 60 : zIndex;

            // Idle floating animation selection
            const floatAnimation = isResting && !isHovered
              ? `${i % 2 === 0 ? 'editorialDrift' : 'editorialDriftAlt'} ${5.5 + (i * 0.6)}s ease-in-out infinite`
              : 'none';

            return (
              <div
                key={i}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="absolute w-[100px] sm:w-[145px] md:w-[190px] aspect-[3/4] bg-[#F3F0E9] p-1.5 sm:p-2 border-[1.5px] border-[#101010] rounded-[2px] will-change-transform group cursor-pointer"
                style={{
                  transform: `translate3d(${currentX + parallaxX}px, ${currentY + parallaxY}px, 0) rotate(${currentRotate}deg) scale(${finalScale})`,
                  opacity: currentOpacity,
                  boxShadow: isHovered
                    ? '0 26px 54px -14px rgba(16,14,12,0.28)'
                    : currentShadow,
                  zIndex: finalZIndex,
                  transition: isMoving ? 'none' : 'box-shadow 0.3s ease-out, transform 0.25s ease-out',
                }}
              >
                {/* Inner Breathing/Floating Drift Wrapper */}
                <div
                  className="w-full h-full relative"
                  style={{ animation: floatAnimation }}
                >
                  {/* Inner Ivory Mat Border & Archival Photograph */}
                  <div className="w-full h-full overflow-hidden border border-[#E3DBCC] rounded-[1px] bg-[#E3DBCC]/20 relative">
                    <img
                      src={src}
                      alt={`Atelier Portfolio Print ${i + 1}`}
                      className="w-full h-full object-cover select-none pointer-events-none transition-transform duration-700 ease-out group-hover:scale-105"
                      loading={i <= 1 ? 'eager' : 'lazy'}
                      draggable={false}
                    />

                    {/* Subtle Vignette on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none" />
                  </div>

                  {/* Subtle Minimal Archival Plate Watermark on Hover */}
                  <div className="absolute bottom-1 left-1.5 right-1.5 flex items-center justify-between text-[0.45rem] font-mono tracking-widest text-white/90 uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
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
            {EDITORIAL_BEATS.map((beat) => {
              const style = calculateBeatStyle(scrollProgress, beat.start, beat.peakStart, beat.peakEnd, beat.end);
              if (!style.visible) return null;

              return (
                <div
                  key={`left-${beat.id}`}
                  className="transition-none will-change-[transform,opacity,filter]"
                  style={{
                    opacity: style.opacity,
                    filter: style.blur > 0.05 ? `blur(${style.blur.toFixed(1)}px)` : 'none',
                    transform: `translateY(${style.y.toFixed(1)}px)`,
                  }}
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
              );
            })}
          </div>

          {/* =================================================================
              RIGHT EDITORIAL TYPOGRAPHY FLANK (BLUR-TO-REAL SCROLL DRIVEN)
              ================================================================= */}
          <div className="hidden md:block absolute right-2 lg:right-6 xl:right-10 top-1/2 -translate-y-1/2 z-20 pointer-events-none select-none max-w-[210px] lg:max-w-[260px] xl:max-w-[280px] text-right">
            {EDITORIAL_BEATS.map((beat) => {
              const style = calculateBeatStyle(scrollProgress, beat.start, beat.peakStart, beat.peakEnd, beat.end);
              if (!style.visible) return null;

              return (
                <div
                  key={`right-${beat.id}`}
                  className="transition-none will-change-[transform,opacity,filter]"
                  style={{
                    opacity: style.opacity,
                    filter: style.blur > 0.05 ? `blur(${style.blur.toFixed(1)}px)` : 'none',
                    transform: `translateY(${style.y.toFixed(1)}px)`,
                  }}
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
              );
            })}
          </div>

        </div>

        {/* =================================================================
            MOBILE BOTTOM EDITORIAL TEXT (BLUR-TO-REAL SCROLL DRIVEN)
            ================================================================= */}
        <div className="md:hidden w-full max-w-[360px] px-3 text-center pointer-events-none select-none z-20 relative min-h-[92px] flex items-center justify-center mt-1 mb-8 -translate-y-[58px]">
          {EDITORIAL_BEATS.map((beat) => {
            const style = calculateBeatStyle(scrollProgress, beat.start, beat.peakStart, beat.peakEnd, beat.end);
            if (!style.visible) return null;

            return (
              <div
                key={`mobile-bottom-${beat.id}`}
                className="absolute inset-0 flex flex-col items-center justify-center transition-none will-change-[transform,opacity,filter]"
                style={{
                  opacity: style.opacity,
                  filter: style.blur > 0.05 ? `blur(${style.blur.toFixed(1)}px)` : 'none',
                  transform: `translateY(${-style.y.toFixed(1)}px)`,
                }}
              >
                <h4
                  className="font-serif text-[clamp(1.25rem,4.5vw,1.6rem)] font-normal text-[#101010] leading-[1.18] tracking-[-0.02em]"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  {beat.right.title}{' '}
                  <span className="italic font-light text-[#101010]">{beat.right.italic}</span>
                </h4>
                <div className="flex items-center gap-2 font-mono text-[0.58rem] sm:text-[0.62rem] tracking-[0.24em] text-[#7A7770] font-semibold uppercase mt-1">
                  <span className="w-3 h-[1px] bg-[#E3DBCC]" />
                  <span>{beat.right.eyebrow}</span>
                  <span className="w-3 h-[1px] bg-[#E3DBCC]" />
                </div>
                <p className="font-sans text-[clamp(0.74rem,2.5vw,0.86rem)] text-[#4A4844] font-normal leading-snug tracking-wide mt-1 max-w-[310px]">
                  {beat.right.subtitle}
                </p>
              </div>
            );
          })}
        </div>

        {/* =================================================================
            BOTTOM ARCHIVAL FOOTER: Hairline Progress & Status
            ================================================================= */}
        <div className="w-full max-w-[1400px] flex flex-col gap-2 pointer-events-none z-30 -translate-y-[40px] md:translate-y-0">
          {/* Hairline Scrub Progress Line */}
          <div className="w-full h-[1px] bg-[#E3DBCC]/60 relative overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-[#101010] transition-all duration-150 ease-out"
              style={{ width: `${Math.round(scrollProgress * 100)}%` }}
            />
          </div>

          <div className="w-full flex items-center justify-between font-mono text-[0.58rem] sm:text-[0.64rem] tracking-[0.22em] text-[#7A7770] uppercase">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#101010] animate-pulse" />
              <span className="text-[#101010] font-medium">SCROLL ARCHIVE</span>
            </div>

            <div className="hidden sm:flex items-center gap-1.5">
              <span>FINE ART 35MM COLLECTION</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
