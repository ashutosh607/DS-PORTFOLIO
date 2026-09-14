import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw, Home, ChevronDown, ChevronUp } from 'lucide-react';
import Logo from '../../components/layout/Logo';

export default function ErrorPage({
  error = null,
  resetErrorBoundary = null,
}) {
  const [showDetails, setShowDetails] = useState(false);

  const handleReload = () => {
    if (resetErrorBoundary) {
      resetErrorBoundary();
    }
    window.location.reload();
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div
      className="min-h-screen relative flex flex-col justify-between items-center px-4 py-8 sm:py-12 overflow-hidden select-none"
      style={{
        backgroundColor: '#FAF9F6',
        color: '#101010',
      }}
    >
      {/* Ambient background glow */}
      <div
        className="absolute inset-0 pointer-events-none opacity-50"
        style={{
          background:
            'radial-gradient(ellipse at 50% 30%, rgba(200, 160, 140, 0.25) 0%, rgba(250, 249, 246, 0) 75%)',
        }}
      />

      {/* Top Header */}
      <header className="relative z-10 w-full max-w-[1240px] flex justify-between items-center pt-2 px-2 sm:px-6">
        <a
          href="/"
          className="inline-flex items-center gap-3 no-underline transition-opacity hover:opacity-80"
        >
          <Logo variant="dark" height={36} withText={false} />
          <span className="font-serif tracking-[0.16em] text-[13px] text-[#1E1B18] font-medium hidden sm:inline">
            DS PHOTOGRAPHY &amp; FILMS
          </span>
        </a>

        <div className="flex items-center gap-2 font-mono text-[10px] sm:text-[11px] tracking-[0.24em] text-[#8C3A3A] uppercase">
          <span className="w-2 h-2 rounded-full bg-[#8C3A3A] inline-block animate-ping" />
          <span>RUNTIME EXCEPTION</span>
        </div>
      </header>

      {/* Center Main Card */}
      <main className="relative z-10 my-auto py-12 flex flex-col items-center text-center max-w-[700px] px-4">
        {/* Eyebrow badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#ECC8C8] bg-[#FDF8F8] text-[11px] font-mono tracking-[0.22em] text-[#8C3A3A] uppercase mb-6 shadow-sm"
        >
          <AlertCircle size={13} strokeWidth={1.7} />
          <span>TECHNICAL INTERRUPT</span>
        </motion.div>

        {/* Large Decorative 500 Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative select-none"
        >
          <span
            className="block font-serif text-[90px] sm:text-[140px] md:text-[170px] font-light leading-none tracking-[-0.03em] text-[#8C3A3A]/10 select-none pointer-events-none"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            500
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="font-script text-3xl sm:text-4xl text-[#7A6E5D] rotate-[-3deg] tracking-wide"
              style={{ fontFamily: 'var(--font-script)' }}
            >
              momentary disruption&hellip;
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
          AN UNEXPECTED ANOMALY OCCURRED
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="font-sans text-[14px] sm:text-[15px] text-[#5A544C] max-w-[500px] leading-relaxed mb-8"
        >
          We encountered an unexpected condition while rendering this visual folio.
          Your private gallery experience can be restored immediately by reloading.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-center justify-center gap-3.5 w-full max-w-[480px]"
        >
          <button
            type="button"
            onClick={handleReload}
            className="inline-flex items-center gap-2.5 px-6 py-3 bg-[#1E1B18] text-[#FAF8F5] text-[12px] font-sans font-medium tracking-[0.16em] uppercase rounded-full hover:bg-[#34302B] hover:shadow-lg transition-all duration-300 cursor-pointer"
          >
            <RefreshCw size={14} strokeWidth={1.8} />
            <span>Reload Studio</span>
          </button>

          <button
            type="button"
            onClick={handleGoHome}
            className="inline-flex items-center gap-2.5 px-6 py-3 bg-[#FDFCF8] text-[#1E1B18] border border-[#D6CBB9] text-[12px] font-sans font-medium tracking-[0.16em] uppercase rounded-full hover:bg-[#F5EFE6] transition-all duration-300 cursor-pointer"
          >
            <Home size={14} strokeWidth={1.8} className="text-[#7A6E5D]" />
            <span>Return to Sanctuary</span>
          </button>
        </motion.div>

        {/* Optional Collapsible Technical Details for Debugging */}
        {error && (
          <div className="w-full mt-8 max-w-[600px] text-left">
            <button
              type="button"
              onClick={() => setShowDetails(!showDetails)}
              className="w-full flex items-center justify-between px-4 py-2.5 bg-[#F2EDE4] rounded-lg border border-[#E3DBCC] text-[11px] font-mono text-[#5A544C] hover:text-[#1E1B18] transition-colors cursor-pointer"
            >
              <span>TECHNICAL DIAGNOSTICS</span>
              {showDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {showDetails && (
              <div className="mt-2 p-4 bg-[#1E1B18] text-[#FAF8F5] rounded-lg text-[11px] font-mono overflow-auto max-h-[200px] leading-relaxed border border-[#333]">
                <p className="text-[#FF8080] font-semibold mb-2">
                  {error?.toString?.() || 'Unknown Runtime Error'}
                </p>
                {error?.stack && (
                  <pre className="text-[#A49B8D] text-[10px] whitespace-pre-wrap">
                    {error.stack}
                  </pre>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Bottom Footer Credits */}
      <footer className="relative z-10 w-full max-w-[1240px] flex justify-between items-center pt-6 pb-2 border-t border-[#E8E0D2] text-[10px] sm:text-[11px] font-mono tracking-[0.2em] text-[#8C8070] uppercase">
        <span>&copy; {new Date().getFullYear()} DS PHOTOGRAPHY &amp; FILMS</span>
        <span>STUDIO ERROR HANDLER</span>
      </footer>
    </div>
  );
}
