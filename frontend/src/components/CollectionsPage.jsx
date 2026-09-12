import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PhotoPlaceholder from './PhotoPlaceholder';

const CATEGORIES = [
  {
    id: '01',
    name: 'Weddings',
    slug: 'weddings',
    tagline: 'Honest moments, beautifully preserved as they unfold.',
    quote: 'A love story, in every frame.',
    medium: 'Leica M11 · 35mm Summilux & 50mm Noctilux',
    location: 'Lake Como & Private Estates',
    cardShape: 'rounded-t-[88px]', // Distinct arched top
    cardTilt: -1.8,
    cardY: 0,
    featured: {
      label: 'CLIENT IMAGE — TO BE ADDED',
      title: 'Weddings',
      tag: 'WEDDING FOLIO — CEREMONY AT DUSK',
      meta: 'Leica M11 · 35mm Summilux · F/1.4 · Natural Twilight',
      count: '01 / 06',
      caption: 'A love story, in every frame.',
    },
    supporting: [
      {
        id: 'w-1',
        label: 'CLIENT IMAGE — TO BE ADDED',
        tag: 'BRIDAL DETAIL — ATELIER LACE & VEIL',
        meta: '50mm Noctilux · Natural Ambient Light',
        aspect: '4/3',
      },
      {
        id: 'w-2',
        label: 'CLIENT IMAGE — TO BE ADDED',
        tag: 'TWILIGHT RECEPTION — CANDLELIT HARMONY',
        meta: '35mm Summilux · Ambient Evening',
        aspect: '4/3',
      },
      {
        id: 'w-3',
        label: 'CLIENT IMAGE — TO BE ADDED',
        tag: 'HIGHLAND PROMENADE — DUAL PORTRAIT',
        meta: 'Medium Format 6x7 · Platinotype Tonal Scale',
        aspect: '4/3',
      },
      {
        id: 'w-4',
        label: 'CLIENT IMAGE — TO BE ADDED',
        tag: 'CEREMONIAL VOWS — INTIMATE DETAIL',
        meta: '75mm Summicron · Archival Silver Proof',
        aspect: '4/3',
      },
    ],
  },
  {
    id: '02',
    name: 'Pre-Wedding',
    slug: 'pre-wedding',
    tagline: 'Intimate anticipation before the grand celebration.',
    quote: 'Quiet chapters before the vows.',
    medium: 'Hasselblad H6D · Natural Ambient Glow',
    location: 'Cap d’Antibes & Parisian Terraces',
    cardShape: 'rounded-tr-[70px] rounded-tl-[16px]', // Asymmetric sculpted cut
    cardTilt: 1.5,
    cardY: 22,
    featured: {
      label: 'CLIENT IMAGE — TO BE ADDED',
      title: 'Pre-Wedding',
      tag: 'PRE-WEDDING MONOGRAPH — SUNSET HORIZON',
      meta: 'Hasselblad 80mm · Mediterranean Warm Glow',
      count: '02 / 06',
      caption: 'Quiet chapters before the vows.',
    },
    supporting: [
      {
        id: 'pw-1',
        label: 'CLIENT IMAGE — TO BE ADDED',
        tag: 'COASTAL PROMENADE — GOLDEN HOUR',
        meta: '35mm Summicron · Coastal Spray',
        aspect: '4/3',
      },
      {
        id: 'pw-2',
        label: 'CLIENT IMAGE — TO BE ADDED',
        tag: 'CANDID EMBRACE — NATURAL WIND',
        meta: '50mm F/1.2 · Natural Light',
        aspect: '4/3',
      },
      {
        id: 'pw-3',
        label: 'CLIENT IMAGE — TO BE ADDED',
        tag: 'HISTORIC CLOISTER — WALKING STUDY',
        meta: 'Large Format 4x5 · Architectural Shift',
        aspect: '4/3',
      },
      {
        id: 'pw-4',
        label: 'CLIENT IMAGE — TO BE ADDED',
        tag: 'BOTANICAL VIGNETTE — INTIMATE DETAIL',
        meta: '90mm Macro · Ambient Flora',
        aspect: '4/3',
      },
    ],
  },
  {
    id: '03',
    name: 'Birthdays',
    slug: 'birthdays',
    tagline: 'Milestone celebrations, laughter, and timeless nostalgia.',
    quote: 'Moments of joy etched forever.',
    medium: 'Leica SL2 · 50mm F/1.2 & 28mm Elmarit',
    location: 'Hôtel Particulier & Private Salons',
    cardShape: 'rounded-t-[44px]', // Graceful low arch
    cardTilt: -0.8,
    cardY: 6,
    featured: {
      label: 'CLIENT IMAGE — TO BE ADDED',
      title: 'Birthdays',
      tag: 'BIRTHDAY FOLIO — CANDLELIT MONOGRAPH',
      meta: 'Leica SL2 · 50mm · Warm Luminescence',
      count: '03 / 06',
      caption: 'Moments of joy etched forever.',
    },
    supporting: [
      {
        id: 'b-1',
        label: 'CLIENT IMAGE — TO BE ADDED',
        tag: 'CHAMPAGNE REVEAL — KINETIC TOAST',
        meta: '28mm Elmarit · Available Light',
        aspect: '4/3',
      },
      {
        id: 'b-2',
        label: 'CLIENT IMAGE — TO BE ADDED',
        tag: 'PATISSERIE DETAIL — VINTAGE TIER',
        meta: '50mm Summilux · Tonal Grace',
        aspect: '4/3',
      },
      {
        id: 'b-3',
        label: 'CLIENT IMAGE — TO BE ADDED',
        tag: 'GATHERED FRIENDS — MIDNIGHT LAUGHTER',
        meta: '35mm Tri-X 400 · Unstaged Candid',
        aspect: '4/3',
      },
      {
        id: 'b-4',
        label: 'CLIENT IMAGE — TO BE ADDED',
        tag: 'TABLE D’HONNEUR — FLORAL HARMONY',
        meta: '75mm Apo · Ambient Glow',
        aspect: '4/3',
      },
    ],
  },
  {
    id: '04',
    name: 'Portraits',
    slug: 'portraits',
    tagline: 'Personal, expressive portraits shaped around your story.',
    quote: 'The soul captured in stillness.',
    medium: 'Medium Format Digital + 120 B&W Film',
    location: 'Atelier Paris & Private Residencies',
    cardShape: 'rounded-tl-[80px] rounded-tr-[20px]', // Asymmetric peak
    cardTilt: 1.8,
    cardY: 28,
    featured: {
      label: 'CLIENT IMAGE — TO BE ADDED',
      title: 'Portraits',
      tag: 'PORTRAITURE MONOGRAPH — WINDOW STUDY',
      meta: 'Hasselblad 100c · 80mm · North Sky Light',
      count: '04 / 06',
      caption: 'The soul captured in stillness.',
    },
    supporting: [
      {
        id: 'po-1',
        label: 'CLIENT IMAGE — TO BE ADDED',
        tag: 'SILHOUETTE CONTEMPLATION',
        meta: '120mm Macro · Rim Light',
        aspect: '4/3',
      },
      {
        id: 'po-2',
        label: 'CLIENT IMAGE — TO BE ADDED',
        tag: 'GAZE VIGNETTE — DIRECT EMOTION',
        meta: '85mm F/1.4 · Chiaroscuro',
        aspect: '4/3',
      },
      {
        id: 'po-3',
        label: 'CLIENT IMAGE — TO BE ADDED',
        tag: 'STUDIO EASEL & ARTIST HANDS',
        meta: '35mm Tri-X · Silver Gelatin',
        aspect: '4/3',
      },
      {
        id: 'po-4',
        label: 'CLIENT IMAGE — TO BE ADDED',
        tag: 'PROFILE MONOGRAPH — SHADOW PLAY',
        meta: 'Large Format 4x5 · Monolith',
        aspect: '4/3',
      },
    ],
  },
  {
    id: '05',
    name: 'Events',
    slug: 'events',
    tagline: 'Energy, atmosphere, and every detail worth remembering.',
    quote: 'Unstaged kinetic elegance.',
    medium: 'Leica M11 & SL2-S · High Sensitivity',
    location: 'Palais Garnier & Foundation Galas',
    cardShape: 'rounded-t-[16px]', // Clean architectural rectangle
    cardTilt: -1.2,
    cardY: 10,
    featured: {
      label: 'CLIENT IMAGE — TO BE ADDED',
      title: 'Events',
      tag: 'GALA MONOGRAPH — GRAND BALLROOM ENTRANCE',
      meta: 'Leica SL2 · 24-70mm · Chandelier Luminescence',
      count: '05 / 06',
      caption: 'Unstaged kinetic elegance.',
    },
    supporting: [
      {
        id: 'e-1',
        label: 'CLIENT IMAGE — TO BE ADDED',
        tag: 'ORCHESTRA PASSAGE — CADENCE',
        meta: '70-200mm F/2.8 · Ambient',
        aspect: '4/3',
      },
      {
        id: 'e-2',
        label: 'CLIENT IMAGE — TO BE ADDED',
        tag: 'COCKTAIL POISE — ARCHITECTURAL ARCH',
        meta: '35mm Summilux · Kinetic',
        aspect: '4/3',
      },
      {
        id: 'e-3',
        label: 'CLIENT IMAGE — TO BE ADDED',
        tag: 'AFTER-HOURS JAZZ — HIGH CONTRAST',
        meta: '50mm Noctilux · Smoke & Light',
        aspect: '4/3',
      },
      {
        id: 'e-4',
        label: 'CLIENT IMAGE — TO BE ADDED',
        tag: 'CLOAKROOM DETAILS — TAILORED SILK',
        meta: '90mm Macro · Textural',
        aspect: '4/3',
      },
    ],
  },
  {
    id: '06',
    name: 'Commercial',
    slug: 'commercial',
    tagline: 'Thoughtful imagery that gives brands a distinct visual voice.',
    quote: 'Clarity, form, and architectural presence.',
    medium: 'Hasselblad 100MP · Directional Light Studio',
    location: 'Place Vendôme & European Maisons',
    cardShape: 'rounded-tr-[88px] rounded-tl-[12px]', // Diagonal curve
    cardTilt: 1.4,
    cardY: 24,
    featured: {
      label: 'CLIENT IMAGE — TO BE ADDED',
      title: 'Commercial',
      tag: 'HAUTE PARFUMERIE — SPATIAL SHADOW STUDY',
      meta: 'Hasselblad 100MP · 120mm Macro · Sculptural Shadow',
      count: '06 / 06',
      caption: 'Clarity, form, and architectural presence.',
    },
    supporting: [
      {
        id: 'c-1',
        label: 'CLIENT IMAGE — TO BE ADDED',
        tag: 'BOTANICAL ESSENCE — ORGANIC FORM',
        meta: '90mm Tilt-Shift · Focus Plane',
        aspect: '4/3',
      },
      {
        id: 'c-2',
        label: 'CLIENT IMAGE — TO BE ADDED',
        tag: 'ATELIER LEATHER CRAFT — TEXTURE',
        meta: '100mm Macro · Natural Grain',
        aspect: '4/3',
      },
      {
        id: 'c-3',
        label: 'CLIENT IMAGE — TO BE ADDED',
        tag: 'ARCHITECTURAL FLACON — HARD LIGHT',
        meta: 'Directional Tungsten · Contrast',
        aspect: '4/3',
      },
      {
        id: 'c-4',
        label: 'CLIENT IMAGE — TO BE ADDED',
        tag: 'MINIMAL MONOGRAPH — NEGATIVE SPACE',
        meta: 'Hasselblad 80mm · Archival Proof',
        aspect: '4/3',
      },
    ],
  },
  {
    id: '07',
    name: 'Couple Shoots',
    slug: 'couple-shoots',
    tagline: 'Authentic connections captured in natural, unscripted light.',
    quote: 'Two souls in unspoken harmony.',
    medium: 'Leica M11 · 35mm Summicron',
    location: 'Jardin des Tuileries & Seine Embankment',
    cardShape: 'rounded-t-[72px]', // Warm arched dome
    cardTilt: -1.5,
    cardY: 4,
    featured: {
      label: 'CLIENT IMAGE — TO BE ADDED',
      title: 'Couple Shoots',
      tag: 'PARISIAN DAWN — COUPLE MONOGRAPH',
      meta: 'Leica M11 · 35mm · Morning Mist',
      count: '07 / 06',
      caption: 'Two souls in unspoken harmony.',
    },
    supporting: [
      {
        id: 'cs-1',
        label: 'CLIENT IMAGE — TO BE ADDED',
        tag: 'WHISPERED LAUGHTER — BRIDGE OF ARTS',
        meta: '50mm Summilux · Bokeh',
        aspect: '4/3',
      },
      {
        id: 'cs-2',
        label: 'CLIENT IMAGE — TO BE ADDED',
        tag: 'COBBLESTONE STRIDE — CANDID CADENCE',
        meta: '28mm Elmarit · Kinetic',
        aspect: '4/3',
      },
      {
        id: 'cs-3',
        label: 'CLIENT IMAGE — TO BE ADDED',
        tag: 'CAFÉ TERRACE — SHARED ESPRESSO',
        meta: '35mm Tri-X · Tonal Grain',
        aspect: '4/3',
      },
      {
        id: 'cs-4',
        label: 'CLIENT IMAGE — TO BE ADDED',
        tag: 'INTERTWINED FINGERS — SUBTLE WARMTH',
        meta: '75mm Noctilux · Micro Detail',
        aspect: '4/3',
      },
    ],
  },
  {
    id: '08',
    name: 'Fashion',
    slug: 'fashion',
    tagline: 'Editorial silhouettes, tactile textiles, and haute couture poetics.',
    quote: 'Where couture meets cinematic art.',
    medium: 'Hasselblad H6D + Phase One IQ4',
    location: 'Grand Palais & Modernist Spaces',
    cardShape: 'rounded-tl-[84px] rounded-tr-[16px]', // Monumental fashion curve
    cardTilt: 1.6,
    cardY: 20,
    featured: {
      label: 'CLIENT IMAGE — TO BE ADDED',
      title: 'Fashion',
      tag: 'COUTURE LOOKBOOK — DRAPED SILK & SHADOW',
      meta: 'Hasselblad 100c · 80mm · Directional Light',
      count: '08 / 06',
      caption: 'Where couture meets cinematic art.',
    },
    supporting: [
      {
        id: 'f-1',
        label: 'CLIENT IMAGE — TO BE ADDED',
        tag: 'VOLUMINOUS TULLE — KINETIC GESTURE',
        meta: '50mm F/1.2 · Fast Shutter',
        aspect: '4/3',
      },
      {
        id: 'f-2',
        label: 'CLIENT IMAGE — TO BE ADDED',
        tag: 'TEXTILE CLOSE-UP — WEAVE & METALLIC',
        meta: '120mm Macro · Archival',
        aspect: '4/3',
      },
      {
        id: 'f-3',
        label: 'CLIENT IMAGE — TO BE ADDED',
        tag: 'EDITORIAL PROFILE — GEOMETRIC ACCENT',
        meta: '85mm Summilux · Sculpted',
        aspect: '4/3',
      },
      {
        id: 'f-4',
        label: 'CLIENT IMAGE — TO BE ADDED',
        tag: 'RUNWAY POLAROID STUDY — CONTACT PROOF',
        meta: 'Polaroid Type 55 · Positive',
        aspect: '4/3',
      },
    ],
  },
];

export default function CollectionsPage({ onOpenInquiry }) {
  const [activeCategoryId, setActiveCategoryId] = useState('01');
  const [viewAllModalOpen, setViewAllModalOpen] = useState(false);
  const categoriesSectionRef = useRef(null);
  const galleryRevealRef = useRef(null);

  const activeCategory = CATEGORIES.find((c) => c.id === activeCategoryId) || CATEGORIES[0];

  const handleSelectCategory = (id) => {
    setActiveCategoryId(id);
    if (galleryRevealRef.current) {
      setTimeout(() => {
        galleryRevealRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 80);
    }
  };

  const handleScrollToCategories = () => {
    if (categoriesSectionRef.current) {
      categoriesSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="collections-page-root w-full bg-[var(--color-off-white)] text-[var(--color-obsidian)] min-h-screen">
      
      {/* =====================================================================
          1. EDITORIAL HERO SECTION
          Spacious editorial hero matching reference composition:
          - “THE COLLECTIONS —————”
          - “Different moments. Same feeling.” (with italic serif)
          - Tagline & Scroll indicator
          - Right: 3 overlapping tilted photography placeholders + cursive note
          ===================================================================== */}
      <section
        className="relative w-full pt-32 sm:pt-36 md:pt-40 lg:pt-44 pb-20 md:pb-28 overflow-hidden"
        style={{
          backgroundColor: 'var(--color-off-white)',
          borderBottom: '1px solid var(--color-nude-subtle)',
        }}
      >
        {/* Fine subtle ambient background grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(227, 219, 204, 0.14) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(227, 219, 204, 0.14) 1px, transparent 1px)
            `,
            backgroundSize: '90px 90px',
          }}
        />

        <div className="container relative z-10 mx-auto px-4 sm:px-8 md:px-12 lg:px-16 max-w-[1440px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Column: Monumental Editorial Typography */}
            <div className="lg:col-span-6 xl:col-span-6">
              
              {/* Eyebrow with elongated horizontal line */}
              <div className="flex items-center gap-4 mb-6 sm:mb-8">
                <span
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    letterSpacing: '0.26em',
                    textTransform: 'uppercase',
                    color: 'var(--color-obsidian-light)',
                  }}
                >
                  The Collections
                </span>
                <span style={{ width: '56px', height: '1px', backgroundColor: 'var(--color-nude)' }} />
              </div>

              {/* Major Heading: “Different moments. Same feeling.” */}
              <h1
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(2.75rem, 5.5vw, 4.75rem)',
                  lineHeight: 1.08,
                  letterSpacing: '-0.025em',
                  fontWeight: 400,
                  color: 'var(--color-obsidian)',
                  marginBottom: '1.75rem',
                }}
              >
                Different moments.
                <br />
                <span
                  className="editorial-italic"
                  style={{
                    fontStyle: 'italic',
                    fontWeight: 400,
                  }}
                >
                  Same feeling.
                </span>
              </h1>

              {/* Curated Photography Subtitle */}
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'clamp(0.95rem, 1.2vw, 1.1rem)',
                  lineHeight: 1.65,
                  color: 'var(--color-obsidian-muted)',
                  maxWidth: '460px',
                  marginBottom: '2.5rem',
                }}
              >
                Explore our curated photography collections, each designed to tell a different story.
              </p>

              {/* Interactive Pill: Scroll to explore */}
              <button
                onClick={handleScrollToCategories}
                className="group inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-[var(--color-nude)] bg-[var(--color-ivory)] hover:bg-[var(--color-off-white)] hover:border-[var(--color-obsidian)] transition-all duration-300 shadow-sm cursor-pointer"
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.75rem',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'var(--color-obsidian)',
                }}
              >
                {/* Small Pill Capsule Icon with arrows */}
                <div className="w-5 h-7 rounded-full border border-[var(--color-obsidian-light)] flex flex-col items-center justify-center gap-0.5 group-hover:border-[var(--color-obsidian)] transition-colors">
                  <span className="w-1 h-1 rounded-full bg-[var(--color-obsidian)]" />
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
                <span>Scroll to explore</span>
              </button>
            </div>

            {/* Right Column: Artistic Composition of 3 Overlapping Photography Placeholders */}
            <div className="lg:col-span-6 xl:col-span-6 relative flex justify-center items-center min-h-[460px] sm:min-h-[520px] lg:min-h-[580px]">
              
              {/* Category Counter indicator on top-right edge (matching reference '01 / 08') */}
              <div
                className="hidden sm:flex flex-col items-center gap-2 absolute top-0 right-0 z-30"
                style={{
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '0.65rem',
                  letterSpacing: '0.2em',
                  color: 'var(--color-obsidian-light)',
                  textTransform: 'uppercase',
                }}
              >
                <span>{activeCategory.id} / 08</span>
                <div className="flex flex-col items-center gap-1 opacity-70">
                  <span className="cursor-pointer hover:text-[var(--color-obsidian)]">↑</span>
                  <span className="cursor-pointer hover:text-[var(--color-obsidian)]">↓</span>
                </div>
              </div>

              {/* Composition Container with organic layered depth */}
              <div className="relative w-full max-w-[500px] h-[480px] sm:h-[540px]">
                
                {/* Cursive Script Handwritten Note (matching reference: "Real people / Real moments / Beautiful stories") */}
                <div
                  className="absolute -top-4 sm:-top-6 left-0 sm:left-4 z-30 select-none pointer-events-none"
                  style={{
                    transform: 'rotate(-7deg)',
                    fontFamily: 'var(--font-script, Caveat, cursive)',
                    fontSize: 'clamp(1.4rem, 2.2vw, 1.85rem)',
                    color: '#6B6862',
                    lineHeight: 1.15,
                  }}
                >
                  <p>Real people</p>
                  <p style={{ paddingLeft: '0.6rem' }}>Real moments</p>
                  <p style={{ paddingLeft: '1.2rem' }}>Beautiful stories.</p>
                  
                  {/* Subtle delicate curved loop SVG */}
                  <svg
                    className="w-24 h-12 -mt-2 ml-10 text-[var(--color-nude)] opacity-80"
                    viewBox="0 0 100 50"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  >
                    <path d="M10,15 C40,45 65,-10 90,30" strokeLinecap="round" />
                  </svg>
                </div>

                {/* 1. Large Main Vertical Polaroid Frame (Center-Left) */}
                <motion.div
                  initial={{ opacity: 0, y: 30, rotate: 3.5 }}
                  animate={{ opacity: 1, y: 0, rotate: 3.5 }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ scale: 1.02, rotate: 2, zIndex: 25 }}
                  className="absolute left-2 sm:left-6 top-10 sm:top-12 z-20 w-[240px] sm:w-[285px] md:w-[310px] bg-white p-3 sm:p-3.5 pb-8 sm:pb-10 shadow-[0_25px_50px_-12px_rgba(16,16,16,0.18)] border border-[rgba(227,219,204,0.6)] cursor-pointer"
                  style={{
                    borderRadius: '4px',
                    transformOrigin: 'center center',
                  }}
                  onClick={() => handleSelectCategory('01')}
                >
                  <PhotoPlaceholder
                    aspectRatio="3/4"
                    label="CLIENT IMAGE — TO BE ADDED"
                    meta="Hasselblad H6D · Natural Light"
                    title="The Monograph"
                    borderRadius="0px"
                    style={{ backgroundColor: '#EBE7DC' }}
                  />
                  <div className="mt-3.5 flex justify-between items-center px-1 font-mono text-[0.625rem] text-[var(--color-obsidian-light)] uppercase tracking-[0.18em]">
                    <span>Atelier Series</span>
                    <span>Plate 01</span>
                  </div>
                </motion.div>

                {/* 2. Top-Right Tilted Frame (Behind Main Frame) */}
                <motion.div
                  initial={{ opacity: 0, y: 40, rotate: -7 }}
                  animate={{ opacity: 1, y: 0, rotate: -7 }}
                  transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ scale: 1.03, rotate: -5, zIndex: 25 }}
                  className="absolute right-0 sm:right-4 top-2 sm:top-4 z-10 w-[180px] sm:w-[215px] md:w-[235px] bg-white p-2.5 sm:p-3 pb-6 sm:pb-8 shadow-[0_20px_40px_-10px_rgba(16,16,16,0.15)] border border-[rgba(227,219,204,0.6)] cursor-pointer"
                  style={{
                    borderRadius: '4px',
                    transformOrigin: 'center center',
                  }}
                  onClick={() => handleSelectCategory('04')}
                >
                  <PhotoPlaceholder
                    aspectRatio="4/5"
                    label="CLIENT IMAGE — TO BE ADDED"
                    meta="Leica M11 · 35mm Summilux"
                    title="Camera & Hands"
                    borderRadius="0px"
                    style={{ backgroundColor: '#E4DFD2' }}
                  />
                  <div className="mt-2.5 flex justify-between items-center px-1 font-mono text-[0.58rem] text-[var(--color-obsidian-light)] uppercase tracking-[0.16em]">
                    <span>Candid Study</span>
                    <span>Plate 02</span>
                  </div>
                </motion.div>

                {/* 3. Bottom-Right Smaller Tilted Frame (Foreground Overlap) */}
                <motion.div
                  initial={{ opacity: 0, y: 40, rotate: 6 }}
                  animate={{ opacity: 1, y: 0, rotate: 6 }}
                  transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ scale: 1.04, rotate: 4, zIndex: 26 }}
                  className="absolute right-2 sm:right-8 bottom-0 sm:bottom-4 z-20 w-[145px] sm:w-[170px] md:w-[185px] bg-white p-2 sm:p-2.5 pb-5 sm:pb-6 shadow-[0_22px_45px_-10px_rgba(16,16,16,0.16)] border border-[rgba(227,219,204,0.6)] cursor-pointer"
                  style={{
                    borderRadius: '4px',
                    transformOrigin: 'center center',
                  }}
                  onClick={() => handleSelectCategory('07')}
                >
                  <PhotoPlaceholder
                    aspectRatio="1/1"
                    label="CLIENT IMAGE — TO BE ADDED"
                    meta="50mm Macro · Botanical"
                    title="Flora Study"
                    borderRadius="0px"
                    style={{ backgroundColor: '#F0ECE3' }}
                  />
                  <div className="mt-2 flex justify-between items-center px-0.5 font-mono text-[0.55rem] text-[var(--color-obsidian-light)] uppercase tracking-[0.14em]">
                    <span>Botanical Detail</span>
                    <span>Plate 03</span>
                  </div>
                </motion.div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================================
          2. COLLECTION CATEGORIES SECTION
          Below the hero, show photography categories as large vertical image cards
          arranged across the page with generous spacing.
          Includes:
          01 Weddings, 02 Pre-Wedding, 03 Birthdays, 04 Portraits,
          05 Events, 06 Commercial, 07 Couple Shoots, 08 Fashion
          Artistic irregular sculpted tops, subtle rotation, depth & hover movement.
          ===================================================================== */}
      <section
        ref={categoriesSectionRef}
        id="categories-ribbon"
        className="relative w-full py-24 sm:py-32 md:py-36 overflow-hidden"
        style={{
          backgroundColor: 'var(--color-ivory)',
          borderBottom: '1px solid var(--color-nude)',
        }}
      >
        {/* Subtle decorative undulating curve running behind the cards (matching reference design) */}
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 pointer-events-none opacity-45 overflow-hidden">
          <svg className="w-full h-36" viewBox="0 0 1440 140" preserveAspectRatio="none" fill="none">
            <path
              d="M-20,70 C240,130 480,10 720,70 C960,130 1200,20 1460,80"
              stroke="var(--color-nude)"
              strokeWidth="1.2"
              strokeDasharray="4 6"
            />
          </svg>
        </div>

        <div className="container relative z-10 mx-auto px-4 sm:px-6 md:px-10 lg:px-12 max-w-[1480px]">
          
          {/* Section Sub-header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-12 sm:mb-16 md:mb-20 pb-6 border-b border-[var(--color-nude)]">
            <div>
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.675rem',
                  fontWeight: 600,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: 'var(--color-obsidian-light)',
                  display: 'block',
                  marginBottom: '0.45rem',
                }}
              >
                02 / Archival Disciplines
              </span>
              <h2
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(2rem, 3.5vw, 3rem)',
                  fontWeight: 400,
                  color: 'var(--color-obsidian)',
                }}
              >
                Curated Categories
              </h2>
            </div>
            
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.85rem',
                color: 'var(--color-obsidian-muted)',
                maxWidth: '420px',
              }}
            >
              Select any collection to smoothly inspect its full editorial gallery and curated master frames below.
            </p>
          </div>

          {/* Large Vertical Image Cards Ribbon (Scrollable or Flowing Grid) */}
          <div className="relative w-full">
            <div
              className="flex gap-5 sm:gap-6 md:gap-7 lg:gap-8 overflow-x-auto pb-10 pt-4 px-2 no-scrollbar scroll-smooth"
              style={{
                scrollSnapType: 'x proximity',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              {CATEGORIES.map((cat, index) => {
                const isActive = cat.id === activeCategoryId;

                return (
                  <motion.div
                    key={cat.id}
                    onClick={() => handleSelectCategory(cat.id)}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.06 }}
                    whileHover={{
                      y: -12,
                      scale: 1.025,
                      rotate: 0,
                      transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
                    }}
                    style={{
                      transform: `rotate(${cat.cardTilt}deg) translateY(${cat.cardY}px)`,
                      scrollSnapAlign: 'start',
                      minWidth: 'clamp(210px, 20vw, 250px)',
                      maxWidth: '260px',
                      flexShrink: 0,
                    }}
                    className="group cursor-pointer select-none"
                  >
                    {/* Card Body */}
                    <div
                      className={`relative w-full h-[400px] sm:h-[450px] md:h-[480px] overflow-hidden flex flex-col justify-between p-6 sm:p-7 transition-all duration-500 ${cat.cardShape}`}
                      style={{
                        backgroundColor: '#1E1D1A',
                        boxShadow: isActive
                          ? '0 30px 60px -15px rgba(16, 16, 16, 0.35), 0 0 0 2px var(--color-obsidian)'
                          : '0 18px 40px -12px rgba(16, 16, 16, 0.16)',
                        border: isActive
                          ? '1px solid var(--color-nude)'
                          : '1px solid rgba(227, 219, 204, 0.25)',
                      }}
                    >
                      {/* Dark photographic canvas with subtle warm tint */}
                      <div
                        className="absolute inset-0 pointer-events-none opacity-85"
                        style={{
                          backgroundImage: `
                            radial-gradient(circle at 50% 30%, rgba(65, 60, 52, 0.95) 0%, rgba(18, 17, 16, 0.98) 100%),
                            linear-gradient(to right, rgba(227, 219, 204, 0.05) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(227, 219, 204, 0.05) 1px, transparent 1px)
                          `,
                          backgroundSize: '100% 100%, 20px 20px, 20px 20px',
                        }}
                      />

                      {/* Corner crop marks */}
                      <span className="absolute top-4 left-4 text-[rgba(227,219,204,0.3)] font-mono text-xs">+</span>
                      <span className="absolute top-4 right-4 text-[rgba(227,219,204,0.3)] font-mono text-xs">+</span>

                      {/* Top: Category Number */}
                      <div className="relative z-10 flex items-center justify-between">
                        <span
                          style={{
                            fontFamily: 'var(--font-serif)',
                            fontSize: '1.4rem',
                            color: isActive ? 'var(--color-off-white)' : 'rgba(243, 240, 233, 0.65)',
                            fontWeight: 400,
                          }}
                        >
                          {cat.id}
                        </span>

                        {/* Active indicator dot */}
                        {isActive && (
                          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[rgba(253,252,248,0.15)] border border-[rgba(227,219,204,0.3)] font-mono text-[0.55rem] tracking-[0.16em] uppercase text-[var(--color-off-white)]">
                            Active
                          </span>
                        )}
                      </div>

                      {/* Center: Camera Aperture Icon & Technical Specs */}
                      <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center opacity-80 group-hover:opacity-100 transition-opacity">
                        <div className="w-12 h-12 rounded-full border border-[rgba(227,219,204,0.25)] bg-[rgba(255,255,255,0.03)] flex items-center justify-center text-[var(--color-nude)] mb-3 group-hover:scale-110 transition-transform">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="14.31" y1="8" x2="20.05" y2="17.94" />
                            <line x1="9.69" y1="8" x2="21.17" y2="8" />
                            <line x1="7.38" y1="12" x2="13.12" y2="2.06" />
                            <line x1="9.69" y1="16" x2="3.95" y2="6.06" />
                            <line x1="14.31" y1="16" x2="2.83" y2="16" />
                            <line x1="16.62" y1="12" x2="10.88" y2="21.94" />
                          </svg>
                        </div>
                        <span className="font-mono text-[0.575rem] tracking-[0.2em] text-[var(--color-ivory)] uppercase px-2 py-0.5 rounded-full bg-[rgba(255,255,255,0.06)] border border-[rgba(227,219,204,0.2)] mb-1">
                          CLIENT IMAGE — TO BE ADDED
                        </span>
                        <span className="font-mono text-[0.55rem] tracking-[0.14em] text-[rgba(243,240,233,0.45)] uppercase">
                          {cat.medium.split('·')[0]}
                        </span>
                      </div>

                      {/* Bottom: Category Name & Arrow */}
                      <div className="relative z-10 pt-4 border-t border-[rgba(227,219,204,0.18)]">
                        <h3
                          style={{
                            fontFamily: 'var(--font-serif)',
                            fontSize: 'clamp(1.5rem, 1.8vw, 1.85rem)',
                            color: 'var(--color-off-white)',
                            fontWeight: 400,
                            lineHeight: 1.15,
                            marginBottom: '0.5rem',
                          }}
                        >
                          {cat.name}
                        </h3>

                        {/* Small Arrow indicator (matching reference design) */}
                        <div className="flex items-center gap-2 text-[var(--color-nude)] group-hover:text-white transition-colors">
                          <span className="w-6 h-[1px] bg-[currentColor] transition-all group-hover:w-9" />
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                          </svg>
                        </div>
                      </div>

                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* =====================================================================
          3. CATEGORY INTERACTION & EDITORIAL REVEALED GALLERY
          When a category is clicked, smoothly reveal its photography collection underneath.
          Creative asymmetric gallery matching reference:
          - Header: 01 ————— Weddings | VIEW ALL →
          - Large featured image (~58% width) with bottom-left overlay (01) 01/06 and quote
          - Smaller supporting images around it (4 images)
          - Whitespace, image count & View All modal
          ===================================================================== */}
      <section
        ref={galleryRevealRef}
        id="editorial-gallery-view"
        className="relative w-full py-24 sm:py-32 md:py-36 overflow-hidden"
        style={{
          backgroundColor: 'var(--color-off-white)',
        }}
      >
        <div className="container relative z-10 mx-auto px-4 sm:px-8 md:px-12 lg:px-16 max-w-[1440px]">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory.id}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Gallery Header (Matching Reference: "01 ————— Weddings ... VIEW ALL →") */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16 pb-8 border-b border-[var(--color-nude-subtle)]">
                <div>
                  <div className="flex items-center gap-4 mb-3">
                    <span
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '1.25rem',
                        color: 'var(--color-obsidian)',
                        fontWeight: 400,
                      }}
                    >
                      {activeCategory.id}
                    </span>
                    <span style={{ width: '48px', height: '1px', backgroundColor: 'var(--color-nude)' }} />
                    <h2
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: 'clamp(2.4rem, 4.5vw, 3.6rem)',
                        fontWeight: 400,
                        color: 'var(--color-obsidian)',
                        lineHeight: 1,
                      }}
                    >
                      {activeCategory.name}
                    </h2>
                  </div>

                  <p
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: 'clamp(0.9rem, 1.1vw, 1.05rem)',
                      color: 'var(--color-obsidian-muted)',
                      maxWidth: '520px',
                    }}
                  >
                    {activeCategory.tagline}
                  </p>
                </div>

                {/* Right: View All Interaction & Image Count */}
                <div className="flex items-center gap-6">
                  <span
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.75rem',
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: 'var(--color-obsidian-light)',
                    }}
                    className="hidden sm:inline-block"
                  >
                    06 Curated Frames
                  </span>

                  <button
                    onClick={() => setViewAllModalOpen(true)}
                    className="group inline-flex items-center gap-2 font-mono text-[0.75rem] tracking-[0.2em] uppercase text-[var(--color-obsidian)] pb-1 border-b border-[var(--color-obsidian)] hover:opacity-75 transition-opacity cursor-pointer"
                  >
                    <span>View All</span>
                    <span className="transform transition-transform group-hover:translate-x-1">→</span>
                  </button>
                </div>
              </div>

              {/* Asymmetric Gallery Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
                
                {/* LEFT: One Large Featured Image (~58% width / 7 cols) */}
                <div className="lg:col-span-7 xl:col-span-7">
                  <div
                    className="group relative w-full overflow-hidden bg-[#1D1C19] border border-[var(--color-nude)] shadow-[0_20px_45px_-12px_rgba(16,16,16,0.12)] cursor-pointer"
                    style={{
                      aspectRatio: '16/10',
                      borderRadius: '12px',
                    }}
                    onClick={() => setViewAllModalOpen(true)}
                  >
                    {/* Atmospheric luxury darkroom canvas */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        backgroundImage: `
                          radial-gradient(circle at 50% 35%, rgba(65, 60, 52, 0.92) 0%, rgba(16, 16, 16, 0.98) 100%),
                          linear-gradient(to right, rgba(227, 219, 204, 0.05) 1px, transparent 1px),
                          linear-gradient(to bottom, rgba(227, 219, 204, 0.05) 1px, transparent 1px)
                        `,
                        backgroundSize: '100% 100%, 24px 24px, 24px 24px',
                      }}
                    />

                    {/* Corner crop marks */}
                    <span className="absolute top-4 left-4 text-[rgba(227,219,204,0.4)] font-mono text-sm">+</span>
                    <span className="absolute top-4 right-4 text-[rgba(227,219,204,0.4)] font-mono text-sm">+</span>
                    <span className="absolute bottom-4 left-4 text-[rgba(227,219,204,0.4)] font-mono text-sm">+</span>
                    <span className="absolute bottom-4 right-4 text-[rgba(227,219,204,0.4)] font-mono text-sm">+</span>

                    {/* Center Museum Placeholder Indicator */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                      <div className="w-16 h-16 rounded-full border border-[rgba(227,219,204,0.3)] bg-[rgba(255,255,255,0.04)] flex items-center justify-center text-[var(--color-ivory)] mb-4 shadow-lg group-hover:scale-105 transition-transform">
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="14.31" y1="8" x2="20.05" y2="17.94" />
                          <line x1="9.69" y1="8" x2="21.17" y2="8" />
                          <line x1="7.38" y1="12" x2="13.12" y2="2.06" />
                          <line x1="9.69" y1="16" x2="3.95" y2="6.06" />
                          <line x1="14.31" y1="16" x2="2.83" y2="16" />
                          <line x1="16.62" y1="12" x2="10.88" y2="21.94" />
                        </svg>
                      </div>

                      <span className="font-mono text-xs font-semibold tracking-[0.24em] text-[var(--color-off-white)] uppercase px-4 py-1.5 rounded-full bg-[rgba(255,255,255,0.08)] border border-[rgba(227,219,204,0.3)] mb-2">
                        CLIENT IMAGE — TO BE ADDED
                      </span>
                      <span className="font-mono text-[0.65rem] tracking-[0.16em] text-[rgba(243,240,233,0.55)] uppercase">
                        {activeCategory.featured.meta}
                      </span>
                    </div>

                    {/* Bottom Overlay: (01) 01 / 06 pill on left, italic quote on right */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7 flex items-end justify-between bg-gradient-to-t from-[rgba(16,16,16,0.85)] via-[rgba(16,16,16,0.4)] to-transparent">
                      {/* Left: Progress Pill matching reference */}
                      <div className="flex items-center gap-3 bg-[rgba(16,16,16,0.6)] backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[rgba(227,219,204,0.25)]">
                        <span className="w-5 h-5 rounded-full border border-[rgba(227,219,204,0.4)] flex items-center justify-center font-mono text-[0.55rem] text-[var(--color-off-white)]">
                          {activeCategory.id}
                        </span>
                        <span className="font-mono text-[0.625rem] tracking-[0.16em] text-[var(--color-ivory)]">
                          {activeCategory.featured.count}
                        </span>
                        <span className="w-10 h-[1.5px] bg-[rgba(227,219,204,0.4)] relative overflow-hidden">
                          <span className="absolute left-0 top-0 bottom-0 w-1/2 bg-[var(--color-off-white)]" />
                        </span>
                      </div>

                      {/* Right: Poetic Italic Quote matching reference */}
                      <p
                        style={{
                          fontFamily: 'var(--font-serif)',
                          fontStyle: 'italic',
                          fontSize: 'clamp(1rem, 1.4vw, 1.25rem)',
                          color: 'var(--color-off-white)',
                          textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                        }}
                        className="hidden sm:block"
                      >
                        {activeCategory.quote}
                      </p>
                    </div>

                  </div>
                </div>

                {/* RIGHT: 4 Smaller Supporting Images in 2x2 Editorial Grid */}
                <div className="lg:col-span-5 xl:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  {activeCategory.supporting.map((item, idx) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 + idx * 0.08 }}
                      whileHover={{ scale: 1.02 }}
                      className="group relative bg-[var(--color-ivory)] border border-[var(--color-nude)] rounded-xl overflow-hidden shadow-[0_12px_24px_-8px_rgba(16,16,16,0.06)] cursor-pointer"
                      style={{ aspectRatio: item.aspect }}
                      onClick={() => setViewAllModalOpen(true)}
                    >
                      <PhotoPlaceholder
                        aspectRatio={item.aspect}
                        label="CLIENT IMAGE — TO BE ADDED"
                        meta={item.meta}
                        borderRadius="12px"
                      />

                      {/* Hover Overlay with Frame Details */}
                      <div className="absolute inset-0 bg-[rgba(16,16,16,0.6)] backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 text-[var(--color-off-white)]">
                        <span className="font-mono text-[0.6rem] tracking-[0.16em] uppercase text-[var(--color-nude)]">
                          Frame 0{idx + 2} / 06
                        </span>
                        <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', lineHeight: 1.2 }}>
                          {item.tag}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

              </div>

            </motion.div>
          </AnimatePresence>

        </div>
      </section>

      {/* =====================================================================
          VIEW ALL EDITORIAL MODAL (Archival Contact Sheet View)
          ===================================================================== */}
      <AnimatePresence>
        {viewAllModalOpen && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 sm:p-6 md:p-10">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setViewAllModalOpen(false)}
              className="absolute inset-0 bg-[rgba(16,16,16,0.85)] backdrop-blur-md"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 w-full max-w-5xl max-h-[90vh] bg-[var(--color-off-white)] rounded-2xl border border-[var(--color-nude)] shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-6 sm:p-8 border-b border-[var(--color-nude)] flex items-center justify-between">
                <div>
                  <span className="font-mono text-[0.65rem] tracking-[0.22em] text-[var(--color-obsidian-light)] uppercase">
                    Archival Contact Sheet · {activeCategory.id}
                  </span>
                  <h3
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.85rem',
                      color: 'var(--color-obsidian)',
                      fontWeight: 400,
                    }}
                  >
                    {activeCategory.name} Collection
                  </h3>
                </div>

                <button
                  onClick={() => setViewAllModalOpen(false)}
                  className="w-10 h-10 rounded-full border border-[var(--color-nude)] bg-[var(--color-ivory)] hover:bg-[var(--color-obsidian)] hover:text-white transition-colors flex items-center justify-center text-sm cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Modal Content / Contact Sheet Grid */}
              <div className="p-6 sm:p-8 overflow-y-auto max-h-[calc(90vh-180px)] space-y-8">
                <div className="flex items-center justify-between text-xs font-mono text-[var(--color-obsidian-light)]">
                  <span>{activeCategory.medium}</span>
                  <span>{activeCategory.location}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {/* Featured Item */}
                  <div className="flex flex-col gap-2">
                    <PhotoPlaceholder
                      aspectRatio="4/3"
                      label="CLIENT IMAGE — TO BE ADDED"
                      meta={activeCategory.featured.meta}
                      dark={true}
                      borderRadius="8px"
                    />
                    <span className="font-mono text-[0.6rem] uppercase tracking-wider text-[var(--color-obsidian-light)]">
                      01 / Master Hero Frame
                    </span>
                  </div>

                  {/* Supporting Items */}
                  {activeCategory.supporting.map((sup, i) => (
                    <div key={sup.id} className="flex flex-col gap-2">
                      <PhotoPlaceholder
                        aspectRatio="4/3"
                        label="CLIENT IMAGE — TO BE ADDED"
                        meta={sup.meta}
                        borderRadius="8px"
                      />
                      <span className="font-mono text-[0.6rem] uppercase tracking-wider text-[var(--color-obsidian-light)]">
                        0{i + 2} / {sup.tag.split('—')[0]}
                      </span>
                    </div>
                  ))}

                  {/* Additional Frame 06 */}
                  <div className="flex flex-col gap-2">
                    <PhotoPlaceholder
                      aspectRatio="4/3"
                      label="CLIENT IMAGE — TO BE ADDED"
                      meta="Archival Silver Master Proof · Final Cut"
                      dark={true}
                      borderRadius="8px"
                    />
                    <span className="font-mono text-[0.6rem] uppercase tracking-wider text-[var(--color-obsidian-light)]">
                      06 / Atmospheric Close
                    </span>
                  </div>
                </div>

                {/* Consultation Note inside modal */}
                <div className="p-6 rounded-xl bg-[var(--color-ivory)] border border-[var(--color-nude)] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--color-obsidian)' }}>
                      Commission This Collection
                    </h4>
                    <p className="text-xs text-[var(--color-obsidian-muted)] mt-1">
                      Each project is tailored with bespoke lighting, medium-format capture, and archival print delivery.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setViewAllModalOpen(false);
                      if (onOpenInquiry) {
                        onOpenInquiry(activeCategory.name);
                      }
                    }}
                    className="btn-primary flex-shrink-0"
                  >
                    Inquire For {activeCategory.name}
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
