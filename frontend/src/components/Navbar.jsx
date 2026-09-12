import React, { useState, useEffect } from 'react';
import Logo from './Logo';

export default function Navbar({ onOpenInquiry }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'What We Do', href: '#what-we-do' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        transition: 'all 0.35s ease',
        backgroundColor: scrolled ? 'rgba(253, 252, 248, 0.92)' : 'rgba(253, 252, 248, 0.75)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: scrolled ? '1px solid var(--color-nude)' : '1px solid transparent',
        padding: scrolled ? '0.75rem 0' : '1rem 0',
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Studio Identity / Inverted Theme-Matched Logo */}
        <a
          href="#"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            textDecoration: 'none',
            transition: 'opacity 0.25s ease, transform 0.25s ease',
          }}
          className="hover:opacity-85 active:scale-95"
        >
          <Logo
            variant="dark"
            height={scrolled ? 38 : 44}
            withText={true}
          />
        </a>

        {/* Desktop Navigation Links */}
        <nav
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '2.5rem',
          }}
          className="desktop-nav"
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.825rem',
                fontWeight: 500,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--color-obsidian)',
                position: 'relative',
                padding: '0.25rem 0',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#7A7770';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--color-obsidian)';
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right CTA Button & Mobile Trigger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <button
            onClick={onOpenInquiry}
            className="btn-primary"
            style={{
              padding: '0.65rem 1.45rem',
              fontSize: '0.75rem',
            }}
          >
            <span>Inquire</span>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 13L13 3M13 3H6M13 3V10" />
            </svg>
          </button>

          {/* Hamburger for mobile */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-menu-toggle"
            aria-label="Toggle navigation menu"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-ivory)',
              border: '1px solid var(--color-nude)',
              cursor: 'pointer',
              gap: '5px',
            }}
          >
            <span
              style={{
                width: '18px',
                height: '1.5px',
                backgroundColor: 'var(--color-obsidian)',
                transition: 'all 0.3s ease',
                transform: mobileMenuOpen ? 'rotate(45deg) translate(2.5px, 2.5px)' : 'none',
              }}
            />
            <span
              style={{
                width: '18px',
                height: '1.5px',
                backgroundColor: 'var(--color-obsidian)',
                transition: 'all 0.3s ease',
                opacity: mobileMenuOpen ? 0 : 1,
              }}
            />
            <span
              style={{
                width: '18px',
                height: '1.5px',
                backgroundColor: 'var(--color-obsidian)',
                transition: 'all 0.3s ease',
                transform: mobileMenuOpen ? 'rotate(-45deg) translate(2.5px, -2.5px)' : 'none',
              }}
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: 'var(--color-off-white)',
            borderBottom: '1px solid var(--color-nude)',
            padding: '2rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            animation: 'fadeIn 0.3s ease forwards',
          }}
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.5rem',
                color: 'var(--color-obsidian)',
                textDecoration: 'none',
                borderBottom: '1px solid var(--color-nude-subtle)',
                paddingBottom: '0.75rem',
              }}
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenInquiry();
            }}
            className="btn-primary"
            style={{ width: '100%', marginTop: '0.5rem' }}
          >
            Book a Commission
          </button>
        </div>
      )}

      {/* Responsive media query styling */}
      <style>{`
        @media (min-width: 900px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-menu-toggle {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}
