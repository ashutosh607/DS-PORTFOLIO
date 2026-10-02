import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Logo from './Logo';
import { usePageTransition } from '../common/PageTransition';
import StaggeredMenu from './StaggeredMenu';

export default function Navbar({ onOpenInquiry }) {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { navigateWithTransition } = usePageTransition();

  const mobileMenuItems = [
    { label: 'Home', ariaLabel: 'Go to home page', link: '/' },
    { label: 'Collections', ariaLabel: 'Explore photo collections', link: '/collections' },
    { label: 'Services', ariaLabel: 'Photographer services & pricing', link: '/services' },
    { label: 'Book a Session', ariaLabel: 'Book a photography session', link: '/services#book', isBooking: true },
  ];

  const handleMobileMenuClick = (it) => {
    if (it.isBooking || it.link === '/services#book') {
      if (location.pathname === '/services') {
        window.dispatchEvent(new CustomEvent('open-booking-form'));
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        navigateWithTransition('/services#book', 'SERVICES');
      }
    } else {
      navigateWithTransition(it.link, it.label.toUpperCase());
    }
  };

  const socialItems = [
    { label: 'Instagram', link: 'https://www.instagram.com/dishant_shelar_photography/' },
    { label: 'WhatsApp', link: 'https://wa.me/919876543210' },
    { label: 'Inquiries', link: 'mailto:ashutoshkadam2406@gmail.com' },
  ];

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
      id="site-navbar"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        zIndex: 1000,
        transition: 'background-color 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease, padding 0.35s ease',
        backgroundColor: scrolled ? 'rgba(253, 252, 248, 0.96)' : 'rgba(253, 252, 248, 0.84)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: scrolled ? '1px solid var(--color-nude)' : '1px solid transparent',
        boxShadow: scrolled ? '0 4px 20px -4px rgba(20, 18, 15, 0.08)' : 'none',
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
            height={scrolled ? 36 : 42}
            withText={false}
          />
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

        {/* Right CTA Button & Mobile StaggeredMenu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <button
            onClick={() => {
              if (location.pathname === '/services') {
                window.dispatchEvent(new CustomEvent('open-booking-form'));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else {
                navigateWithTransition('/services#book', 'SERVICES');
              }
            }}
            className="btn-primary desktop-cta"
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

          {/* StaggeredMenu from React Bits for Small Devices */}
          <div className="mobile-staggered-menu">
            <StaggeredMenu
              position="right"
              items={mobileMenuItems}
              socialItems={socialItems}
              displaySocials={true}
              displayItemNumbering={true}
              showLogo={false}
              menuButtonColor="#1E1B18"
              openMenuButtonColor="#1E1B18"
              accentColor="#685444"
              colors={['#E6DAC8', '#CBB9A4', '#8C7764']}
              onItemClick={handleMobileMenuClick}
            />
          </div>
        </div>
      </div>

      {/* Responsive media query styling */}
      <style>{`
        @media (min-width: 1024px) {
          .desktop-nav {
            display: flex !important;
          }
          .desktop-cta {
            display: inline-flex !important;
          }
          .mobile-staggered-menu {
            display: none !important;
          }
        }
        @media (max-width: 1023px) {
          .desktop-nav {
            display: none !important;
          }
          .desktop-cta {
            display: none !important;
          }
          .mobile-staggered-menu {
            display: block !important;
          }
        }
      `}</style>
    </header>
  );
}
