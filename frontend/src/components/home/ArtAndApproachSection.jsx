import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { useEditorialReveal } from '../../utils/useEditorialReveal';
import approachArchPhoto from '../../assets/landing-down-animation/IMG_7785.webp';

const PHILOSOPHY_PARAGRAPH =
  'Led by Dishant Shelar, DS Photography & Films operates on the philosophy that photography should be honest, emotive, and timeless. Rather than forcing awkward poses or chasing fleeting trends, we observe quietly and capture genuine interactions. We utilize natural ambient light and subtle framing to create photographs that feel like fine art while preserving the true emotional essence of the moment.';

export default function ArtAndApproachSection() {
  const containerRef = useRef(null);
  const [headerRef, headerRevealed] = useEditorialReveal(0.15);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            // Progress: 0 when top enters lower viewport, 1 when bottom leaves upper viewport
            const total = rect.height + windowHeight;
            const current = windowHeight - rect.top;
            const progress = Math.max(0, Math.min(1, current / total));
            setScrollProgress(progress);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prefersReducedMotion]);

  // Parallax subtle vertical drift on arch photo
  const parallaxY = !prefersReducedMotion ? (scrollProgress - 0.5) * -45 : 0;

  // Words array for word-by-word scroll illumination
  const words = PHILOSOPHY_PARAGRAPH.split(' ');
  const totalWords = words.length;

  return (
    <section
      id="about"
      ref={containerRef}
      aria-label="The Art and Approach Behind Our Photography"
      className="w-full bg-[#FDFCF8] text-[#101010] py-20 sm:py-28 lg:py-36 border-t border-[#E3DBCC] relative overflow-hidden"
    >
      {/* Decorative subtle background aura */}
      <div
        className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FAF8F5] rounded-full filter blur-[100px] pointer-events-none -z-10 opacity-70"
        aria-hidden="true"
      />

      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 md:px-10 lg:px-10 xl:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Word-By-Word Editorial Statement */}
          <div className="lg:col-span-7 xl:col-span-8">
            <div ref={headerRef} className="mb-6 sm:mb-8">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-[#625D55] font-semibold">
                  ATELIER PHILOSOPHY · HONEST OBSERVATION
                </span>

                <Sparkles size={12} className="text-[#CBB9A4] animate-sparkle-twinkle" aria-hidden="true" />
              </div>

              <div className="editorial-mask-wrap mb-4">
                <h2
                  className={`font-serif text-[32px] sm:text-[42px] lg:text-[46px] font-normal text-[#101010] leading-[1.14] editorial-mask-rise ${
                    headerRevealed ? 'is-revealed' : ''
                  }`}
                >
                  Meet Dishant Shelar – Your Photographer in Mumbai
                </h2>
              </div>

              {/* Hairline underline */}
              <div className="w-16 sm:w-24 h-[1px] bg-[#E3DBCC] mb-6 overflow-hidden">
                <div
                  className={`h-full bg-[#101010]/30 editorial-draw-line ${
                    headerRevealed ? 'is-revealed' : ''
                  }`}
                />
              </div>
            </div>

            {/* Large Scroll-Linked Illuminated Statement: 100% crawlable in DOM */}
            <p
              className="font-serif text-[24px] sm:text-[28px] md:text-[32px] lg:text-[34px] xl:text-[36px] font-normal leading-[1.38] tracking-[-0.01em]"
              aria-label={PHILOSOPHY_PARAGRAPH}
            >
              {words.map((word, index) => {
                // Map word index to a scroll activation window across 0.25 to 0.75 progress
                const wordStart = 0.22 + (index / totalWords) * 0.48;
                const isIlluminated = prefersReducedMotion || scrollProgress >= wordStart;

                return (
                  <span
                    key={index}
                    className="inline-block mr-[0.28em] transition-colors duration-500 ease-out"
                    style={{
                      color: isIlluminated ? '#101010' : '#C5BDB0',
                      opacity: isIlluminated ? 1 : 0.45,
                    }}
                  >
                    {word}
                  </span>

                );
              })}
            </p>

            {/* Editorial citation micro-tag */}
            <div className="mt-8 pt-6 border-t border-[#E3DBCC]/70 flex flex-wrap items-center justify-between gap-3">
              <span className="w-6 h-[1px] bg-[#101010]/40" />
              <span className="font-mono text-xs uppercase tracking-widest text-[#625D55]">
                Dishant Shelar · Creative Director
              </span>
              <Link to="/about" className="font-mono text-[11px] uppercase tracking-widest text-[#101010] hover:text-[#7A6E5D] transition-colors underline underline-offset-4 font-semibold">
                Learn More About Dishant →
              </Link>

            </div>
          </div>

          {/* Right Column: Tall Arch Archival Photo with Parallax */}
          <div className="lg:col-span-5 xl:col-span-4 flex justify-center lg:justify-end">
            <div
              className="relative w-full max-w-[340px] sm:max-w-[380px] lg:max-w-[320px] xl:max-w-[360px] aspect-[1/1.42]"
              style={{
                transform: `translateY(${parallaxY}px)`,
                transition: prefersReducedMotion ? 'none' : 'transform 0.15s ease-out',
              }}
            >
              {/* Outer delicate arch outline border */}
              <div
                className="absolute -inset-3 rounded-t-full rounded-b-2xl border border-[#CBB9A4]/60 pointer-events-none transition-all duration-1000 ease-out"
                style={{
                  opacity: headerRevealed ? 1 : 0,
                  transform: headerRevealed ? 'scale(1)' : 'scale(0.96)',
                  transitionDelay: '0.2s',
                }}
              />

              {/* Inner Arch Photo container */}
              <div
                className={`relative w-full h-full rounded-t-full rounded-b-xl overflow-hidden bg-[#E8E2D5] shadow-[0_16px_40px_rgba(16,16,16,0.08)] editorial-arch-reveal ${
                  headerRevealed ? 'is-revealed' : ''
                }`}
              >
                <img
                  src={approachArchPhoto}
                  alt="Archival bridal fine art portrait study in Mumbai by Dishant Shelar"
                  title="The Art and Approach Behind Our Photography – DS Photography & Films"
                  width="400"
                  height="580"
                  className="w-full h-full object-cover select-none transition-transform duration-1000 ease-out hover:scale-105"
                  loading="lazy"
                />

                {/* Subtle bottom film-grain vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                {/* Micro Arch Label */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[10px] font-mono tracking-widest text-[#FDFCF8] uppercase pointer-events-none">
                  <span>ATELIER ARCHIVE</span>
                  <span>MUMBAI</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
