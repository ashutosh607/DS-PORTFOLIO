import React from 'react';

export default function CollectionTierCard({
  collection,
  isSelected,
  onSelectAndBook,
}) {
  const isSignature =
    collection.highlight ||
    collection.isAtelierChoice ||
    collection.id.includes('signature');

  // Curated deliverables with comfortable fallback
  const deliverablesList =
    collection.deliverables && collection.deliverables.length > 0
      ? collection.deliverables
      : [
          'Lead principal photographer + associate',
          'Archival master proofing gallery & print release',
          '35mm analog film rolls (Portra 400)',
          'Archival presentation folio in Belgian linen',
        ];

  const shortDescription = collection.description || collection.subtitle;

  const handleClick = (e) => {
    e.preventDefault();
    if (isSelected) {
      // Already selected: continue to Stage 02 booking
      onSelectAndBook(collection.id, true);
    } else {
      // Select this collection while remaining in Stage 01
      onSelectAndBook(collection.id, false);
    }
  };

  return (
    <div
      className={`group relative h-auto min-h-full flex flex-col justify-between rounded-2xl p-7 sm:p-9 lg:p-10 transition-all duration-400 ease-out ${
        isSelected
          ? 'bg-[#FAF8F5] border border-[#101010] shadow-[0_8px_30px_-6px_rgba(16,16,16,0.09)] -translate-y-1'
          : isSignature
          ? 'bg-[#FAF8F5] border border-[#D5CBB9] shadow-[0_4px_24px_-8px_rgba(16,16,16,0.04)] hover:border-[#101010]/50 hover:-translate-y-1 hover:shadow-[0_12px_32px_-8px_rgba(16,16,16,0.07)]'
          : 'bg-[#FDFCF8] border border-[#E3DBCC] shadow-[0_2px_18px_-6px_rgba(16,16,16,0.03)] hover:border-[#C5B7A4] hover:-translate-y-1 hover:shadow-[0_12px_32px_-8px_rgba(16,16,16,0.06)]'
      }`}
    >
      <div>
        {/* =========================================================
            LINE 1: EYEBROW & FOLIO (Followed by generous gap)
            ========================================================= */}
        <div className="flex items-center justify-between gap-2 mb-5">
          <div className="flex items-center gap-2">
            {isSelected ? (
              <span className="text-[9.5px] font-sans font-semibold tracking-[0.24em] uppercase text-[#101010] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#101010]" />
                <span>SELECTED COLLECTION</span>
              </span>
            ) : isSignature ? (
              <span className="text-[9.5px] font-sans font-semibold tracking-[0.24em] uppercase text-[#7A7770]">
                ★ Atelier Choice
              </span>
            ) : (
              <span className="font-sans text-[9.5px] font-semibold tracking-[0.24em] text-[#7A7770] uppercase">
                {collection.tag}
              </span>
            )}
          </div>

          <span
            className={`text-[9.5px] font-sans tracking-wider px-2.5 py-0.5 rounded-full transition-colors ${
              isSelected
                ? 'bg-[#101010] text-[#FDFCF8]'
                : 'bg-[#F3F0E9] text-[#7A7770]'
            }`}
          >
            {collection.folio}
          </span>
        </div>

        {/* =========================================================
            LINE 2: COLLECTION TITLE (Followed by clear gap)
            ========================================================= */}
        <h3
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(1.65rem, 1.85vw, 1.95rem)',
            letterSpacing: '0.04em',
            lineHeight: 1.15,
            fontWeight: 400,
            color: 'var(--color-obsidian)',
            textTransform: 'uppercase',
            marginBottom: '14px',
          }}
        >
          {collection.title}
        </h3>

        {/* =========================================================
            LINE 3: ITALIC SUBTITLE (Followed by gap before image)
            ========================================================= */}
        <p className="font-serif italic text-xs sm:text-[13.5px] text-[#7A7770] leading-relaxed mb-6 sm:mb-7">
          {collection.subtitle}
        </p>

        {/* =========================================================
            LINE 4: PHOTOGRAPHY AREA
            - Inset with padding from left, right, top, and bottom
            - Strictly DOES NOT TOUCH the borders of the card
            ========================================================= */}
        <div className="w-full px-2 sm:px-3 lg:px-4 my-7 sm:my-9">
          <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-[#F3F0E9] border border-[#E3DBCC]/80 shadow-[0_4px_16px_rgba(16,16,16,0.04)]">
            <img
              src={collection.image}
              alt={collection.title}
              className="w-full h-full object-cover object-center filter brightness-[0.98] contrast-[1.02] transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

            <div className="absolute bottom-3 left-3.5 flex items-center gap-1.5 text-white/95 text-[9.5px] font-sans font-medium tracking-wide drop-shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-white/90" />
              <span>{collection.imageLabel || 'Archive Specimen'}</span>
            </div>

            {collection.imageBadge && (
              <div className="absolute bottom-3 right-3.5 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white text-[8px] font-sans tracking-wider uppercase drop-shadow-sm">
                {collection.imageBadge}
              </div>
            )}
          </div>
        </div>

        {/* =========================================================
            LINE 5: COMMISSION INVESTMENT LABEL (Followed by gap)
            ========================================================= */}
        <span className="block font-sans text-[9px] font-semibold tracking-[0.24em] text-[#7A7770] uppercase mb-3">
          COMMISSION INVESTMENT
        </span>

        {/* =========================================================
            LINE 6: PRICE (Followed by gap)
            ========================================================= */}
        <div
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.55rem',
            color: 'var(--color-obsidian)',
            lineHeight: 1.15,
            fontWeight: 400,
            marginBottom: '8px',
          }}
        >
          {collection.price}
        </div>

        {/* =========================================================
            LINE 7: PRICE NOTE (Followed by medium gap)
            ========================================================= */}
        {collection.priceNote && (
          <p className="font-sans text-[11px] text-[#7A7770] leading-snug mb-5 sm:mb-6">
            {collection.priceNote}
          </p>
        )}

        {/* =========================================================
            LINE 8: SHORT DESCRIPTION (Followed by LARGE gap before divider)
            ========================================================= */}
        <p className="font-serif italic text-xs sm:text-[13.5px] text-[#55534E] leading-[1.75] mb-8 sm:mb-9">
          {shortDescription}
        </p>

        {/* =========================================================
            SUBTLE DIVIDER ABOVE DELIVERABLES
            ========================================================= */}
        <div className="border-t border-[#E3DBCC]/70 pt-7 sm:pt-8">
          {/* =========================================================
              LINE 9: INCLUDED DELIVERABLES HEADING (Followed by gap)
              ========================================================= */}
          <span className="block font-sans text-[9px] font-semibold tracking-[0.24em] text-[#7A7770] uppercase mb-4 sm:mb-5">
            {collection.deliverablesHeading ||
              (isSignature ? 'INCLUDED ATELIER PRIVILEGES' : 'INCLUDED DELIVERABLES')}
          </span>

          {/* =========================================================
              LINE 10: DELIVERABLE BULLETS (Comfortable gaps between each line)
              ========================================================= */}
          <div className="space-y-3.5 sm:space-y-4">
            {deliverablesList.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 text-xs font-sans text-[#3E3C38] leading-[1.65]"
              >
                <span className="text-[#C5B9A5] text-xs shrink-0 mt-0.5">•</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* =========================================================
          LINE 11: CTA BUTTON (Separated with generous gap above, 
          plus card container padding below)
          ========================================================= */}
      <div className="mt-auto pt-9 sm:pt-11">
        <button
          type="button"
          onClick={handleClick}
          className={`w-full py-3.5 px-6 rounded-full font-sans text-xs font-medium uppercase tracking-[0.14em] transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer group/btn ${
            isSelected
              ? 'bg-[#101010] text-[#FDFCF8] border border-[#101010] shadow-[0_4px_14px_rgba(16,16,16,0.14)] hover:bg-[#2A2825]'
              : 'bg-[#FAF7F2] hover:bg-[#F3EFE6] text-[#101010] border border-[#E3DBCC] hover:border-[#C5B9A5]'
          }`}
        >
          {isSelected ? (
            <>
              <span>SELECTED · CONTINUE TO BOOKING</span>
              <span className="transition-transform duration-300 ease-out group-hover/btn:translate-x-1">
                →
              </span>
            </>
          ) : (
            <>
              <span>SELECT &amp; BOOK</span>
              <span className="transition-transform duration-300 ease-out group-hover/btn:translate-x-1">
                →
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
