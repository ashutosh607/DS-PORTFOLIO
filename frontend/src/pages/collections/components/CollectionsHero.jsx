import React from 'react';
import { motion } from 'framer-motion';
import TextBlurReveal from '../../../components/common/TextBlurReveal';

export default function CollectionsHero({
  onScrollToExplore,
  onSelectCategory,
  onPrevCategory,
  onNextCategory,
}) {
  return (
    <section className="relative w-full pt-28 sm:pt-32 md:pt-36 lg:pt-40 pb-16 sm:pb-20 md:pb-24 overflow-hidden">
      {/* Centered Content Container with substantial empty space on left and right */}
      <div className="container mx-auto px-6 sm:px-10 md:px-12 max-w-[1260px] relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">

          {/* Left Column: Refined Editorial Typography */}
          <div className="lg:col-span-5 flex flex-col items-start pr-0 lg:pr-4">

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
                  color: '#8A857D',
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
                color: '#5C5852',
                maxWidth: '380px',
                marginBottom: '2.25rem',
              }}
            />

            {/* Subtle Scroll to explore widget */}
            <div
              onClick={onScrollToExplore}
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

          {/* Right Column: Small Editorial Image Collage */}
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
                  onClick={onPrevCategory}
                  className="cursor-pointer hover:text-[#101010] transition-colors p-0.5 text-[11px]"
                  aria-label="Previous collection"
                >
                  ↑
                </button>
                <button
                  onClick={onNextCategory}
                  className="cursor-pointer hover:text-[#101010] transition-colors p-0.5 text-[11px]"
                  aria-label="Next collection"
                >
                  ↓
                </button>
              </div>
            </div>

            {/* Collage Box: Compact Layout with explicit White Polaroid borders */}
            <div className="relative w-full max-w-[480px] h-[430px] mx-auto lg:mr-4">

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

              {/* 1. Main Polaroid Card — Wedding Couple with Crisp White Border */}
              <motion.div
                initial={{ opacity: 0, y: 20, rotate: 3 }}
                animate={{ opacity: 1, y: 0, rotate: 3 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ scale: 1.02, rotate: 1.5, zIndex: 28 }}
                onClick={() => onSelectCategory('01')}
                className="cursor-pointer"
                style={{
                  position: 'absolute',
                  left: '10px',
                  top: '55px',
                  zIndex: 20,
                  width: '235px',
                  backgroundColor: '#FFFFFF',
                  padding: '10px 10px 34px 10px',
                  boxShadow: '0 18px 38px -8px rgba(25, 22, 18, 0.22), 0 3px 10px rgba(0,0,0,0.06)',
                  border: '1.5px solid #D8CFBF',
                  borderRadius: '2px',
                  transformOrigin: 'center center',
                }}
              >
                <div className="relative w-full aspect-[3/4] overflow-hidden bg-[#E9E4D8] border border-[rgba(0,0,0,0.06)]">
                  <img
                    src="/images/hero_polaroid_wedding.jpg"
                    alt="Romantic wedding couple on coastal cliff at sunset"
                    className="w-full h-full object-cover object-center filter brightness-[1.01]"
                    loading="eager"
                  />
                </div>
              </motion.div>

              {/* 2. Secondary Polaroid Card — Top-Right Vintage Camera with Prominent White Border */}
              <motion.div
                initial={{ opacity: 0, y: 25, rotate: -6 }}
                animate={{ opacity: 1, y: 0, rotate: -6 }}
                transition={{ duration: 0.8, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ scale: 1.025, rotate: -3.5, zIndex: 28 }}
                onClick={() => onSelectCategory('04')}
                className="cursor-pointer"
                style={{
                  position: 'absolute',
                  right: '15px',
                  top: '20px',
                  zIndex: 10,
                  width: '185px',
                  backgroundColor: '#FFFFFF',
                  padding: '10px 10px 28px 10px',
                  boxShadow: '0 18px 38px -8px rgba(25, 22, 18, 0.2), 0 3px 10px rgba(0,0,0,0.06)',
                  border: '1.5px solid #D8CFBF',
                  borderRadius: '2px',
                  transformOrigin: 'center center',
                }}
              >
                <div className="relative w-full aspect-[4/5] overflow-hidden bg-[#E9E4D8] border border-[rgba(0,0,0,0.06)]">
                  <img
                    src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop"
                    alt="Hands holding vintage camera in rich monochrome"
                    className="w-full h-full object-cover object-center filter grayscale contrast-110"
                    loading="lazy"
                  />
                </div>
              </motion.div>

              {/* 3. Small Third Polaroid Card — Bottom-Right Wildflowers with Prominent White Border */}
              <motion.div
                initial={{ opacity: 0, y: 25, rotate: 5 }}
                animate={{ opacity: 1, y: 0, rotate: 5 }}
                transition={{ duration: 0.8, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ scale: 1.03, rotate: 2, zIndex: 28 }}
                onClick={() => onSelectCategory('06')}
                className="cursor-pointer"
                style={{
                  position: 'absolute',
                  right: '35px',
                  bottom: '15px',
                  zIndex: 22,
                  width: '140px',
                  backgroundColor: '#FFFFFF',
                  padding: '8px 8px 24px 8px',
                  boxShadow: '0 18px 38px -8px rgba(25, 22, 18, 0.2), 0 3px 10px rgba(0,0,0,0.06)',
                  border: '1.5px solid #D8CFBF',
                  borderRadius: '2px',
                  transformOrigin: 'center center',
                }}
              >
                <div className="relative w-full aspect-square overflow-hidden bg-[#E9E4D8] border border-[rgba(0,0,0,0.06)]">
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
  );
}
