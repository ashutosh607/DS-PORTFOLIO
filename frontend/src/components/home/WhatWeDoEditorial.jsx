import React from 'react';
import { motion } from 'framer-motion';
import PhotoPlaceholder from '../common/PhotoPlaceholder';
import ScrollBlurCharReveal from '../common/ScrollBlurCharReveal';

/**
 * Editorial Photography Services Data
 * Copy strictly conforms to the requested brief:
 * - Portraits: “Personal, expressive portraits shaped around your story.”
 * - Weddings: “Honest moments, beautifully preserved as they unfold.”
 * - Events: “Energy, atmosphere, and every detail worth remembering.”
 * - Commercial: “Thoughtful imagery that gives brands a distinct visual voice.”
 */
const SERVICES = [
  {
    number: '01',
    title: 'Portraits',
    tagline: 'Personal, expressive portraits shaped around your story.',
    editorialNote: 'Medium Format · Natural Ambient Light · Archival Proof',
    smallCaptionTitle: 'Personal space',
    smallCaptionDesc: 'Your space to reset & focus',
    largeLabel: 'PORTRAITURE MONOGRAPH — MASTER PROOF',
    largeMeta: 'Hasselblad 80mm F/2.8 · Natural Ambient Light · Studio',
    smallAspectRatio: '4/5',
    smallLabel: 'PORTRAIT STUDY — DETAIL',
    smallMeta: '35mm Tri-X 400 · Tonal Contrast',
    layoutReversed: false, // Left: Text + Small Sliding Image · Right: Big Image
  },
  {
    number: '02',
    title: 'Weddings',
    tagline: 'Honest moments, beautifully preserved as they unfold.',
    editorialNote: 'Documentary Storytelling · Candid Poise · Hand-Bound Folio',
    smallCaptionTitle: 'Intimate space',
    smallCaptionDesc: 'Unstaged emotion preserved in time',
    largeLabel: 'WEDDING FOLIO — MASTER PROOF',
    largeMeta: 'Leica M11 · 35mm Summilux · Candid Documentary Story',
    smallAspectRatio: '4/5',
    smallLabel: 'MOMENT VIGNETTE — DETAIL',
    smallMeta: '50mm Noctilux · Ambient Vignette',
    layoutReversed: true, // Left: Big Image · Right: Text + Small Sliding Image
  },
  {
    number: '03',
    title: 'Events',
    tagline: 'Energy, atmosphere, and every detail worth remembering.',
    editorialNote: 'Atmospheric Presence · Kinetic Energy · Available Light',
    smallCaptionTitle: 'Atmosphere space',
    smallCaptionDesc: 'Energy and festive celebration details',
    largeLabel: 'EVENT FOLIO — MASTER PROOF',
    largeMeta: 'Leica SL2 · 24-70mm · Available Ambient Light · Galas',
    smallAspectRatio: '4/5',
    smallLabel: 'CELEBRATION — DETAIL',
    smallMeta: '50mm F/1.2 · Fast Kinetic Frame',
    layoutReversed: false, // Left: Text + Small Sliding Image · Right: Big Image
  },
  {
    number: '04',
    title: 'Commercial',
    tagline: 'Thoughtful imagery that gives brands a distinct visual voice.',
    editorialNote: 'Visual Identity · Architectural & Maison Campaigns',
    smallCaptionTitle: 'Brand space',
    smallCaptionDesc: 'Art-directed clarity for European luxury maisons',
    largeLabel: 'COMMERCIAL CAMPAIGN — MASTER PROOF',
    largeMeta: 'Hasselblad 100MP · Directional Light Studio · Archival',
    smallAspectRatio: '4/5',
    smallLabel: 'SPATIAL GEOMETRY — DETAIL',
    smallMeta: '120mm Macro · Materiality Study',
    layoutReversed: true, // Left: Big Image · Right: Text + Small Sliding Image
  },
];

/**
 * Editorial Sliding Service Row
 * Refined per user feedback:
 * 1. Gap in 1st & 3rd part fixed to match 2nd & 4th (equal tight 12px gap everywhere).
 * 2. Instant responsive scroll tracking: small image moves down directly along with user's scroll.
 * 3. Starts right below the text (0 text overlap).
 * 4. Slides smoothly down until it lands flush at the bottom of the bigger image.
 * 5. All corners sharp rectangles (0 radius).
 */
function SlidingServiceRow({ service, index }) {
  return (
    <div
      className="relative w-full"
      style={{
        marginTop: index === 0 ? 'clamp(3.5rem, 6vw, 4.5rem)' : 'clamp(7rem, 14vh, 10rem)',
      }}
    >
      {/* Subtle chapter separator between disciplines for clear spatial breathing room */}
      {index > 0 && (
        <div className="w-full mb-8 sm:mb-10 md:mb-12 flex items-center justify-between font-mono text-[0.6rem] tracking-[0.24em] text-[var(--color-obsidian-light)] uppercase opacity-60 pb-4 border-b border-[var(--color-nude-subtle)]">
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-1.5 bg-[var(--color-obsidian)]" />
            <span>Chapter [{service.number}] · {service.title}</span>
          </div>
          <span className="w-24 sm:w-48 h-[1px] bg-[var(--color-nude)]" />
          <span className="hidden sm:inline">Maison Édouard Folio</span>
        </div>
      )}

      {/* Dual Column Layout with tight 12px gap across ALL parts */}
      <div
        className={`flex flex-col ${
          service.layoutReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'
        } gap-4 lg:gap-3 xl:gap-3 items-stretch`}
        style={{ alignItems: 'stretch' }}
      >
        {/* ===================================================================
            COLUMN 1: TEXT AT TOP + SMALL IMAGE SLIDING BENEATH IT
            =================================================================== */}
        <div
          className="w-full lg:w-[44%] xl:w-[42%] flex flex-col justify-start relative"
          style={{ alignSelf: 'stretch' }}
        >
          {/* Service Title & Introduction (At the Top) */}
          <div
            className={`w-full max-w-md ${
              service.layoutReversed ? 'lg:pl-2 ml-auto' : 'lg:pr-2 mr-auto'
            }`}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Subtle Numbering */}
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <span className="font-mono text-xs md:text-sm tracking-[0.24em] text-[var(--color-obsidian-light)] uppercase">
                  [{service.number}]
                </span>
                <span className="w-8 h-[1px] bg-[var(--color-nude)]" />
                <span className="font-mono text-[0.625rem] tracking-[0.2em] text-[var(--color-obsidian-light)] uppercase">
                  Disciplines
                </span>
              </div>

              {/* Service Title with character blur-to-sharp reveal */}
              <ScrollBlurCharReveal
                as="h3"
                text={service.title}
                className="font-serif text-[clamp(2.4rem,4.5vw,3.6rem)] text-[var(--color-obsidian)] font-normal leading-[1.08] tracking-[-0.025em] mb-3 sm:mb-4"
                style={{ fontFamily: 'var(--font-serif)' }}
                blurAmount={12}
                initialOpacity={0.14}
                offset={['start 0.90', 'start 0.45']}
              />

              {/* One-line Description with character blur-to-sharp reveal */}
              <ScrollBlurCharReveal
                as="p"
                text={`“${service.tagline}”`}
                className="font-sans text-base sm:text-lg text-[var(--color-obsidian-muted)] leading-relaxed font-light mb-4 sm:mb-5"
                blurAmount={9}
                initialOpacity={0.18}
                offset={['start 0.90', 'start 0.45']}
              />

              {/* Subtle Editorial Metadata Line */}
              <div className="pt-3 sm:pt-4 border-t border-[var(--color-nude-light)] flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[var(--color-nude)]" />
                <span className="font-mono text-[0.65rem] tracking-wider text-[var(--color-obsidian-light)] uppercase">
                  {service.editorialNote}
                </span>
              </div>
            </motion.div>
          </div>

          {/* ---------------------------------------------------------------
              SMALL IMAGE: FULLY VISIBLE DIRECTLY BELOW TEXT, THEN STICKS & SLIDES
              - At rest: sitting right below text (mt-5 lg:mt-6), completely visible!
              - On scroll: sticks at lg:top-[5.5rem] and glides down alongside big image
              - At end: stops flush at the bottom of the big image
              - Rectangle: borderRadius 0px
              - Gap strictly equalized across 1st, 2nd, 3rd, 4th parts (~12px gap)
              --------------------------------------------------------------- */}
          <div
            className={`w-full flex flex-col mt-5 lg:mt-6 editorial-sticky-card z-20 ${
              service.layoutReversed ? 'items-start' : 'items-end'
            }`}
          >
            <div
              style={{
                borderRadius: '0px',
              }}
              className={`w-[175px] sm:w-[190px] lg:w-[200px] xl:w-[215px] ${
                service.layoutReversed
                  ? 'self-start mr-auto ml-0' // Exactly 12px from big image on left!
                  : 'self-end ml-auto mr-0' // Exactly 12px from big image on right!
              } bg-[var(--color-ivory)] border border-[var(--color-nude)] p-2.5 shadow-[0_16px_36px_-10px_rgba(16,14,12,0.12)]`}
            >
              {/* Very Small Image Plate - Sharp Rectangle */}
              <div style={{ borderRadius: '0px', overflow: 'hidden' }}>
                <PhotoPlaceholder
                  aspectRatio={service.smallAspectRatio}
                  label={service.smallLabel}
                  meta={service.smallMeta}
                  title=""
                  showBadge={true}
                  dark={false}
                  borderRadius="0px"
                  style={{
                    borderRadius: '0px',
                    padding: '0.65rem',
                    transition: 'none',
                  }}
                />
              </div>

              {/* 21Oaks Caption Info Bar */}
              <div className="mt-2.5 pt-2 border-t border-[var(--color-nude-subtle)] flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-[var(--color-obsidian)] mt-1 shrink-0" />
                <div className="flex flex-col">
                  <span className="font-sans text-[0.7rem] font-semibold tracking-wide text-[var(--color-obsidian)]">
                    {service.smallCaptionTitle}
                  </span>
                  <span className="font-sans text-[0.625rem] text-[var(--color-obsidian-muted)] leading-tight mt-0.5">
                    {service.smallCaptionDesc}
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* ===================================================================
            COLUMN 2: TALL LARGE IMAGE (Sharp Rectangle, borderRadius: 0)
            =================================================================== */}
        <div className="w-full lg:w-[56%] xl:w-[58%] flex flex-col" style={{ alignSelf: 'stretch' }}>
          <div
            className="relative w-full border border-[var(--color-nude)] bg-[var(--color-ivory)] shadow-[0_24px_54px_-16px_rgba(16,14,12,0.1)] transition-transform duration-700 ease-out hover:scale-[1.005] flex flex-col flex-1"
            style={{
              borderRadius: '0px',
              minHeight: 'clamp(680px, 92vh, 980px)',
            }}
          >
            {/* Full-bleed Tall Photo Placeholder - Sharp Rectangle */}
            <div className="w-full h-full min-h-[680px] sm:min-h-[780px] lg:min-h-[900px] flex flex-col flex-1">
              <PhotoPlaceholder
                aspectRatio="auto"
                label={service.largeLabel}
                meta={service.largeMeta}
                title={service.title}
                showBadge={true}
                dark={false}
                borderRadius="0px"
                style={{
                  borderRadius: '0px',
                  minHeight: 'clamp(680px, 92vh, 980px)',
                  height: '100%',
                  flex: 1,
                }}
              />
            </div>

            {/* Corner Editorial Coordinates Badge */}
            <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between pointer-events-none font-mono text-[0.625rem] tracking-widest text-[var(--color-obsidian-light)] uppercase">
              <span>Maison Édouard · Atelier Paris</span>
              <span>Plate [{service.number}] · Archival Master</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

/**
 * WhatWeDoEditorial
 * Premium editorial photography section with exact 21Oaks sliding small image effect:
 * - All rectangle: no curved edges on big or small pictures.
 * - Equal tight gap across all 4 services.
 * - Small image starts below text and moves down directly along with user's scroll.
 */
export default function WhatWeDoEditorial() {
  return (
    <section
      id="what-we-do"
      className="relative w-full bg-[var(--color-off-white)] text-[var(--color-obsidian)] overflow-visible"
      style={{
        paddingTop: 'clamp(5.5rem, 11vw, 9.5rem)',
        paddingBottom: 'clamp(6rem, 12vw, 10rem)',
      }}
    >
      {/* Fine Ambient Grid & Decorative Architectural Watermark */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(227, 219, 204, 0.12) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(227, 219, 204, 0.12) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      <div className="container relative z-10 mx-auto px-4 sm:px-8 md:px-12 lg:px-16 max-w-[1440px]">
        
        {/* ===================================================================
            EDITORIAL HEADER SECTION
            - Large elegant serif heading: “What We Do”
            - Editorial introduction beside/below with generous whitespace
            =================================================================== */}
        <div className="w-full pb-14 md:pb-20 border-b border-[var(--color-nude-subtle)]">
          {/* Eyebrow / Catalog Chapter Indicator */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-6 sm:mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-[var(--color-obsidian)]" />
            <span className="font-mono text-[0.675rem] sm:text-xs font-semibold tracking-[0.26em] uppercase text-[var(--color-obsidian-light)]">
              Maison Édouard · 02 / Disciplines
            </span>
            <span className="w-8 h-[1px] bg-[var(--color-nude)]" />
            <span className="font-mono text-[0.65rem] tracking-widest text-[var(--color-obsidian-light)] uppercase hidden sm:inline-block">
              Editorial Folio
            </span>
          </motion.div>

          {/* Asymmetric Header Layout: Big Serif Left, Editorial Copy Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
            
            {/* Left Column: Monumental Serif Heading with character blur reveal */}
            <div className="lg:col-span-6 xl:col-span-7">
              <ScrollBlurCharReveal
                as="h2"
                text="What We Do"
                className="font-serif text-[clamp(3.2rem,7.2vw,6.5rem)] font-normal leading-[0.98] tracking-[-0.03em] text-[var(--color-obsidian)]"
                style={{ fontFamily: 'var(--font-serif)' }}
                blurAmount={16}
                initialOpacity={0.12}
                offset={['start 0.92', 'start 0.42']}
              />
            </div>

            {/* Right Column: Editorial Introduction & Monograph Statement with character blur reveal */}
            <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-end pt-2 lg:pt-4">
              <ScrollBlurCharReveal
                as="p"
                text="“From intimate portraits to celebrations and meaningful brand stories, we create photographs that feel honest, timeless, and unmistakably yours.”"
                className="font-sans text-[clamp(1.05rem,1.4vw,1.3rem)] text-[var(--color-obsidian-muted)] leading-[1.75] font-light"
                blurAmount={10}
                initialOpacity={0.16}
                offset={['start 0.90', 'start 0.38']}
              />

              {/* Editorial Spec Footnote */}
              <div className="mt-6 sm:mt-8 flex items-center justify-between font-mono text-[0.625rem] tracking-widest text-[var(--color-obsidian-light)] uppercase pt-4 border-t border-[var(--color-nude-subtle)]">
                <span>Medium Format & 35mm Analog</span>
                <span>Four Disciplines</span>
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================================
            21OAKS-STYLE SLIDING PHOTOGRAPHY SERVICES SHOWCASE (4 SERVICES)
            - Pure rectangle frames (no curved ends)
            - Equal tight gap across all services
            - Small image starts below text and glides down along with scrolling
            =================================================================== */}
        <div className="w-full flex flex-col">
          {SERVICES.map((service, index) => (
            <SlidingServiceRow
              key={service.number}
              service={service}
              index={index}
            />
          ))}
        </div>

        {/* ===================================================================
            SECTION FOOTER / SUBTLE EDITORIAL CLOSE
            =================================================================== */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-24 sm:mt-32 md:mt-40 pt-8 border-t border-[var(--color-nude-subtle)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-[0.625rem] tracking-[0.2em] text-[var(--color-obsidian-light)] uppercase"
        >
          <div className="flex items-center gap-4">
            <span className="w-1.5 h-1.5 bg-[var(--color-obsidian)]" />
            <span>End of Disciplines Folio</span>
          </div>

          <div className="flex items-center gap-6">
            <span>Archival Standard 100% Cotton Rag</span>
            <span className="hidden md:inline">·</span>
            <span className="hidden md:inline">Natural Ambient Lighting</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
