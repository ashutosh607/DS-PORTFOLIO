import React from 'react';
import { motion } from 'framer-motion';

export default function ServicesHero({ onScrollToForm, onStartBooking }) {
  const handleScroll = onScrollToForm || onStartBooking;
  return (
    <section className="relative w-full pt-32 sm:pt-36 md:pt-40 pb-16 sm:pb-24 overflow-hidden bg-[#FAF9F6]">
      {/* Subtle warm ambient atmospheric gradient */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40 select-none"
        style={{
          background: 'radial-gradient(ellipse at 75% 25%, rgba(203, 185, 164, 0.45) 0%, transparent 65%)',
        }}
      />

      <div className="container mx-auto px-6 sm:px-10 md:px-12 max-w-[1280px] relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Left Column: Editorial Headline & Manifesto */}
          <motion.div
            initial={{ opacity: 0, filter: 'blur(8px)', y: 30 }}
            animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 flex flex-col items-start pr-0 lg:pr-6"
          >
            {/* Small uppercase label + thin horizontal line */}
            <div className="flex items-center gap-3.5 mb-6 sm:mb-8">
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  letterSpacing: '0.24em',
                  textTransform: 'uppercase',
                  color: '#7A6E5D',
                }}
              >
                Let's Work Together
              </span>
              <span className="w-12 h-[1px] bg-[#D5CBB9]" />
            </div>

            {/* Main Serif Headline */}
            <h1
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(2.75rem, 5vw, 4.4rem)',
                lineHeight: 1.06,
                fontWeight: 400,
                letterSpacing: '-0.025em',
                color: '#1E1B18',
                marginBottom: '1.75rem',
              }}
            >
              LET'S MAKE
              <br />
              YOUR MOMENTS
              <br />
              <span style={{ fontStyle: 'italic', fontWeight: 400 }}>
                TIMELESS.
              </span>
            </h1>

            {/* Body Description */}
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(1rem, 1.2vw, 1.15rem)',
                lineHeight: 1.65,
                color: '#554E44',
                maxWidth: '460px',
                marginBottom: '2.5rem',
              }}
            >
              Tell us about your celebration, your vision, and the moments that matter to you.
            </p>

            {/* Step Counter Indicator from Reference: 01 / 03 ─────── YOUR STORY */}
            <div className="flex items-center gap-4 pt-2 mb-8 select-none">
              <span
                className="font-mono text-xs sm:text-sm tracking-[0.2em] text-[#1E1B18] font-semibold"
              >
                01 / 03
              </span>
              <span className="w-14 sm:w-20 h-[1.5px] bg-[#C5BAA9]" />
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.75rem',
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: '#6B6256',
                  fontWeight: 600,
                }}
              >
                Your Story
              </span>
            </div>

            {/* Action to scroll directly into the booking form */}
            <button
              onClick={handleScroll}
              className="inline-flex items-center gap-3 bg-[#685444] hover:bg-[#524133] text-[#FAF8F5] px-8 py-3.5 rounded-full font-mono text-xs font-semibold uppercase tracking-[0.2em] transition-all duration-300 shadow-[0_8px_20px_-4px_rgba(104,84,68,0.35)] cursor-pointer group"
            >
              <span>Begin Your Story</span>
              <span className="transform transition-transform duration-300 group-hover:translate-y-0.5">↓</span>
            </button>
          </motion.div>

          {/* Right Column: Printed Photograph with White Border, Rotation & Botanical Accents */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 25 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 relative flex justify-center lg:justify-end items-center min-h-[460px]"
          >
            <div className="relative w-full max-w-[420px] flex justify-center">

              {/* Main Printed Photograph Frame */}
              <div
                className="relative z-10 bg-white p-3 sm:p-3.5 pb-11 sm:pb-12 shadow-[0_24px_55px_-12px_rgba(30,27,24,0.2)] border border-[#E0D8CA] rounded-[2px] cursor-pointer"
                style={{ transform: 'rotate(2deg)' }}
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#ECE7DC] rounded-[1px]">
                  <img
                    src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000&auto=format&fit=crop"
                    alt="Couple on coastal mountain at golden hour"
                    className="w-full h-full object-cover object-center filter brightness-[1.01] contrast-[1.03]"
                    loading="eager"
                  />
                </div>

                <div className="pt-3 px-1 flex items-center justify-between text-[11px] font-mono text-[#8C8070]">
                  <span>Maison Édouard</span>
                  <span>Sunset Promenade</span>
                </div>
              </div>

              {/* Dried Botanical Sprig Tucked Beside Frame */}
              <div className="absolute -right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 pointer-events-none select-none">
                <svg
                  width="75"
                  height="150"
                  viewBox="0 0 70 140"
                  fill="none"
                  className="opacity-80 text-[#8C7E6D]"
                >
                  <path d="M 35 135 Q 25 70, 45 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  <path d="M 33 100 Q 15 90, 20 80" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                  <circle cx="21" cy="78" r="3" fill="currentColor" opacity="0.6" />
                  <path d="M 32 70 Q 52 60, 48 48" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                  <circle cx="49" cy="46" r="3.5" fill="currentColor" opacity="0.6" />
                  <path d="M 40 40 Q 25 30, 28 20" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                  <circle cx="29" cy="18" r="3" fill="currentColor" opacity="0.6" />
                  <circle cx="46" cy="8" r="3" fill="currentColor" opacity="0.6" />
                </svg>
              </div>

              {/* Handwritten Script Annotation matching reference */}
              <div
                className="absolute -right-4 sm:-right-8 top-12 z-30 select-none pointer-events-none"
                style={{
                  transform: 'rotate(-8deg)',
                  fontFamily: 'Caveat, cursive',
                  color: '#554E44',
                  lineHeight: 1.25,
                }}
              >
                <p className="text-2xl sm:text-3xl font-bold tracking-wide">Real moments.</p>
                <p className="text-2xl sm:text-3xl font-bold tracking-wide pl-3">Real emotions.</p>
                <p className="text-2xl sm:text-3xl font-bold tracking-wide pl-6">Beautiful stories.</p>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
