import React from 'react';
import Logo from './Logo';

export default function Footer({ onOpenInquiry }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      style={{
        backgroundColor: '#101010',
        color: 'rgba(243, 240, 233, 0.7)',
        borderTop: '1px solid rgba(227, 219, 204, 0.1)',
        paddingTop: '100px',
        paddingBottom: '50px',
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
          
          {/* Left Branding Block (6 columns) */}
          <div className="md:col-span-6 space-y-4 pr-0 lg:pr-12">
            <Logo variant="light" height={42} withText={true} />
            <p className="font-sans text-xs sm:text-[13px] text-[#F3F0E9]/60 leading-relaxed max-w-sm">
              Fine art editorial photography, cinematic films, and spatial monographs. Available for private commissions worldwide.
            </p>
            <div className="flex items-center gap-2 text-xs font-sans tracking-wider text-[#E3DBCC]/60 pt-1">
              <span>Paris</span>
              <span className="text-[#E3DBCC]/30">•</span>
              <span>London</span>
              <span className="text-[#E3DBCC]/30">•</span>
              <span>Commissions Worldwide</span>
            </div>
          </div>

          {/* Navigation Column (3 columns) */}
          <div className="md:col-span-3">
            <span className="block font-sans text-[10px] font-semibold tracking-[0.2em] text-[#E3DBCC]/70 uppercase mb-4">
              Navigation
            </span>
            <ul className="space-y-3 font-sans text-xs sm:text-[13px]">
              {[
                { name: 'Home', href: '/' },
                { name: 'Collections', href: '/collections' },
                { name: 'Services & Pricing', href: '/services' },
                { name: 'Private Inquiry', onClick: onOpenInquiry },
              ].map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href || '#'}
                    onClick={(e) => {
                      if (item.onClick) {
                        e.preventDefault();
                        item.onClick();
                      }
                    }}
                    className="text-[#F3F0E9]/65 hover:text-[#FDFCF8] transition-colors cursor-pointer"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links Column (3 columns) */}
          <div className="md:col-span-3">
            <span className="block font-sans text-[10px] font-semibold tracking-[0.2em] text-[#E3DBCC]/70 uppercase mb-4">
              Archive & Social
            </span>
            <ul className="space-y-3 font-sans text-xs sm:text-[13px]">
              {[
                'Instagram (@edouard)',
                'Substack Monograph',
                'Behance Curated',
                'VSCO Journal',
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#social"
                    onClick={(e) => e.preventDefault()}
                    className="text-[#F3F0E9]/65 hover:text-[#FDFCF8] transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Back to Top Row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans text-xs text-[#F3F0E9]/40">
          <p>
            © {new Date().getFullYear()} Maison Édouard / DS Photography. All rights reserved.
          </p>

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
    </footer>
  );
}
