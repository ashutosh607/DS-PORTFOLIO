import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Volume2, VolumeX, Play, Pause, Sparkles } from 'lucide-react';

/**
 * Editorial Photography Assets
 * Sourced directly from the atelier's curated collections and local media.
 */
const MEDIA = {
  video: '/videos/cinematic-film.mp4',
  beat1: {
    hero: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop',
    topRight: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=800&auto=format&fit=crop',
    bottomRight: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800&auto=format&fit=crop',
  },
  beat2: {
    center: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=1000&auto=format&fit=crop',
    topLeft: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=800&auto=format&fit=crop',
    topRight: 'https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?q=80&w=800&auto=format&fit=crop',
    bottomRight: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
  },
  beat3: {
    arch: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1400&auto=format&fit=crop',
    bouquet: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=800&auto=format&fit=crop',
  },
};

const DISCIPLINES = [
  'WEDDINGS',
  'PRE-WEDDINGS',
  'PORTRAITS',
  'EVENTS',
  'FILMS',
];

/**
 * Editorial Video Card Component
 * Premium moving media vignette with subtle controls, soundwave, and hover micro-animations.
 */
function EditorialVideoCard({ className = '', style = {}, isPlaying, isMuted, onTogglePlay, onToggleMute, videoRef }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`relative overflow-hidden rounded-[10px] md:rounded-[12px] bg-[#101010] shadow-[0_20px_50px_-12px_rgba(16,14,12,0.3)] border border-[#E3DBCC]/30 transition-transform duration-500 ease-out group ${className}`}
      style={{
        ...style,
        transform: isHovered ? 'scale(1.02)' : 'scale(1)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={MEDIA.video}
        muted={isMuted}
        loop
        playsInline
        autoPlay
        className="w-full h-full object-cover select-none pointer-events-none"
      />

      {/* Subtle Grain & Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

      {/* Top Header Bar: FILM Label + Duration */}
      <div className="absolute top-2.5 left-3 right-3 flex items-center justify-between pointer-events-none">
        <span className="px-2 py-0.5 rounded-[4px] bg-white/20 backdrop-blur-md text-[0.6rem] font-mono tracking-[0.2em] text-[#FDFCF8] uppercase">
          FILM
        </span>
        <span className="text-[0.6rem] font-mono tracking-[0.16em] text-white/80">
          00:18
        </span>
      </div>

      {/* Center Play/Pause Overlay Indicator on Hover */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          animate={{
            opacity: isHovered || !isPlaying ? 1 : 0,
            scale: isHovered ? 1 : 0.9,
          }}
          transition={{ duration: 0.25 }}
          className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center text-white border border-white/40 shadow-lg"
        >
          {isPlaying ? (
            <Pause size={16} className="text-white fill-white" />
          ) : (
            <Play size={16} className="text-white fill-white ml-0.5" />
          )}
        </motion.div>
      </div>

      {/* Bottom Controls Bar */}
      <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between">
        {/* Play/Pause Button */}
        <button
          type="button"
          onClick={onTogglePlay}
          aria-label={isPlaying ? 'Pause film' : 'Play film'}
          className="p-1.5 rounded-full bg-black/40 hover:bg-black/70 text-white/90 transition-colors backdrop-blur-sm cursor-pointer"
        >
          {isPlaying ? <Pause size={12} /> : <Play size={12} className="ml-0.5" />}
        </button>

        {/* Audio Mute/Unmute Toggle */}
        <button
          type="button"
          onClick={onToggleMute}
          aria-label={isMuted ? 'Unmute film' : 'Mute film'}
          className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/40 hover:bg-black/70 text-white/90 transition-colors backdrop-blur-sm cursor-pointer"
        >
          {isMuted ? (
            <VolumeX size={12} />
          ) : (
            <>
              <Volume2 size={12} />
              {/* Animated audio bar */}
              <span className="flex items-end gap-0.5 h-2">
                <span className="w-0.5 h-1.5 bg-white animate-pulse" />
                <span className="w-0.5 h-2.5 bg-white animate-pulse delay-75" />
                <span className="w-0.5 h-1 bg-white animate-pulse delay-150" />
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default function WhatWeDoEditorial() {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [activeBeat, setActiveBeat] = useState(1);

  // Bulletproof Scroll Progress MotionValue (strictly bounded between 0.0 and 1.0, NEVER NaN)
  const scrollYProgress = useMotionValue(0);

  useEffect(() => {
    let ticking = false;

    const updateScrollProgress = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalScroll = rect.height - window.innerHeight;
      if (totalScroll <= 0) {
        scrollYProgress.set(0);
        return;
      }
      // Distance scrolled past the section's top entry
      const currentScroll = -rect.top;
      const progress = Math.max(0, Math.min(1, currentScroll / totalScroll));
      scrollYProgress.set(progress);
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateScrollProgress();
          ticking = false;
        });
        ticking = true;
      }
    };

    // Initial calculation
    updateScrollProgress();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [scrollYProgress]);

  // Track Active Beat for Counter (01, 02, 03)
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (v) => {
      if (v < 0.33) {
        setActiveBeat(1);
      } else if (v < 0.66) {
        setActiveBeat(2);
      } else {
        setActiveBeat(3);
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  // Mouse Parallax Springs (±7px subtle floating)
  const rawMouseX = useSpring(0, { stiffness: 45, damping: 20 });
  const rawMouseY = useSpring(0, { stiffness: 45, damping: 20 });

  const mouseHeroX = useTransform(rawMouseX, [-0.5, 0.5], [-7, 7]);
  const mouseHeroY = useTransform(rawMouseY, [-0.5, 0.5], [-4, 4]);

  const mouseFloatX = useTransform(rawMouseX, [-0.5, 0.5], [-14, 14]);
  const mouseFloatY = useTransform(rawMouseY, [-0.5, 0.5], [-10, 10]);

  const mouseDecoX = useTransform(rawMouseX, [-0.5, 0.5], [-4, 4]);
  const mouseDecoY = useTransform(rawMouseY, [-0.5, 0.5], [-3, 3]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    rawMouseX.set(x);
    rawMouseY.set(y);
  };

  const handleMouseLeave = () => {
    rawMouseX.set(0);
    rawMouseY.set(0);
  };

  // Video Autoplay / Viewport Visibility via IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!videoRef.current) return;
        if (entry.isIntersecting) {
          videoRef.current.play().catch(() => {});
          setIsPlaying(true);
        } else {
          videoRef.current.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.15 }
    );

    const currentEl = containerRef.current;
    if (currentEl) observer.observe(currentEl);

    return () => {
      if (currentEl) observer.unobserve(currentEl);
    };
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  // =========================================================================
  // STRICTLY ISOLATED 3 BEATS + 4TH EXIT HANDOVER
  // =========================================================================

  // BEAT 01: Strictly active from 0.0 to 0.33, completely hidden above 0.33
  const beat1TextOpacity = useTransform(scrollYProgress, [0, 0.22, 0.31], [1, 1, 0]);
  const beat1TextY = useTransform(scrollYProgress, [0, 0.22, 0.31], [0, 0, -28]);
  const beat1Display = useTransform(scrollYProgress, (v) => (v <= 0.33 ? 'flex' : 'none'));
  const beat1MediaDisplay = useTransform(scrollYProgress, (v) => (v <= 0.33 ? 'block' : 'none'));

  const b1HeroOpacity = useTransform(scrollYProgress, [0, 0.24, 0.32], [1, 1, 0]);
  const b1HeroScale = useTransform(scrollYProgress, [0, 0.32], [0.98, 1.03]);
  const b1HeroY = useTransform(scrollYProgress, [0, 0.32], [20, -30]);

  const b1TopRightOpacity = useTransform(scrollYProgress, [0, 0.22, 0.31], [1, 1, 0]);
  const b1TopRightX = useTransform(scrollYProgress, [0, 0.31], [0, 45]);
  const b1TopRightRotate = useTransform(scrollYProgress, [0, 0.31], [1.5, 5]);

  const b1BottomRightOpacity = useTransform(scrollYProgress, [0, 0.22, 0.31], [1, 1, 0]);
  const b1BottomRightY = useTransform(scrollYProgress, [0, 0.31], [0, 40]);
  const b1BottomRightRotate = useTransform(scrollYProgress, [0, 0.31], [-2, -5]);

  // BEAT 02: Strictly active from 0.29 to 0.67, completely hidden before 0.29 and after 0.67
  const beat2TextOpacity = useTransform(
    scrollYProgress,
    [0.31, 0.38, 0.58, 0.65],
    [0, 1, 1, 0]
  );
  const beat2TextY = useTransform(
    scrollYProgress,
    [0.31, 0.38, 0.58, 0.65],
    [28, 0, 0, -28]
  );
  const beat2Display = useTransform(
    scrollYProgress,
    (v) => (v > 0.29 && v < 0.67 ? 'flex' : 'none')
  );
  const beat2MediaDisplay = useTransform(
    scrollYProgress,
    (v) => (v > 0.29 && v < 0.67 ? 'block' : 'none')
  );

  const b2CenterOpacity = useTransform(
    scrollYProgress,
    [0.31, 0.38, 0.58, 0.65],
    [0, 1, 1, 0]
  );
  const b2CenterScale = useTransform(
    scrollYProgress,
    [0.31, 0.40, 0.55, 0.65],
    [0.88, 1.03, 1.0, 0.88]
  );
  const b2CenterRotate = useTransform(
    scrollYProgress,
    [0.31, 0.40, 0.65],
    [-6, -2, 2]
  );
  const b2CenterY = useTransform(
    scrollYProgress,
    [0.31, 0.40, 0.65],
    [40, 0, -35]
  );

  const b2TopLeftOpacity = useTransform(
    scrollYProgress,
    [0.32, 0.39, 0.58, 0.65],
    [0, 1, 1, 0]
  );
  const b2TopLeftX = useTransform(scrollYProgress, [0.32, 0.40, 0.65], [-50, 0, 25]);
  const b2TopLeftRotate = useTransform(scrollYProgress, [0.32, 0.40, 0.65], [-12, -7, -4]);

  const b2TopRightOpacity = useTransform(
    scrollYProgress,
    [0.32, 0.39, 0.58, 0.65],
    [0, 1, 1, 0]
  );
  const b2TopRightX = useTransform(scrollYProgress, [0.32, 0.40, 0.65], [50, 0, -20]);
  const b2TopRightRotate = useTransform(scrollYProgress, [0.32, 0.40, 0.65], [10, 5, 2]);

  const b2BottomRightOpacity = useTransform(
    scrollYProgress,
    [0.33, 0.40, 0.58, 0.65],
    [0, 1, 1, 0]
  );
  const b2BottomRightY = useTransform(scrollYProgress, [0.33, 0.40, 0.65], [50, 0, -25]);
  const b2BottomRightRotate = useTransform(scrollYProgress, [0.33, 0.40, 0.65], [6, 2, 0]);

  // BEAT 03 & 4TH TRANSITION (Seamless Handover into About Section)
  // Enters smoothly at 0.64, dominates, then at 0.92-1.0 glides gracefully into the next section!
  const beat3TextOpacity = useTransform(
    scrollYProgress,
    [0.64, 0.71, 0.92, 1.0],
    [0, 1, 1, 0.15]
  );
  const beat3TextY = useTransform(
    scrollYProgress,
    [0.64, 0.71, 0.92, 1.0],
    [28, 0, 0, -35]
  );
  const beat3Display = useTransform(scrollYProgress, (v) => (v >= 0.63 ? 'flex' : 'none'));
  const beat3MediaDisplay = useTransform(scrollYProgress, (v) => (v >= 0.63 ? 'block' : 'none'));

  const b3ArchOpacity = useTransform(
    scrollYProgress,
    [0.64, 0.71, 0.92, 1.0],
    [0, 1, 1, 0.15]
  );
  const b3ArchScale = useTransform(
    scrollYProgress,
    [0.64, 0.72, 0.92, 1.0],
    [0.93, 1.0, 1.0, 0.96]
  );
  const b3ArchY = useTransform(
    scrollYProgress,
    [0.64, 0.72, 0.92, 1.0],
    [40, 0, 0, -40]
  );

  const b3BouquetOpacity = useTransform(
    scrollYProgress,
    [0.66, 0.73, 0.92, 1.0],
    [0, 1, 1, 0.15]
  );
  const b3BouquetRotate = useTransform(scrollYProgress, [0.66, 0.75, 1.0], [-8, -4, -2]);
  const b3BouquetX = useTransform(scrollYProgress, [0.66, 0.75, 1.0], [45, 0, -10]);
  const b3BouquetY = useTransform(scrollYProgress, [0.66, 0.75, 0.92, 1.0], [20, 0, 0, -30]);

  // VIDEO FRAME (Smooth continuous presence, gracefully handing over on 4th transition)
  const videoOpacity = useTransform(
    scrollYProgress,
    [0, 0.10, 0.92, 1.0],
    [0.7, 1, 1, 0.15]
  );
  const videoY = useTransform(
    scrollYProgress,
    [0, 0.33, 0.66, 0.92, 1.0],
    [10, -5, 10, 0, -35]
  );
  const videoX = useTransform(
    scrollYProgress,
    [0, 0.33, 0.66, 1.0],
    [0, -15, 15, 0]
  );

  return (
    <section
      id="what-we-do"
      ref={containerRef}
      className="relative w-full bg-[#FDFCF8] text-[#101010] selection:bg-[#101010] selection:text-[#FDFCF8]"
      style={{
        // 340vh height allows all 3 beats + 4th transition to unfold with generous breathing room
        minHeight: '340vh',
      }}
    >
      {/* =====================================================================
          PINNED 100VH STAGE (Sticky viewport for scrubbed animation)
          ===================================================================== */}
      <div
        className="sticky top-0 h-screen w-full flex items-center overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Subtle Ambient Editorial Grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-25"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(227, 219, 204, 0.25) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(227, 219, 204, 0.25) 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px',
          }}
        />

        {/* Content Container */}
        <div className="container relative z-10 mx-auto px-6 sm:px-10 md:px-14 lg:px-16 max-w-[1440px] h-full flex flex-col justify-between py-8 md:py-12">
          
          {/* =================================================================
              TOP MINIMAL HEADER BAR (Editorial label & Studio Mark)
              ================================================================= */}
          <div className="w-full flex items-center justify-between pointer-events-none">
            {/* Eyebrow Label with Hairline Accents */}
            <div className="flex items-center gap-3 font-mono text-[0.68rem] tracking-[0.26em] uppercase text-[#7A7770]">
              <span className="w-6 sm:w-10 h-[1px] bg-[#E3DBCC]" />
              <span className="text-[#101010] font-medium">WHAT WE DO</span>
              <span className="w-6 sm:w-10 h-[1px] bg-[#E3DBCC]" />
            </div>

            {/* Subtle Studio Catalog Coordinate */}
            <div className="hidden sm:flex items-center gap-3 font-mono text-[0.62rem] tracking-[0.2em] uppercase text-[#7A7770]">
              <span>DS STUDIO FOLIO</span>
              <span className="w-1 h-1 rounded-full bg-[#E3DBCC]" />
              <span>EST. 2026</span>
            </div>
          </div>

          {/* =================================================================
              MAIN 2-COLUMN STAGE (Left: Kinetic Typography · Right: Dynamic Media)
              ================================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center flex-1 my-auto">
            
            {/* ---------------------------------------------------------------
                LEFT COLUMN: MONUMENTAL EDITORIAL STATEMENTS (Strictly Isolated)
                --------------------------------------------------------------- */}
            <div className="lg:col-span-5 relative min-h-[220px] sm:min-h-[260px] lg:min-h-[360px] flex flex-col justify-center">
              
              {/* BEAT 01 STATEMENT */}
              <motion.div
                style={{
                  opacity: beat1TextOpacity,
                  y: beat1TextY,
                  display: beat1Display,
                }}
                className="absolute inset-0 flex-col justify-center pointer-events-none"
              >
                <h2
                  className="font-serif text-[clamp(2.4rem,4.8vw,4.4rem)] font-normal leading-[1.04] tracking-[-0.025em] text-[#101010] mb-4 sm:mb-6"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  We capture
                  <br />
                  <span className="italic font-light">the real,</span> the raw,
                  <br />
                  the in-between.
                </h2>
                <p className="font-sans text-[clamp(0.95rem,1.2vw,1.15rem)] text-[#4A4844] leading-relaxed font-light max-w-sm">
                  Not just moments, but the emotions behind them.
                </p>

                {/* Handwritten Stamp Note */}
                <div className="mt-6 sm:mt-8 inline-block select-none">
                  <div
                    className="font-script text-[1.4rem] sm:text-[1.65rem] text-[#7A7770] leading-tight transform -rotate-[7deg] origin-left"
                    style={{ fontFamily: 'var(--font-script)' }}
                  >
                    Real People
                    <br />
                    Real Moments
                    <br />
                    <span className="text-[#101010]">Timeless</span>
                  </div>
                </div>
              </motion.div>

              {/* BEAT 02 STATEMENT */}
              <motion.div
                style={{
                  opacity: beat2TextOpacity,
                  y: beat2TextY,
                  display: beat2Display,
                }}
                className="absolute inset-0 flex-col justify-center pointer-events-none"
              >
                <h2
                  className="font-serif text-[clamp(2.4rem,4.8vw,4.4rem)] font-normal leading-[1.04] tracking-[-0.025em] text-[#101010] mb-4 sm:mb-6"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  Every moment
                  <br />
                  has a story.
                  <br />
                  <span className="italic font-light">We just frame it.</span>
                </h2>
                <p className="font-sans text-[clamp(0.95rem,1.2vw,1.15rem)] text-[#4A4844] leading-relaxed font-light max-w-sm">
                  From grand celebrations to quiet, intimate moments — we turn memories into timeless visuals.
                </p>

                {/* Editorial Discipline Tags in Beat 02 */}
                <div className="mt-6 pt-5 border-t border-[#E3DBCC]/60 flex flex-wrap gap-2 sm:gap-3 text-[0.62rem] font-mono tracking-[0.2em] uppercase text-[#7A7770]">
                  <span>WEDDINGS</span>
                  <span>·</span>
                  <span>PRE-WEDDINGS</span>
                  <span>·</span>
                  <span>PORTRAITS</span>
                </div>
              </motion.div>

              {/* BEAT 03 STATEMENT */}
              <motion.div
                style={{
                  opacity: beat3TextOpacity,
                  y: beat3TextY,
                  display: beat3Display,
                }}
                className="absolute inset-0 flex-col justify-center pointer-events-none"
              >
                <h2
                  className="font-serif text-[clamp(2.4rem,4.8vw,4.4rem)] font-normal leading-[1.04] tracking-[-0.025em] text-[#101010] mb-4 sm:mb-6"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  More than
                  <br />
                  <span className="italic font-light">photos,</span>
                  <br />
                  it’s a feeling.
                </h2>
                <p className="font-sans text-[clamp(0.95rem,1.2vw,1.15rem)] text-[#4A4844] leading-relaxed font-light max-w-sm">
                  Thoughtful frames. Honest emotions. Timeless stories.
                </p>

                {/* Archival Note */}
                <div className="mt-6 pt-5 border-t border-[#E3DBCC]/60 flex items-center gap-2 font-mono text-[0.62rem] tracking-[0.22em] uppercase text-[#7A7770]">
                  <Sparkles size={13} className="text-[#101010]" />
                  <span>MASTER PROOF COLLECTION 2026</span>
                </div>
              </motion.div>

            </div>

            {/* ---------------------------------------------------------------
                RIGHT COLUMN: ANIMATED PHYSICAL MEDIA STAGE
                --------------------------------------------------------------- */}
            <div className="lg:col-span-7 relative h-[380px] sm:h-[460px] md:h-[520px] lg:h-[560px] flex items-center justify-center">
              
              {/* =============================================================
                  BACKGROUND DECORATIVE SKETCHES & CURVES
                  ============================================================= */}
              <motion.div
                style={{
                  x: mouseDecoX,
                  y: mouseDecoY,
                }}
                className="absolute inset-0 pointer-events-none flex items-center justify-center"
              >
                {/* Beat 01: Soft background circular arc */}
                <motion.div
                  style={{ display: beat1MediaDisplay }}
                  className="w-full h-full flex items-center justify-center"
                >
                  <svg
                    className="w-[340px] sm:w-[480px] lg:w-[560px] h-auto text-[#E3DBCC]/50"
                    viewBox="0 0 500 500"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="250"
                      cy="250"
                      r="220"
                      stroke="currentColor"
                      strokeWidth="1"
                      strokeDasharray="4 6"
                    />
                  </svg>
                </motion.div>

                {/* Beat 02: Handwritten Arrow & Cross-stitch diagonal line */}
                <motion.div
                  style={{ display: beat2MediaDisplay }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  {/* Diagonal Line with stitch marks */}
                  <svg
                    className="absolute right-6 top-16 w-36 h-36 text-[#7A7770]/60 hidden sm:block"
                    viewBox="0 0 100 100"
                    fill="none"
                  >
                    <line x1="10" y1="90" x2="90" y2="10" stroke="currentColor" strokeWidth="0.8" />
                    <circle cx="50" cy="50" r="2.5" fill="currentColor" />
                    <line x1="45" y1="45" x2="55" y2="55" stroke="currentColor" strokeWidth="0.8" />
                  </svg>

                  {/* Tiny Handwritten Arrow Sketch pointing towards center */}
                  <svg
                    className="absolute left-10 bottom-16 w-14 h-14 text-[#101010]/70"
                    viewBox="0 0 50 50"
                    fill="none"
                  >
                    <path
                      d="M10 15 C 18 30, 32 35, 42 22 M 34 18 L 42 22 L 38 30"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </motion.div>

                {/* Beat 03: Sparkle ✦ and organic contour around the Arch */}
                <motion.div
                  style={{ display: beat3MediaDisplay }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  {/* Subtle Sparkle Accent */}
                  <div className="absolute right-12 top-10 text-[#101010]">
                    <Sparkles size={22} className="opacity-70 animate-pulse" />
                  </div>

                  {/* Flowing bottom contour line */}
                  <svg
                    className="absolute bottom-6 left-12 w-64 h-24 text-[#E3DBCC]"
                    viewBox="0 0 200 60"
                    fill="none"
                  >
                    <path
                      d="M10 50 Q 80 10, 140 35 T 190 20"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                    />
                  </svg>
                </motion.div>
              </motion.div>

              {/* =============================================================
                  BEAT 01: ARRIVAL COMPOSITION (Hidden when activeBeat > 1)
                  ============================================================= */}
              <motion.div
                style={{
                  display: beat1MediaDisplay,
                }}
                className="absolute inset-0"
              >
                {/* Photo 1: Hero Bride with Veil in Backlight */}
                <motion.div
                  style={{
                    opacity: b1HeroOpacity,
                    scale: b1HeroScale,
                    y: b1HeroY,
                    translateX: mouseHeroX,
                    translateY: mouseHeroY,
                  }}
                  className="absolute z-10 left-4 sm:left-10 lg:left-12 top-6 sm:top-8 w-[200px] sm:w-[250px] md:w-[280px] lg:w-[310px] aspect-[4/5] bg-[#F3F0E9] p-2 sm:p-2.5 shadow-[0_24px_50px_-16px_rgba(16,14,12,0.18)] border border-[#E3DBCC]"
                >
                  <div className="w-full h-full overflow-hidden">
                    <img
                      src={MEDIA.beat1.hero}
                      alt="Atelier Bridal Master Proof"
                      className="w-full h-full object-cover select-none transition-transform duration-700 hover:scale-105"
                      loading="eager"
                    />
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-[0.55rem] font-mono tracking-widest text-[#7A7770] uppercase">
                    <span>Plate 01 · Veil</span>
                    <span>35mm Analog</span>
                  </div>
                </motion.div>

                {/* Photo 2: Coastal Sunset Couple Silhouette (Top Right) */}
                <motion.div
                  style={{
                    opacity: b1TopRightOpacity,
                    x: b1TopRightX,
                    rotate: b1TopRightRotate,
                    translateX: mouseFloatX,
                    translateY: mouseFloatY,
                  }}
                  className="absolute z-20 right-4 sm:right-10 lg:right-14 top-4 sm:top-6 w-[150px] sm:w-[190px] md:w-[220px] aspect-[4/3] bg-[#F3F0E9] p-2 shadow-[0_16px_36px_-12px_rgba(16,14,12,0.14)] border border-[#E3DBCC]"
                >
                  <div className="w-full h-full overflow-hidden">
                    <img
                      src={MEDIA.beat1.topRight}
                      alt="Coastal Sunset Promenade"
                      className="w-full h-full object-cover select-none transition-transform duration-700 hover:scale-105"
                    />
                  </div>
                </motion.div>

                {/* Photo 3: Bridal Lace Details (Bottom Right Overlap) */}
                <motion.div
                  style={{
                    opacity: b1BottomRightOpacity,
                    y: b1BottomRightY,
                    rotate: b1BottomRightRotate,
                    translateX: mouseFloatX,
                    translateY: mouseFloatY,
                  }}
                  className="absolute z-30 right-10 sm:right-20 lg:right-24 bottom-6 sm:bottom-10 w-[140px] sm:w-[175px] md:w-[200px] aspect-[4/5] bg-[#101010] p-2 shadow-[0_20px_45px_-10px_rgba(16,14,12,0.25)] border border-[#E3DBCC]/40"
                >
                  <div className="w-full h-full overflow-hidden">
                    <img
                      src={MEDIA.beat1.bottomRight}
                      alt="Bridal Lace Detail"
                      className="w-full h-full object-cover select-none transition-transform duration-700 hover:scale-105"
                    />
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[0.5rem] font-mono tracking-widest text-[#FDFCF8]/70 uppercase">
                    <span>Close Study</span>
                    <span>50mm F/1.2</span>
                  </div>
                </motion.div>
              </motion.div>

              {/* =============================================================
                  BEAT 02: REARRANGED & TRANSFORMATION COMPOSITION (Hidden outside Beat 2)
                  ============================================================= */}
              <motion.div
                style={{
                  display: beat2MediaDisplay,
                }}
                className="absolute inset-0"
              >
                {/* Photo 4: Central Intimate Portrait of Bride & Groom */}
                <motion.div
                  style={{
                    opacity: b2CenterOpacity,
                    scale: b2CenterScale,
                    rotate: b2CenterRotate,
                    y: b2CenterY,
                    translateX: mouseHeroX,
                    translateY: mouseHeroY,
                  }}
                  className="absolute z-30 left-1/2 -translate-x-1/2 top-8 sm:top-10 w-[210px] sm:w-[270px] md:w-[310px] aspect-[4/5] bg-[#F3F0E9] p-2.5 sm:p-3 shadow-[0_28px_60px_-16px_rgba(16,14,12,0.22)] border border-[#E3DBCC]"
                >
                  <div className="w-full h-full overflow-hidden">
                    <img
                      src={MEDIA.beat2.center}
                      alt="Intimate Dual Portrait"
                      className="w-full h-full object-cover select-none transition-transform duration-700 hover:scale-105"
                    />
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-[0.55rem] font-mono tracking-widest text-[#7A7770] uppercase">
                    <span>Frame 02 · Intimate Gaze</span>
                    <span>Lake Como</span>
                  </div>
                </motion.div>

                {/* Photo 5: Romantic Embrace (Top Left Tilted) */}
                <motion.div
                  style={{
                    opacity: b2TopLeftOpacity,
                    x: b2TopLeftX,
                    rotate: b2TopLeftRotate,
                    translateX: mouseFloatX,
                    translateY: mouseFloatY,
                  }}
                  className="absolute z-10 left-2 sm:left-6 top-8 sm:top-12 w-[130px] sm:w-[170px] aspect-[4/3] bg-[#F3F0E9] p-1.5 shadow-[0_16px_32px_-10px_rgba(16,14,12,0.12)] border border-[#E3DBCC]"
                >
                  <div className="w-full h-full overflow-hidden">
                    <img
                      src={MEDIA.beat2.topLeft}
                      alt="Romantic Embrace"
                      className="w-full h-full object-cover select-none"
                    />
                  </div>
                </motion.div>

                {/* Photo 6: Photographer Behind Lens (Top Right Tilted) */}
                <motion.div
                  style={{
                    opacity: b2TopRightOpacity,
                    x: b2TopRightX,
                    rotate: b2TopRightRotate,
                    translateX: mouseFloatX,
                    translateY: mouseFloatY,
                  }}
                  className="absolute z-20 right-2 sm:right-8 top-6 sm:top-10 w-[140px] sm:w-[180px] aspect-square bg-[#101010] p-1.5 shadow-[0_18px_36px_-10px_rgba(16,14,12,0.18)] border border-[#E3DBCC]/30"
                >
                  <div className="w-full h-full overflow-hidden">
                    <img
                      src={MEDIA.beat2.topRight}
                      alt="Atelier Behind Lens"
                      className="w-full h-full object-cover select-none"
                    />
                  </div>
                </motion.div>

                {/* Photo 7: Mountain Sunset Landscape (Bottom Right) */}
                <motion.div
                  style={{
                    opacity: b2BottomRightOpacity,
                    y: b2BottomRightY,
                    rotate: b2BottomRightRotate,
                    translateX: mouseFloatX,
                    translateY: mouseFloatY,
                  }}
                  className="absolute z-20 right-6 sm:right-16 bottom-4 sm:bottom-8 w-[150px] sm:w-[200px] aspect-[16/10] bg-[#F3F0E9] p-1.5 shadow-[0_16px_36px_-12px_rgba(16,14,12,0.14)] border border-[#E3DBCC]"
                >
                  <div className="w-full h-full overflow-hidden">
                    <img
                      src={MEDIA.beat2.bottomRight}
                      alt="Alpine Sunset Atmosphere"
                      className="w-full h-full object-cover select-none"
                    />
                  </div>
                </motion.div>

                {/* Discipline Column in Beat 02 (Far Right Metadata) */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-2 font-mono text-[0.6rem] tracking-[0.24em] text-[#7A7770] uppercase pointer-events-none select-none">
                  {DISCIPLINES.map((disc, idx) => (
                    <div key={disc} className="flex items-center gap-2">
                      <span
                        className={`w-1 h-1 rounded-full ${
                          idx === 0 ? 'bg-[#101010] scale-125' : 'bg-[#E3DBCC]'
                        }`}
                      />
                      <span className={idx === 0 ? 'text-[#101010] font-semibold' : 'opacity-70'}>
                        {disc}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* =============================================================
                  BEAT 03: FINAL MONUMENTAL ARCH COMPOSITION (Hidden before Beat 3)
                  ============================================================= */}
              <motion.div
                style={{
                  display: beat3MediaDisplay,
                }}
                className="absolute inset-0"
              >
                {/* Photo 8: French Arch-Top Frame (Sunset Silhouette with Veil) */}
                <motion.div
                  style={{
                    opacity: b3ArchOpacity,
                    scale: b3ArchScale,
                    y: b3ArchY,
                    translateX: mouseHeroX,
                    translateY: mouseHeroY,
                  }}
                  className="absolute z-20 left-6 sm:left-14 lg:left-20 top-2 sm:top-4 w-[220px] sm:w-[280px] md:w-[320px] lg:w-[350px] aspect-[4/5] bg-[#F3F0E9] p-2.5 sm:p-3 shadow-[0_30px_70px_-16px_rgba(16,14,12,0.22)] border border-[#E3DBCC] rounded-t-[180px] sm:rounded-t-[240px] md:rounded-t-[280px]"
                >
                  <div className="w-full h-full overflow-hidden rounded-t-[172px] sm:rounded-t-[232px] md:rounded-t-[272px]">
                    <img
                      src={MEDIA.beat3.arch}
                      alt="Twilight Terrace Ceremony"
                      className="w-full h-full object-cover select-none transition-transform duration-700 hover:scale-105"
                    />
                  </div>
                </motion.div>

                {/* Photo 9: Overlapping Bridal Floral Bouquet (Bottom Right) */}
                <motion.div
                  style={{
                    opacity: b3BouquetOpacity,
                    rotate: b3BouquetRotate,
                    x: b3BouquetX,
                    y: b3BouquetY,
                    translateX: mouseFloatX,
                    translateY: mouseFloatY,
                  }}
                  className="absolute z-30 right-8 sm:right-16 lg:right-20 bottom-4 sm:bottom-8 w-[150px] sm:w-[190px] md:w-[220px] aspect-[4/5] bg-[#101010] p-2 sm:p-2.5 shadow-[0_24px_50px_-12px_rgba(16,14,12,0.28)] border border-[#E3DBCC]/40"
                >
                  <div className="w-full h-full overflow-hidden">
                    <img
                      src={MEDIA.beat3.bouquet}
                      alt="Bridal Floral Composition"
                      className="w-full h-full object-cover select-none transition-transform duration-700 hover:scale-105"
                    />
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[0.52rem] font-mono tracking-widest text-[#FDFCF8]/70 uppercase">
                    <span>Floral Study</span>
                    <span>Archival Plate</span>
                  </div>
                </motion.div>

                {/* Discipline Column in Beat 03 (Far Right Metadata) */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-2 font-mono text-[0.6rem] tracking-[0.24em] text-[#7A7770] uppercase pointer-events-none select-none">
                  {DISCIPLINES.map((disc, idx) => (
                    <div key={disc} className="flex items-center gap-2">
                      <span
                        className={`w-1 h-1 rounded-full ${
                          idx === 4 ? 'bg-[#101010] scale-125' : 'bg-[#E3DBCC]'
                        }`}
                      />
                      <span className={idx === 4 ? 'text-[#101010] font-semibold' : 'opacity-70'}>
                        {disc}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* =============================================================
                  REAL VIDEO CARD (Cinematic Moving Media Vignette)
                  ============================================================= */}
              <motion.div
                style={{
                  opacity: videoOpacity,
                  y: videoY,
                  x: videoX,
                  translateX: mouseFloatX,
                  translateY: mouseFloatY,
                }}
                className="absolute z-40 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-4 md:right-8 bottom-0 sm:bottom-3 w-[170px] sm:w-[210px] md:w-[240px] aspect-[16/10]"
              >
                <EditorialVideoCard
                  videoRef={videoRef}
                  isPlaying={isPlaying}
                  isMuted={isMuted}
                  onTogglePlay={togglePlay}
                  onToggleMute={toggleMute}
                  className="w-full h-full cursor-pointer"
                />
              </motion.div>

            </div>

          </div>

          {/* =================================================================
              BOTTOM INTERACTION BAR (Scroll Prompt Left · Beat Counter Right)
              ================================================================= */}
          <div className="w-full flex items-center justify-between pt-4 border-t border-[#E3DBCC]/60 font-mono text-[0.65rem] tracking-[0.22em] text-[#7A7770] uppercase select-none">
            
            {/* Scroll Indicator Prompt */}
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#101010] animate-pulse" />
              <span className="text-[#101010] font-medium">| SCROLL</span>
              <span className="inline-block animate-bounce">↓</span>
            </div>

            {/* Cinematic Beat Counter (01 — 03, 02 — 03, 03 — 03) */}
            <div className="flex items-center gap-3">
              <span className="text-[#101010] font-semibold text-xs tracking-[0.24em]">
                0{activeBeat}
              </span>
              <span className="w-6 sm:w-10 h-[1px] bg-[#101010]/40" />
              <span className="text-[#7A7770]">03</span>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
