import React from 'react';
import PhotoPlaceholder from '../common/PhotoPlaceholder';
import ScrollBlurCharReveal from '../common/ScrollBlurCharReveal';

export default function AboutSection() {
  return (
    <section
      id="about"
      style={{
        padding: 'clamp(5rem, 10vw, 8rem) 0',
        backgroundColor: 'var(--color-off-white)',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'clamp(3rem, 6vw, 6rem)',
            alignItems: 'center',
          }}
        >
          {/* Left: Photographer Portrait Placeholder & Quote */}
          <div style={{ position: 'relative' }}>
            <div
              style={{
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-spotlight)',
                border: '1px solid var(--color-nude)',
              }}
            >
              <PhotoPlaceholder
                aspectRatio="4/5"
                label="PHOTOGRAPHER PORTRAIT — TO BE ADDED"
                meta="Édouard Vauquelin · Studio Portrait · 35mm Tri-X"
                title="Atelier Paris, 2026"
              />
            </div>

            {/* Floating Quote Card */}
            <div
              style={{
                position: 'relative',
                marginTop: '-2.5rem',
                marginRight: 'auto',
                marginLeft: '1.5rem',
                maxWidth: '85%',
                backgroundColor: 'var(--color-ivory)',
                border: '1px solid var(--color-nude)',
                borderRadius: '16px',
                padding: '1.5rem 1.75rem',
                boxShadow: 'var(--shadow-card)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <ScrollBlurCharReveal
                as="p"
                text="“To photograph is to hold one's breath when all faculties converge to captivate fleeting reality.”"
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.2rem',
                  fontStyle: 'italic',
                  color: 'var(--color-obsidian)',
                  lineHeight: 1.5,
                  marginBottom: '0.5rem',
                }}
                blurAmount={10}
                initialOpacity={0.16}
                offset={['start 0.90', 'start 0.40']}
              />
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.675rem',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'var(--color-obsidian-light)',
                  fontWeight: 600,
                }}
              >
                — Édouard Vauquelin, Principal Photographer
              </span>
            </div>
          </div>

          {/* Right: Biography, Philosophy & Recognition */}
          <div>
            <span className="eyebrow" style={{ marginBottom: '1rem' }}>
              The Studio
            </span>
            <ScrollBlurCharReveal
              as="h2"
              text="Stillness in an accelerated world."
              style={{ marginBottom: '1.5rem' }}
              blurAmount={14}
              initialOpacity={0.14}
              offset={['start 0.90', 'start 0.40']}
            />

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
                fontSize: '1.05rem',
                lineHeight: 1.75,
                color: 'var(--color-obsidian-muted)',
                marginBottom: '2.5rem',
              }}
            >
              <p>
                Founded in Paris in 2014, Maison Édouard is an editorial and fine art photography studio dedicated to the purist traditions of medium-format and large-format capture. We work exclusively with natural ambient light and deliberate spatial geometry.
              </p>
              <p>
                Whether documenting a private brutalist residence in the Swiss Alps or crafting an haute couture campaign for European fashion houses, our process rejects haste in favor of contemplative composition, tonal purity, and museum-grade archival permanence.
              </p>
            </div>

            {/* Atelier Metrics */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1.5rem',
                padding: '1.75rem 0',
                borderTop: '1px solid var(--color-nude)',
                borderBottom: '1px solid var(--color-nude)',
                marginBottom: '2.5rem',
              }}
            >
              <div>
                <span
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '2.25rem',
                    color: 'var(--color-obsidian)',
                    fontWeight: 500,
                    lineHeight: 1,
                    display: 'block',
                    marginBottom: '0.25rem',
                  }}
                >
                  12+
                </span>
                <span style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-obsidian-light)' }}>
                  Years Atelier Craft
                </span>
              </div>
              <div>
                <span
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '2.25rem',
                    color: 'var(--color-obsidian)',
                    fontWeight: 500,
                    lineHeight: 1,
                    display: 'block',
                    marginBottom: '0.25rem',
                  }}
                >
                  24
                </span>
                <span style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-obsidian-light)' }}>
                  Published Monographs
                </span>
              </div>
              <div>
                <span
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '2.25rem',
                    color: 'var(--color-obsidian)',
                    fontWeight: 500,
                    lineHeight: 1,
                    display: 'block',
                    marginBottom: '0.25rem',
                  }}
                >
                  3
                </span>
                <span style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-obsidian-light)' }}>
                  Global Studios (FR · CH · US)
                </span>
              </div>
            </div>

            {/* Selected Exhibitions & Monograph Honors */}
            <div>
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.7rem',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'var(--color-obsidian-light)',
                  fontWeight: 600,
                  display: 'block',
                  marginBottom: '1rem',
                }}
              >
                Selected Recognition & Folios
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                {['Paris Photo Grand Palais', 'Venice Biennale Collateral', 'Hasselblad Masters Finalist', 'Vogue Italia Curation', 'Architectural Digest Award'].map((item, i) => (
                  <span
                    key={i}
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.775rem',
                      letterSpacing: '0.08em',
                      color: 'var(--color-obsidian)',
                      backgroundColor: 'var(--color-ivory)',
                      border: '1px solid var(--color-nude)',
                      borderRadius: '999px',
                      padding: '0.4rem 0.95rem',
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
