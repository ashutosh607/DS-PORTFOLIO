import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Camera, Film, Heart, BookOpen, MapPin, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

// Curated studio assets
import driedBotanical from '../../assets/dried-botanical.jpg';
import defaultArchPhoto from '../../assets/landing-down-animation/IMG_7785.webp';
import photographerPhoto from '../../assets/photographer.webp';
import filmTonalityPhoto from '../../assets/landing-down-animation/DSP09982.webp';
import storytellingPhoto from '../../assets/landing-page-images/landing-03.webp';
import heirloomsPhoto from '../../assets/landing-down-animation/IMG_7783.webp';
import destinationPhoto from '../../assets/landing-down-animation/_0006027.webp';

gsap.registerPlugin(ScrollTrigger);

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
    icon: BookOpen,
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
  // Row 01 (index 0) active by default
  const [activeRow, setActiveRow] = useState(0);

  // Scoped root container
  const sectionRef = useRef(null);

  // References for accordion elements
  const contentRefs = useRef([]);
  const arrowRefs = useRef([]);
  const rowRefs = useRef([]);
  const idleFloatTween = useRef(null);

  // Master ScrollTrigger Timeline & GSAP Animation Setup
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // 1. Reduced Motion: Show everything instantly
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(
          [
            '.why-heading-line',
            '.why-eyebrow',
            '.why-underline-bar',
            '.why-subtext',
            '.why-arch-outline',
            '.why-arch-inner',
            '.why-arch-img',
            '.why-timeline-line',
            '.why-row',
            '.why-row-divider',
            '.why-row-number',
            '.why-row-dot',
            '.why-row-icon',
            '.why-row-text',
            '.why-reserve-card',
            '.why-botanical-img',
            '.why-reserve-label',
            '.why-reserve-title',
            '.why-reserve-desc',
            '.why-reserve-btn',
            '.why-arc-path',
          ],
          {
            clearProps: 'all',
          }
        );
        gsap.set('.why-arch-inner', {
          clipPath: 'inset(0% 0% 0% 0% round 200px 200px 0 0)',
        });
        gsap.set('.why-arc-path', {
          strokeDashoffset: 0,
        });
      });

      // 2. Desktop & Tablet (min-width: 768px): Full Cinematic Master Timeline
      mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
        // Initial States
        gsap.set(['.why-eyebrow', '.why-heading-line'], {
          y: 60,
          opacity: 0,
          filter: 'blur(12px)',
          willChange: 'transform, opacity, filter',
        });
        gsap.set('.why-underline-bar', {
          scaleX: 0,
          transformOrigin: 'left center',
          willChange: 'transform',
        });
        gsap.set('.why-subtext', {
          y: 20,
          opacity: 0,
          willChange: 'transform, opacity',
        });

        // Arch (left)
        gsap.set('.why-arch-outline', {
          scale: 0.92,
          opacity: 0,
          willChange: 'transform, opacity',
        });
        gsap.set('.why-arch-inner', {
          clipPath: 'inset(100% 0% 0% 0% round 200px 200px 0 0)',
          willChange: 'clip-path',
        });
        gsap.set('.why-arch-img', {
          scale: 1.35,
          filter: 'blur(20px)',
          willChange: 'transform, filter',
        });

        // Center Timeline & Rows
        gsap.set('.why-timeline-line', {
          scaleY: 0,
          transformOrigin: 'top center',
          willChange: 'transform',
        });
        gsap.set('.why-row', {
          x: 60,
          opacity: 0,
          filter: 'blur(8px)',
          willChange: 'transform, opacity, filter',
        });
        gsap.set('.why-row-divider', {
          scaleX: 0,
          transformOrigin: 'left center',
          willChange: 'transform',
        });
        gsap.set('.why-row-dot', {
          scale: 0,
          willChange: 'transform',
        });
        gsap.set('.why-row-icon', {
          scale: 0,
          willChange: 'transform',
        });
        gsap.set('.why-row-text', {
          y: 20,
          opacity: 0,
          willChange: 'transform, opacity',
        });

        // Right Reserve Card
        gsap.set('.why-reserve-card', {
          y: 100,
          rotateX: 14,
          transformPerspective: 1000,
          transformOrigin: 'bottom center',
          opacity: 0,
          filter: 'blur(14px)',
          boxShadow: '0 6px 15px rgba(16,16,16,0.05)',
          willChange: 'transform, opacity, filter, box-shadow',
        });
        gsap.set('.why-botanical-img', {
          scale: 1.2,
          willChange: 'transform',
        });
        gsap.set(['.why-reserve-label', '.why-reserve-title', '.why-reserve-desc'], {
          y: 24,
          opacity: 0,
          willChange: 'transform, opacity',
        });
        gsap.set('.why-reserve-btn', {
          scale: 0.9,
          opacity: 0,
          willChange: 'transform, opacity',
        });

        // Master ScrollTrigger Timeline
        const masterTl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            once: true,
          },
          onComplete: () => {
            // Remove blur filter completely to avoid GPU cost
            gsap.set(
              ['.why-heading-line', '.why-arch-img', '.why-row', '.why-reserve-card'],
              { filter: 'none', willChange: 'auto' }
            );

            // Subtle idle float on reserve card (3s sine.inOut, yoyo)
            idleFloatTween.current = gsap.to('.why-reserve-card', {
              y: -8,
              duration: 3,
              ease: 'sine.inOut',
              yoyo: true,
              repeat: -1,
            });
          },
        });

        // 1) HEADING + SUBTEXT
        masterTl
          .to(
            ['.why-eyebrow', '.why-heading-line'],
            {
              y: 0,
              opacity: 1,
              filter: 'blur(0px)',
              duration: 1.0,
              ease: 'power3.out',
              stagger: 0.12,
            },
            0
          )
          .to(
            '.why-underline-bar',
            {
              scaleX: 1,
              duration: 0.9,
              ease: 'power3.out',
            },
            0.25
          )
          .to(
            '.why-subtext',
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              ease: 'power3.out',
            },
            0.45
          );

        // 2) ARCHED PORTRAIT (left)
        masterTl
          .to(
            '.why-arch-outline',
            {
              scale: 1,
              opacity: 1,
              duration: 1.1,
              ease: 'power3.out',
            },
            0.4
          )
          .to(
            '.why-arch-inner',
            {
              clipPath: 'inset(0% 0% 0% 0% round 200px 200px 0 0)',
              duration: 1.4,
              ease: 'power4.inOut',
            },
            0.5
          )
          .to(
            '.why-arch-img',
            {
              scale: 1,
              filter: 'blur(0px)',
              duration: 1.8,
              ease: 'power3.out',
            },
            0.5
          );

        // 3) ACCORDION ROWS (center)
        masterTl
          .to(
            '.why-timeline-line',
            {
              scaleY: 1,
              duration: 1.2,
              ease: 'power3.out',
            },
            0.6
          )
          .to(
            '.why-row',
            {
              x: 0,
              opacity: 1,
              filter: 'blur(0px)',
              duration: 1.0,
              ease: 'power3.out',
              stagger: 0.12,
            },
            0.7
          )
          .to(
            '.why-row-divider',
            {
              scaleX: 1,
              duration: 0.8,
              ease: 'power3.out',
              stagger: 0.1,
            },
            0.8
          )
          .to(
            '.why-row-number',
            {
              opacity: 1,
              duration: 0.4,
              ease: 'power2.out',
              stagger: 0.08,
            },
            0.85
          )
          .to(
            '.why-row-dot',
            {
              scale: 1,
              duration: 0.5,
              ease: 'power2.out',
              stagger: 0.08,
            },
            0.9
          )
          .to(
            '.why-row-icon',
            {
              scale: 1,
              duration: 0.6,
              ease: 'back.out(1.7)',
              stagger: 0.08,
            },
            0.95
          )
          .to(
            '.why-row-text',
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              ease: 'power3.out',
              stagger: 0.08,
            },
            1.05
          );

        // 5) RESERVE CARD (right)
        masterTl
          .to(
            '.why-reserve-card',
            {
              y: 0,
              rotateX: 0,
              opacity: 1,
              filter: 'blur(0px)',
              boxShadow: '0 24px 50px rgba(16,16,16,0.22)',
              duration: 1.4,
              ease: 'power4.out',
            },
            0.8
          )
          .to(
            '.why-botanical-img',
            {
              scale: 1,
              duration: 2.0,
              ease: 'power3.out',
            },
            0.9
          )
          .to(
            ['.why-reserve-label', '.why-reserve-title', '.why-reserve-desc'],
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              ease: 'power3.out',
              stagger: 0.1,
            },
            1.2
          )
          .to(
            '.why-reserve-btn',
            {
              scale: 1,
              opacity: 1,
              duration: 0.6,
              ease: 'back.out(1.5)',
            },
            1.4
          );

        // Subtle Scrubbed Parallax on Arched Photo
        gsap.fromTo(
          '.why-arch-img-wrap',
          { yPercent: -6 },
          {
            yPercent: 6,
            ease: 'none',
            scrollTrigger: {
              trigger: '.why-arch-container',
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
            },
          }
        );

        // 6) CONNECTING CURVE (top right)
        gsap.fromTo(
          '.why-arc-path',
          { strokeDashoffset: 650 },
          {
            strokeDashoffset: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
              end: 'bottom 40%',
              scrub: 1,
            },
          }
        );

        // Row Hover Interactions (Desktop)
        const rows = gsap.utils.toArray('.why-row');
        rows.forEach((row) => {
          const arrow = row.querySelector('.why-row-arrow-icon');
          const icon = row.querySelector('.why-row-icon');

          const onEnter = () => {
            gsap.to(row, { x: 6, duration: 0.35, ease: 'power2.out', overwrite: 'auto' });
            if (arrow) gsap.to(arrow, { x: 4, duration: 0.35, ease: 'power2.out', overwrite: 'auto' });
            if (icon) gsap.to(icon, { borderColor: '#C5B9A5', duration: 0.35, overwrite: 'auto' });
          };

          const onLeave = () => {
            gsap.to(row, { x: 0, duration: 0.35, ease: 'power2.out', overwrite: 'auto' });
            if (arrow) gsap.to(arrow, { x: 0, duration: 0.35, ease: 'power2.out', overwrite: 'auto' });
            if (icon) gsap.to(icon, { borderColor: '#E3DBCC', duration: 0.35, overwrite: 'auto' });
          };

          row.addEventListener('mouseenter', onEnter);
          row.addEventListener('mouseleave', onLeave);
        });

        // Reserve Button Hover (Desktop)
        const btn = sectionRef.current?.querySelector('.why-reserve-btn');
        if (btn) {
          const btnArrow = btn.querySelector('.why-btn-arrow');
          const onBtnEnter = () => {
            gsap.to(btn, { scale: 1.03, duration: 0.35, ease: 'power2.out', overwrite: 'auto' });
            if (btnArrow) gsap.to(btnArrow, { x: 6, duration: 0.35, ease: 'power2.out', overwrite: 'auto' });
          };
          const onBtnLeave = () => {
            gsap.to(btn, { scale: 1, duration: 0.35, ease: 'power2.out', overwrite: 'auto' });
            if (btnArrow) gsap.to(btnArrow, { x: 0, duration: 0.35, ease: 'power2.out', overwrite: 'auto' });
          };
          btn.addEventListener('mouseenter', onBtnEnter);
          btn.addEventListener('mouseleave', onBtnLeave);
        }
      });

      // 3. Mobile (< 768px): Stack animations as simple y: 60 -> 0 fades with blur 8px, stagger 0.1
      mm.add('(max-width: 767px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.set(
          [
            '.why-eyebrow',
            '.why-heading-line',
            '.why-subtext',
            '.why-arch-container',
            '.why-row',
            '.why-reserve-card',
          ],
          {
            y: 60,
            opacity: 0,
            filter: 'blur(8px)',
            willChange: 'transform, opacity, filter',
          }
        );
        gsap.set('.why-underline-bar', { scaleX: 0, transformOrigin: 'left' });
        gsap.set('.why-arch-inner', { clipPath: 'inset(0% 0% 0% 0% round 140px 140px 0 0)' });
        gsap.set('.why-arc-path', { strokeDashoffset: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            once: true,
          },
          onComplete: () => {
            gsap.set(
              ['.why-heading-line', '.why-arch-container', '.why-row', '.why-reserve-card'],
              { filter: 'none', willChange: 'auto' }
            );
          },
        });

        tl.to(['.why-eyebrow', '.why-heading-line'], {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.1,
        })
          .to('.why-underline-bar', { scaleX: 1, duration: 0.8, ease: 'power3.out' }, 0.2)
          .to('.why-subtext', { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, 0.3)
          .to(
            '.why-arch-container',
            { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.9, ease: 'power3.out' },
            0.4
          )
          .to(
            '.why-row',
            {
              y: 0,
              opacity: 1,
              filter: 'blur(0px)',
              duration: 0.8,
              ease: 'power3.out',
              stagger: 0.1,
            },
            0.5
          )
          .to(
            '.why-reserve-card',
            { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.9, ease: 'power3.out' },
            0.7
          );
      });

      // Refresh ScrollTrigger after images load
      const handleLoad = () => ScrollTrigger.refresh();
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    },
    { scope: sectionRef }
  );

  // 4) ACCORDION INTERACTION: GSAP Height & Text Reveal
  useEffect(() => {
    PILLARS.forEach((_, i) => {
      const content = contentRefs.current[i];
      const arrow = arrowRefs.current[i];
      const row = rowRefs.current[i];
      if (!content) return;

      if (activeRow === i) {
        // Expand active row
        gsap.to(content, {
          height: 'auto',
          duration: 0.6,
          ease: 'power3.inOut',
          overwrite: 'auto',
        });
        const text = content.querySelector('.why-accordion-text');
        if (text) {
          gsap.fromTo(
            text,
            { opacity: 0, y: 12 },
            { opacity: 1, y: 0, duration: 0.5, delay: 0.1, ease: 'power3.out', overwrite: 'auto' }
          );
        }
        if (arrow) {
          gsap.to(arrow, { rotation: 90, duration: 0.6, ease: 'power3.inOut', overwrite: 'auto' });
        }
        if (row) {
          gsap.to(row, {
            backgroundColor: '#F4EFE6',
            duration: 0.5,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        }
      } else {
        // Collapse other rows
        gsap.to(content, {
          height: 0,
          duration: 0.5,
          ease: 'power3.inOut',
          overwrite: 'auto',
        });
        const text = content.querySelector('.why-accordion-text');
        if (text) {
          gsap.to(text, { opacity: 0, y: 12, duration: 0.25, ease: 'power2.in', overwrite: 'auto' });
        }
        if (arrow) {
          gsap.to(arrow, { rotation: 0, duration: 0.5, ease: 'power3.inOut', overwrite: 'auto' });
        }
        if (row) {
          gsap.to(row, {
            backgroundColor: 'transparent',
            duration: 0.4,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        }
      }
    });
  }, [activeRow]);

  return (
    <section
      id="why-choose"
      ref={sectionRef}
      aria-label="Why Choose DS Photography & Films"
      className="w-full bg-[#FAF8F5] relative pt-16 sm:pt-24 lg:pt-32 pb-16 sm:pb-24 border-t border-[#E3DBCC] overflow-hidden scroll-mt-24 sm:scroll-mt-28"
    >
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 md:px-10 lg:px-10 xl:px-16 relative z-10">
        {/* 6) Decorative top-right curved arc line */}
        <svg
          className="absolute top-0 right-0 w-[300px] sm:w-[460px] lg:w-[480px] h-[200px] sm:h-[280px] pointer-events-none z-0 overflow-visible opacity-40 sm:opacity-50"
          viewBox="0 0 600 400"
          fill="none"
          aria-hidden="true"
        >
          <path
            className="why-arc-path"
            d="M 600,10 C 440,60 340,180 260,380"
            stroke="#CBB9A4"
            strokeWidth="1"
            strokeDasharray="650"
            strokeDashoffset="650"
          />
        </svg>

        {/* =========================================================================
            SECTION HEADER
            ========================================================================= */}
        <div className="relative z-10 max-w-3xl mb-10 sm:mb-12 lg:mb-12">
          {/* Monospace label */}
          <span className="why-eyebrow text-[11px] sm:text-xs font-mono tracking-[0.25em] uppercase text-[#625D55] block mb-2.5 sm:mb-3 font-semibold">
            ATELIER STANDARDS &amp; PHILOSOPHY
          </span>

          {/* Heading masked rise */}
          <div className="overflow-hidden pb-1">
            <h2 className="why-heading-line font-serif text-[30px] sm:text-[38px] md:text-[42px] lg:text-[42px] xl:text-[46px] font-normal text-[#101010] leading-[1.14] mb-3 sm:mb-3.5">
              Why Choose DS Photography &amp; Films?
            </h2>
          </div>

          {/* Thin underline: draws with scaleX from left */}
          <div className="w-16 sm:w-24 lg:w-full lg:max-w-[480px] h-[1px] bg-[#E3DBCC] origin-left mb-3.5 sm:mb-4 overflow-hidden">
            <div className="why-underline-bar h-full bg-[#101010]/30" />
          </div>

          {/* Subheading: short line shown, full original preserved in DOM for SEO */}
          <p className="why-subtext text-[14.5px] sm:text-[16px] lg:text-[15.5px] xl:text-[16.5px] text-[#4A463F] leading-relaxed font-sans">
            A commitment to timeless storytelling.
            <span className="sr-only">
              {' '}We accept a limited number of commissions each calendar year to ensure every couple and client receives our undivided creative focus, prompt archival delivery, and bespoke attention.
            </span>
          </p>
        </div>

        {/* =========================================================================
            RESPONSIVE LAYOUT (3 columns on desktop, 1 on mobile)
            ========================================================================= */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-6 xl:gap-8 items-center">
          {/* -----------------------------------------------------------------------
              2) ARCH-SHAPED PHOTO (Left column)
              ----------------------------------------------------------------------- */}
          <div className="why-arch-container lg:col-span-3 xl:col-span-3 flex justify-center lg:justify-start">
            <div className="relative w-full max-w-[320px] sm:max-w-[380px] lg:max-w-[260px] xl:max-w-[290px] 2xl:max-w-[320px] aspect-[4/3] sm:aspect-[16/11] lg:aspect-[1/1.4]">
              {/* Outer delicate arch outline border */}
              <div className="why-arch-outline absolute -inset-2.5 sm:-inset-3 rounded-t-[140px] sm:rounded-t-[180px] lg:rounded-t-full rounded-b-none lg:rounded-b-2xl border border-[#CBB9A4]/60 pointer-events-none" />

              {/* Inner arch container with door wipe reveal */}
              <div className="why-arch-inner relative w-full h-full rounded-t-[130px] sm:rounded-t-[170px] lg:rounded-t-full rounded-b-none lg:rounded-b-xl overflow-hidden bg-[#E8E2D5] shadow-[0_8px_30px_rgba(16,16,16,0.06)]">
                {/* Parallax wrapper with 16% extra bleed to allow -6% to 6% scrub without gaps */}
                <div className="why-arch-img-wrap absolute -top-[8%] -bottom-[8%] left-0 right-0 w-full h-[116%] overflow-hidden pointer-events-none">
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
                        className={`why-arch-img absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-out select-none ${
                          isSelected ? 'opacity-100' : 'opacity-0 pointer-events-none'
                        }`}
                        style={{
                          objectPosition: pillar.objectPosition || 'center 20%',
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
                    className={`why-arch-img absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-out select-none ${
                      activeRow === null ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                    style={{
                      objectPosition: 'center 20%',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* -----------------------------------------------------------------------
              3) CENTER COLUMN: 5 Numbered Rows (01 to 05) with Timeline Dots
              ----------------------------------------------------------------------- */}
          <div className="lg:col-span-5 xl:col-span-5 relative py-2 lg:py-0">
            {/* Continuous vertical hairline timeline line */}
            <div className="why-timeline-line absolute left-[59px] sm:left-[63px] lg:left-[61px] xl:left-[67px] top-6 bottom-6 w-[1px] bg-[#E3DBCC] pointer-events-none z-0" />

            <div className="flex flex-col gap-2 sm:gap-2.5 lg:gap-2 relative z-10">
              {PILLARS.map((pillar, i) => {
                const isActive = activeRow === i;
                const IconComponent = pillar.icon;

                return (
                  <div
                    key={pillar.number}
                    ref={(el) => (rowRefs.current[i] = el)}
                    role="button"
                    tabIndex={0}
                    aria-expanded={isActive}
                    aria-controls={`pillar-content-${pillar.number}`}
                    onMouseEnter={() => {
                      if (
                        typeof window !== 'undefined' &&
                        window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
                        window.innerWidth >= 1024
                      ) {
                        setActiveRow(i);
                      }
                    }}
                    onClick={() => setActiveRow((prev) => (prev === i ? null : i))}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setActiveRow((prev) => (prev === i ? null : i));
                      }
                    }}
                    className={`why-row group relative rounded-2xl lg:rounded-xl px-3.5 py-3 sm:px-4 sm:py-3.5 lg:px-4 lg:py-3 xl:px-5 xl:py-3.5 min-h-[56px] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8C7764] ${
                      isActive ? 'shadow-[0_2px_12px_rgba(20,18,15,0.06)]' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3 sm:gap-3.5 lg:gap-3 xl:gap-3.5">
                      {/* Number: 01 to 05 */}
                      <span
                        className={`why-row-number font-serif text-[21px] sm:text-[23px] lg:text-[21px] xl:text-[23px] font-light tracking-tight min-w-[28px] text-center transition-colors duration-300 ${
                          isActive ? 'text-[#101010] font-normal' : 'text-[#5C564D] group-hover:text-[#101010]'
                        }`}
                      >
                        {pillar.number}
                      </span>

                      {/* Timeline dot aligned on the continuous vertical line */}
                      <div className="relative z-10 flex items-center justify-center shrink-0 w-2.5">
                        <div
                          className={`why-row-dot w-1.5 h-1.5 rounded-full border transition-all duration-300 ${
                            isActive
                              ? 'bg-[#101010] border-[#101010] scale-125'
                              : 'bg-[#FAF8F5] border-[#CBB9A4]'
                          }`}
                        />
                      </div>

                      {/* Icon circular container */}
                      <div
                        className={`why-row-icon w-8 h-8 sm:w-9 sm:h-9 lg:w-8 lg:h-8 xl:w-9 xl:h-9 rounded-full border flex items-center justify-center shrink-0 transition-colors duration-300 ${
                          isActive
                            ? 'bg-[#EAE3D4] border-[#C5B9A5] text-[#101010]'
                            : 'bg-[#FAF8F5] border-[#E3DBCC] text-[#625D55] group-hover:border-[#C5B9A5] group-hover:text-[#101010]'
                        }`}
                      >
                        <IconComponent className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[1.4]" />
                      </div>

                      {/* Text block */}
                      <div className="why-row-text flex-1 min-w-0 pr-1">
                        <h3 className="font-serif text-[16.5px] sm:text-[18px] lg:text-[16.5px] xl:text-[18px] font-normal text-[#101010] leading-snug">
                          {pillar.heading}
                        </h3>
                        <p className="text-[12.5px] sm:text-[13.5px] lg:text-[12.5px] xl:text-[13.5px] text-[#5C564D] font-sans truncate sm:whitespace-normal">
                          {pillar.shortText}
                        </p>

                        {/* 4) GSAP Controlled Expandable Text: height 0 <-> auto */}
                        <div
                          id={`pillar-content-${pillar.number}`}
                          ref={(el) => (contentRefs.current[i] = el)}
                          className="overflow-hidden"
                          style={{
                            height: i === 0 ? 'auto' : 0,
                          }}
                        >
                          <div className="why-accordion-text pt-2">
                            <p className="text-[13px] sm:text-[14px] lg:text-[13px] xl:text-[14px] text-[#4A463F] leading-relaxed font-sans border-t border-[#E3DBCC]/60 pt-2">
                              {pillar.fullText}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Arrow indicator: rotates 0 <-> 90deg down when active */}
                      <div className="shrink-0 text-[#625D55] pl-1">
                        <div
                          ref={(el) => (arrowRefs.current[i] = el)}
                          className="why-row-arrow-icon origin-center"
                        >
                          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </div>
                      </div>
                    </div>

                    {/* Hairline bottom divider between items */}
                    {i < PILLARS.length - 1 && (
                      <div className="why-row-divider absolute left-16 right-4 bottom-0 h-[1px] bg-[#EAE4DA]/50 pointer-events-none" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* -----------------------------------------------------------------------
              5) RIGHT COLUMN: Dark "Reserve Your Date" Card
              ----------------------------------------------------------------------- */}
          <div className="lg:col-span-4 xl:col-span-4 flex justify-center lg:justify-end">
            <div
              className="why-reserve-card relative w-full max-w-[340px] sm:max-w-[420px] lg:max-w-[310px] xl:max-w-[340px] 2xl:max-w-[360px] bg-[#101010] text-[#FDFCF8] rounded-[24px] lg:rounded-[22px] p-6 sm:p-7 lg:p-6 xl:p-7 flex flex-col justify-between shadow-[0_18px_45px_rgba(16,16,16,0.18)]"
            >
              {/* Top botanical photo */}
              <div className="relative w-full h-[130px] sm:h-[150px] lg:h-[135px] xl:h-[155px] rounded-xl overflow-hidden mb-4 sm:mb-5 lg:mb-4 bg-[#1a1a1a]">
                <img
                  src={driedBotanical}
                  alt="Archival dried botanical in warm chiaroscuro light – DS Photography Atelier"
                  loading="lazy"
                  width="400"
                  height="280"
                  className="why-botanical-img w-full h-full object-cover select-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#101010]/60 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Card Content Area */}
              <div className="flex-1 flex flex-col justify-between">
                <div className="mb-5 sm:mb-6 lg:mb-5">
                  <span className="why-reserve-label text-[10.5px] sm:text-[11px] lg:text-[10.5px] font-mono uppercase tracking-[0.22em] text-[#CBB9A4] block mb-2 font-semibold">
                    DATE RESERVATION
                  </span>
                  <h3 className="why-reserve-title font-serif text-[24px] sm:text-[28px] lg:text-[24px] xl:text-[27px] font-normal text-[#FDFCF8] leading-tight mb-2 sm:mb-2.5">
                    Reserve Your Date
                  </h3>

                  {/* Subtitle with full original text in DOM */}
                  <p className="why-reserve-desc text-[13.5px] sm:text-[14.5px] lg:text-[13.5px] xl:text-[14px] text-[#E3DBCC]/90 leading-relaxed font-sans">
                    Peak dates book 4 to 9 months ahead.
                    <span className="sr-only">
                      {' '}Peak wedding dates across Mumbai, Goa, and Maharashtra reserve 4 to 9 months in advance. Share your celebration plans with us.
                    </span>
                  </p>
                </div>

                {/* Full-width white pill button with looping light sweep */}
                <div className="relative">
                  <Link
                    to="/services#book"
                    className="why-reserve-btn why-sweep-btn group relative inline-flex items-center justify-center gap-2.5 w-full bg-[#FDFCF8] text-[#101010] py-3.5 sm:py-4 lg:py-3 xl:py-3.5 px-6 rounded-full font-mono text-xs sm:text-[12.5px] lg:text-[11.5px] xl:text-[12px] font-semibold uppercase tracking-[0.16em] active:scale-[0.98] transition-colors duration-300 shadow-md"
                  >
                    <span>CHECK AVAILABILITY</span>
                    <ArrowRight className="why-btn-arrow w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
