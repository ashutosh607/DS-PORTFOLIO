import React from 'react';
import { GripVertical, Eye, EyeOff, Pencil, Trash2 } from 'lucide-react';

// Helper function to condense full-sentence deliverables into clean 3-4 word phrases
const condenseDeliverable = (item) => {
  if (!item || typeof item !== 'string') return '';
  const text = item.trim();

  const editorialMap = {
    'Lead principal photographer + associate': 'Principal & Associate Lead',
    '35mm analog film rolls (Portra 400 & HP5)': '35mm Analog Film Rolls',
    '35mm analog film rolls (Portra 400)': '35mm Analog Film Rolls',
    'Private online proofing gallery & print release': 'Private Proofing Gallery',
    'Archival master proofing gallery & print release': 'Archival Master Gallery',
    'Archival USB folio in Belgian linen': 'Belgian Linen Folio',
    'Archival presentation folio in Belgian linen': 'Belgian Linen Folio',
    'Creative director + 2 master associates': 'Creative Director + Associates',
    '120 Medium Format & 35mm analog film': 'Medium Format & 35mm Film',
    'Handcrafted 12x12 Italian leather heirloom album': 'Handcrafted Heirloom Album',
    'Drone & aerial architectural context': 'Aerial & Architectural Capture',
    'Priority 3-week archival digital proof delivery': 'Priority Proof Delivery',
    'Full atelier team (Principal, Cinema, Aerial)': 'Complete Atelier Team',
    'Unlimited 35mm & 120 analog negatives (Paris lab)': 'Unlimited Analog Negatives',
    'Bespoke 14x14 heirloom album + 2 parent albums': 'Three Heirloom Albums',
    'Pre-wedding editorial session in Europe': 'Destination Editorial Session',
    'Worldwide travel & accommodation covered': 'Travel Inclusive Worldwide',
    '4 hours directed golden-hour session': '4-Hour Directed Session',
    '2 rolls 35mm fine-grain film (Portra 400)': '35mm Fine-Grain Film',
    '120+ hand-retouched high-res master frames': 'Hand-Retouched Master Frames',
    'Online private gallery with download rights': 'Online Private Gallery',
    'Full-day multi-venue creative direction': 'Multi-Venue Direction',
    'Dual capture: 120 Medium format & Super 8mm cinema': 'Medium Format & Super 8mm',
    '250+ master color-graded monograph frames': 'Color-Graded Monograph Frames',
    '2-minute 4K analog video teaser with score': '4K Analog Teaser Reel',
    'Handmade 10x10 linen preview guestbook': 'Handmade Linen Guestbook',
  };

  if (editorialMap[text]) return editorialMap[text];

  const cleaned = text.replace(/\(.*?\)/g, '').replace(/&.*$/, '').trim();
  const words = cleaned.split(/\s+/).filter(Boolean);
  return words.slice(0, 4).join(' ');
};

export default function CollectionTierCard({
  collection,
  isSelected,
  onSelectAndBook,
  isAdmin = false,
  index = 0,
  onEdit,
  onDelete,
  onToggleActive,
  dragProps = {},
  isDragging = false,
  isOver = false,
}) {
  const cardId = collection.id || collection.tier || collection._id;
  const isRecommended =
    collection.highlight ||
    collection.isAtelierChoice ||
    collection.isRecommended ||
    (collection.tier && collection.tier.toLowerCase() === 'signature') ||
    (collection.id && collection.id.toLowerCase().includes('signature'));

  const rawDeliverables =
    collection.deliverables && collection.deliverables.length > 0
      ? collection.deliverables
      : [
        'Lead principal photographer + associate',
        'Archival master proofing gallery & print release',
        '35mm analog film rolls (Portra 400)',
        'Archival presentation folio in Belgian linen',
      ];

  // Uniform 4 concise items per card for flawless structural consistency
  const condensedDeliverables = rawDeliverables
    .map(condenseDeliverable)
    .filter(Boolean)
    .slice(0, 4);

  const title = collection.title || collection.eyebrow || 'Collection';
  const subtitle = collection.subtitle || '';
  const imageSrc = collection.image || collection.imageUrl;
  const imageLabel = collection.imageLabel || collection.imageTag || 'Archive Specimen';

  // Format real price value
  let displayPrice = '';
  if (typeof collection.price === 'number') {
    displayPrice = `₹${collection.price.toLocaleString('en-IN')}`;
  } else if (
    typeof collection.price === 'string' &&
    collection.price.trim() !== '' &&
    !collection.price.toLowerCase().includes('to be added') &&
    !collection.price.toLowerCase().includes('tbd')
  ) {
    displayPrice = collection.price.trim();
  } else if (collection.numericPrice) {
    displayPrice = `₹${collection.numericPrice.toLocaleString('en-IN')}`;
  } else {
    displayPrice = 'Price on request';
  }

  const descriptionLine =
    collection.priceNote || 'Archival proofing & master curation included';

  const handleClick = (e) => {
    e.preventDefault();
    if (isSelected) {
      onSelectAndBook(cardId, true);
    } else {
      onSelectAndBook(cardId, false);
    }
  };

  return (
    <div
      {...(isAdmin ? dragProps : {})}
      style={{
        padding: '32px',
        boxSizing: 'border-box',
      }}
      className={`group relative h-full flex flex-col justify-between rounded-2xl transition-all duration-300 ease-out ${
        isDragging
          ? 'opacity-40 border-[#101010] shadow-lg'
          : isOver
          ? 'border-[#9E8159] shadow-md bg-[#FAF6F0]'
          : isSelected
          ? 'bg-[#FAF8F5] border-2 border-[#101010] shadow-[0_8px_32px_-6px_rgba(16,16,16,0.12)] -translate-y-1'
          : isRecommended
          ? 'bg-[#FAF8F5] border border-[#D5CBB9] shadow-[0_4px_24px_-6px_rgba(16,16,16,0.05)] hover:border-[#101010]/50 hover:-translate-y-1 hover:shadow-[0_16px_36px_-8px_rgba(16,16,16,0.08)]'
          : 'bg-[#FDFCF8] border border-[#E3DBCC] shadow-[0_2px_20px_-6px_rgba(16,16,16,0.04)] hover:border-[#C5B7A4] hover:-translate-y-1 hover:shadow-[0_16px_36px_-8px_rgba(16,16,16,0.07)]'
      } ${isAdmin ? 'cursor-grab active:cursor-grabbing' : ''} ${
        collection.isActive === false ? 'opacity-70' : ''
      }`}
    >
      <div className="flex-1 flex flex-col">
        {/* =========================================================
            1. TOP LABEL LINE (8px gap below before title)
            ========================================================= */}
        <div
          data-testid="top-label-container"
          style={{ marginBottom: '8px' }}
          className="flex items-center justify-between min-h-[16px]"
        >
          <div className="flex items-center gap-1.5">
            {isAdmin && <GripVertical size={13} className="text-[#A39E93] shrink-0" />}
            {isSelected ? (
              <span className="font-sans text-[10px] font-medium tracking-[0.22em] text-[#101010] uppercase flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#101010] shrink-0" />
                <span>Selected Collection</span>
              </span>
            ) : isRecommended ? (
              <span className="font-sans text-[10px] font-medium tracking-[0.22em] text-[#7A7770] uppercase flex items-center gap-1.5">
                <span className="text-[#C2A378]">★</span>
                <span>Recommended</span>
              </span>
            ) : (
              <span className="font-sans text-[10px] font-medium tracking-[0.22em] text-[#7A7770] uppercase">
                {collection.tier || 'The Collection'}
              </span>
            )}
          </div>

          {isAdmin && (
            <div className="flex items-center gap-2">
              <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#7A7770]">
                Folio 0{index + 1}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onToggleActive) onToggleActive(collection, e);
                }}
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] uppercase tracking-[0.14em] font-medium transition-colors cursor-pointer ${
                  collection.isActive !== false
                    ? 'bg-[#101010] text-[#FDFCF8] hover:bg-[#2A2825]'
                    : 'bg-red-800/80 text-white hover:bg-red-700'
                }`}
                title={collection.isActive !== false ? 'Visible on public site' : 'Hidden draft'}
              >
                {collection.isActive !== false ? (
                  <>
                    <Eye size={9} />
                    <span>Active</span>
                  </>
                ) : (
                  <>
                    <EyeOff size={9} />
                    <span>Draft</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* =========================================================
            2. TITLE (8px gap below before subtitle)
            ========================================================= */}
        <h3
          data-testid="title-element"
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(1.5rem, 1.75vw, 1.9rem)',
            letterSpacing: '0.03em',
            lineHeight: 1.15,
            fontWeight: 400,
            color: 'var(--color-obsidian)',
            textTransform: 'uppercase',
            marginBottom: '8px',
          }}
          className="truncate"
          title={title}
        >
          {title}
        </h3>

        {/* =========================================================
            3. SUBTITLE (24px gap below before photo)
            ========================================================= */}
        <p
          data-testid="subtitle-element"
          style={{
            marginBottom: '24px',
          }}
          className="font-serif italic text-xs sm:text-[13px] text-[#7A7770] leading-relaxed truncate"
        >
          {subtitle || 'Archival commission suite'}
        </p>

        {/* =========================================================
            4. PHOTO (24px gap below before "Commission Investment")
            ========================================================= */}
        {imageSrc && (
          <div
            data-testid="photo-container"
            style={{
              marginBottom: '24px',
              width: '100%',
            }}
          >
            <div
              style={{
                width: '100%',
                aspectRatio: '4 / 3',
                borderRadius: '12px',
                overflow: 'hidden',
                position: 'relative',
                backgroundColor: '#F3EFE6',
                border: '1px solid rgba(227, 219, 204, 0.8)',
                boxShadow: '0 2px 12px rgba(16, 16, 16, 0.04)',
              }}
            >
              <img
                src={imageSrc}
                alt={title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                }}
                className="filter brightness-[0.98] contrast-[1.02] transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent pointer-events-none" />

              {/* Subtle archive specimen tag */}
              <div className="absolute bottom-2.5 left-3 flex items-center gap-1.5 text-white/90 text-[9px] font-sans font-normal tracking-wider drop-shadow-xs pointer-events-none">
                <span className="w-1 h-1 rounded-full bg-white/80 shrink-0" />
                <span className="truncate max-w-[180px]">{imageLabel}</span>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            5. "COMMISSION INVESTMENT" LABEL (8px gap below before price)
            ========================================================= */}
        <span
          data-testid="commission-investment-label"
          style={{
            display: 'block',
            marginBottom: '8px',
          }}
          className="font-sans text-[10px] font-medium tracking-[0.22em] text-[#7A7770] uppercase"
        >
          Commission Investment
        </span>

        {/* =========================================================
            6. PRICE (12px gap below before description line)
            ========================================================= */}
        <div
          data-testid="price-element"
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.55rem',
            color: 'var(--color-obsidian)',
            lineHeight: 1.15,
            fontWeight: 400,
            marginBottom: '12px',
          }}
        >
          {displayPrice}
        </div>

        {/* =========================================================
            7. DESCRIPTION LINE
            ========================================================= */}
        <p
          data-testid="description-line"
          style={{
            lineHeight: '1.5',
          }}
          className="font-sans text-[11px] text-[#7A7770] break-words"
        >
          {descriptionLine}
        </p>

        {/* =========================================================
            8. "INCLUDED DELIVERABLES" SECTION
            - 24px gap from description line to "Included Deliverables" label
            - 12px gap below header before first item
            - 10px gap between items with line-height >= 1.6
            ========================================================= */}
        <div
          data-testid="deliverables-section"
          style={{
            borderTop: '1px solid rgba(227, 219, 204, 0.7)',
            marginTop: '12px',
            paddingTop: '12px',
          }}
        >
          <span
            data-testid="deliverables-heading"
            style={{
              display: 'block',
              marginBottom: '12px',
            }}
            className="font-sans text-[10px] font-medium tracking-[0.22em] text-[#7A7770] uppercase"
          >
            Included Deliverables
          </span>

          <div
            data-testid="deliverables-list"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            {condensedDeliverables.map((item, idx) => (
              <div
                key={idx}
                data-testid={`deliverable-item-${idx}`}
                style={{
                  lineHeight: '1.6',
                }}
                className="font-sans text-[12.5px] text-[#3E3C38] tracking-[0.01em]"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* =========================================================
          9. CTA BUTTON OR ADMIN ACTIONS
          - 24px gap above button from last item
          - Card has 32px bottom padding (>= 24px)
          ========================================================= */}
      {isAdmin ? (
        <div
          data-testid="admin-actions-wrapper"
          style={{
            marginTop: '24px',
            paddingTop: '16px',
            borderTop: '1px solid rgba(227, 219, 204, 0.7)',
          }}
          className="flex items-center justify-between gap-3"
        >
          <span className="font-mono text-[10.5px] tracking-[0.16em] uppercase text-[#7A7770] font-medium">
            ORDER #{index + 1}
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onEdit) onEdit(collection);
              }}
              className="inline-flex items-center gap-1.5 py-2 px-4 rounded-full border border-[#E3DBCC] bg-[#FAF7F2] hover:bg-[#F3EFE6] text-[11px] uppercase tracking-[0.14em] font-medium text-[#101010] transition-colors cursor-pointer"
            >
              <Pencil size={11} />
              <span>Edit</span>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onDelete) onDelete(collection);
              }}
              className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-800 transition-colors cursor-pointer"
              title="Delete package"
            >
              <Trash2 size={12} />
            </button>
          </div>
        </div>
      ) : (
        <div
          data-testid="button-wrapper"
          style={{
            marginTop: '24px',
          }}
        >
          <button
            type="button"
            onClick={handleClick}
            className={`w-full py-3.5 px-6 rounded-full font-sans text-xs font-medium uppercase tracking-[0.14em]
      transition-all duration-300 flex items-center justify-center gap-2.5
      cursor-pointer group/btn
      focus:outline-none focus-visible:ring-2 focus-visible:ring-[#101010]/30 focus-visible:ring-offset-2
      active:scale-[0.98]
      ${isSelected
                ? `
            bg-[#101010]
            text-[#FDFCF8]
            border-2 border-[#101010]
            shadow-[0_6px_20px_rgba(16,16,16,0.20)]
            ring-1 ring-[#101010]/10
            hover:bg-[#242220]
            hover:border-[#242220]
            hover:shadow-[0_8px_24px_rgba(16,16,16,0.24)]
          `
                : `
            bg-[#FAF7F2]
            text-[#101010]
            border border-[#E3DBCC]
            hover:bg-[#F3EFE6]
            hover:border-[#B9AA96]
            hover:shadow-[0_4px_14px_rgba(16,16,16,0.08)]
          `
              }`}
          >
            {isSelected ? (
              <>
                <span className="text-[#FDFCF8] text-black">
                  Selected · Continue to Booking →
                </span>

                <span className="transition-transform duration-300 ease-out group-hover/btn:translate-x-1">
                  →
                </span>
              </>
            ) : (
              <>
                <span>Select &amp; Book</span>

                <span className="transition-transform duration-300 ease-out group-hover/btn:translate-x-1">
                  →
                </span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
