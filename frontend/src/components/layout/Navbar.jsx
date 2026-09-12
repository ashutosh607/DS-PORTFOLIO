import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Logo from './Logo';
import { usePageTransition } from '../common/PageTransition';

export default function Navbar({ onOpenInquiry }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { navigateWithTransition } = usePageTransition();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, item) => {
    if (item.onClick) {
      e.preventDefault();
      item.onClick();
      return;
    }

    if (item.to) {
      // standard route link handled by Link component
      return;
    }

    if (item.hash) {
      e.preventDefault();
      if (location.pathname === '/') {
        const el = document.querySelector(item.hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } else {
        navigate('/' + item.hash);
      }
    }
  };

  const navLinks = [
    {
      label: 'Home',
      to: '/',
      isActive: location.pathname === '/' && !location.hash,
    },
    {
      label: 'Collections',
      to: '/collections',
      isActive: location.pathname === '/collections',
    },
    {
      label: 'Services',
      to: '/services',
      isActive: location.pathname === '/services',
    },
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
        backgroundColor: scrolled ? 'rgba(253, 252, 248, 0.94)' : 'rgba(253, 252, 248, 0.82)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: scrolled ? '1px solid var(--color-nude)' : '1px solid transparent',
        padding: scrolled ? '0.75rem 0' : '1.1rem 0',
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        {/* Studio Identity / Logo */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            navigateWithTransition('/', 'HOME');
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.85rem',
            textDecoration: 'none',
            transition: 'opacity 0.25s ease',
            cursor: 'pointer',
          }}
          className="hover:opacity-85"
        >
          <Logo
            variant="dark"
            height={scrolled ? 34 : 38}
            withText={false}
          />
          <div className="flex flex-col text-left">
            <span
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.05rem',
                letterSpacing: '0.14em',
                fontWeight: 500,
                lineHeight: 1.1,
                color: '#1E1B18',
                textTransform: 'uppercase',
              }}
            >
              RAVEN &amp; LENS
            </span>
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.55rem',
                letterSpacing: '0.28em',
                fontWeight: 600,
                color: '#7A6E5D',
                textTransform: 'uppercase',
                marginTop: '1px',
              }}
            >
              PHOTOGRAPHY
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '2.75rem',
          }}
          className="desktop-nav"
        >
          {navLinks.map((link) => {
            const isCurrent = link.isActive;

            if (link.to) {
              return (
                <a
                  key={link.label}
                  href={link.to}
                  onClick={(e) => {
                    e.preventDefault();
                    navigateWithTransition(link.to, link.label.toUpperCase());
                  }}
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.8125rem',
                    fontWeight: 500,
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: 'var(--color-obsidian)',
                    position: 'relative',
                    padding: '0.35rem 0',
                    textDecoration: 'none',
                    cursor: 'pointer',
                    transition: 'color 0.25s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#7A7770';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--color-obsidian)';
                  }}
                >
                  {link.label}
                  {/* Subtle active underline indicator matching reference */}
                  {isCurrent && (
                    <span
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '1.5px',
                        backgroundColor: 'var(--color-obsidian)',
                        borderRadius: '1px',
                      }}
                    />
                  )}
                </a>
              );
            }

            return (
              <a
                key={link.label}
                href={link.hash || '#'}
                onClick={(e) => handleNavClick(e, link)}
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: 'var(--color-obsidian)',
                  position: 'relative',
                  padding: '0.35rem 0',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  transition: 'color 0.25s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#7A7770';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--color-obsidian)';
                }}
              >
                {link.label}
                {isCurrent && (
                  <span
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '1.5px',
                      backgroundColor: 'var(--color-obsidian)',
                      borderRadius: '1px',
                    }}
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Right CTA Button & Mobile Trigger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <button
            onClick={() => {
              if (location.pathname === '/services') {
                const el = document.getElementById('booking-form');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else window.scrollTo({ top: 500, behavior: 'smooth' });
              } else {
                navigateWithTransition('/services', 'SERVICES');
              }
            }}
            className="btn-primary"
            style={{
              padding: '0.65rem 1.45rem',
              fontSize: '0.75rem',
              letterSpacing: '0.16em',
            }}
          >
            <span>Book a Session</span>
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
          {navLinks.map((link) => {
            if (link.to) {
              return (
                <a
                  key={link.label}
                  href={link.to}
                  onClick={(e) => {
                    e.preventDefault();
                    setMobileMenuOpen(false);
                    navigateWithTransition(link.to, link.label.toUpperCase());
                  }}
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.5rem',
                    color: 'var(--color-obsidian)',
                    textDecoration: 'none',
                    borderBottom: '1px solid var(--color-nude-subtle)',
                    paddingBottom: '0.75rem',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span>{link.label}</span>
                  {link.isActive && (
                    <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-sans)', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-obsidian-light)' }}>
                      Active
                    </span>
                  )}
                </a>
              );
            }

            return (
              <a
                key={link.label}
                href={link.hash || '#'}
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  handleNavClick(e, link);
                }}
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.5rem',
                  color: 'var(--color-obsidian)',
                  textDecoration: 'none',
                  borderBottom: '1px solid var(--color-nude-subtle)',
                  paddingBottom: '0.75rem',
                  cursor: 'pointer',
                }}
              >
                {link.label}
              </a>
            );
          })}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              navigateWithTransition('/services', 'SERVICES');
            }}
            className="btn-primary"
            style={{ width: '100%', marginTop: '0.5rem' }}
          >
            Book a Session
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
