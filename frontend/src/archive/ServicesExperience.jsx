import React from 'react';

const SERVICES = [
  {
    num: '01',
    title: 'Editorial & Commercial Campaigns',
    tagline: 'High-fashion spreads, designer lookbooks, and luxury maison brand storytelling.',
    deliverables: [
      'Art direction & creative lighting treatment',
      'High-resolution digital medium format + 35mm film',
      'Global commercial licensing & advertising rights',
      'Full post-production color science and master retouching',
    ],
  },
  {
    num: '02',
    title: 'Architectural & Spatial Commissions',
    tagline: 'Monumental structures, private estates, and interior sanctuaries captured in natural light.',
    deliverables: [
      'Sun path and spatial ambient light analysis',
      'Perspective-corrected large-format capture',
      'Monograph-ready architectural folios',
      'Archival gallery exhibition prints',
    ],
  },
  {
    num: '03',
    title: 'Fine Art Monographs & Archival Prints',
    tagline: 'Limited edition bespoke photobooks, museum-grade darkroom gelatin silver prints.',
    deliverables: [
      'Handmade Japanese washi & Hahnemühle cotton rag prints',
      'Custom bound linen monographs with foil debossing',
      'Certificate of authenticity & archival provenance',
      'Private collector acquisitions',
    ],
  },
];

const STEPS = [
  {
    step: 'I',
    title: 'The Vision & Light Scout',
    desc: 'Every commission begins with a comprehensive dialogue on atmosphere, moodboard alignment, and solar/ambient light scouting.',
  },
  {
    step: 'II',
    title: 'The Production & Capture',
    desc: 'Conducting the session with calm precision, combining Hasselblad medium format digital clarity with the tactile soul of analog film.',
  },
  {
    step: 'III',
    title: 'Archival Curation',
    desc: 'Reviewing raw contact sheets to select only the most poignant, timeless frames that resonate with lasting editorial gravitas.',
  },
  {
    step: 'IV',
    title: 'Fine Art Master Printing',
    desc: 'Meticulous color grading, tonal contrast refinement, and museum-grade master print production in our Paris darkroom atelier.',
  },
];

export default function ServicesExperience({ onOpenInquiry }) {
  return (
    <section
      id="services"
      style={{
        padding: 'clamp(5rem, 10vw, 8rem) 0',
        backgroundColor: 'var(--color-off-white)',
      }}
    >
      <div className="container">
        
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto clamp(3rem, 6vw, 5rem)' }}>
          <span className="eyebrow" style={{ marginBottom: '1rem' }}>
            The Atelier Craft
          </span>
          <h2 style={{ marginBottom: '1.25rem' }}>
            Services & <span className="editorial-italic">The Experience</span>
          </h2>
          <p style={{ color: 'var(--color-obsidian-muted)' }}>
            We approach photography as a fine art discipline — deliberate, unhurried, and attuned to the subtle poetry of shadow and geometry.
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem',
            marginBottom: 'clamp(4rem, 8vw, 6rem)',
          }}
        >
          {SERVICES.map((s) => (
            <div
              key={s.num}
              style={{
                backgroundColor: 'var(--color-ivory)',
                border: '1px solid var(--color-nude)',
                borderRadius: '20px',
                padding: 'clamp(2rem, 3.5vw, 2.75rem)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-card)';
                e.currentTarget.style.borderColor = 'var(--color-obsidian)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = 'var(--color-nude)';
              }}
            >
              <div>
                <span
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.85rem',
                    color: 'var(--color-obsidian-light)',
                    display: 'block',
                    marginBottom: '1rem',
                  }}
                >
                  {s.num}
                </span>
                <h3
                  style={{
                    fontSize: '1.65rem',
                    fontWeight: 500,
                    marginBottom: '1rem',
                    color: 'var(--color-obsidian)',
                  }}
                >
                  {s.title}
                </h3>
                <p
                  style={{
                    fontSize: '0.95rem',
                    lineHeight: 1.6,
                    color: 'var(--color-obsidian-muted)',
                    marginBottom: '2rem',
                  }}
                >
                  {s.tagline}
                </p>

                <div
                  style={{
                    borderTop: '1px solid var(--color-nude)',
                    paddingTop: '1.5rem',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.675rem',
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      color: 'var(--color-obsidian-light)',
                      display: 'block',
                      marginBottom: '1rem',
                      fontWeight: 600,
                    }}
                  >
                    Disciplines & Deliverables
                  </span>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {s.deliverables.map((item, i) => (
                      <li
                        key={i}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.65rem',
                          fontSize: '0.875rem',
                          color: 'var(--color-obsidian)',
                        }}
                      >
                        <span style={{ color: 'var(--color-obsidian-light)', marginTop: '2px' }}>—</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div style={{ marginTop: '2.5rem' }}>
                <button
                  onClick={onOpenInquiry}
                  className="editorial-link"
                >
                  Request Consultation →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* The 4-Stage Experience Process */}
        <div
          style={{
            backgroundColor: 'var(--color-ivory)',
            border: '1px solid var(--color-nude)',
            borderRadius: '24px',
            padding: 'clamp(2.5rem, 5vw, 4rem)',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="eyebrow" style={{ marginBottom: '0.75rem' }}>
              The Methodology
            </span>
            <h3 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' }}>
              From First Dialogue to <span className="editorial-italic">Archival Masterpiece</span>
            </h3>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '2.5rem',
              position: 'relative',
            }}
          >
            {STEPS.map((st) => (
              <div
                key={st.step}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '2.5rem',
                    color: 'var(--color-obsidian)',
                    fontWeight: 400,
                    lineHeight: 1,
                    marginBottom: '1rem',
                  }}
                >
                  {st.step}
                </span>
                <h4
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    marginBottom: '0.75rem',
                    color: 'var(--color-obsidian)',
                  }}
                >
                  {st.title}
                </h4>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--color-obsidian-muted)' }}>
                  {st.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
