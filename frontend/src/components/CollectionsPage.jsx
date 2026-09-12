import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './CollectionsPage.css';

const CATEGORIES = [
  {
    id: '01',
    name: 'Weddings',
    slug: 'weddings',
    tagline: 'Honest moments, beautifully preserved as they unfold.',
    quote: 'A love story, in every frame.',
    medium: 'Leica M11 · 35mm Summilux & 50mm Noctilux',
    location: 'Lake Como & Private Estates',
    // French arch top
    cardShapeStyle: {
      borderRadius: '68px 68px 4px 4px',
    },
    cardTransform: 'perspective(1200px) rotateY(16deg) translateY(2px)',
    coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop',
    featured: {
      image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1400&auto=format&fit=crop',
      title: 'Ceremony at Lake Como',
      count: '01 / 06',
      caption: 'A love story, in every frame.',
      meta: 'Leica M11 · 35mm Summilux · F/1.4 · Natural Twilight',
    },
    supporting: [
      {
        id: 'w-1',
        image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800&auto=format&fit=crop',
        tag: 'Bridal Detail — Atelier Lace & Veil',
        meta: '50mm Noctilux · Natural Ambient Light',
      },
      {
        id: 'w-2',
        image: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=800&auto=format&fit=crop',
        tag: 'Candlelit Reception — Evening Harmony',
        meta: '35mm Summilux · Ambient Evening',
      },
      {
        id: 'w-3',
        image: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=800&auto=format&fit=crop',
        tag: 'Highland Promenade — Dual Portrait',
        meta: 'Medium Format 6x7 · Platinotype Tonal Scale',
      },
      {
        id: 'w-4',
        image: 'https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?q=80&w=800&auto=format&fit=crop',
        tag: 'Ceremonial Vows — Adorned Details',
        meta: '75mm Summicron · Archival Silver Proof',
      },
    ],
  },
  {
    id: '02',
    name: 'Pre-wedding',
    slug: 'pre-wedding',
    tagline: 'Intimate anticipation before the grand celebration.',
    quote: 'Quiet chapters before the vows.',
    medium: 'Hasselblad H6D · Natural Ambient Glow',
    location: 'Cap d’Antibes & Parisian Terraces',
    // Asymmetric sculpted top curve
    cardShapeStyle: {
      borderRadius: '4px 44px 4px 4px',
    },
    cardTransform: 'perspective(1200px) rotateY(10deg) translateY(0px)',
    coverImage: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=800&auto=format&fit=crop',
    featured: {
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1400&auto=format&fit=crop',
      title: 'Golden Hour Promenade',
      count: '02 / 06',
      caption: 'Quiet chapters before the vows.',
      meta: 'Hasselblad 80mm · Mediterranean Warm Glow',
    },
    supporting: [
      {
        id: 'pw-1',
        image: 'https://images.unsplash.com/photo-1529636798458-92182e662485?q=80&w=800&auto=format&fit=crop',
        tag: 'Coastal Sunset — Whispered Promises',
        meta: '35mm Summicron · Golden Hour Spray',
      },
      {
        id: 'pw-2',
        image: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=800&auto=format&fit=crop',
        tag: 'Candid Embrace — Natural Breeze',
        meta: '50mm F/1.2 · Natural Light',
      },
      {
        id: 'pw-3',
        image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=800&auto=format&fit=crop',
        tag: 'Historic Cloister — Walking Study',
        meta: 'Medium Format 6x7 · Architectural Tonal Scale',
      },
      {
        id: 'pw-4',
        image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=800&auto=format&fit=crop',
        tag: 'Botanical Vignette — Intimate Moments',
        meta: '90mm Macro · Ambient Flora',
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
    // Graceful curved top
    cardShapeStyle: {
      borderRadius: '42px 42px 4px 4px',
    },
    cardTransform: 'perspective(1200px) rotateY(2deg) translateY(-4px)',
    coverImage: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?q=80&w=800&auto=format&fit=crop',
    featured: {
      image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=1400&auto=format&fit=crop',
      title: 'Candlelit Celebration',
      count: '03 / 06',
      caption: 'Moments of joy etched forever.',
      meta: 'Leica SL2 · 50mm · Warm Luminescence',
    },
    supporting: [
      {
        id: 'b-1',
        image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=800&auto=format&fit=crop',
        tag: 'Champagne Reveal — Kinetic Toast',
        meta: '28mm Elmarit · Available Light',
      },
      {
        id: 'b-2',
        image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?q=80&w=800&auto=format&fit=crop',
        tag: 'Patisserie Detail — Vintage Tier',
        meta: '50mm Summilux · Tonal Grace',
      },
      {
        id: 'b-3',
        image: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?q=80&w=800&auto=format&fit=crop',
        tag: 'Gathered Friends — Midnight Laughter',
        meta: '35mm Tri-X 400 · Unstaged Candid',
      },
      {
        id: 'b-4',
        image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800&auto=format&fit=crop',
        tag: 'Table d’Honneur — Floral Harmony',
        meta: '50mm F/1.4 · Ambient Twilight',
      },
    ],
  },
  {
    id: '04',
    name: 'Portraits',
    slug: 'portraits',
    tagline: 'Authentic presence, evocative gazes, and nuanced light.',
    quote: 'Soulful character in every glance.',
    medium: 'Hasselblad 503CW · Carl Zeiss 80mm Planar',
    location: 'Paris Atelier & Natural Light Daylight Studio',
    // Arch sculpted top
    cardShapeStyle: {
      borderRadius: '4px 46px 4px 4px',
    },
    cardTransform: 'perspective(1200px) rotateY(-6deg) translateY(0px)',
    coverImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
    featured: {
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1400&auto=format&fit=crop',
      title: 'The Atelier Portrait',
      count: '04 / 06',
      caption: 'Soulful character in every glance.',
      meta: 'Carl Zeiss 80mm · Tri-X 400 Grain · Available Skylight',
    },
    supporting: [
      {
        id: 'p-1',
        image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop',
        tag: 'Chiaroscuro Silhouette — Soft Light',
        meta: '80mm Planar · North-Facing Studio Window',
      },
      {
        id: 'p-2',
        image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=800&auto=format&fit=crop',
        tag: 'Candid Gaze — Unfiltered Emotion',
        meta: '50mm Noctilux · Natural Daylight',
      },
      {
        id: 'p-3',
        image: 'https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?q=80&w=800&auto=format&fit=crop',
        tag: 'Analog Contact Sheet — Behind The Lens',
        meta: 'Ilford HP5 Plus · Hand Processed',
      },
      {
        id: 'p-4',
        image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop',
        tag: 'Editorial Profile — Sculpted Shadow',
        meta: '100mm Macro · Directional Daylight',
      },
    ],
  },
  {
    id: '05',
    name: 'Events',
    slug: 'events',
    tagline: 'Atmospheric galas, spatial depth, and unstaged energy.',
    quote: 'The living pulse of celebrated evenings.',
    medium: 'Leica Q3 · 28mm Summilux & Leica M11',
    location: 'Palais Brongniart & Private Châteaux',
    // Clean architectural top
    cardShapeStyle: {
      borderRadius: '4px 4px 4px 4px',
    },
    cardTransform: 'perspective(1200px) rotateY(-12deg) translateY(4px)',
    coverImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=800&auto=format&fit=crop',
    featured: {
      image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1400&auto=format&fit=crop',
      title: 'Gala Evening at the Grand Salon',
      count: '05 / 06',
      caption: 'The living pulse of celebrated evenings.',
      meta: 'Leica Q3 · 28mm Summilux · F/1.7 · Ambient Chandeliers',
    },
    supporting: [
      {
        id: 'e-1',
        image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=800&auto=format&fit=crop',
        tag: 'Champagne Cascade — Movement & Light',
        meta: '28mm Summilux · 1/250s · Available Luminescence',
      },
      {
        id: 'e-2',
        image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800&auto=format&fit=crop',
        tag: 'Architectural Shadow & Golden Glow',
        meta: '35mm Summilux · High Dynamic Natural Shadow',
      },
      {
        id: 'e-3',
        image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=800&auto=format&fit=crop',
        tag: 'Evening Whispers — Unposed Dialogue',
        meta: '50mm Noctilux · Low Light Candela',
      },
      {
        id: 'e-4',
        image: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?q=80&w=800&auto=format&fit=crop',
        tag: 'Closing Waltz — Lyrical Motion',
        meta: '28mm · Slow Sync Drag · Atmospheric',
      },
    ],
  },
  {
    id: '06',
    name: 'Commercial',
    slug: 'commercial',
    tagline: 'Haute editorial campaigns, luxury objects, and spatial poetics.',
    quote: 'Purity of form, shadow, and tactile desire.',
    medium: 'Phase One IQ4 150MP & Schneider Kreuznach',
    location: 'Atelier Minimaliste & Concept Showrooms',
    // Clean architectural top
    cardShapeStyle: {
      borderRadius: '4px 4px 4px 4px',
    },
    cardTransform: 'perspective(1200px) rotateY(-18deg) translateY(8px)',
    coverImage: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800&auto=format&fit=crop',
    featured: {
      image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1400&auto=format&fit=crop',
      title: 'Haute Parfumerie & Stone Pedestal',
      count: '06 / 06',
      caption: 'Purity of form, shadow, and tactile desire.',
      meta: 'Phase One IQ4 · 120mm Macro · Directional Studio Sunlight',
    },
    supporting: [
      {
        id: 'c-1',
        image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=800&auto=format&fit=crop',
        tag: 'Architectural Flacon — Botanical Cast Shadows',
        meta: 'Schneider 80mm · Precision Chiaroscuro',
      },
      {
        id: 'c-2',
        image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop',
        tag: 'Haute Joaillerie — Gold & Raw Mineral',
        meta: '120mm Macro · Micro Prism Focus',
      },
      {
        id: 'c-3',
        image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800&auto=format&fit=crop',
        tag: 'Interior Spatial Poetics — Minimalist Gallery',
        meta: 'Medium Format 35mm Shift · Archival',
      },
      {
        id: 'c-4',
        image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop',
        tag: 'Editorial Draped Silk — Fluid Geometry',
        meta: 'Schneider 110mm · Available Silk Light',
      },
    ],
  },
];

export default function CollectionsPage({ onOpenInquiry }) {
  const [activeCategoryId, setActiveCategoryId] = useState('01');
  const [viewAllModalOpen, setViewAllModalOpen] = useState(false);
  const categoriesRibbonRef = useRef(null);
  const galleryRevealRef = useRef(null);

  const activeCategory = CATEGORIES.find((c) => c.id === activeCategoryId) || CATEGORIES[0];

  const handleSelectCategory = (id) => {
    setActiveCategoryId(id);
    if (galleryRevealRef.current) {
      setTimeout(() => {
        galleryRevealRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  const handleScrollToExplore = () => {
    if (categoriesRibbonRef.current) {
      categoriesRibbonRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleNextCategory = () => {
    const currentIndex = CATEGORIES.findIndex((c) => c.id === activeCategoryId);
    const nextIndex = (currentIndex + 1) % CATEGORIES.length;
    handleSelectCategory(CATEGORIES[nextIndex].id);
  };

  const handlePrevCategory = () => {
    const currentIndex = CATEGORIES.findIndex((c) => c.id === activeCategoryId);
    const prevIndex = (currentIndex - 1 + CATEGORIES.length) % CATEGORIES.length;
    handleSelectCategory(CATEGORIES[prevIndex].id);
  };

  return (
    <div
      className="collections-page-root w-full min-h-screen text-[#101010]"
      style={{
        backgroundColor: '#F6F3EC',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* =====================================================================
          1. HERO SECTION (70vh – 80vh Viewport Occupancy)
          Matches First Reference Image:
          - Generous negative space & centered container
          - Refined typography (clamp(44px, 4.5vw, 64px))
          - Small, elegant Polaroid collage (Main 320px–350px, Second 220px–250px, Third 150px–175px)
          - Clear air below navbar (no collision)
          ===================================================================== */}
      <section className="relative w-full pt-28 sm:pt-32 md:pt-36 lg:pt-40 pb-16 sm:pb-20 md:pb-24 overflow-hidden">
        {/* Centered Content Container with substantial empty space on left and right */}
        <div className="container mx-auto px-6 sm:px-10 md:px-12 max-w-[1260px] relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">

            {/* Left Column: Refined Editorial Typography */}
            <div className="lg:col-span-5 flex flex-col items-start pr-0 lg:pr-4">

              {/* Eyebrow Label with horizontal line */}
              <div className="flex items-center gap-3.5 mb-5 sm:mb-6">
                <span
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    letterSpacing: '0.24em',
                    textTransform: 'uppercase',
                    color: '#8A857D',
                  }}
                >
                  The Collections
                </span>
                <span className="w-10 sm:w-12 h-[1px] bg-[#D1C9BD]" />
              </div>

              {/* Main Heading: "Different moments. Same feeling." */}
              <h1
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(2.5rem, 4.2vw, 3.85rem)',
                  lineHeight: 1.08,
                  fontWeight: 400,
                  letterSpacing: '-0.025em',
                  color: '#151515',
                  marginBottom: '1.4rem',
                }}
              >
                Different moments.
                <br />
                <span
                  style={{
                    fontStyle: 'italic',
                    fontWeight: 400,
                  }}
                >
                  Same feeling.
                </span>
              </h1>

              {/* Description */}
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'clamp(0.95rem, 1.1vw, 1.05rem)',
                  lineHeight: 1.6,
                  color: '#5C5852',
                  maxWidth: '380px',
                  marginBottom: '2.25rem',
                }}
              >
                Explore our curated photography collections, each designed to tell a different story.
              </p>

              {/* Subtle Scroll to explore widget */}
              <div
                onClick={handleScrollToExplore}
                className="inline-flex items-center gap-2.5 select-none cursor-pointer group"
              >
                <div className="w-[18px] h-[26px] rounded-full border border-[#8C867D] group-hover:border-[#101010] transition-colors flex flex-col items-center justify-center gap-0.5">
                  <span className="text-[7px] leading-none text-[#5C5852] group-hover:text-[#101010]">↑</span>
                  <span className="text-[7px] leading-none text-[#5C5852] group-hover:text-[#101010]">↓</span>
                </div>
                <span
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.72rem',
                    letterSpacing: '0.12em',
                    color: '#4A453D',
                  }}
                  className="group-hover:text-[#101010] transition-colors"
                >
                  Scroll to explore
                </span>
              </div>
            </div>

            {/* Right Column: Small Editorial Image Collage (approx 320px main, 230px second, 160px third) */}
            <div className="lg:col-span-7 relative flex justify-center lg:justify-end items-center min-h-[440px] sm:min-h-[480px] lg:min-h-[500px]">

              {/* Right Vertical Pagination Indicator */}
              <div
                className="hidden xl:flex flex-col items-center gap-2.5 absolute -right-4 lg:-right-8 top-6 z-30 select-none"
                style={{
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '0.625rem',
                  letterSpacing: '0.2em',
                  color: '#8A857D',
                }}
              >
                <span>01 / 08</span>
                <span className="w-[1px] h-8 bg-[#D5CDBC]" />
                <div className="flex flex-col items-center gap-0.5">
                  <button
                    onClick={handlePrevCategory}
                    className="cursor-pointer hover:text-[#101010] transition-colors p-0.5 text-[11px]"
                    aria-label="Previous collection"
                  >
                    ↑
                  </button>
                  <button
                    onClick={handleNextCategory}
                    className="cursor-pointer hover:text-[#101010] transition-colors p-0.5 text-[11px]"
                    aria-label="Next collection"
                  >
                    ↓
                  </button>
                </div>
              </div>

              {/* Collage Box: Spacious CROSS Layout — Photos spread apart with visible gaps */}
              <div className="relative w-full max-w-[580px] h-[500px] sm:h-[540px] mr-0 xl:mr-8">

                {/* Handwritten Cursive Script Annotation */}
                <div
                  className="absolute -top-6 sm:-top-8 -left-2 sm:left-2 z-30 select-none pointer-events-none"
                  style={{
                    transform: 'rotate(-7deg)',
                    fontFamily: 'Caveat, cursive',
                    color: '#7C746B',
                    lineHeight: 1.15,
                  }}
                >
                  <p className="text-xl sm:text-2xl font-medium tracking-wide">Real people</p>
                  <p className="text-xl sm:text-2xl font-medium tracking-wide pl-2 sm:pl-3">Real moments</p>
                  <p className="text-xl sm:text-2xl font-medium tracking-wide pl-4 sm:pl-6">Beautiful stories.</p>

                  {/* Fine curved line flourish */}
                  <svg
                    className="w-24 h-10 -mt-2 ml-10 text-[#C9BFB0] opacity-80"
                    viewBox="0 0 100 45"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.1"
                  >
                    <path d="M10,12 C45,45 65,-10 95,25" strokeLinecap="round" />
                  </svg>
                </div>

                {/* 1. Main Polaroid Card — Center-Left Position */}
                <motion.div
                  initial={{ opacity: 0, y: 20, rotate: 3 }}
                  animate={{ opacity: 1, y: 0, rotate: 3 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ scale: 1.02, rotate: 1.5, zIndex: 28 }}
                  onClick={() => handleSelectCategory('01')}
                  className="absolute left-0 sm:left-4 top-[80px] sm:top-[90px] z-20 w-[220px] sm:w-[250px] md:w-[280px] bg-white p-2.5 sm:p-3 pb-8 sm:pb-9 shadow-[0_20px_40px_-10px_rgba(30,28,24,0.16)] border border-[rgba(215,206,190,0.65)] rounded-[2px] cursor-pointer"
                  style={{ transformOrigin: 'center center' }}
                >
                  <div className="relative w-full aspect-[3/4] overflow-hidden bg-[#E9E4D8]">
                    <img
                      src="/images/hero_polaroid_wedding.jpg"
                      alt="Romantic wedding couple on coastal cliff at sunset"
                      className="w-full h-full object-cover object-center filter brightness-[1.01]"
                      loading="eager"
                    />
                  </div>
                </motion.div>

                {/* 2. Secondary Polaroid Card — Top-Right, Separated with gap */}
                <motion.div
                  initial={{ opacity: 0, y: 25, rotate: -6 }}
                  animate={{ opacity: 1, y: 0, rotate: -6 }}
                  transition={{ duration: 0.8, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ scale: 1.025, rotate: -3.5, zIndex: 28 }}
                  onClick={() => handleSelectCategory('04')}
                  className="absolute right-0 sm:right-4 top-[50px] sm:top-[60px] z-10 w-[175px] sm:w-[195px] md:w-[220px] bg-white p-2 sm:p-2.5 pb-6 sm:pb-7 shadow-[0_18px_36px_-10px_rgba(30,28,24,0.14)] border border-[rgba(215,206,190,0.65)] rounded-[2px] cursor-pointer"
                  style={{ transformOrigin: 'center center' }}
                >
                  <div className="relative w-full aspect-[4/5] overflow-hidden bg-[#E9E4D8]">
                    <img
                      src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop"
                      alt="Hands holding vintage camera in rich monochrome"
                      className="w-full h-full object-cover object-center filter grayscale contrast-110"
                      loading="lazy"
                    />
                  </div>
                </motion.div>

                {/* 3. Small Third Polaroid Card — Bottom-Right, Clear gap from others */}
                <motion.div
                  initial={{ opacity: 0, y: 25, rotate: 5 }}
                  animate={{ opacity: 1, y: 0, rotate: 5 }}
                  transition={{ duration: 0.8, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ scale: 1.03, rotate: 2, zIndex: 28 }}
                  onClick={() => handleSelectCategory('06')}
                  className="absolute right-6 sm:right-10 bottom-0 sm:bottom-[5px] z-20 w-[135px] sm:w-[150px] md:w-[165px] bg-white p-1.5 sm:p-2 pb-5 sm:pb-6 shadow-[0_20px_38px_-10px_rgba(30,28,24,0.15)] border border-[rgba(215,206,190,0.65)] rounded-[2px] cursor-pointer"
                  style={{ transformOrigin: 'center center' }}
                >
                  <div className="relative w-full aspect-square overflow-hidden bg-[#E9E4D8]">
                    <img
                      src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop"
                      alt="Delicate white daisies and summer wildflowers in field"
                      className="w-full h-full object-cover object-center filter brightness-[1.03]"
                      loading="lazy"
                    />
                  </div>
                </motion.div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================================
          2. CATEGORY CARDS RIBBON
          Matches second reference image:
          - Cards are larger and spread apart with generous gaps
          - 3D curved arc perspective (left cards tilt toward viewer, right away)
          - Spacious breathing room between each card
          - Undulating thread line weaving behind cards
          - Cards ~180-200px wide, ~380-420px tall
      {/* =====================================================================
          2. CATEGORY CARDS RIBBON
          Matches Reference Image 2:
          - Cards are compact, slender, centered (124-154px wide, 270-325px tall)
          - Clear, visible gaps (~24-32px) between cards so they never touch
          - Clean separation between Ribbon and Gallery Detail sections
          ===================================================================== */}
      <section
        ref={categoriesRibbonRef}
        id="collection-categories-ribbon"
        className="collections-ribbon-section"
      >
        {/* Delicate decorative curved undulating thread stroke waving across behind the cards */}
        <div className="collections-ribbon-thread">
          <svg className="w-full h-44" viewBox="0 0 1400 160" preserveAspectRatio="none" fill="none">
            {/* Left accent cursive artistic loop */}
            <path
              d="M 32 112 C 8 92, 2 136, 48 136 C 82 136, 96 92, 72 72 C 52 52, 26 72, 36 96"
              stroke="#D2C8B8"
              strokeWidth="0.95"
              strokeDasharray="2 3"
            />
            {/* Undulating thread line matching reference */}
            <path
              d="M 42 96 C 160 140, 250 25, 410 80 C 570 135, 670 20, 830 75 C 970 130, 1070 30, 1210 70 C 1290 85, 1360 60, 1430 75"
              stroke="#D2C8B8"
              strokeWidth="1.1"
            />
          </svg>
        </div>

        {/* Centered container for cards to spread across without edge collision */}
        <div className="relative z-10 mx-auto px-4 sm:px-6 md:px-8 max-w-[1260px]">

          {/* Horizontal Row of 6 Cards — Dedicated CSS track with explicit 24-32px gaps */}
          <div className="collections-ribbon-track">
            {CATEGORIES.map((cat) => {
              const isActive = cat.id === activeCategoryId;

              return (
                <div
                  key={cat.id}
                  className="category-ribbon-card-anchor"
                  style={{
                    transform: cat.cardTransform,
                    transformStyle: 'preserve-3d',
                  }}
                >
                  <motion.div
                    onClick={() => handleSelectCategory(cat.id)}
                    whileHover={{
                      y: -10,
                      scale: 1.025,
                      transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
                    }}
                    className="category-ribbon-card-inner group"
                    style={{
                      ...cat.cardShapeStyle,
                      boxShadow: isActive
                        ? '0 24px 44px -10px rgba(18, 16, 14, 0.38), 0 0 0 2px #101010'
                        : '0 16px 36px -10px rgba(18, 16, 14, 0.22), 0 4px 12px -4px rgba(18, 16, 14, 0.1)',
                    }}
                  >
                    {/* Background Photograph with warm editorial tone */}
                    <img
                      src={cat.coverImage}
                      alt={`${cat.name} Collection`}
                      className="category-ribbon-card-img"
                      loading="lazy"
                    />

                    {/* Dark gradient overlay for bottom legibility matching reference */}
                    <div className="category-ribbon-card-scrim" />

                    {/* Top: Category Number with small underline rule */}
                    <div className="relative z-10 flex flex-col items-start">
                      <span
                        style={{
                          fontFamily: 'var(--font-serif)',
                          fontSize: '1.1rem',
                          color: '#FFFFFF',
                          fontWeight: 400,
                          textShadow: '0 1px 4px rgba(0,0,0,0.5)',
                          opacity: 0.95,
                          lineHeight: 1,
                        }}
                      >
                        {cat.id}
                      </span>
                      <span className="w-4 h-[1px] bg-white/45 mt-1.5" />
                    </div>

                    {/* Bottom: Category Name & Arrow matching reference */}
                    <div className="relative z-10 pt-3">
                      <h3
                        style={{
                          fontFamily: 'var(--font-serif)',
                          fontSize: 'clamp(1.15rem, 1.35vw, 1.35rem)',
                          color: '#FFFFFF',
                          fontWeight: 400,
                          lineHeight: 1.15,
                          marginBottom: '0.25rem',
                          textShadow: '0 2px 8px rgba(0,0,0,0.65)',
                        }}
                      >
                        {cat.name}
                      </h3>

                      {/* Small clean arrow indicator matching reference: —→ */}
                      <div className="flex items-center gap-1.5 text-white/80 group-hover:text-white group-hover:translate-x-1.5 transition-all duration-300">
                        <span className="w-5 h-[1px] bg-current" />
                        <span className="text-[10px] leading-none">→</span>
                      </div>
                    </div>

                  </motion.div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* =====================================================================
          3. WEDDINGS / GALLERY DETAIL SECTION
          Dedicated spacing and alignment:
          - Clean vertical gap from ribbon above
          - Clear ~44px margin between header rule and photo grid
          - Generous ~44px gap between master photo and 2x2 supporting grid
          - Clear ~20px gap between each supporting photo
          ===================================================================== */}
      <section
        ref={galleryRevealRef}
        id="collection-gallery-detail"
        className="collections-gallery-section"
      >
        <div className="container mx-auto px-6 sm:px-10 md:px-12 max-w-[1260px] relative z-10">

          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Header: "01 ──── Weddings ... VIEW ALL →" */}
              <div className="collections-gallery-header">
                <div>
                  <div className="collections-gallery-title-group">
                    <span
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '1.25rem',
                        color: '#101010',
                        fontWeight: 400,
                      }}
                    >
                      {activeCategory.id}
                    </span>
                    <span className="collections-gallery-rule" />
                    <h2
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: 'clamp(2.4rem, 4vw, 3.25rem)',
                        fontWeight: 400,
                        color: '#141414',
                        lineHeight: 1,
                      }}
                    >
                      {activeCategory.name}
                    </h2>
                  </div>

                  <p
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: 'clamp(0.875rem, 1vw, 0.975rem)',
                      color: '#5C5852',
                      maxWidth: '480px',
                    }}
                  >
                    {activeCategory.tagline}
                  </p>
                </div>

                {/* Right: View All Interaction */}
                <div className="flex items-center gap-5">
                  <button
                    onClick={() => setViewAllModalOpen(true)}
                    className="group inline-flex items-center gap-2 font-mono text-[0.7rem] tracking-[0.2em] uppercase text-[#101010] pb-0.5 border-b border-[#101010] hover:opacity-75 transition-all cursor-pointer"
                  >
                    <span>View All</span>
                    <span className="transform transition-transform group-hover:translate-x-1">→</span>
                  </button>
                </div>
              </div>

              {/* Gallery Composition Grid — Spacious Gaps Between Master & Supporting Photos */}
              <div className="collections-gallery-layout">

                {/* LEFT: Large Master Hero Photograph */}
                <div>
                  <div
                    onClick={() => setViewAllModalOpen(true)}
                    className="gallery-master-frame group"
                  >
                    <img
                      src={activeCategory.featured.image}
                      alt={activeCategory.featured.title}
                      className="w-full h-full object-cover object-center filter brightness-[0.98] contrast-[1.02] group-hover:scale-[1.02] transition-transform duration-600 ease-out"
                      loading="lazy"
                    />

                    {/* Gradient Overlay at Bottom */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[rgba(16,16,16,0.85)] via-[rgba(16,16,16,0.2)] to-transparent pointer-events-none" />

                    {/* Bottom-Left & Bottom-Right Content inside Master Frame */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 flex items-end justify-between text-white pointer-events-none">

                      {/* Left: Progress Badge (matching reference '(01) 01 / 06') */}
                      <div className="flex items-center gap-2.5 bg-[rgba(16,16,16,0.55)] backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                        <span className="w-4.5 h-4.5 rounded-full border border-white/40 flex items-center justify-center font-mono text-[0.55rem] text-white">
                          {activeCategory.id}
                        </span>
                        <span className="font-mono text-[0.6rem] tracking-[0.16em] text-white/90">
                          {activeCategory.featured.count}
                        </span>
                        <span className="w-7 h-[1.5px] bg-white/30 relative overflow-hidden">
                          <span className="absolute left-0 top-0 bottom-0 w-1/2 bg-white" />
                        </span>
                      </div>

                      {/* Right: Poetic Italic Quote */}
                      <p
                        style={{
                          fontFamily: 'var(--font-serif)',
                          fontStyle: 'italic',
                          fontSize: 'clamp(0.9rem, 1.2vw, 1.15rem)',
                          color: '#FFFFFF',
                          textShadow: '0 2px 6px rgba(0,0,0,0.6)',
                        }}
                        className="hidden sm:block"
                      >
                        {activeCategory.quote}
                      </p>

                    </div>
                  </div>
                </div>

                {/* RIGHT: 4 Supporting Photographs in 2x2 Grid with Generous Gaps */}
                <div className="gallery-supporting-grid">
                  {activeCategory.supporting.map((item, idx) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.06 + idx * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setViewAllModalOpen(true)}
                      className="gallery-supporting-card group"
                    >
                      <div className="gallery-supporting-card-inner">
                        <img
                          src={item.image}
                          alt={item.tag}
                          className="w-full h-full object-cover object-center filter brightness-[0.98] contrast-[1.02] group-hover:scale-105 transition-transform duration-500 ease-out"
                          loading="lazy"
                        />

                        {/* Subtle hover overlay */}
                        <div className="absolute inset-0 bg-[rgba(16,16,16,0.65)] backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-2.5 sm:p-3 text-white">
                          <span className="font-mono text-[0.55rem] tracking-[0.16em] uppercase text-[#E3DBCC]">
                            Frame 0{idx + 2} / 06
                          </span>
                          <p
                            style={{
                              fontFamily: 'var(--font-serif)',
                              fontSize: '0.8rem',
                              lineHeight: 1.25,
                            }}
                            className="mt-0.5 line-clamp-2 text-white/95"
                          >
                            {item.tag}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Far Right Vertical Arrows Navigation Capsule */}
                <div className="hidden xl:flex flex-col items-center gap-1.5 absolute -right-9 top-1/2 -translate-y-1/2 bg-white/70 backdrop-blur-md p-1.5 rounded-full border border-[#D5CDBC] shadow-sm">
                  <button
                    onClick={handlePrevCategory}
                    className="p-1 cursor-pointer text-[#8A857D] hover:text-[#101010] transition-colors"
                    aria-label="Previous category"
                  >
                    ↑
                  </button>
                  <span className="w-2.5 h-[1px] bg-[#D5CDBC]" />
                  <button
                    onClick={handleNextCategory}
                    className="p-1 cursor-pointer text-[#8A857D] hover:text-[#101010] transition-colors"
                    aria-label="Next category"
                  >
                    ↓
                  </button>
                </div>

              </div>

            </motion.div>
          </AnimatePresence>

        </div>
      </section>

      {/* =====================================================================
          VIEW ALL EDITORIAL ARCHIVAL MODAL
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
              className="absolute inset-0 bg-[rgba(16,16,16,0.86)] backdrop-blur-md"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 w-full max-w-5xl max-h-[92vh] bg-[#FAF8F5] rounded-xl border border-[#E0D8CA] shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 sm:p-8 border-b border-[#E0D8CA] flex items-center justify-between">
                <div>
                  <span className="font-mono text-[0.65rem] tracking-[0.22em] text-[#8A857D] uppercase">
                    Archival Contact Sheet · {activeCategory.id}
                  </span>
                  <h3
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.85rem',
                      color: '#101010',
                      fontWeight: 400,
                    }}
                  >
                    {activeCategory.name} Collection
                  </h3>
                </div>

                <button
                  onClick={() => setViewAllModalOpen(false)}
                  className="w-10 h-10 rounded-full border border-[#D5CDBC] bg-white hover:bg-[#101010] hover:text-white transition-colors flex items-center justify-center text-sm cursor-pointer"
                  aria-label="Close modal"
                >
                  ✕
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 sm:p-8 overflow-y-auto max-h-[calc(92vh-180px)] space-y-8">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-[#7A746B] pb-3 border-b border-[#ECE6DB]">
                  <span>{activeCategory.medium}</span>
                  <span>{activeCategory.location}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                  {/* Featured Frame */}
                  <div className="flex flex-col gap-2">
                    <div className="relative aspect-[4/3] rounded-[3px] overflow-hidden bg-[#1A1917] border border-[#E0D8CA]">
                      <img
                        src={activeCategory.featured.image}
                        alt={activeCategory.featured.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="font-mono text-[0.6rem] uppercase tracking-wider text-[#7A746B]">
                      01 / Master Hero Frame
                    </span>
                  </div>

                  {/* Supporting Frames */}
                  {activeCategory.supporting.map((sup, i) => (
                    <div key={sup.id} className="flex flex-col gap-2">
                      <div className="relative aspect-[4/3] rounded-[3px] overflow-hidden bg-[#1A1917] border border-[#E0D8CA]">
                        <img
                          src={sup.image}
                          alt={sup.tag}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="font-mono text-[0.6rem] uppercase tracking-wider text-[#7A746B]">
                        0{i + 2} / {sup.tag.split('—')[0]}
                      </span>
                    </div>
                  ))}

                  {/* Sixth Frame */}
                  <div className="flex flex-col gap-2">
                    <div className="relative aspect-[4/3] rounded-[3px] overflow-hidden bg-[#1A1917] border border-[#E0D8CA]">
                      <img
                        src={activeCategory.coverImage}
                        alt="Archival Close"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="font-mono text-[0.6rem] uppercase tracking-wider text-[#7A746B]">
                      06 / Atmospheric Close
                    </span>
                  </div>
                </div>

                {/* Consultation CTA Inside Modal */}
                <div className="p-6 rounded-lg bg-[#F0EBE1] border border-[#DDD5C5] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h4
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '1.25rem',
                        color: '#101010',
                      }}
                    >
                      Commission The {activeCategory.name} Collection
                    </h4>
                    <p className="text-xs text-[#5C5852] mt-1">
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
