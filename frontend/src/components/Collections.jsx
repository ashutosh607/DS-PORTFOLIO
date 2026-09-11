import React from 'react';

const PACKAGES = [
  {
    tier: 'Private Folio',
    name: 'The Monograph Edition',
    subtitle: 'For artists, patrons, collectors, and personal fine art portraiture.',
    investment: 'Starting at €3,800',
    turnaround: '3 Weeks Delivery',
    medium: 'Medium Format Digital + 120 B&W Film',
    features: [
      'Full day private studio or location session',
      'Art direction & bespoke styling consultation',
      'Curated proof gallery of 40 contact frames',
      '15 master retouched high-resolution files',
      'One bespoke 30x40cm archival Hahnemühle master print',
      'Private online archival vault for lifetime access',
    ],
    signature: false,
  },
  {
    tier: 'Signature Atelier',
    name: 'The Editorial Campaign',
    subtitle: 'For luxury fashion houses, designers, and high-end publications.',
    investment: 'Starting at €8,500',
    turnaround: '2 Weeks Delivery',
    medium: 'Hasselblad 100MP + 35mm Leica Summilux',
    features: [
      'Two full days on-location or studio production',
      'Comprehensive moodboard, lighting script & crew coordination',
      'Complete lookbook & editorial spread sequencing',
      '35 master graded editorial hero assets',
      'Full international commercial & advertising licensing',
      'Expedited darkroom rush proofing',
    ],
    signature: true,
  },
  {
    tier: 'Spatial Commission',
    name: 'The Architectural Archive',
    subtitle: 'For architects, interior masters, historic estates, and developer monographs.',
    investment: 'Starting at €6,200',
    turnaround: '4 Weeks Delivery',
    medium: 'Large Format 4x5 + Shift Lens Digital',
    features: [
      'Multi-day solar alignment & twilight exposure passes',
      'Perspective-corrected spatial and structural compositions',
      'Detail vignettes & material texture monographs',
      '25 museum-grade archival spatial frames',
      'Monograph-ready publication proofs',
      'Archival gallery print folio in linen box',
    ],
    signature: false,
  },
];

export default function Collections({ onOpenInquiry }) {
  return (
    <section
      id="collections"
      style={{
        padding: 'clamp(5rem, 10vw, 8rem) 0',
        backgroundColor: 'var(--color-ivory)',
        borderTop: '1px solid var(--color-nude)',
        borderBottom: '1px solid var(--color-nude)',
      }}
    >
      <div className="container">

        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto clamp(3rem, 6vw, 5rem)' }}>
          <span className="eyebrow" style={{ marginBottom: '1rem' }}>
            Commissions & Investment
          </span>
          <h2 style={{ marginBottom: '1.25rem' }}>
            Featured Collections & <span className="editorial-italic">Editions</span>
          </h2>
          <p style={{ color: 'var(--color-obsidian-muted)' }}>
            Each commission is tailored to the unique architectural or editorial scope of the client. Below are our signature established engagement frameworks.
          </p>
        </div>

        {/* 3 Packages Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.5rem',
            alignItems: 'stretch',
          }}
        >
          {PACKAGES.map((pkg) => (
            <div
              key={pkg.name}
              style={{
                backgroundColor: pkg.signature ? 'var(--color-off-white)' : 'var(--color-ivory)',
                border: pkg.signature ? '2px solid var(--color-obsidian)' : '1px solid var(--color-nude)',
                borderRadius: '24px',
                padding: 'clamp(2rem, 3.5vw, 3rem)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                boxShadow: pkg.signature ? 'var(--shadow-spotlight)' : 'var(--shadow-card)',
                transform: pkg.signature ? 'scale(1.02)' : 'none',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              }}
            >
              {pkg.signature && (
                <div
                  style={{
                    position: 'absolute',
                    top: '-14px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: 'var(--color-obsidian)',
                    color: 'var(--color-off-white)',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.675rem',
                    fontWeight: 600,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    padding: '0.35rem 1.15rem',
                    borderRadius: '999px',
                    boxShadow: '0 4px 12px rgba(16, 16, 16, 0.2)',
                  }}
                >
                  Signature Atelier Edition
                </div>
              )}

              <div>
                <span
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.7rem',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: 'var(--color-obsidian-light)',
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: 600,
                  }}
                >
                  {pkg.tier}
                </span>

                <h3
                  style={{
                    fontSize: '1.85rem',
                    fontWeight: 500,
                    color: 'var(--color-obsidian)',
                    marginBottom: '0.75rem',
                  }}
                >
                  {pkg.name}
                </h3>

                <p
                  style={{
                    fontSize: '0.9rem',
                    color: 'var(--color-obsidian-muted)',
                    marginBottom: '2rem',
                    lineHeight: 1.5,
                  }}
                >
                  {pkg.subtitle}
                </p>

                <div
                  style={{
                    padding: '1.25rem 0',
                    borderTop: '1px solid var(--color-nude)',
                    borderBottom: '1px solid var(--color-nude)',
                    marginBottom: '2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.35rem',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.75rem',
                      color: 'var(--color-obsidian)',
                      fontWeight: 500,
                    }}
                  >
                    {pkg.investment}
                  </span>
                  <div
                    style={{
                      display: 'flex',
                      gap: '1rem',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.75rem',
                      color: 'var(--color-obsidian-light)',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                    }}
                  >
                    <span>{pkg.turnaround}</span>
                    <span>·</span>
                    <span>{pkg.medium}</span>
                  </div>
                </div>

                {/* Feature Bullet List */}
                <ul
                  style={{
                    listStyle: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.85rem',
                    marginBottom: '2.5rem',
                  }}
                >
                  {pkg.features.map((feat, idx) => (
                    <li
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.75rem',
                        fontSize: '0.875rem',
                        color: 'var(--color-obsidian)',
                        lineHeight: 1.5,
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: '3px', flexShrink: 0, color: 'var(--color-obsidian)' }}>
                        <polyline points="3.5 8.5 6.5 11.5 12.5 4.5" />
                      </svg>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => onOpenInquiry && onOpenInquiry(pkg.name)}
                className={pkg.signature ? 'btn-primary' : 'btn-secondary'}
                style={{ width: '100%' }}
              >
                Inquire for {pkg.name}
              </button>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
