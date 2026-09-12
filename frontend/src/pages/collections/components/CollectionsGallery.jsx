import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CollectionsGallery({
  activeCategory,
  onOpenViewAll,
  onPrevCategory,
  onNextCategory,
  galleryRef,
}) {
  return (
    <section
      ref={galleryRef}
      id="collection-gallery-detail"
      className="relative w-full [scroll-margin-top:100px]"
      style={{
        paddingTop: 'clamp(2.5rem, 4.5vw, 4rem)',
        paddingBottom: 'clamp(6rem, 9vw, 9rem)',
      }}
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
            <div
              className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-[#E2DACD]"
              style={{
                marginBottom: 'clamp(2.25rem, 3.8vw, 3.5rem)',
              }}
            >
              <div>
                <div className="flex items-center gap-4 mb-2">
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
                  <span
                    className="h-[1px] bg-[#D1C8B8]"
                    style={{
                      width: 'clamp(36px, 5vw, 64px)',
                    }}
                  />
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
                  onClick={onOpenViewAll}
                  className="group inline-flex items-center gap-2 font-mono text-[0.7rem] tracking-[0.2em] uppercase text-[#101010] pb-0.5 border-b border-[#101010] hover:opacity-75 transition-all cursor-pointer"
                >
                  <span>View All</span>
                  <span className="transform transition-transform group-hover:translate-x-1">→</span>
                </button>
              </div>
            </div>

            {/* Gallery Composition Grid — Spacious Gaps Between Master & Supporting Photos */}
            <div
              className="grid grid-cols-1 lg:[grid-template-columns:7fr_5fr] items-start relative"
              style={{
                gap: 'clamp(2rem, 3.5vw, 3.5rem)',
              }}
            >
              {/* LEFT: Large Master Hero Photograph */}
              <div>
                <div
                  onClick={onOpenViewAll}
                  className="group relative w-full aspect-[16/10.5] rounded-[4px] overflow-hidden bg-[#1D1C19] border border-[#E0D8CA] shadow-[0_20px_45px_-12px_rgba(20,18,15,0.16)] cursor-pointer"
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
              <div
                className="grid grid-cols-2"
                style={{
                  gap: 'clamp(14px, 1.8vw, 22px)',
                }}
              >
                {activeCategory.supporting.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.06 + idx * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={onOpenViewAll}
                    className="group relative bg-white rounded-[4px] border border-[#E2DACD] shadow-[0_10px_24px_-8px_rgba(20,18,15,0.08)] overflow-hidden cursor-pointer transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:shadow-[0_16px_32px_-10px_rgba(20,18,15,0.15)]"
                    style={{
                      padding: 'clamp(6px, 0.8vw, 8px)',
                    }}
                  >
                    <div className="relative w-full aspect-[4/3] overflow-hidden rounded-[2px] bg-[#ECE7DC]">
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
                  onClick={onPrevCategory}
                  className="p-1 cursor-pointer text-[#8A857D] hover:text-[#101010] transition-colors"
                  aria-label="Previous category"
                >
                  ↑
                </button>
                <span className="w-2.5 h-[1px] bg-[#D5CDBC]" />
                <button
                  onClick={onNextCategory}
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
  );
}
