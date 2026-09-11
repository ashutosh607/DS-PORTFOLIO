import React, { useState } from 'react';
import PhotoPlaceholder from './PhotoPlaceholder';

const WORKS = [
  {
    id: 'w1',
    title: 'The Brutalist Pavilion',
    category: 'Architecture',
    year: '2026',
    location: 'Basel, Switzerland',
    medium: 'Large Format 4x5 Monochrome',
    ratio: '4/5',
    featured: true,
  },
  {
    id: 'w2',
    title: "Couture Automne / Hiver",
    category: 'Editorial',
    year: '2025',
    location: 'Paris, France',
    medium: '35mm Tri-X 400',
    ratio: '16/9',
    featured: true,
  },
  {
    id: 'w3',
    title: 'Portraits in Chiaroscuro',
    category: 'Portraits',
    year: '2026',
    location: 'Milan, Italy',
    medium: 'Hasselblad H6D · Natural Light',
    ratio: '1/1',
    featured: false,
  },
  {
    id: 'w4',
    title: 'Tourbillon Squelette',
    category: 'Haute Horlogerie',
    year: '2025',
    location: 'Geneva, Switzerland',
    medium: 'Medium Format Macro 120mm',
    ratio: '4/5',
    featured: false,
  },
  {
    id: 'w5',
    title: 'Sanctuary of Silence',
    category: 'Architecture',
    year: '2026',
    location: 'Kyoto, Japan',
    medium: '6x7 Color Negative',
    ratio: '16/9',
    featured: true,
  },
  {
    id: 'w6',
    title: 'The Tuscan Solitude',
    category: 'Portraits',
    year: '2025',
    location: 'Val d’Orcia, Italy',
    medium: '35mm Leica Summilux',
    ratio: '4/5',
    featured: false,
  },
];

const CATEGORIES = ['All', 'Editorial', 'Architecture', 'Portraits', 'Haute Horlogerie'];

export default function SelectedWork({ onSelectWork }) {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredWorks = activeCategory === 'All'
    ? WORKS
    : WORKS.filter((w) => w.category === activeCategory);

  return (
    <section
      id="selected-work"
      style={{
        padding: 'clamp(5rem, 10vw, 8rem) 0',
        backgroundColor: 'var(--color-ivory)',
        borderTop: '1px solid var(--color-nude)',
        borderBottom: '1px solid var(--color-nude)',
      }}
    >
      <div className="container">
        
        {/* Section Header */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            marginBottom: '3.5rem',
          }}
        >
          <span className="eyebrow" style={{ marginBottom: '1rem' }}>
            Portfolio Archive
          </span>
          <h2 style={{ maxWidth: '750px', marginBottom: '1.25rem' }}>
            Selected Works & <span className="editorial-italic">Commissions</span>
          </h2>
          <p style={{ maxWidth: '580px', color: 'var(--color-obsidian-muted)' }}>
            A deliberate curation of international editorial features, architectural monographs, and private portrait commissions.
          </p>

          {/* Filter Pills */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '0.6rem',
              marginTop: '2.5rem',
            }}
          >
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    padding: '0.5rem 1.25rem',
                    borderRadius: '999px',
                    fontSize: '0.75rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    fontWeight: 500,
                    backgroundColor: isActive ? 'var(--color-obsidian)' : 'var(--color-off-white)',
                    color: isActive ? 'var(--color-off-white)' : 'var(--color-obsidian)',
                    border: `1px solid ${isActive ? 'var(--color-obsidian)' : 'var(--color-nude)'}`,
                    transition: 'all 0.25s ease',
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Asymmetric Editorial Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.5rem',
          }}
        >
          {filteredWorks.map((work) => (
            <article
              key={work.id}
              onClick={() => onSelectWork && onSelectWork(work)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                group: 'card',
              }}
            >
              <div
                style={{
                  position: 'relative',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-card)',
                  transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-spotlight)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-card)';
                }}
              >
                <PhotoPlaceholder
                  aspectRatio={work.ratio}
                  title={work.title}
                  meta={work.medium}
                />
              </div>

              {/* Card Meta Description */}
              <div
                style={{
                  padding: '1.25rem 0.5rem 0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >
                <div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.45rem',
                      fontWeight: 500,
                      marginBottom: '0.25rem',
                      color: 'var(--color-obsidian)',
                    }}
                  >
                    {work.title}
                  </h3>
                  <div
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.75rem',
                      letterSpacing: '0.1em',
                      color: 'var(--color-obsidian-light)',
                      textTransform: 'uppercase',
                    }}
                  >
                    {work.location} · {work.year}
                  </div>
                </div>

                <span
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.675rem',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'var(--color-obsidian)',
                    border: '1px solid var(--color-nude)',
                    borderRadius: '999px',
                    padding: '0.25rem 0.65rem',
                    backgroundColor: 'var(--color-off-white)',
                  }}
                >
                  {work.category}
                </span>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
