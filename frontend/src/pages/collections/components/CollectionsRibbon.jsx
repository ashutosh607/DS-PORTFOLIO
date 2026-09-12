import React from 'react';
import { motion } from 'framer-motion';

export default function CollectionsRibbon({
  categories,
  activeCategoryId,
  onSelectCategory,
  ribbonRef,
}) {
  return (
    <section
      ref={ribbonRef}
      id="collection-categories-ribbon"
      className="relative w-full overflow-visible"
      style={{
        marginTop: 'clamp(2.5rem, 5vw, 4.5rem)',
        paddingTop: '1.5rem',
        paddingBottom: 'clamp(4.5rem, 7vw, 6.5rem)',
      }}
    >
      {/* Delicate decorative curved undulating thread stroke waving across behind the cards */}
      <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 pointer-events-none select-none z-0 w-full">
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

      {/* Centered container for cards */}
      <div
        className="relative z-10 w-full flex justify-center items-center px-4 mx-auto"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          margin: '0 auto',
        }}
      >
        {/* Horizontal Row of 6 Cards — Centered */}
        <div
          className="relative z-10 flex flex-nowrap justify-center items-end py-5 px-2 w-max max-w-full mx-auto"
          style={{
            display: 'flex',
            flexWrap: 'nowrap',
            justifyContent: 'center',
            alignItems: 'flex-end',
            gap: 'clamp(12px, 1.8vw, 24px)',
            perspective: '1400px',
            perspectiveOrigin: '50% 50%',
            padding: '1.25rem 0.5rem',
            width: 'max-content',
            maxWidth: '100%',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          {categories.map((cat) => {
            const isActive = cat.id === activeCategoryId;

            return (
              <div
                key={cat.id}
                className="flex-none [transform-style:preserve-3d] [will-change:transform]"
                style={{
                  flex: '0 0 auto',
                  width: 'clamp(124px, 11vw, 154px)',
                  transform: cat.cardTransform,
                  transformStyle: 'preserve-3d',
                  willChange: 'transform',
                }}
              >
                <motion.div
                  onClick={() => onSelectCategory(cat.id)}
                  whileHover={{
                    y: -10,
                    scale: 1.025,
                    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
                  }}
                  className="group relative w-full overflow-hidden flex flex-col justify-between cursor-pointer select-none bg-[#1A1816] border border-[#1C1A17] transition-[box-shadow] duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{
                    borderRadius: '9999px 9999px 4px 4px',
                    height: 'clamp(270px, 25vw, 325px)',
                    padding: 'clamp(1.1rem, 1.5vw, 1.35rem) clamp(0.85rem, 1.2vw, 1.1rem) clamp(0.85rem, 1.2vw, 1.1rem)',
                    boxShadow: isActive
                      ? '0 24px 44px -10px rgba(18, 16, 14, 0.42), 0 0 0 2px #101010'
                      : '0 16px 36px -10px rgba(18, 16, 14, 0.22), 0 4px 12px -4px rgba(18, 16, 14, 0.1)',
                  }}
                >
                  {/* Background Photograph with warm editorial tone */}
                  <img
                    src={cat.coverImage}
                    alt={`${cat.name} Collection`}
                    className="absolute inset-0 w-full h-full object-cover object-center transition-[transform,filter] duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 [filter:sepia(0.06)_contrast(1.04)_brightness(0.92)] group-hover:[filter:sepia(0)_contrast(1.06)_brightness(0.98)]"
                    loading="lazy"
                  />

                  {/* Dark gradient overlay for bottom legibility matching reference */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        'linear-gradient(to bottom, rgba(16, 16, 16, 0.2) 0%, rgba(16, 16, 16, 0) 30%, rgba(16, 16, 16, 0.55) 70%, rgba(16, 16, 16, 0.9) 100%)',
                    }}
                  />

                  {/* Top: Category Number with small underline rule */}
                  <div className="relative z-10 flex flex-col items-start pt-1">
                    <span
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '1.15rem',
                        color: '#FFFFFF',
                        fontWeight: 400,
                        textShadow: '0 1px 4px rgba(0,0,0,0.5)',
                        opacity: 0.95,
                        lineHeight: 1,
                      }}
                    >
                      {cat.id}
                    </span>
                    <span className="w-5 h-[1px] bg-white/55 mt-1.5" />
                  </div>

                  {/* Bottom: Category Name & Arrow matching reference */}
                  <div className="relative z-10 pt-3 pb-0.5">
                    <h3
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: 'clamp(1.15rem, 1.35vw, 1.35rem)',
                        color: '#FFFFFF',
                        fontWeight: 400,
                        lineHeight: 1.15,
                        marginBottom: '0.35rem',
                        textShadow: '0 2px 8px rgba(0,0,0,0.65)',
                      }}
                    >
                      {cat.name}
                    </h3>

                    {/* Small clean arrow indicator matching reference: —→ */}
                    <div className="flex items-center gap-1.5 text-white/80 group-hover:text-white group-hover:translate-x-1.5 transition-all duration-300">
                      <span className="w-6 h-[1px] bg-current" />
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
  );
}
