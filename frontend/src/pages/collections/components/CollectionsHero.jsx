import React, { useRef, useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import TextBlurReveal from '../../../components/common/TextBlurReveal';

export default function CollectionsHero({
  onScrollToExplore,
  onSelectCategory,
  onPrevCategory,
  onNextCategory,
}) {
  const shouldReduceMotion = useReducedMotion();
  const videoRef = useRef(null);
  const [isVideoReady, setIsVideoReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Strict DOM properties and attributes for iOS Safari, WebKit, and Chrome autoplay policies
    video.defaultMuted = true;
    video.muted = true;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', 'true');

    const handleReady = () => {
      setIsVideoReady(true);
    };

    const playVideo = () => {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.debug('Autoplay waiting for policy or user touch:', err);
        });
      }
    };

    if (video.readyState >= 2) {
      handleReady();
    }

    video.addEventListener('loadeddata', handleReady);
    video.addEventListener('canplay', handleReady);
    video.addEventListener('playing', handleReady);

    // Explicitly trigger media loading pipeline
    video.load();
    playVideo();

    // Fallback: If mobile browser power-saver initially deferred autoplay, trigger on first user interaction
    const handleFirstInteraction = () => {
      handleReady();
      if (video.paused) {
        playVideo();
      }
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction, { passive: true, once: true });
    window.addEventListener('touchstart', handleFirstInteraction, { passive: true, once: true });

    return () => {
      video.removeEventListener('loadeddata', handleReady);
      video.removeEventListener('canplay', handleReady);
      video.removeEventListener('playing', handleReady);
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, []);

  return (
    <section
      className="relative w-full overflow-hidden flex items-center"
      style={{
        minHeight: '100svh',
        height: '100svh',
        backgroundColor: '#FDFCF8',
      }}
    >
      {/* 1. Fullscreen Background Video Layer */}
      <motion.div
        className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none"
        initial={shouldReduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: isVideoReady ? 1 : 0 }}
        transition={{
          duration: 0.65,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        <video
          ref={videoRef}
          src="/videos/landingpagevd.mp4"
          autoPlay
          muted
          defaultMuted
          loop
          playsInline
          preload="auto"
          onLoadedData={() => setIsVideoReady(true)}
          onPlaying={() => setIsVideoReady(true)}
          className="w-full h-full object-cover object-center pointer-events-none select-none"
          style={{
            objectPosition: 'center center',
          }}
          aria-hidden="true"
        >
          {/* Direct edge-served asset for instant playback */}
          <source src="/videos/landingpagevd.mp4" type="video/mp4" />
          <source src="/uploads/ds_portfolio/categories/landingpagevd.mp4" type="video/mp4" />
          <source src="/categories/landingpagevd.mp4" type="video/mp4" />
        </video>
      </motion.div>

      {/* 2. Soft Warm-Neutral Scrim for Flawless Text Readability */}
      {/* Desktop: Horizontal directional gradient strongest behind the text and fading toward the center/right */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none hidden md:block"
        style={{
          background:
            'linear-gradient(90deg, rgba(253, 252, 248, 0.90) 0%, rgba(253, 252, 248, 0.72) 32%, rgba(253, 252, 248, 0.35) 54%, rgba(253, 252, 248, 0) 75%)',
        }}
      />

      {/* Mobile / Tablet: Vertical & gentle horizontal scrim tuned for narrower screens */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none md:hidden"
        style={{
          background:
            'linear-gradient(180deg, rgba(253, 252, 248, 0.92) 0%, rgba(253, 252, 248, 0.78) 45%, rgba(253, 252, 248, 0.40) 75%, rgba(253, 252, 248, 0.20) 100%)',
        }}
      />

      {/* 3. Text & Interaction Layer (Stacked above scrim & video, below fixed navbar) */}
      <div className="relative z-10 w-full h-full flex flex-col justify-between pt-28 sm:pt-32 md:pt-0 pb-10 sm:pb-12 px-6 sm:px-10 md:px-12 lg:px-16 xl:px-24">
        
        {/* Invisible spacer on desktop to balance vertical centering */}
        <div className="hidden md:block md:flex-1" />

        {/* Left-Aligned Refined Editorial Typography (Max-width 560-600px, 6-8vw horizontal offset) */}
        <motion.div
          className="flex flex-col items-start max-w-[580px]"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Eyebrow Label with horizontal line */}
          <div className="flex items-center gap-3.5 mb-5 sm:mb-6">
            <TextBlurReveal
              text="The Collections"
              blurAmount={6}
              delay={0.05}
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.6875rem',
                fontWeight: 600,
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                color: '#6E6961',
              }}
            />
            <motion.span
              initial={{ scaleX: 0, originX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="w-10 sm:w-12 h-[1px] bg-[#D1C9BD]"
            />
          </div>

          {/* Main Heading: "Different moments. Same feeling." */}
          <TextBlurReveal
            as="h1"
            text="Different moments. Same feeling."
            blurAmount={12}
            stagger={0.06}
            delay={0.1}
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.5rem, 4.2vw, 3.85rem)',
              lineHeight: 1.08,
              fontWeight: 400,
              letterSpacing: '-0.025em',
              color: '#151515',
              marginBottom: '1.4rem',
            }}
          />

          {/* Description */}
          <TextBlurReveal
            as="p"
            text="Explore our curated photography collections, each designed to tell a different story."
            blurAmount={8}
            delay={0.25}
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'clamp(0.95rem, 1.1vw, 1.05rem)',
              lineHeight: 1.6,
              color: '#47433C',
              maxWidth: '410px',
              marginBottom: '2.25rem',
            }}
          />

          {/* Subtle Scroll to explore widget */}
          <div
            onClick={onScrollToExplore}
            className="inline-flex items-center gap-2.5 select-none cursor-pointer group"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onScrollToExplore?.();
              }
            }}
            aria-label="Scroll to explore collections"
          >
            <div className="w-[18px] h-[26px] rounded-full border border-[#7A746B] group-hover:border-[#101010] transition-colors flex flex-col items-center justify-center gap-0.5">
              <span className="text-[7px] leading-none text-[#4A453D] group-hover:text-[#101010]">↑</span>
              <span className="text-[7px] leading-none text-[#4A453D] group-hover:text-[#101010]">↓</span>
            </div>
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.72rem',
                letterSpacing: '0.12em',
                color: '#38342E',
                fontWeight: 500,
              }}
              className="group-hover:text-[#101010] transition-colors"
            >
              Scroll to explore
            </span>
          </div>
        </motion.div>

        {/* Bottom spacer on desktop to complete vertical balance */}
        <div className="hidden md:block md:flex-1" />

      </div>
    </section>
  );
}
