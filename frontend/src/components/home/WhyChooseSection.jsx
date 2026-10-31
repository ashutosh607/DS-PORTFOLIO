import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Camera, Film, Heart, Sparkles, MapPin, ArrowRight } from 'lucide-react';

// Curated studio assets
import driedBotanical from '../../assets/dried-botanical.jpg';
import defaultArchPhoto from '../../assets/landing-down-animation/IMG_7785.webp';
import photographerPhoto from '../../assets/photographer.webp';
import filmTonalityPhoto from '../../assets/landing-down-animation/DSP09982.webp';
import storytellingPhoto from '../../assets/landing-page-images/landing-03.webp';
import heirloomsPhoto from '../../assets/landing-down-animation/IMG_7783.webp';
import destinationPhoto from '../../assets/landing-down-animation/_0006027.webp';

/**
 * 5 Core Philosophy Pillars with complete SEO texts preserved in the DOM
 */
const PILLARS = [
  {
    number: '01',
    heading: 'Direct Creative Leadership',
    shortText: 'Dishant personally shoots every commission.',
    fullText:
      'Dishant Shelar personally directs and shoots principal coverage for every single atelier commission, guaranteeing uncompromising artistic quality.',
    icon: Camera,
    image: photographerPhoto,
    objectPosition: 'center 12%',
    alt: 'Dishant Shelar lead photographer directing wedding coverage in Mumbai',
  },
  {
    number: '02',
    heading: 'Medium-Format Film Tonality',
    shortText: 'Rich, organic, and timeless.',
    fullText:
      'Soft highlight rolloff, organic film grain, and subtle color palettes inspired by archival medium-format photography.',
    icon: Film,
    image: filmTonalityPhoto,
    objectPosition: 'center 45%',
    alt: 'Archival medium-format film tonality wedding photography in Mumbai',
  },
  {
    number: '03',
    heading: 'Unobtrusive Storytelling',
    shortText: 'Honest moments, quietly observed.',
    fullText:
      'Quiet, observant candid documentation that allows you and your families to be fully present and enjoy your celebration freely.',
    icon: Heart,
    image: storytellingPhoto,
    objectPosition: 'center 20%',
    alt: 'Candid unscripted emotional wedding storytelling in Mumbai Maharashtra',
  },
  {
    number: '04',
    heading: 'Archival Heirlooms & Delivery',
    shortText: 'Fine-art albums and high-resolution files.',
    fullText:
      'Color-graded high-resolution digital master files and handcrafted Italian leather-bound albums delivered within 3 weeks of selection.',
    icon: Sparkles,
    image: heirloomsPhoto,
    objectPosition: 'center 48%',
    alt: 'Handcrafted archival leather wedding albums and heirloom deliverables',
  },
  {
    number: '05',
    heading: 'Mumbai & Destination Coverage',
    shortText: 'From Mumbai to wherever love takes you.',
    fullText:
      'Extensive on-location expertise across South Mumbai, Bandra, Juhu, Thane, Alibaug, Goa, Rajasthan, and international destination estates.',
    icon: MapPin,
    image: destinationPhoto,
    objectPosition: 'center 22%',
    alt: 'Destination wedding photographer across Mumbai, Goa, Rajasthan and international estates',
  },
];

export default function WhyChooseSection() {
  // Row 01 (index 0) active by default, or 03 (index 2)
  const [activeRow, setActiveRow] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Parallax offsets
  const [scrollY, setScrollY] = useState(0);

  // Magnetic button state (desktop only)
  const [buttonOffset, setButtonOffset] = useState({ x: 0, y: 0 });
  const buttonRef = useRef(null);

  // 3D Card tilt state (desktop only)
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  // Container ref for scroll trigger and parallax
  const sectionRef = useRef(null);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const handler = (e) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // IntersectionObserver for one-time trigger
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.12 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // Parallax scroll listener
  useEffect(() => {
    if (reducedMotion) return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (sectionRef.current) {
            const rect = sectionRef.current.getBoundingClientRect();
            setScrollY(rect.top);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [reducedMotion]);

  // Magnetic button handlers (desktop)
  const handleButtonMouseMove = (e) => {
    if (reducedMotion || !buttonRef.current || window.innerWidth < 1024) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.28;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.28;
    setButtonOffset({ x, y });
  };

  const handleButtonMouseLeave = () => {
    setButtonOffset({ x: 0, y: 0 });
  };

  // 3D Card Tilt handlers (desktop)
  const handleCardMouseMove = (e) => {
    if (reducedMotion || !cardRef.current || window.innerWidth < 1024) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      x: -y * 2.5,
      y: x * 2.5,
    });
  };

  const handleCardMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  // Parallax translation amounts
  const archParallax = !reducedMotion ? (scrollY * 0.03) : 0;
  const cardParallax = !reducedMotion ? -(scrollY * 0.035) : 0;

  return (
    <div
      id="why-choose"
      ref={sectionRef}
      className="relative pt-14 sm:pt-20 lg:pt-24 pb-4 sm:pb-6 border-t border-[#E3DBCC] overflow-hidden"
    >
      {/* Decorative top-right curved arc line */}
      <svg
        className="absolute top-0 right-0 w-[300px] sm:w-[460px] lg:w-[480px] h-[200px] sm:h-[280px] pointer-events-none z-0 overflow-visible opacity-40 sm:opacity-50"
        viewBox="0 0 600 400"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M 600,10 C 440,60 340,180 260,380"
          stroke="#CBB9A4"
          strokeWidth="1"
          strokeDasharray="650"
          strokeDashoffset={isVisible ? '0' : '650'}
          style={{
            transition: 'stroke-dashoffset 1.4s cubic-bezier(0.22, 1, 0.36, 1) 0.3s',
          }}
        />
      </svg>

      {/* =========================================================================
          SECTION HEADER
          ========================================================================= */}
      <div className="relative z-10 max-w-3xl mb-10 sm:mb-12 lg:mb-12">
        {/* Monospace label */}
        <span
          className="text-[11px] sm:text-xs font-mono tracking-[0.25em] uppercase text-[#625D55] block mb-2.5 sm:mb-3 font-semibold transition-all duration-700 ease-out"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(12px)',
          }}
        >
          ATELIER STANDARDS &amp; PHILOSOPHY
        </span>

        {/* Heading masked rise */}
        <div className="overflow-hidden pb-1">
          <h2
            className="font-serif text-[30px] sm:text-[38px] md:text-[42px] lg:text-[42px] xl:text-[46px] font-normal text-[#101010] leading-[1.14] mb-3 sm:mb-3.5 transition-transform duration-800 ease-out"
            style={{
              transform: isVisible ? 'translateY(0)' : 'translateY(100%)',
              transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          >
            Why Choose DS Photography &amp; Films?
          </h2>
        </div>

        {/* Thin underline: short accent on mobile, elegant width on desktop */}
        <div className="w-16 sm:w-24 lg:w-full lg:max-w-[480px] h-[1px] bg-[#E3DBCC] origin-left mb-3.5 sm:mb-4 overflow-hidden">
          <div
            className="h-full bg-[#101010]/30 transition-transform duration-900 ease-out"
            style={{
              transform: isVisible ? 'scaleX(1)' : 'scaleX(0)',
              transformOrigin: 'left',
              transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
              transitionDelay: '0.25s',
            }}
          />
        </div>

        {/* Subheading: short line shown, full original preserved in DOM for SEO */}
        <p
          className="text-[14.5px] sm:text-[16px] lg:text-[15.5px] xl:text-[16.5px] text-[#4A463F] leading-relaxed font-sans transition-all duration-700 ease-out"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
            transitionDelay: '0.35s',
          }}
        >
          A commitment to timeless storytelling.
          <span className="sr-only">
            {' '}We accept a limited number of commissions each calendar year to ensure every couple and client receives our undivided creative focus, prompt archival delivery, and bespoke attention.
          </span>
        </p>
      </div>

      {/* =========================================================================
          RESPONSIVE LAYOUT (Mobile: 1 column vertical flow, Desktop/Laptop: 3 columns)
          ========================================================================= */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-6 xl:gap-8 items-center">
        
        {/* -----------------------------------------------------------------------
            ARCH-SHAPED PHOTO (Fluid responsive across all screens)
            ----------------------------------------------------------------------- */}
        <div className="lg:col-span-3 xl:col-span-3 flex justify-center lg:justify-start">
          <div
            className="relative w-full max-w-[320px] sm:max-w-[380px] lg:max-w-[260px] xl:max-w-[290px] 2xl:max-w-[320px] aspect-[4/3] sm:aspect-[16/11] lg:aspect-[1/1.4]"
            style={{
              transform: `translateY(${archParallax}px)`,
              transition: reducedMotion ? 'none' : 'transform 0.15s ease-out',
            }}
          >
            {/* Outer delicate arch outline border */}
            <div
              className="absolute -inset-2.5 sm:-inset-3 rounded-t-[140px] sm:rounded-t-[180px] lg:rounded-t-full rounded-b-none lg:rounded-b-2xl border border-[#CBB9A4]/60 pointer-events-none transition-all duration-1000 ease-out"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'scale(1)' : 'scale(0.96)',
                transitionDelay: '0.3s',
              }}
            />

            {/* Inner arch container with bottom-to-top wipe reveal */}
            <div
              className="relative w-full h-full rounded-t-[130px] sm:rounded-t-[170px] lg:rounded-t-full rounded-b-none lg:rounded-b-xl overflow-hidden bg-[#E8E2D5] shadow-[0_8px_30px_rgba(16,16,16,0.06)]"
              style={{
                clipPath: isVisible ? 'inset(0% 0% 0% 0%)' : 'inset(100% 0% 0% 0%)',
                transition: reducedMotion
                  ? 'opacity 0.6s ease-out'
                  : 'clip-path 1.1s cubic-bezier(0.22, 1, 0.36, 1) 0.2s',
              }}
            >
              {/* Photo stack crossfade with calibrated framing so faces & subjects are clearly visible */}
              {PILLARS.map((pillar, i) => {
                const isSelected = activeRow === i;
                return (
                  <img
                    key={pillar.number}
                    src={pillar.image}
                    alt={pillar.alt}
                    loading="lazy"
                    width="480"
                    height="560"
                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out ${
                      isSelected ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
                    }`}
                    style={{
                      objectPosition: pillar.objectPosition || 'center 20%',
                      transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
                    }}
                  />
                );
              })}

              {/* Fallback default portrait if activeRow is null */}
              <img
                src={defaultArchPhoto}
                alt="Archival couple portrait in Mumbai by DS Photography"
                loading="lazy"
                width="480"
                height="560"
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out ${
                  activeRow === null ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
                }`}
                style={{
                  objectPosition: 'center 20%',
                  transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
                }}
              />
            </div>
          </div>
        </div>

        {/* -----------------------------------------------------------------------
            CENTER COLUMN: 5 Numbered Rows (01 to 05) with Timeline Dots
            ----------------------------------------------------------------------- */}
        <div className="lg:col-span-5 xl:col-span-5 relative py-2 lg:py-0">
          {/* Continuous vertical hairline timeline line passing through all row dots */}
          <div
            className="absolute left-[59px] sm:left-[63px] lg:left-[61px] xl:left-[67px] top-6 bottom-6 w-[1px] bg-[#E3DBCC] pointer-events-none z-0 origin-top transition-transform duration-1000 ease-out"
            style={{
              transform: isVisible ? 'scaleY(1)' : 'scaleY(0)',
              transitionDelay: '0.35s',
            }}
          />

          <div className="flex flex-col gap-2 sm:gap-2.5 lg:gap-2 relative z-10">
            {PILLARS.map((pillar, i) => {
              const isActive = activeRow === i;
              const IconComponent = pillar.icon;

              return (
                <div
                  key={pillar.number}
                  role="button"
                  tabIndex={0}
                  aria-expanded={isActive}
                  aria-controls={`pillar-content-${pillar.number}`}
                  onMouseEnter={() => {
                    // Only hover on desktop/laptop
                    if (window.innerWidth >= 1024) setActiveRow(i);
                  }}
                  onFocus={() => setActiveRow(i)}
                  onClick={() => setActiveRow(isActive ? null : i)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setActiveRow(isActive ? null : i);
                    }
                  }}
                  className={`group relative rounded-2xl lg:rounded-xl px-3.5 py-3 sm:px-4 sm:py-3.5 lg:px-4 lg:py-3 xl:px-5 xl:py-3.5 min-h-[56px] cursor-pointer transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8C7764] ${
                    isActive
                      ? 'bg-[#F4EFE6] shadow-[0_2px_12px_rgba(20,18,15,0.06)]'
                      : 'hover:bg-[#FAF7F0] active:bg-[#F4EFE6]/60'
                  }`}
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(14px)',
                    transitionDelay: `${0.2 + i * 0.06}s`,
                  }}
                >
                  <div className="flex items-center gap-3 sm:gap-3.5 lg:gap-3 xl:gap-3.5">
                    {/* Number: 01 to 05 in light serif */}
                    <span
                      className={`font-serif text-[21px] sm:text-[23px] lg:text-[21px] xl:text-[23px] font-light tracking-tight min-w-[28px] text-center transition-colors duration-300 ${
                        isActive ? 'text-[#101010] font-normal' : 'text-[#7A746B] group-hover:text-[#101010]'
                      }`}
                    >
                      {pillar.number}
                    </span>

                    {/* Timeline dot aligned on the continuous vertical line */}
                    <div className="relative z-10 flex items-center justify-center shrink-0 w-2.5">
                      <div
                        className={`w-1.5 h-1.5 rounded-full border transition-all duration-300 ${
                          isActive
                            ? 'bg-[#101010] border-[#101010] scale-125'
                            : 'bg-[#FAF8F5] border-[#CBB9A4]'
                        }`}
                      />
                    </div>

                    {/* Icon circular container */}
                    <div
                      className={`w-8 h-8 sm:w-9 sm:h-9 lg:w-8 lg:h-8 xl:w-9 xl:h-9 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300 ${
                        isActive
                          ? 'bg-[#EAE3D4] border-[#C5B9A5] text-[#101010] scale-105'
                          : 'bg-[#FAF8F5] border-[#E3DBCC] text-[#625D55] group-hover:border-[#C5B9A5] group-hover:text-[#101010]'
                      }`}
                    >
                      <IconComponent className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[1.4]" />
                    </div>

                    {/* Text block */}
                    <div className="flex-1 min-w-0 pr-1">
                      <h3 className="font-serif text-[16.5px] sm:text-[18px] lg:text-[16.5px] xl:text-[18px] font-normal text-[#101010] leading-snug">
                        {pillar.heading}
                      </h3>
                      <p className="text-[12.5px] sm:text-[13.5px] lg:text-[12.5px] xl:text-[13.5px] text-[#7A746B] font-sans truncate sm:whitespace-normal">
                        {pillar.shortText}
                      </p>

                      {/* Full original SEO text: always in the HTML DOM, visually collapsed with CSS */}
                      <div
                        id={`pillar-content-${pillar.number}`}
                        className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out ${
                          isActive
                            ? 'grid-rows-[1fr] opacity-100 mt-2'
                            : 'grid-rows-[0fr] opacity-0 mt-0 pointer-events-none'
                        }`}
                        style={{
                          transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
                        }}
                      >
                        <div className="overflow-hidden">
                          <p className="text-[13px] sm:text-[14px] lg:text-[13px] xl:text-[14px] text-[#4A463F] leading-relaxed font-sans pt-2 border-t border-[#E3DBCC]/60">
                            {pillar.fullText}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Arrow indicator: rotates down on mobile when active */}
                    <div className="shrink-0 text-[#8C7764] pl-1">
                      <ArrowRight
                        className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 ${
                          isActive
                            ? 'rotate-90 text-[#101010]'
                            : 'group-hover:translate-x-1'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Hairline bottom divider between items */}
                  {i < PILLARS.length - 1 && !isActive && (
                    <div className="absolute left-16 right-4 bottom-0 h-[1px] bg-[#EAE4DA]/50 pointer-events-none" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* -----------------------------------------------------------------------
            RIGHT COLUMN: Dark "Reserve Your Date" Card (Sleek across all devices)
            ----------------------------------------------------------------------- */}
        <div className="lg:col-span-4 xl:col-span-4 flex justify-center lg:justify-end">
          <div
            ref={cardRef}
            onMouseMove={handleCardMouseMove}
            onMouseLeave={handleCardMouseLeave}
            className="relative w-full max-w-[340px] sm:max-w-[420px] lg:max-w-[310px] xl:max-w-[340px] 2xl:max-w-[360px] bg-[#101010] text-[#FDFCF8] rounded-[24px] lg:rounded-[22px] p-6 sm:p-7 lg:p-6 xl:p-7 flex flex-col justify-between shadow-[0_18px_45px_rgba(16,16,16,0.18)] transition-transform duration-300 ease-out"
            style={{
              transform: reducedMotion
                ? 'none'
                : `translateY(${cardParallax}px) perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              opacity: isVisible ? 1 : 0,
              transition: isVisible
                ? 'opacity 0.8s ease-out 0.3s, transform 0.25s ease-out'
                : 'opacity 0.8s ease-out, transform 0.8s ease-out',
            }}
          >
            {/* Top botanical photo: visible on desktop, tablet, and mobile */}
            <div className="relative w-full h-[130px] sm:h-[150px] lg:h-[135px] xl:h-[155px] rounded-xl overflow-hidden mb-4 sm:mb-5 lg:mb-4 bg-[#1a1a1a]">
              <img
                src={driedBotanical}
                alt="Archival dried botanical in warm chiaroscuro light – DS Photography Atelier"
                loading="lazy"
                width="400"
                height="280"
                className="w-full h-full object-cover"
                style={{
                  animation: reducedMotion ? 'none' : 'kenBurnsLoop 18s ease-in-out infinite',
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#101010]/60 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Card Content Area */}
            <div className="flex-1 flex flex-col justify-between">
              <div className="mb-5 sm:mb-6 lg:mb-5">
                <span className="text-[10.5px] sm:text-[11px] lg:text-[10.5px] font-mono uppercase tracking-[0.22em] text-[#CBB9A4] block mb-2 font-semibold">
                  DATE RESERVATION
                </span>
                <h3 className="font-serif text-[24px] sm:text-[28px] lg:text-[24px] xl:text-[27px] font-normal text-[#FDFCF8] leading-tight mb-2 sm:mb-2.5">
                  Reserve Your Date
                </h3>

                {/* Subtitle with full original text in DOM */}
                <p className="text-[13.5px] sm:text-[14.5px] lg:text-[13.5px] xl:text-[14px] text-[#E3DBCC]/90 leading-relaxed font-sans">
                  Peak dates book 4 to 9 months ahead.
                  <span className="sr-only">
                    {' '}Peak wedding dates across Mumbai, Goa, and Maharashtra reserve 4 to 9 months in advance. Share your celebration plans with us.
                  </span>
                </p>
              </div>

              {/* Full-width white pill button with tap press effect */}
              <div
                ref={buttonRef}
                onMouseMove={handleButtonMouseMove}
                onMouseLeave={handleButtonMouseLeave}
                className="relative"
              >
                <Link
                  to="/services#book"
                  className="group relative inline-flex items-center justify-center gap-2.5 w-full bg-[#FDFCF8] text-[#101010] py-3.5 sm:py-4 lg:py-3 xl:py-3.5 px-6 rounded-full font-mono text-xs sm:text-[12.5px] lg:text-[11.5px] xl:text-[12px] font-semibold uppercase tracking-[0.16em] hover:bg-[#E3DBCC] active:scale-[0.98] transition-all duration-300 shadow-md"
                  style={{
                    transform: reducedMotion
                      ? 'none'
                      : `translate(${buttonOffset.x}px, ${buttonOffset.y}px)`,
                    transition: 'transform 0.18s ease-out, background-color 0.3s ease',
                    animation: isVisible && !reducedMotion ? 'buttonSubtleShimmer 1.2s ease-out 0.8s 1' : 'none',
                  }}
                >
                  <span>CHECK AVAILABILITY</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Scoped CSS animations for button shimmer & desktop Ken Burns */}
      <style>{`
        @keyframes buttonSubtleShimmer {
          0% {
            box-shadow: 0 0 0 0 rgba(253, 252, 248, 0);
          }
          40% {
            box-shadow: 0 0 20px 2px rgba(253, 252, 248, 0.4);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(253, 252, 248, 0);
          }
        }
        @keyframes kenBurnsLoop {
          0%, 100% {
            transform: scale(1) translate(0, 0);
          }
          50% {
            transform: scale(1.08) translate(-1.5%, -1%);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          #why-choose * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
}
