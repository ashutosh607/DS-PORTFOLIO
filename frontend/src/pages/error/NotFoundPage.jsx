import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Compass, Camera, Sparkles, Home } from 'lucide-react';
import Logo from '../../components/layout/Logo';
import { usePageTransition } from '../../components/common/PageTransition';
import SEOHead from '../../components/common/SEOHead';

export default function NotFoundPage() {
  const navigate = useNavigate();
  const { navigateWithTransition } = usePageTransition();

  const handleNav = (to, title) => {
    if (navigateWithTransition) {
      navigateWithTransition(to, title);
    } else {
      navigate(to);
    }
  };

  return (
    <div
      className="min-h-screen relative flex flex-col justify-between items-center px-4 py-8 sm:py-12 overflow-hidden select-none"
      style={{
        backgroundColor: '#FAF9F6',
        color: '#101010',
      }}
    >
      <SEOHead
        title="Page Not Found (404) | DS Photography & Films"
        description="The requested page could not be located in our active catalog."
        robots="noindex, follow"
      />
      {/* Subtle Warm Ambient Lighting */}
      <div
        className="absolute inset-0 pointer-events-none opacity-60"
        style={{
          background:
            'radial-gradient(ellipse at 50% 30%, rgba(227, 219, 204, 0.45) 0%, rgba(250, 249, 246, 0) 75%)',
        }}
      />

      {/* Top Editorial Brand Bar */}
      <header className="relative z-10 w-full max-w-[1240px] flex justify-between items-center pt-2 px-2 sm:px-6">
        <Link
          to="/"
          className="inline-flex items-center gap-3 no-underline transition-opacity hover:opacity-80"
        >
          <Logo variant="dark" height={36} withText={false} />
          <span className="font-serif tracking-[0.16em] text-[13px] text-[#1E1B18] font-medium hidden sm:inline">
            DS PHOTOGRAPHY &amp; FILMS
          </span>
        </Link>

        <div className="flex items-center gap-2 font-mono text-[10px] sm:text-[11px] tracking-[0.24em] text-[#7A756D] uppercase">
          <span className="w-2 h-2 rounded-full bg-[#C5B9A5] inline-block animate-pulse" />
          <span>STATUS // 404 UNRESOLVED</span>
        </div>
      </header>

      {/* Center 404 Artwork & Content */}
      <main className="relative z-10 my-auto py-12 flex flex-col items-center text-center max-w-[760px] px-4">
        {/* Editorial Pill Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#E3DBCC] bg-[#FDFCF8] text-[11px] font-mono tracking-[0.22em] text-[#7A6E5D] uppercase mb-6 shadow-sm"
        >
          <Compass size={13} strokeWidth={1.5} className="text-[#A48D78]" />
          <span>DISPLACED IN THE ARCHIVE</span>
        </motion.div>

        {/* Large Aesthetic 404 Headline */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative select-none"
        >
          <span
            className="block font-serif text-[100px] sm:text-[150px] md:text-[190px] font-light leading-none tracking-[-0.03em] text-[#1E1B18]/10 select-none pointer-events-none"
            style={{
              fontFamily: 'var(--font-serif)',
            }}
          >
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="font-script text-3xl sm:text-4xl md:text-5xl text-[#7A6E5D] rotate-[-4deg] tracking-wide"
              style={{ fontFamily: 'var(--font-script)' }}
            >
              a frame lost to time&hellip;
            </span>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#1E1B18] font-normal tracking-[0.06em] uppercase mt-2 mb-4 leading-tight"
        >
          THE MONOGRAPH CANNOT BE FOUND
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="font-sans text-[14px] sm:text-[15px] text-[#5A544C] max-w-[540px] leading-relaxed mb-8"
        >
          The folio, collection gallery, or page you are seeking has been archived,
          relocated, or never existed in our active catalog. Let us guide you back to
          our master collections.
        </motion.p>

        {/* Luxury Divider */}
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 64, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="h-[1px] bg-[#D6CBB9] mb-8"
        />

        {/* Action Button Navigation Grid */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-center justify-center gap-3.5 w-full max-w-[560px]"
        >
          <button
            type="button"
            onClick={() => handleNav('/', 'HOME')}
            className="inline-flex items-center gap-2.5 px-6 py-3 bg-[#1E1B18] text-[#FAF8F5] text-[12px] font-sans font-medium tracking-[0.16em] uppercase rounded-full hover:bg-[#34302B] hover:shadow-lg transition-all duration-300 cursor-pointer"
          >
            <Home size={14} strokeWidth={1.8} />
            <span>Return to Sanctuary</span>
          </button>

          <button
            type="button"
            onClick={() => handleNav('/collections', 'COLLECTIONS')}
            className="inline-flex items-center gap-2.5 px-6 py-3 bg-[#FDFCF8] text-[#1E1B18] border border-[#D6CBB9] text-[12px] font-sans font-medium tracking-[0.16em] uppercase rounded-full hover:bg-[#F5EFE6] hover:border-[#BAAA94] transition-all duration-300 cursor-pointer"
          >
            <Camera size={14} strokeWidth={1.8} className="text-[#7A6E5D]" />
            <span>Explore Collections</span>
          </button>

          <button
            type="button"
            onClick={() => handleNav('/services', 'SERVICES')}
            className="inline-flex items-center gap-2 px-5 py-3 text-[#5A544C] hover:text-[#1E1B18] text-[11px] font-mono tracking-[0.18em] uppercase transition-colors cursor-pointer"
          >
            <Sparkles size={13} strokeWidth={1.6} />
            <span>Services &amp; Pricing</span>
          </button>
        </motion.div>
      </main>

      {/* Bottom Footer Credits */}
      <footer className="relative z-10 w-full max-w-[1240px] flex flex-col sm:flex-row justify-between items-center gap-3 pt-6 pb-2 border-t border-[#E8E0D2] text-[10px] sm:text-[11px] font-mono tracking-[0.2em] text-[#8C8070] uppercase">
        <span>&copy; {new Date().getFullYear()} DS PHOTOGRAPHY &amp; FILMS</span>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 hover:text-[#1E1B18] transition-colors cursor-pointer"
        >
          <ArrowLeft size={12} />
          <span>GO BACK PREVIOUS FRAME</span>
        </button>
      </footer>
    </div>
  );
}
