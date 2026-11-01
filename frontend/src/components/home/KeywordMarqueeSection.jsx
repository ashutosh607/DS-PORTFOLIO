import React from 'react';

const KEYWORDS = [
  'Fine Art Weddings',
  'Pre-Wedding Stories',
  'Editorial Portraits',
  'Cinematic Films',
  'South Mumbai',
  'Bandra & Juhu',
  'Alibaug Coastal',
  'Goa Beachscapes',
  'Rajasthan Palaces',
  'Destinations Worldwide',
  'Archival Medium-Format',
];

export default function KeywordMarqueeSection() {
  return (
    <section
      aria-label="Studio Disciplines and Coverage Locations Marquee"
      className="w-full bg-[#FAF8F5] py-5 sm:py-6 border-y border-[#E3DBCC] overflow-hidden select-none"
    >
      <div className="relative flex overflow-x-hidden">
        {/* Continuous Marquee Track */}
        <div className="animate-marquee-slow flex items-center whitespace-nowrap">
          {KEYWORDS.concat(KEYWORDS).map((keyword, index) => (
            <div key={index} className="flex items-center">
              <span className="font-serif text-[18px] sm:text-[22px] md:text-[24px] font-light tracking-wide text-[#3D3A35] px-4 sm:px-6 hover:text-[#101010] transition-colors">
                {keyword}
              </span>
              <span className="text-[#CBB9A4] text-xs" aria-hidden="true">
                ·
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
