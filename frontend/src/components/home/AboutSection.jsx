import React from 'react';
import photographerImg from '../../assets/photographer.jpg';

/**
 * Editorial About Section — Dishant (DS Photography & Films)
 * 
 * Styled after luxury high-fashion editorial monographs:
 * - Asymmetric layout: Offset portrait on the left with warm ivory/nude backdrop
 * - Editorial typography: Cormorant Garamond serif heading & Plus Jakarta Sans labels
 * - Arched circular stamp: "PHOTOGRAPHY × FILMS"
 * - Script signature detail with fountain-pen underline
 * - Pure factual studio identifiers (zero invented claims/statistics)
 * - Generous 100–140px desktop breathing room
 */
export default function AboutSection({ imageUrl = null }) {
  const activeImage = imageUrl || photographerImg;

  return (
    <section
      id="about"
      aria-label="About the Photographer"
      style={{
        backgroundColor: 'var(--color-off-white, #FDFCF8)',
        borderTop: '1px solid var(--color-nude, #E3DBCC)',
        position: 'relative',
        overflow: 'hidden',
        padding: 'clamp(100px, 8.5vw, 140px) 0',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1440px',
          margin: '0 auto',
          paddingLeft: 'clamp(24px, 5.5vw, 80px)',
          paddingRight: 'clamp(24px, 5.5vw, 80px)',
          position: 'relative',
        }}
      >
        {/* Main Editorial Grid: Left Photo Composition / Right Editorial Persona */}
        <div className="about-editorial-grid">
          {/* =========================================================
              LEFT COLUMN: Offset Portrait & Editorial Framing
              ========================================================= */}
          <div className="about-portrait-col">
            <div className="about-portrait-wrapper">
              {/* Warm Nude/Ivory Accent Backdrop Block (Offset Top-Left) */}
              <div
                className="about-accent-block"
                aria-hidden="true"
              />

              {/* Single Photographer Portrait Image */}
              <div className="about-portrait-frame">
                <div className="about-portrait-img-container">
                  <img
                    src={activeImage}
                    alt="Dishant — Photographer & Visual Storyteller"
                    className="about-portrait-img"
                    loading="lazy"
                  />
                  {/* Subtle inner editorial vignette / film border */}
                  <div className="about-portrait-overlay" aria-hidden="true" />

                  {/* Editorial identification pill tag */}
                  <div className="about-portrait-badge">
                    <span className="about-badge-dot" />
                    <span className="about-badge-text">
                      DISHANT · DS PHOTOGRAPHY
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom-left Editorial Tagline & Accent Rule */}
            <div className="about-corner-tagline">
              <span className="about-corner-text">
                CAPTURING<br />WHAT MATTERS
              </span>
              <span className="about-corner-rule" aria-hidden="true" />
            </div>
          </div>

          {/* =========================================================
              RIGHT COLUMN: Editorial Content & Typography
              ========================================================= */}
          <div className="about-content-col">
            {/* Top Row: Label & Arched Typography Stamp */}
            <div className="about-header-row">
              <div className="about-label-wrap">
                <span className="about-section-label">
                  ABOUT THE PHOTOGRAPHER
                </span>
              </div>

              {/* Arched "PHOTOGRAPHY × FILMS" Editorial Stamp */}
              <div className="about-arch-stamp" aria-hidden="true">
                <svg
                  viewBox="0 0 160 80"
                  style={{
                    width: '130px',
                    height: '65px',
                    overflow: 'visible',
                  }}
                >
                  <path
                    id="archPath"
                    d="M 15,75 A 65,65 0 0,1 145,75"
                    fill="none"
                  />
                  <text
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '9.5px',
                      letterSpacing: '0.28em',
                      textTransform: 'uppercase',
                      fill: 'var(--color-obsidian-light, #7A7770)',
                      fontWeight: 600,
                    }}
                  >
                    <textPath href="#archPath" startOffset="50%" textAnchor="middle">
                      PHOTOGRAPHY × FILMS
                    </textPath>
                  </text>
                </svg>
              </div>
            </div>

            {/* Primary Editorial Heading */}
            <h2 className="about-primary-heading">
              Hi,<br />
              I’m Dishant.
            </h2>

            {/* Supporting Storyteller Subheading */}
            <p className="about-supporting-title">
              Photographer & Visual Storyteller
            </p>

            {/* Minimal Editorial Text */}
            <p className="about-description-text">
              Capturing honest moments, meaningful stories, and the details that make each frame yours.
            </p>

            {/* Handwritten Signature Flourish */}
            <div className="about-signature-wrap">
              <span className="about-signature-text">
                Dishant
              </span>
              <svg
                width="130"
                height="14"
                viewBox="0 0 130 14"
                fill="none"
                className="about-signature-stroke"
                aria-hidden="true"
              >
                <path
                  d="M 2 10 C 35 3, 75 12, 128 4"
                  stroke="var(--color-obsidian, #101010)"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  opacity="0.75"
                />
              </svg>
            </div>

            {/* Studio Identifier Metadata Bar (Factual DS Details Only) */}
            <div className="about-studio-meta-grid">
              <div className="about-meta-item">
                <span className="about-meta-label">STUDIO</span>
                <span className="about-meta-val">DS Photography & Films</span>
              </div>
              <div className="about-meta-divider" aria-hidden="true" />
              <div className="about-meta-item">
                <span className="about-meta-label">DISCIPLINE</span>
                <span className="about-meta-val">Photography & Films</span>
              </div>
              <div className="about-meta-divider" aria-hidden="true" />
              <div className="about-meta-item">
                <span className="about-meta-label">APPROACH</span>
                <span className="about-meta-val">Honest & Meaningful</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Margin Folio Index Indicator (Desktop) */}
        <div className="about-side-folio" aria-hidden="true">
          <span className="about-folio-num">01</span>
          <span className="about-folio-sep">/</span>
          <span className="about-folio-total">ABOUT</span>
          <span className="about-folio-line" />
        </div>
      </div>

      {/* Scoped CSS for Editorial Typography, Grid & Responsive Spacing */}
      <style dangerouslySetInnerHTML={{
        __html: `
        /* Main 2-Column Asymmetric Composition */
        .about-editorial-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: clamp(40px, 6vw, 80px);
          align-items: center;
        }

        @media (min-width: 992px) {
          .about-editorial-grid {
            grid-template-columns: minmax(360px, 0.9fr) minmax(440px, 1.1fr);
            gap: clamp(48px, 6vw, 96px);
          }
        }

        /* Left Column: Portrait & Offset Block */
        .about-portrait-col {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          width: 100%;
          max-width: 480px;
          margin: 0 auto;
        }

        .about-portrait-wrapper {
          position: relative;
          width: 100%;
          padding-top: 24px;
          padding-left: 24px;
        }

        @media (max-width: 640px) {
          .about-portrait-wrapper {
            padding-top: 16px;
            padding-left: 16px;
          }
        }

        /* Offset Warm Nude Accent Block */
        .about-accent-block {
          position: absolute;
          top: 0;
          left: 0;
          width: 72%;
          height: 72%;
          background-color: var(--color-nude, #E3DBCC);
          opacity: 0.75;
          border-radius: 12px;
          z-index: 1;
        }

        /* Main Portrait Frame with Subtle Rounded Corners */
        .about-portrait-frame {
          position: relative;
          z-index: 2;
          width: 100%;
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 20px 45px -15px rgba(16, 16, 16, 0.08);
          border: 1px solid var(--color-nude, #E3DBCC);
          background-color: var(--color-ivory, #F3F0E9);
        }

        .about-portrait-img-container {
          position: relative;
          width: 100%;
          aspect-ratio: 4/5;
          overflow: hidden;
          background-color: var(--color-ivory, #F3F0E9);
        }

        .about-portrait-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 22%;
          display: block;
          transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .about-portrait-frame:hover .about-portrait-img {
          transform: scale(1.03);
        }

        .about-portrait-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.2), inset 0 -40px 60px -20px rgba(16, 16, 16, 0.25);
        }

        .about-portrait-badge {
          position: absolute;
          bottom: 16px;
          left: 16px;
          padding: 6px 12px;
          border-radius: 999px;
          background-color: rgba(16, 16, 16, 0.68);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.16);
          display: inline-flex;
          align-items: center;
          gap: 6px;
          pointer-events: none;
        }

        .about-badge-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #E3DBCC;
        }

        .about-badge-text {
          font-family: var(--font-sans);
          font-size: 0.65rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #FDFCF8;
          font-weight: 600;
        }

        /* Bottom-Left Corner Tagline */
        .about-corner-tagline {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-top: 32px;
          padding-left: 24px;
        }

        @media (max-width: 640px) {
          .about-corner-tagline {
            padding-left: 16px;
            margin-top: 24px;
          }
        }

        .about-corner-text {
          font-family: var(--font-sans);
          font-size: 0.65rem;
          line-height: 1.4;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--color-obsidian-light, #7A7770);
          font-weight: 600;
        }

        .about-corner-rule {
          display: inline-block;
          width: 32px;
          height: 1px;
          background-color: var(--color-nude, #E3DBCC);
        }

        /* Right Column: Content */
        .about-content-col {
          display: flex;
          flex-direction: column;
          position: relative;
          z-index: 2;
        }

        /* Header Row: Label & Arched Stamp */
        .about-header-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: clamp(16px, 2.5vw, 28px);
        }

        .about-section-label {
          font-family: var(--font-sans);
          font-size: 0.725rem;
          text-transform: uppercase;
          letter-spacing: 0.24em;
          color: var(--color-obsidian-light, #7A7770);
          font-weight: 600;
          display: inline-block;
        }

        .about-arch-stamp {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          margin-top: -12px;
          user-select: none;
          pointer-events: none;
        }

        @media (max-width: 768px) {
          .about-arch-stamp {
            transform: scale(0.85);
            transform-origin: right top;
          }
        }

        /* Large Editorial Heading */
        .about-primary-heading {
          font-family: var(--font-serif);
          font-size: clamp(2.75rem, 5.8vw, 5.25rem);
          line-height: 1.05;
          font-weight: 400;
          color: var(--color-obsidian, #101010);
          letter-spacing: -0.02em;
          margin: 0 0 18px 0;
        }

        /* Supporting Title */
        .about-supporting-title {
          font-family: var(--font-serif);
          font-size: clamp(1.2rem, 1.8vw, 1.5rem);
          font-style: italic;
          color: var(--color-obsidian, #101010);
          line-height: 1.35;
          margin: 0 0 16px 0;
        }

        /* Description */
        .about-description-text {
          font-family: var(--font-sans);
          font-size: clamp(0.95rem, 1.1vw, 1.05rem);
          line-height: 1.75;
          color: var(--color-obsidian-muted, #4A4844);
          max-width: 460px;
          margin: 0 0 28px 0;
        }

        /* Signature Flourish */
        .about-signature-wrap {
          display: inline-flex;
          flex-direction: column;
          align-items: flex-start;
          margin-bottom: clamp(32px, 4vw, 48px);
        }

        .about-signature-text {
          font-family: var(--font-script, 'Caveat', cursive);
          font-size: clamp(2.2rem, 3.2vw, 2.75rem);
          line-height: 1;
          color: var(--color-obsidian, #101010);
          transform: rotate(-3deg);
          letter-spacing: 0.02em;
          font-weight: 500;
        }

        .about-signature-stroke {
          margin-top: 4px;
          margin-left: 8px;
        }

        /* Studio Metadata Grid */
        .about-studio-meta-grid {
          display: flex;
          align-items: center;
          gap: clamp(16px, 2.5vw, 32px);
          padding-top: clamp(20px, 2.5vw, 28px);
          border-top: 1px solid var(--color-nude, #E3DBCC);
          width: 100%;
          max-width: 520px;
        }

        @media (max-width: 560px) {
          .about-studio-meta-grid {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }
          .about-meta-divider {
            display: none !important;
          }
        }

        .about-meta-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .about-meta-label {
          font-family: var(--font-sans);
          font-size: 0.65rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--color-obsidian-light, #7A7770);
          font-weight: 600;
        }

        .about-meta-val {
          font-family: var(--font-sans);
          font-size: 0.85rem;
          letter-spacing: 0.04em;
          color: var(--color-obsidian, #101010);
          font-weight: 500;
        }

        .about-meta-divider {
          width: 1px;
          height: 32px;
          background-color: var(--color-nude, #E3DBCC);
        }

        /* Desktop Side Folio Indicator */
        .about-side-folio {
          display: none;
        }

        @media (min-width: 1200px) {
          .about-side-folio {
            position: absolute;
            right: clamp(24px, 4vw, 56px);
            top: 50%;
            transform: translateY(-50%);
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
            font-family: var(--font-sans);
            font-size: 0.625rem;
            letter-spacing: 0.2em;
            color: var(--color-obsidian-light, #7A7770);
            font-weight: 600;
            user-select: none;
          }

          .about-folio-line {
            width: 1px;
            height: 48px;
            background-color: var(--color-nude, #E3DBCC);
            margin-top: 4px;
          }
        }
      `}} />
    </section>
  );
}

