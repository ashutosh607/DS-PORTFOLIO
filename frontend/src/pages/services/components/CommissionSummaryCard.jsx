import React from 'react';

export default function CommissionSummaryCard({
  collection,
  category,
  formData,
  onScrollToCollections,
}) {
  const categoryLabel = category
    ? category.charAt(0).toUpperCase() + category.slice(1)
    : 'Wedding';

  const celebrationText = formData.eventType || `${categoryLabel} Celebration`;
  const locationText = formData.location ? formData.location : 'Pending Venue Entry';
  const durationText = formData.duration ? `${formData.duration} Archive` : '2 Days Archive';

  const displayPrice = collection.numericPrice
    ? `$${collection.numericPrice.toLocaleString()}`
    : collection.price || '$8,400';

  const cardImage =
    collection.image ||
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1000&auto=format&fit=crop';

  return (
    <div className="space-y-8">
      {/* Commission Summary Card */}
      <div
        style={{
          padding: '28px',
          border: '1px solid #E3DBCC',
          borderRadius: '16px',
          background: '#FDFCF8',
        }}
        className="shadow-[0_4px_24px_-8px_rgba(16,16,16,0.04)]"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#E3DBCC]">
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-[#7A7770]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
            <span className="font-sans text-[11px] font-bold tracking-[0.2em] text-[#101010] uppercase">
              COMMISSION SUMMARY
            </span>
          </div>

          <span className="font-mono text-xs text-[#7A7770] tracking-wider">
            Ref: RL-2025-D98
          </span>
        </div>

        {/* Image (Strictly 4:3, 10px radius, with 24px bottom space) */}
        <div
          style={{
            width: '100%',
            aspectRatio: '4 / 3',
            borderRadius: '10px',
            marginBottom: '24px',
            overflow: 'hidden',
            border: '1px solid #E3DBCC',
          }}
          className="relative bg-[#F3F0E9]"
        >
          <img
            src={cardImage}
            alt={collection.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
            className="filter brightness-[0.98] contrast-[1.02]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-3 left-3 text-white/95 text-[9.5px] font-sans font-medium tracking-wide flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-white/90" />
            <span>{collection.imageLabel || 'Archive Specimen'}</span>
          </div>
        </div>

        {/* Summary Information Rows */}
        <div>
          {/* Row 1: Selected Suite */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              padding: '12px 0',
              borderBottom: '1px solid #E3DBCC',
            }}
          >
            <span
              style={{
                fontSize: '11px',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#7A7770',
                fontFamily: 'var(--font-sans)',
              }}
            >
              SELECTED SUITE
            </span>
            <span
              style={{
                fontSize: '16px',
                textAlign: 'right',
                fontFamily: 'var(--font-serif)',
                color: '#101010',
                fontWeight: 500,
              }}
            >
              {collection.title} Collection
            </span>
          </div>

          {/* Row 2: Event Horizon */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              padding: '12px 0',
              borderBottom: '1px solid #E3DBCC',
            }}
          >
            <span
              style={{
                fontSize: '11px',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#7A7770',
                fontFamily: 'var(--font-sans)',
              }}
            >
              EVENT HORIZON
            </span>
            <span
              style={{
                fontSize: '15px',
                textAlign: 'right',
                fontFamily: 'var(--font-sans)',
                color: '#101010',
                fontWeight: 400,
              }}
            >
              {celebrationText}
            </span>
          </div>

          {/* Row 3: Coverage Schedule */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              padding: '12px 0',
              borderBottom: '1px solid #E3DBCC',
            }}
          >
            <span
              style={{
                fontSize: '11px',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#7A7770',
                fontFamily: 'var(--font-sans)',
              }}
            >
              COVERAGE SCHEDULE
            </span>
            <span
              style={{
                fontSize: '15px',
                textAlign: 'right',
                fontFamily: 'var(--font-sans)',
                color: '#101010',
                fontWeight: 400,
              }}
            >
              {durationText}
            </span>
          </div>

          {/* Row 4: Primary Location */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              padding: '12px 0',
              borderBottom: '1px solid #E3DBCC',
            }}
          >
            <span
              style={{
                fontSize: '11px',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#7A7770',
                fontFamily: 'var(--font-sans)',
              }}
            >
              PRIMARY LOCATION
            </span>
            <span
              style={{
                fontSize: '15px',
                textAlign: 'right',
                fontFamily: 'var(--font-sans)',
                color: '#101010',
                fontStyle: 'italic',
                maxWidth: '220px',
              }}
              className="truncate"
            >
              {locationText}
            </span>
          </div>

          {/* Row 5: Studio Investment */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              padding: '12px 0',
              borderBottom: '1px solid #E3DBCC',
            }}
          >
            <span
              style={{
                fontSize: '11px',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#7A7770',
                fontFamily: 'var(--font-sans)',
              }}
            >
              STUDIO INVESTMENT
            </span>
            <div className="text-right">
              <span
                style={{
                  fontSize: '18px',
                  fontFamily: 'var(--font-serif)',
                  color: '#101010',
                  fontWeight: 500,
                }}
              >
                {displayPrice}
              </span>
              <span className="block font-sans text-[10px] text-[#7A7770]">
                Base Commission
              </span>
            </div>
          </div>
        </div>

        {/* INCLUDED IN THIS CURATION (mt-28px, mb-16px) */}
        <div style={{ marginTop: '28px', marginBottom: '16px' }}>
          <span
            style={{
              fontSize: '11px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#7A7770',
              fontFamily: 'var(--font-sans)',
              fontWeight: 600,
              display: 'block',
              marginBottom: '14px',
            }}
          >
            INCLUDED IN THIS CURATION
          </span>

          <ul className="space-y-2.5">
            {(collection.curationHighlights || collection.deliverables || [
              'Full-day dual principal photographer direction',
              '750+ master hand-graded digital archival images',
              '120 Medium Format Hasselblad analog film exposures',
              '12x12 Hand-bound Florentine leather heirloom album',
            ]).map((item, idx) => (
              <li
                key={idx}
                style={{
                  marginBottom: '10px',
                  lineHeight: 1.5,
                  fontSize: '13px',
                  color: '#4A4844',
                }}
                className="flex items-start gap-2.5 font-sans"
              >
                <span className="text-[#101010] font-semibold text-xs shrink-0 mt-0.5">
                  ✓
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 48-HOUR PROVISIONAL HOLD (mt-28px, p-18px 20px, bg #F3F0E9) */}
        <div
          style={{
            marginTop: '28px',
            padding: '18px 20px',
            border: '1px solid #E3DBCC',
            borderRadius: '12px',
            background: '#F3F0E9',
          }}
        >
          <div className="flex items-start gap-2.5">
            <span className="text-base shrink-0 mt-0.5">🔒</span>
            <div className="font-sans text-xs text-[#524436] leading-relaxed">
              <span className="font-semibold text-[#101010] block mb-1 text-[13px]">
                48-Hour Provisional Hold
              </span>
              Upon submission of this brief, your requested dates are locked provisionally on our master board with no immediate retainer.
            </div>
          </div>
        </div>

        {/* Switch Suite Button */}
        <div className="flex items-center justify-between pt-5 mt-5 border-t border-[#E3DBCC] text-xs font-sans">
          <button
            type="button"
            onClick={onScrollToCollections}
            className="text-[#101010] hover:text-[#7A7770] font-semibold tracking-wider uppercase flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>↑</span>
            <span>Switch Collection Suite</span>
          </button>

          <span className="text-[#7A7770] font-mono text-[11px]">
            Concierge SLA: &lt; 24h
          </span>
        </div>
      </div>

      {/* Quote Card */}
      <div
        style={{
          padding: '24px',
          border: '1px solid #E3DBCC',
          borderRadius: '16px',
          background: '#FDFCF8',
        }}
        className="shadow-[0_2px_16px_-6px_rgba(16,16,16,0.03)]"
      >
        <div className="text-3xl font-serif text-[#C5B9A5] leading-none mb-2">
          &ldquo;
        </div>
        <blockquote className="font-serif italic text-[15px] text-[#42392F] leading-relaxed mb-3">
          &ldquo;We photograph people not as they pose for the mirror, but as they exist within the quiet gravity of a memory.&rdquo;
        </blockquote>
        <div className="font-sans text-[10px] font-semibold tracking-[0.2em] text-[#7A7770] uppercase">
          DS PHOTOGRAPHY &amp; FILMS — CREATIVE DIRECTORS
        </div>
      </div>
    </div>
  );
}
