import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function CollectionsRibbon({
  categories,
  activeCategoryId,
  onSelectCategory,
  ribbonRef,
}) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 1024 : false
  );
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(typeof window !== 'undefined' && window.innerWidth < 1024);
    };
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -220, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 220, behavior: 'smooth' });
    }
  };

  const handleSelectAndScroll = (id) => {
    onSelectCategory(id);
    if (scrollContainerRef.current) {
      const targetCard = scrollContainerRef.current.querySelector(`[data-category-id="${id}"]`);
      if (targetCard) {
        targetCard.scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'nearest',
        });
      }
    }
  };

  return (
    <section
      ref={ribbonRef}
      id="collection-categories-ribbon"
      className="relative w-full overflow-visible"
      style={{
        marginTop: 'clamp(2.5rem, 4.5vw, 4.5rem)',
        paddingTop: '1rem',
        paddingBottom: 'clamp(4rem, 6.5vw, 6.5rem)',
      }}
    >
      {/* Delicate decorative curved undulating thread stroke waving across behind the cards */}
      <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 pointer-events-none select-none z-0 w-full hidden md:block">
        <svg className="w-full h-44" viewBox="0 0 1400 160" preserveAspectRatio="none" fill="none">
          <path
            d="M 32 112 C 8 92, 2 136, 48 136 C 82 136, 96 92, 72 72 C 52 52, 26 72, 36 96"
            stroke="#D2C8B8"
            strokeWidth="0.95"
            strokeDasharray="2 3"
          />
          <path
            d="M 42 96 C 160 140, 250 25, 410 80 C 570 135, 670 20, 830 75 C 970 130, 1070 30, 1210 70 C 1290 85, 1360 60, 1430 75"
            stroke="#D2C8B8"
            strokeWidth="1.1"
          />
        </svg>
      </div>

      {/* Mobile Top Controls: Title + Prev/Next Arrow Buttons */}
      <div className="flex lg:hidden items-center justify-between px-5 mb-3">
        <span className="font-mono text-[10px] tracking-[0.24em] text-[#7A6E5D] uppercase">
          Categories ({categories.length})
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleScrollLeft}
            aria-label="Previous categories"
            className="w-8 h-8 rounded-full border border-[#D2C8B8] bg-[#FAF8F5] text-[#101010] flex items-center justify-center text-xs active:scale-90 transition-transform shadow-sm cursor-pointer"
          >
            ←
          </button>
          <button
            type="button"
            onClick={handleScrollRight}
            aria-label="Next categories"
            className="w-8 h-8 rounded-full border border-[#D2C8B8] bg-[#FAF8F5] text-[#101010] flex items-center justify-center text-xs active:scale-90 transition-transform shadow-sm cursor-pointer"
          >
            →
          </button>
        </div>
      </div>

      {/* Scrollable Container on Mobile, Perfectly Centered All-Card Row on Laptop/Desktop */}
      <div
        ref={scrollContainerRef}
        className="collections-ribbon-scroll-container relative z-10 w-full overflow-x-auto overflow-y-visible flex justify-start lg:justify-center items-center px-4 sm:px-6 lg:px-4"
        style={{
          display: 'flex',
          overflowX: 'auto',
          overflowY: 'visible',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {/* Horizontal Row of Cards */}
        <div
          className="relative z-10 flex flex-nowrap items-end py-5 px-1 min-w-max lg:mx-auto"
          style={{
            display: 'flex',
            flexWrap: 'nowrap',
            alignItems: 'flex-end',
            gap: 'clamp(12px, 1.6vw, 22px)',
            perspective: '1400px',
            perspectiveOrigin: '50% 50%',
            padding: '1.25rem 0.5rem',
            width: 'max-content',
          }}
        >
          {categories.map((cat, index) => {
            const isActive = cat.id === activeCategoryId;
            const isLeft = index < 3;
            // 3 cards sweep in from left (0, 1, 2) and 3 from right (3, 4, 5) on laptop/desktop
            const initialX = isLeft ? -160 - (2 - index) * 40 : 160 + (index - 3) * 40;
            const delay = isLeft ? index * 0.12 : (5 - index) * 0.12;

            return (
              <div
                key={cat.id}
                data-category-id={cat.id}
                className="flex-none"
                style={{
                  flex: '0 0 auto',
                  width: 'clamp(142px, 11vw, 154px)',
                  scrollSnapAlign: 'start',
                }}
              >
                <motion.div
                  initial={isMobile ? { opacity: 1, x: 0 } : { opacity: 0, x: initialX }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={
                    isMobile
                      ? { duration: 0 }
                      : { duration: 0.85, delay: delay, ease: [0.16, 1, 0.3, 1] }
                  }
                  className="w-full [transform-style:preserve-3d] [will-change:transform]"
                  style={{
                    transform: cat.cardTransform,
                    transformStyle: 'preserve-3d',
                  }}
                >
                  <motion.div
                    onClick={() => handleSelectAndScroll(cat.id)}
                    whileHover={{
                      y: -10,
                      scale: 1.025,
                      transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
                    }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative w-full overflow-hidden flex flex-col justify-between cursor-pointer select-none bg-[#1A1816] border transition-all duration-350"
                    style={{
                      borderRadius: '9999px 9999px 4px 4px',
                      height: 'clamp(270px, 24vw, 325px)',
                      padding: 'clamp(1.1rem, 1.5vw, 1.35rem) clamp(0.85rem, 1.2vw, 1.1rem) clamp(0.85rem, 1.2vw, 1.1rem)',
                      borderColor: isActive ? '#101010' : '#2A2622',
                      boxShadow: isActive
                        ? '0 24px 44px -10px rgba(18, 16, 14, 0.48), 0 0 0 2px #101010'
                        : '0 14px 32px -10px rgba(18, 16, 14, 0.22)',
                    }}
                  >
                    {/* Background Photograph — crystal sharp */}
                    <img
                      src={cat.coverImage}
                      alt={`${cat.name} Collection`}
                      className="absolute inset-0 w-full h-full object-cover object-center transition-[transform] duration-500 ease-out group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Dark gradient overlay for typography readability */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          'linear-gradient(to bottom, rgba(16, 16, 16, 0.28) 0%, rgba(16, 16, 16, 0.04) 30%, rgba(16, 16, 16, 0.58) 68%, rgba(16, 16, 16, 0.92) 100%)',
                      }}
                    />

                    {/* Top: Category Number with underline indicator */}
                    <div className="relative z-10 flex flex-col items-start pt-1">
                      <span
                        style={{
                          fontFamily: 'var(--font-serif)',
                          fontSize: '1.15rem',
                          color: '#FFFFFF',
                          fontWeight: 500,
                          textShadow: '0 1px 4px rgba(0,0,0,0.7)',
                          lineHeight: 1,
                        }}
                      >
                        {cat.id}
                      </span>
                      <span
                        className="h-[1.5px] mt-1.5 transition-all duration-300"
                        style={{
                          backgroundColor: isActive ? '#FFFFFF' : 'rgba(255,255,255,0.45)',
                          width: isActive ? '24px' : '16px',
                        }}
                      />
                    </div>

                    {/* Bottom: Category Name & Arrow */}
                    <div className="relative z-10 pt-3 pb-0.5">
                      <h3
                        style={{
                          fontFamily: 'var(--font-serif)',
                          fontSize: 'clamp(1.15rem, 1.3vw, 1.35rem)',
                          color: '#FFFFFF',
                          fontWeight: 400,
                          lineHeight: 1.15,
                          marginBottom: '0.35rem',
                          textShadow: '0 2px 8px rgba(0,0,0,0.85)',
                        }}
                      >
                        {cat.name}
                      </h3>

                      <div className="flex items-center gap-1.5 text-white/80 group-hover:text-white group-hover:translate-x-1.5 transition-all duration-300">
                        <span className="w-6 h-[1px] bg-current" />
                        <span className="text-[10px] leading-none">→</span>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Interactive Category Quick-Tabs */}
      <div className="flex lg:hidden items-center justify-center gap-1.5 mt-4 px-4 flex-wrap select-none">
        {categories.map((cat) => {
          const isActive = cat.id === activeCategoryId;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleSelectAndScroll(cat.id)}
              className={`font-sans text-[10px] uppercase tracking-[0.14em] px-2.5 py-1 rounded-full transition-all duration-300 cursor-pointer ${
                isActive
                  ? 'bg-[#101010] text-[#FDFCF8] font-medium shadow-sm'
                  : 'bg-[#EAE4D8] text-[#6B655B] hover:bg-[#DDD6C8]'
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      <style>{`
        .collections-ribbon-scroll-container::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
