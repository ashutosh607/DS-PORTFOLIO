import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Plus, Minus, Sparkles } from 'lucide-react';
import { useEditorialReveal } from '../../utils/useEditorialReveal';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

import weddingImg from '../../assets/landing-page-images/landing-07.webp';
import preWeddingImg from '../../assets/landing-down-animation/_0006027.webp';
import portraitImg from '../../assets/landing-page-images/landing-01.webp';
import eventImg from '../../assets/landing-page-images/landing-03.webp';

gsap.registerPlugin(ScrollTrigger);

const DISCIPLINES = [
  {
    number: '01',
    h2Title: 'Wedding Photographer in Mumbai',
    subtitle: 'Sacred Rituals & Candid Moments',
    shortText: 'Documenting timeless wedding stories across Mumbai and destination venues in Maharashtra with natural, classic film colors.',
    fullText:
      'Your wedding is a once-in-a-lifetime milestone deserving of timeless preservation. As a leading wedding photographer in Mumbai, Dishant Shelar documents sacred rituals, heartfelt family emotions, and spontaneous celebrations with an artistic eye and classic film style. From traditional South Mumbai heritage ceremonies to beachfront celebrations, our team captures real emotion without awkward posing.',
    image: weddingImg,
    alt: 'Intimate wedding couple portrait with bridal bouquet in Mumbai by Dishant Shelar',
    link: '/collections/weddings',
    linkLabel: 'Explore Wedding Collections',
    badge: 'Fine Art Wedding',
  },
  {
    number: '02',
    h2Title: 'Candid Wedding & Pre-Wedding Photography',
    subtitle: 'Couple Photo Stories & Films',
    shortText: 'Captured in beautiful golden-hour light across South Mumbai heritage spots and scenic beaches.',
    fullText:
      'Our pre-wedding shoots in Mumbai capture the authentic connection between couples in warm golden-hour light. Whether walking through historic South Mumbai streets, the beaches of Alibaug, or private scenic retreats in Maharashtra, we create intimate couple photos and cinematic short films that tell your true story.',
    image: preWeddingImg,
    alt: 'Romantic pre-wedding couple photography session in natural light by Dishant Shelar',
    link: '/collections/pre-wedding',
    linkLabel: 'View Pre-Wedding Shoots',
    badge: 'Couple Stories',
  },
  {
    number: '03',
    h2Title: 'Professional Portrait Photography in Mumbai',
    subtitle: 'Personal Portraits & Daylight Sessions',
    shortText: 'Natural daylight portraits, professional headshots, and creative photography in Mumbai.',
    fullText:
      'We create natural personal portraits, professional headshots, and creative fashion photography in Mumbai. Using soft natural light and clean composition, each portrait session brings out your true personality with depth, warmth, and timeless style.',
    image: portraitImg,
    alt: 'Editorial fashion portrait photography and fine-art daylight monograph in Mumbai by Dishant Shelar',
    link: '/collections/portraits',
    linkLabel: 'View Portrait Gallery',
    badge: 'Portrait Sessions',
  },
  {
    number: '04',
    h2Title: 'Event & Commercial Photography',
    subtitle: 'Special Events & Brand Campaigns',
    shortText: 'High-quality photography for private parties, milestone celebrations, and brand events.',
    fullText:
      'Beyond weddings, DS Photography & Films captures cultural gatherings, milestone birthday parties, corporate events, and commercial brand campaigns across Mumbai. We bring storytelling and clean visual style to every event and product shoot.',
    image: eventImg,
    alt: 'Joyful celebration and festive ceremony event photography in Mumbai by Dishant Shelar',
    link: '/collections/events',
    linkLabel: 'Explore Event Portfolio',
    badge: 'Events & Commercial',
  },
];

export default function EditorialDisciplinesSection() {
  const [headerRef, headerRevealed] = useEditorialReveal(0.12);
  const [activeCard, setActiveCard] = useState(null);
  const [expandedDetails, setExpandedDetails] = useState({});
  const sectionRef = useRef(null);

  const toggleDetail = (e, index) => {
    e.stopPropagation();
    setExpandedDetails((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleCardClick = (index) => {
    setActiveCard((prev) => (prev === index ? null : index));
  };

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // 1. Reduced Motion: Instant reveal with no animations
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(['.folio-card', '.folio-img', '.folio-label', '.folio-title', '.folio-arrow'], {
          clearProps: 'all',
        });
        gsap.set('.folio-card', {
          opacity: 1,
          filter: 'none',
          x: 0,
          y: 0,
          scale: 1,
        });
        gsap.set('.folio-img', {
          scale: 1,
        });
        gsap.set(['.folio-label', '.folio-title'], {
          opacity: 1,
          y: 0,
        });
        gsap.set('.folio-arrow', {
          scale: 1,
        });
      });

      // 2. Desktop (>= 768px): Cinematic lens pull-focus, stagger, 3D entrance, parallax & hover
      mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
        const cards = gsap.utils.toArray('.folio-card');
        const images = gsap.utils.toArray('.folio-img');
        const labels = gsap.utils.toArray('.folio-label');
        const titles = gsap.utils.toArray('.folio-title');
        const arrows = gsap.utils.toArray('.folio-arrow');

        const cardOffsets = [
          { x: -120, y: 60 },
          { x: 0, y: 140 },
          { x: 0, y: 140 },
          { x: 120, y: 60 },
        ];

        // Initial state per card: opacity 0, filter: blur(24px), scale 0.94
        cards.forEach((card, i) => {
          const offset = cardOffsets[i] || { x: 0, y: 140 };
          gsap.set(card, {
            opacity: 0,
            filter: 'blur(24px)',
            scale: 0.94,
            x: offset.x,
            y: offset.y,
            willChange: 'transform, filter',
          });
        });

        // Initial state for lens focus settling, text, and circular arrow
        gsap.set(images, { scale: 1.3 });
        gsap.set(labels, { opacity: 0 });
        gsap.set(titles, { opacity: 0, y: 30 });
        gsap.set(arrows, { scale: 0 });

        // Scroll-in animation (trigger once, start: "top 85%")
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: '.folio-cards-grid',
            start: 'top 85%',
            once: true,
          },
          onComplete: () => {
            // Remove blur filter completely on complete to avoid GPU cost
            gsap.set(cards, { filter: 'none', willChange: 'auto' });
          },
        });

        // 2. Animate to: opacity 1, x 0, y 0, scale 1, filter blur(0px) duration 1.4, ease "power4.out", stagger 0.15 (order 1 -> 4)
        tl.to(
          cards,
          {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            filter: 'blur(0px)',
            duration: 1.4,
            ease: 'power4.out',
            stagger: 0.15,
          },
          0
        );

        // 3. Inside each card, animate <img> from scale 1.3 to 1 over 1.8s with "power3.out" (lens settling into focus)
        tl.to(
          images,
          {
            scale: 1,
            duration: 1.8,
            ease: 'power3.out',
            stagger: 0.15,
          },
          0
        );

        // 4. After cards land, animate the text & arrows:
        // "FOLIO 0X" label fades in
        tl.to(
          labels,
          {
            opacity: 1,
            duration: 0.5,
            ease: 'power2.out',
            stagger: 0.1,
          },
          0.85
        );

        // Title slides up from y: 30 with opacity 0 -> 1 (stagger 0.1, ease "power3.out")
        tl.to(
          titles,
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power3.out',
            stagger: 0.1,
          },
          0.95
        );

        // Arrow button scales from 0 to 1 with "back.out(1.7)"
        tl.to(
          arrows,
          {
            scale: 1,
            duration: 0.6,
            ease: 'back.out(1.7)',
            stagger: 0.1,
          },
          1.1
        );

        // Subtle scroll parallax on images: yPercent from -8 to 8 with ScrollTrigger scrub: 1
        cards.forEach((card, i) => {
          const img = images[i];
          const arrow = arrows[i];

          if (img) {
            gsap.fromTo(
              img,
              { yPercent: -8 },
              {
                yPercent: 8,
                ease: 'none',
                scrollTrigger: {
                  trigger: card,
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: 1,
                },
              }
            );
          }

          // Hover: card lifts y: -10, image scales 1.06, arrow button rotates -45deg, 0.5s "power2.out". Reverses on mouse leave.
          const onEnter = () => {
            gsap.to(card, { y: -10, duration: 0.5, ease: 'power2.out', overwrite: 'auto' });
            if (img) gsap.to(img, { scale: 1.06, duration: 0.5, ease: 'power2.out', overwrite: 'auto' });
            if (arrow) gsap.to(arrow, { rotation: -45, duration: 0.5, ease: 'power2.out', overwrite: 'auto' });
          };

          const onLeave = () => {
            gsap.to(card, { y: 0, duration: 0.5, ease: 'power2.out', overwrite: 'auto' });
            if (img) gsap.to(img, { scale: 1, duration: 0.5, ease: 'power2.out', overwrite: 'auto' });
            if (arrow) gsap.to(arrow, { rotation: 0, duration: 0.5, ease: 'power2.out', overwrite: 'auto' });
          };

          card.addEventListener('mouseenter', onEnter);
          card.addEventListener('mouseleave', onLeave);
        });
      });

      // 3. Mobile (< 768px): All cards come from y: 80 only, stagger 0.1, smaller blur (12px), no hover effects
      mm.add('(max-width: 767px) and (prefers-reduced-motion: no-preference)', () => {
        const cards = gsap.utils.toArray('.folio-card');
        const images = gsap.utils.toArray('.folio-img');
        const labels = gsap.utils.toArray('.folio-label');
        const titles = gsap.utils.toArray('.folio-title');
        const arrows = gsap.utils.toArray('.folio-arrow');

        gsap.set(cards, {
          opacity: 0,
          filter: 'blur(12px)',
          scale: 0.96,
          x: 0,
          y: 80,
          willChange: 'transform, filter',
        });

        gsap.set(images, { scale: 1.2 });
        gsap.set(labels, { opacity: 0 });
        gsap.set(titles, { opacity: 0, y: 20 });
        gsap.set(arrows, { scale: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: '.folio-cards-grid',
            start: 'top 85%',
            once: true,
          },
          onComplete: () => {
            gsap.set(cards, { filter: 'none', willChange: 'auto' });
          },
        });

        tl.to(
          cards,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: 'blur(0px)',
            duration: 1.1,
            ease: 'power3.out',
            stagger: 0.1,
          },
          0
        );

        tl.to(
          images,
          {
            scale: 1,
            duration: 1.4,
            ease: 'power3.out',
            stagger: 0.1,
          },
          0
        );

        tl.to(
          labels,
          {
            opacity: 1,
            duration: 0.4,
            ease: 'power2.out',
            stagger: 0.08,
          },
          0.6
        );

        tl.to(
          titles,
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power3.out',
            stagger: 0.08,
          },
          0.7
        );

        tl.to(
          arrows,
          {
            scale: 1,
            duration: 0.5,
            ease: 'back.out(1.7)',
            stagger: 0.08,
          },
          0.8
        );
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="disciplines"
      aria-label="Photography Disciplines & Atelier Services"
      className="w-full bg-[#FAF8F5] text-[#101010] pt-20 sm:pt-28 lg:pt-32 pb-16 sm:pb-24 border-t border-[#E3DBCC] relative overflow-hidden"
    >
      {/* Decorative hairline arc accent */}
      <svg
        className="absolute top-0 right-0 w-[320px] sm:w-[480px] h-[220px] sm:h-[300px] pointer-events-none opacity-30 z-0"
        viewBox="0 0 500 300"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M 500,20 C 360,70 280,180 200,300"
          stroke="#CBB9A4"
          strokeWidth="1"
          strokeDasharray="450"
          strokeDashoffset={headerRevealed ? '0' : '450'}
          style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.22, 1, 0.36, 1) 0.2s' }}
        />
      </svg>

      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 md:px-10 lg:px-10 xl:px-16 relative z-10">
        {/* Section Header */}
        <div ref={headerRef} className="max-w-3xl mb-12 sm:mb-16 lg:mb-20">
          <div className="flex items-center gap-2 mb-2.5 sm:mb-3">
            <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-[#625D55] font-semibold">
              ATELIER DISCIPLINES · MUMBAI
            </span>
            <Sparkles size={12} className="text-[#CBB9A4] animate-sparkle-twinkle" aria-hidden="true" />
          </div>

          <div className="editorial-mask-wrap mb-3.5 sm:mb-4">
            <h2
              className={`font-serif text-[32px] sm:text-[42px] lg:text-[48px] font-normal text-[#101010] leading-[1.12] editorial-mask-rise ${
                headerRevealed ? 'is-revealed' : ''
              }`}
            >
              Capturing What Matters With Archival Grace.
            </h2>
          </div>

          {/* Underline hairline */}
          <div className="w-16 sm:w-24 lg:w-48 h-[1px] bg-[#E3DBCC] mb-3.5 sm:mb-4 overflow-hidden">
            <div
              className={`h-full bg-[#101010]/30 editorial-draw-line ${
                headerRevealed ? 'is-revealed' : ''
              }`}
            />
          </div>

          {/* Subheading: short visible lead, full SEO preserved in DOM */}
          <p
            className={`text-[14.5px] sm:text-[16px] text-[#4A463F] leading-relaxed max-w-2xl font-sans editorial-fade-up ${
              headerRevealed ? 'is-revealed' : ''
            }`}
          >
            Every celebration has an unrepeatable rhythm.
            <span className="sr-only">
              {' '}From intimate golden-hour pre-wedding monographs to multi-day wedding rituals, our commissions are approached with quiet observation and artistic reverence across Mumbai and destination venues in Maharashtra.
            </span>
          </p>
        </div>

        {/* 4 Tall Image-Led Cards Grid */}
        <div className="folio-cards-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7 lg:gap-6">
          {DISCIPLINES.map((item, idx) => {
            const isHoveredOrActive = activeCard === idx;
            const isExpanded = !!expandedDetails[idx];

            return (
              <div
                key={item.number}
                onClick={() => handleCardClick(idx)}
                onMouseEnter={() => {
                  if (typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
                    setActiveCard(idx);
                  }
                }}
                onMouseLeave={() => {
                  if (typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
                    setActiveCard(null);
                  }
                }}
                className="folio-card group relative h-[480px] sm:h-[520px] lg:h-[560px] rounded-[24px] sm:rounded-[28px] overflow-hidden bg-[#1E1B18] shadow-[0_12px_36px_-8px_rgba(16,14,12,0.12)] cursor-pointer flex flex-col justify-end p-6 sm:p-7 border border-[#E3DBCC]/30 hover:border-[#CBB9A4] transition-colors duration-300"
              >
                {/* Background Image Container with parallax headroom (oversized by 16% to allow -8 to 8% scrub without gaps) */}
                <div className="folio-img-wrap absolute -top-[8%] -bottom-[8%] left-0 right-0 overflow-hidden pointer-events-none">
                  <img
                    src={item.image}
                    alt={item.alt}
                    title={`${item.h2Title} — DS Photography & Films`}
                    width="400"
                    height="600"
                    className="folio-img w-full h-full object-cover select-none"
                    loading="lazy"
                  />
                </div>

                {/* Subtle base gradient so resting typography remains legible */}
                <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-400 pointer-events-none ${isHoveredOrActive ? 'opacity-0' : 'opacity-100 group-hover:opacity-0'}`} />

                {/* Sliding Soft Dark Overlay on hover/tap */}
                <div
                  className={`absolute inset-0 z-30 bg-[#101010] backdrop-blur-md transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] p-6 sm:p-7 flex flex-col justify-between ${
                    isHoveredOrActive ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
                  }`}
                >
                  {/* Overlay Top Bar */}
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <span className="font-mono text-xs font-semibold tracking-widest text-[#CBB9A4]">
                        FOLIO {item.number}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono uppercase tracking-[0.18em] px-2.5 py-0.5 rounded-full bg-white/10 text-[#FDFCF8] border border-white/15">
                          {item.badge}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveCard(null);
                          }}
                          aria-label="Close folio details"
                          className="lg:hidden w-6 h-6 rounded-full bg-white/15 text-white flex items-center justify-center text-xs hover:bg-white/25 transition-colors cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                    </div>

                    <h2 className="font-serif text-2xl sm:text-[26px] font-normal text-[#FDFCF8] leading-tight mb-2">
                      {item.h2Title}
                    </h2>
                    <p className="text-[11px] font-mono tracking-wider text-[#CBB9A4] uppercase mb-4">
                      {item.subtitle}
                    </p>

                    {/* Short 2-line visible lead */}
                    <p className="text-[13.5px] text-[#E3DBCC] leading-relaxed font-sans mb-3">
                      {item.shortText}
                    </p>

                    {/* Expandable Disclosure: Keeps 100% full original SEO paragraph in DOM */}
                    <button
                      type="button"
                      onClick={(e) => toggleDetail(e, idx)}
                      aria-expanded={isExpanded}
                      className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-widest text-[#FDFCF8] hover:text-[#CBB9A4] transition-colors py-1 cursor-pointer"
                    >
                      {isExpanded ? <Minus size={11} /> : <Plus size={11} />}
                      <span>{isExpanded ? 'Less overview' : 'Full overview +'}</span>
                    </button>

                    <div
                      className={`editorial-expandable-grid ${
                        isExpanded ? 'is-expanded' : ''
                      }`}
                    >
                      <div className="editorial-expandable-content">
                        <p className="text-[12.5px] text-[#A49B8D] leading-relaxed font-sans pt-2">
                          {item.fullText}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Overlay Bottom Links */}
                  <div className="pt-4 border-t border-white/15 flex items-center justify-between">
                    <Link
                      to={item.link}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.16em] text-[#FDFCF8] hover:text-[#CBB9A4] transition-colors font-semibold group/link"
                    >
                      <span>Explore →</span>
                    </Link>
                    <Link
                      to="/services#book"
                      onClick={(e) => e.stopPropagation()}
                      className="text-[11px] font-mono uppercase tracking-widest text-[#CBB9A4] hover:text-[#FDFCF8] transition-colors"
                    >
                      Enquire
                    </Link>
                  </div>
                </div>

                {/* Resting State Content (Bottom of Card) */}
                <div className={`relative z-10 transition-all duration-300 pointer-events-none ${
                  isHoveredOrActive
                    ? 'opacity-0 invisible translate-y-2'
                    : 'opacity-100 visible translate-y-0 group-hover:opacity-0 group-hover:invisible'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="folio-label font-mono text-xs font-semibold tracking-widest text-[#E3DBCC]">
                      FOLIO {item.number}
                    </span>
                    <span className="folio-arrow w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm border border-white/25 flex items-center justify-center text-white origin-center">
                      <ArrowRight size={13} />
                    </span>
                  </div>
                  <h2 className="folio-title font-serif text-2xl font-normal text-[#FDFCF8] leading-tight">
                    {item.h2Title}
                  </h2>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
