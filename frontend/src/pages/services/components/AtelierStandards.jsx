import React from 'react';

export default function AtelierStandards() {
  const standards = [
    {
      num: '01',
      title: 'Traditional Photography',
      description: 'Comprehensive coverage capturing sacred rituals, family portraits, and authentic emotional moments.',
    },
    {
      num: '02',
      title: 'Traditional Videography',
      description: 'Multi-angle cinematic documentation preserving the vows, ceremonies, and festive celebrations in high definition.',
    },
    {
      num: '03',
      title: 'Album — 300 Selected Photos',
      description: 'A bespoke handcrafted heirloom album featuring 300 individually retouched master photographs on fine art paper.',
    },
  ];

  return (
    <section
      style={{
        paddingTop: 'clamp(100px, 10vw, 140px)',
        paddingBottom: 'clamp(100px, 10vw, 140px)',
      }}
      className="border-t border-[#E3DBCC]/80"
    >
      {/* Centered Section Header */}
      <div className="text-center max-w-xl mx-auto mb-16 sm:mb-20">
        <span className="font-sans text-[9px] sm:text-[10px] font-semibold tracking-[0.25em] text-[#7A7770] uppercase block mb-3">
          ATELIER STANDARDS
        </span>

        <h2
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2.2rem, 3.5vw, 3rem)',
            lineHeight: 1.15,
            fontWeight: 400,
            color: 'var(--color-obsidian)',
            marginBottom: '1rem',
          }}
        >
          Every Commission Includes
        </h2>

        <p className="font-serif italic text-sm sm:text-base text-[#7A7770] leading-relaxed max-w-md mx-auto">
          Regardless of your selected suite, every client receives sovereign attention and artisanal laboratory post-production.
        </p>
      </div>

      {/* 3-Column Editorial Manifesto Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 sm:gap-14 lg:gap-[70px]">
        {standards.map((item, idx) => (
          <div key={idx} className="space-y-3">
            <span className="font-sans text-xs font-semibold text-[#7A7770] tracking-[0.2em] block">
              [{item.num}]
            </span>
            <h3
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.35rem',
                color: 'var(--color-obsidian)',
                fontWeight: 400,
                lineHeight: 1.25,
              }}
            >
              {item.title}
            </h3>
            <p className="font-sans text-xs sm:text-[13px] text-[#5C5852] leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
