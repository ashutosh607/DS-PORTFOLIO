import React, { useState, useEffect } from 'react';

export default function Footer() {
  const [parisTime, setParisTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      try {
        const timeStr = new Intl.DateTimeFormat('en-GB', {
          timeZone: 'Europe/Paris',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }).format(new Date());
        setParisTime(timeStr);
      } catch {
        setParisTime('12:00:00');
      }
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      style={{
        backgroundColor: 'var(--color-obsidian)',
        borderTop: '1px solid rgba(227, 219, 204, 0.15)',
        color: 'rgba(243, 240, 233, 0.65)',
        padding: '4rem 0 3rem',
        fontSize: '0.85rem',
      }}
    >
      <div className="container">
        
        {/* Top Footer Row */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '3rem',
            paddingBottom: '3rem',
            borderBottom: '1px solid rgba(227, 219, 204, 0.1)',
          }}
        >
          {/* Brand Col */}
          <div style={{ maxWidth: '360px' }}>
            <span
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.65rem',
                color: 'var(--color-off-white)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '0.5rem',
              }}
            >
              Maison Édouard
            </span>
            <p style={{ color: 'rgba(243, 240, 233, 0.55)', fontSize: '0.85rem', lineHeight: 1.6 }}>
              Atelier de photographie fine art, archives spatiales et campagnes éditoriales de haute couture. Paris · Zurich · New York.
            </p>
          </div>

          {/* Navigation Links */}
          <div style={{ display: 'flex', gap: '3.5rem', flexWrap: 'wrap' }}>
            <div>
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.675rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'var(--color-nude)',
                  display: 'block',
                  marginBottom: '1rem',
                  fontWeight: 600,
                }}
              >
                Navigation
              </span>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {[
                  { name: 'Home', href: '#home' },
                  { name: 'What We Do', href: '#what-we-do' },
                  { name: 'About', href: '#about' },
                  { name: 'Contact', href: '#contact' },
                ].map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      style={{ color: 'rgba(243, 240, 233, 0.7)', textDecoration: 'none' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-off-white)')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(243, 240, 233, 0.7)')}
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.675rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'var(--color-nude)',
                  display: 'block',
                  marginBottom: '1rem',
                  fontWeight: 600,
                }}
              >
                Archive & Social
              </span>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {['Instagram (@edouard)', 'Substack Monograph', 'Behance Curated', 'VSCO Journal'].map((item) => (
                  <li key={item}>
                    <a
                      href="#social"
                      onClick={(e) => e.preventDefault()}
                      style={{ color: 'rgba(243, 240, 233, 0.7)', textDecoration: 'none' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-off-white)')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(243, 240, 233, 0.7)')}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.675rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'var(--color-nude)',
                  display: 'block',
                  marginBottom: '1rem',
                  fontWeight: 600,
                }}
              >
                Studio Time (CET)
              </span>
              <div
                style={{
                  fontFamily: 'monospace',
                  fontSize: '1.25rem',
                  color: 'var(--color-off-white)',
                  letterSpacing: '0.08em',
                  backgroundColor: '#161616',
                  padding: '0.45rem 0.85rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(227, 219, 204, 0.15)',
                  display: 'inline-block',
                }}
              >
                {parisTime || '14:32:00'}
              </div>
              <span style={{ display: 'block', marginTop: '0.5rem', fontSize: '0.75rem', color: 'rgba(243, 240, 233, 0.45)' }}>
                Paris Studio Active
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Footer Row */}
        <div
          style={{
            paddingTop: '2rem',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1.5rem',
          }}
        >
          <div style={{ fontSize: '0.775rem', color: 'rgba(243, 240, 233, 0.5)' }}>
            © {new Date().getFullYear()} Maison Édouard. All rights reserved. Archival preservation protected.
          </div>

          <button
            onClick={scrollToTop}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.75rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--color-nude)',
              cursor: 'pointer',
              background: 'none',
              border: 'none',
            }}
          >
            <span>Back to top</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 15l-6-6-6 6" />
            </svg>
          </button>
        </div>

      </div>
    </footer>
  );
}
