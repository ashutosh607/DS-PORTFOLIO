import React from 'react';

export default function CollectionTierCard({
  collection,
  isSelected,
  onSelectAndBook,
}) {
  const cardId = collection.id || collection.tier || collection._id;
  const isSignature =
    collection.highlight ||
    collection.isAtelierChoice ||
    collection.isRecommended ||
    (collection.tier && collection.tier.toLowerCase() === 'signature') ||
    (collection.id && collection.id.toLowerCase().includes('signature'));

  // Deliverables fallback
  const deliverablesList =
    collection.deliverables && collection.deliverables.length > 0
      ? collection.deliverables
      : [
          'Lead principal photographer + associate',
          'Archival master proofing gallery & print release',
          '35mm analog film rolls (Portra 400)',
          'Archival presentation folio in Belgian linen',
        ];

  const title = collection.title || collection.eyebrow || 'Collection';
  const subtitle = collection.subtitle || '';
  const shortDescription = collection.description || subtitle;
  const imageSrc = collection.image || collection.imageUrl;
  const imageLabel = collection.imageLabel || collection.imageTag || 'Archive Specimen';
  const folioLabel = collection.folio || collection.folioLabel || 'Folio';

  // Format price
  let displayPrice = collection.price;
  if (typeof collection.price === 'number') {
    displayPrice = `₹${collection.price.toLocaleString('en-IN')}`;
  } else if (!collection.price && collection.price !== 0) {
    displayPrice = 'Price to be added';
  }

  const handleClick = (e) => {
    e.preventDefault();
    if (isSelected) {
      // Already selected: continue to Stage 02 booking
      onSelectAndBook(cardId, true);
    } else {
      // Select this collection while remaining in Stage 01
      onSelectAndBook(cardId, false);
    }
  };

  return (
    <div
      className={`group relative h-full flex flex-col justify-between rounded-2xl p-7 sm:p-9 lg:p-10 transition-all duration-300 ease-out ${
        isSelected
          ? 'bg-[#FAF8F5] border border-[#101010] shadow-[0_8px_30px_-6px_rgba(16,16,16,0.09)] -translate-y-1'
          : isSignature
          ? 'bg-[#FAF8F5] border border-[#D5CBB9] shadow-[0_4px_24px_-8px_rgba(16,16,16,0.04)] hover:border-[#101010]/50 hover:-translate-y-1 hover:shadow-[0_12px_32px_-8px_rgba(16,16,16,0.07)]'
          : 'bg-[#FDFCF8] border border-[#E3DBCC] shadow-[0_2px_18px_-6px_rgba(16,16,16,0.03)] hover:border-[#C5B7A4] hover:-translate-y-1 hover:shadow-[0_12px_32px_-8px_rgba(16,16,16,0.06)]'
      }`}
    >
      <div className="flex-1">
        {/* =========================================================
            LINE 1: EYEBROW & FOLIO / BADGE (No clipping, flex header)
            ========================================================= */}
        <div className="flex items-center justify-between gap-3 mb-5">
          <div className="min-w-0 flex-1">
            {isSelected ? (
              <span className="text-[9.5px] font-sans font-semibold tracking-[0.22em] uppercase text-[#101010] flex items-center gap-1.5 truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-[#101010] shrink-0" />
                <span className="truncate">SELECTED COLLECTION</span>
              </span>
            ) : isSignature ? (
              <span className="text-[9.5px] font-sans font-semibold tracking-[0.22em] uppercase text-[#7A7770] flex items-center gap-1 truncate">
                <span className="text-[#C2A378]">★</span>
                <span className="truncate">{collection.badge || 'Atelier Choice'}</span>
              </span>
            ) : (
              <span className="font-sans text-[9.5px] font-semibold tracking-[0.22em] text-[#7A7770] uppercase block truncate">
                {collection.tag || collection.badge || 'ATELIER SUITE'}
              </span>
            )}
          </div>

          <span
            className={`text-[9.5px] font-sans tracking-wider px-3 py-1 rounded-full shrink-0 whitespace-nowrap transition-colors ${
              isSelected
                ? 'bg-[#101010] text-[#FDFCF8]'
                : 'bg-[#F3F0E9] text-[#7A7770]'
            }`}
          >
            {folioLabel}
          </span>
        </div>

        {/* =========================================================
            LINE 2: COLLECTION TITLE
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
          {title}
        </h3>

        {/* =========================================================
            LINE 3: ITALIC SUBTITLE
            ========================================================= */}
        {subtitle && (
          <p className="font-serif italic text-xs sm:text-[13.5px] text-[#7A7770] leading-relaxed mb-6 sm:mb-7">
            {subtitle}
          </p>
        )}

        {/* =========================================================
            LINE 4: PHOTOGRAPHY AREA
            ========================================================= */}
        {imageSrc && (
          <div className="w-full px-1 sm:px-2 lg:px-3 my-6 sm:my-8">
            <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-[#F3F0E9] border border-[#E3DBCC]/80 shadow-[0_4px_16px_rgba(16,16,16,0.04)]">
              <img
                src={imageSrc}
                alt={title}
                className="w-full h-full object-cover object-center filter brightness-[0.98] contrast-[1.02] transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

              <div className="absolute bottom-3 left-3.5 flex items-center gap-1.5 text-white/95 text-[9.5px] font-sans font-medium tracking-wide drop-shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-white/90 shrink-0" />
                <span className="truncate max-w-[180px]">{imageLabel}</span>
              </div>

              {collection.imageBadge && (
                <div className="absolute bottom-3 right-3.5 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white text-[8px] font-sans tracking-wider uppercase drop-shadow-sm shrink-0">
                  {collection.imageBadge}
                </div>
              )}
            </div>
          </div>
        )}

        {/* =========================================================
            LINE 5: COMMISSION INVESTMENT LABEL
            ========================================================= */}
        <span className="block font-sans text-[9px] font-semibold tracking-[0.24em] text-[#7A7770] uppercase mb-3">
          COMMISSION INVESTMENT
        </span>

        {/* =========================================================
            LINE 6: PRICE
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
          {displayPrice}
        </div>

        {/* =========================================================
            LINE 7: PRICE NOTE
            ========================================================= */}
        {collection.priceNote && (
          <p className="font-sans text-[11px] text-[#7A7770] leading-snug mb-5 sm:mb-6">
            {collection.priceNote}
          </p>
        )}

        {/* =========================================================
            LINE 8: SHORT DESCRIPTION
            ========================================================= */}
        {shortDescription && (
          <p className="font-serif italic text-xs sm:text-[13.5px] text-[#55534E] leading-[1.75] mb-8 sm:mb-9">
            {shortDescription}
          </p>
        )}

        {/* =========================================================
            SUBTLE DIVIDER ABOVE DELIVERABLES
            ========================================================= */}
        <div className="border-t border-[#E3DBCC]/70 pt-7 sm:pt-8">
          {/* Deliverables heading */}
          <span className="block font-sans text-[9px] font-semibold tracking-[0.24em] text-[#7A7770] uppercase mb-4 sm:mb-5">
            {collection.deliverablesHeading ||
              collection.privilegesLabel ||
              (isSignature ? 'INCLUDED ATELIER PRIVILEGES' : 'INCLUDED DELIVERABLES')}
          </span>

          {/* Deliverable bullets (no truncation, natural spacing) */}
          <div className="space-y-3.5 sm:space-y-4">
            {deliverablesList.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 text-xs font-sans text-[#3E3C38] leading-[1.65]"
              >
                <span className="text-[#C5B9A5] text-xs shrink-0 mt-0.5">•</span>
                <span className="break-words">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* =========================================================
          LINE 11: CTA BUTTON (Pushed to absolute bottom across all cards)
          ========================================================= */}
      <div className="mt-auto pt-9 sm:pt-11">
        <button
          type="button"
          onClick={handleClick}
          className={`w-full py-3.5 px-6 rounded-full font-sans text-xs font-medium uppercase tracking-[0.14em] transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer group/btn ${
            isSelected
              ? 'bg-[#101010] text-[#FDFCF8] border border-[#101010] shadow-[0_4px_14px_rgba(16,16,16,0.14)] hover:bg-[#2A2825]'
              : 'bg-[#FAF7F2] hover:bg-[#F3EFE6] text-[#101010] border border-[#E3DBCC] hover:border-[#C5B7A4]'
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
