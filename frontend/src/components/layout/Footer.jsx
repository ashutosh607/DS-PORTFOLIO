import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo from './Logo';

export default function Footer({ onOpenInquiry }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socialLinks = [
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/dishant_shelar_photography/',
      handle: '@dishant_shelar_photography',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
      ),
    },
    {
      name: 'Facebook',
      href: 'https://www.facebook.com/people/D-S-Photography/100063684198604/?ref=PRODASH_UPSELL_xav_ig_profile_page_web#',
      handle: 'D S Photography',
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
        </svg>
      ),
    },
    {
      name: 'YouTube',
      href: 'https://www.youtube.com/@utopia_47',
      handle: '@utopia_47',
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    },
  ];

  return (
    <motion.footer
      initial={{ opacity: 0, y: 35, filter: 'blur(10px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      style={{
        backgroundColor: '#101010',
        color: 'rgba(243, 240, 233, 0.7)',
        borderTop: '1px solid rgba(227, 219, 204, 0.1)',
        paddingTop: '80px',
        paddingBottom: '40px',
      }}
    >
      <div
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          paddingLeft: 'clamp(24px, 5vw, 80px)',
          paddingRight: 'clamp(24px, 5vw, 80px)',
        }}
      >
        {/* Main Balanced Multi-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-14 pb-14 border-b border-[#E3DBCC]/10 items-start">

          {/* Left Branding Block with Side-by-Side Logo (6 columns) */}
          <div className="md:col-span-6 space-y-4 pr-0 lg:pr-12">
            {/* Side-by-Side Logo & Studio Identity */}
            <div className="flex items-center gap-4">
              <Logo variant="light" height={48} withText={false} />
              <div className="flex flex-col">
                <span
                  style={{ fontFamily: 'var(--font-serif)' }}
                  className="text-xl sm:text-2xl font-medium tracking-[0.1em] text-[#FDFCF8] uppercase leading-tight"
                >
                  DS PHOTOGRAPHY
                </span>
                <span className="font-sans text-[10px] tracking-[0.24em] text-[#CBB9A4] uppercase font-semibold mt-1">
                  • Photography • Videography • Films
                </span>
              </div>
            </div>

            <p className="font-sans text-xs sm:text-[13px] text-[#F3F0E9]/65 leading-relaxed max-w-sm pt-1">
              Capturing authentic celebrations, honest emotion, and cinematic wedding films with fine-art craftsmanship.
            </p>

            <div className="pt-2">
              <Link
                to="/services#book"
                className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.18em] text-[#CBB9A4] hover:text-[#FDFCF8] transition-colors"
              >
                <span>Reserve Event Date</span>
                <span>→</span>
              </Link>
            </div>
          </div>

          {/* Navigation Column (3 columns) */}
          <div className="md:col-span-3">
            <span className="block font-sans text-[10px] font-semibold tracking-[0.2em] text-[#E3DBCC]/70 uppercase mb-4">
              Navigation
            </span>
            <ul className="space-y-3 font-sans text-xs sm:text-[13px]">
              <li>
                <Link to="/" className="text-[#F3F0E9]/65 hover:text-[#FDFCF8] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/collections" className="text-[#F3F0E9]/65 hover:text-[#FDFCF8] transition-colors">
                  Collections &amp; Portfolio
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-[#F3F0E9]/65 hover:text-[#FDFCF8] transition-colors">
                  Services &amp; Pricing
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-[#F3F0E9]/90 font-medium hover:text-[#FDFCF8] transition-colors flex items-center gap-1.5">
                  <span>Terms &amp; Conditions</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#FAF8F5]/10 text-[#CBB9A4] uppercase tracking-wider">Policy</span>
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenInquiry}
                  className="text-[#F3F0E9]/65 hover:text-[#FDFCF8] transition-colors cursor-pointer bg-transparent border-0 p-0 font-sans text-xs sm:text-[13px]"
                >
                  Direct Studio Inquiry
                </button>
              </li>
            </ul>
          </div>

          {/* Social Links Column: Instagram, Facebook, YouTube (3 columns) */}
          <div className="md:col-span-3">
            <span className="block font-sans text-[10px] font-semibold tracking-[0.2em] text-[#E3DBCC]/70 uppercase mb-4">
              Connect With Us
            </span>
            <ul className="space-y-3 font-sans text-xs sm:text-[13px]">
              {socialLinks.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 text-[#F3F0E9]/65 hover:text-[#FDFCF8] transition-colors group"
                  >
                    <span className="text-[#CBB9A4] group-hover:text-[#FDFCF8] transition-colors">
                      {item.icon}
                    </span>
                    <span>{item.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Copyright, Terms & Back to Top Row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans text-xs text-[#F3F0E9]/50">
          <div className="flex flex-wrap items-center gap-3">
            <p>
              © {new Date().getFullYear()} DS Photography &amp; Films. All rights reserved.
            </p>
            <span className="text-[#E3DBCC]/20">•</span>
            <Link to="/terms" className="text-[#E3DBCC]/70 hover:text-[#FDFCF8] transition-colors underline-offset-4 hover:underline">
              Payment Terms &amp; Delivery Timeline
            </Link>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-[#E3DBCC]/70 hover:text-[#FDFCF8] transition-colors cursor-pointer bg-transparent border-0"
          >
            <span>Back to top</span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 15l-6-6-6 6" />
            </svg>
          </button>
        </div>

      </div>
    </motion.footer>
  );
}
