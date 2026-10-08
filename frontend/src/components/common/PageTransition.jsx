import React, { createContext, useContext, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../layout/Logo';

// Global Transition Context
const TransitionContext = createContext({
  navigateWithTransition: () => {},
  isTransitioning: false,
});

export const usePageTransition = () => useContext(TransitionContext);

/**
 * Editorial Page Transition Provider & Overlay
 * Implements exact physical sequence:
 * 1. Curtain enters from TOP (translateY(-100%)) and covers screen to translateY(0%).
 * 2. Destination page title enters RIGHT -> LEFT (x: 80px -> 0) with blur-to-sharp reveal.
 * 3. Invisible route change when fully covered.
 * 4. Curtain exits DOWNWARD (translateY(0%) -> translateY(100%)).
 * 5. Destination page content enters with subtle RIGHT -> LEFT movement (x: 40px -> 0).
 */
export function PageTransitionProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [phase, setPhase] = useState('idle'); // 'idle' | 'covering' | 'revealing'
  const [destinationTitle, setDestinationTitle] = useState('');
  const isBusyRef = useRef(false);

  const getTitleForPath = (path) => {
    if (path === '/') return 'HOME';
    if (path === '/collections') return 'COLLECTIONS';
    if (path === '/services') return 'SERVICES';
    if (path === '/terms') return 'TERMS & CONDITIONS';
    const clean = path.replace('/', '').toUpperCase();
    return clean || 'PORTFOLIO';
  };

  const navigateWithTransition = (to, customTitle) => {
    // Prevent overlapping trigger
    if (isBusyRef.current) return;

    // Same route -> smooth scroll to top
    if (location.pathname === to) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    isBusyRef.current = true;
    const title = customTitle || getTitleForPath(to);
    setDestinationTitle(title);

    // 1. TOP -> DOWN COVER
    setPhase('covering');

    // Sequence timing matching exact specs:
    // Cover duration: ~700ms with cubic-bezier(0.76, 0, 0.24, 1)
    setTimeout(() => {
      // 3. ROUTE CHANGE invisibly while screen is completely covered
      navigate(to);
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

      // 4. REVEAL NEW PAGE: Move curtain from translateY(0) to translateY(100%)
      setPhase('revealing');

      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      });

      setTimeout(() => {
        // Reset overlay back to idle state
        setPhase('idle');
        isBusyRef.current = false;
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }, 720);
    }, 720);
  };

  // Easing specified: cubic-bezier(0.76, 0, 0.24, 1)
  const editorialEase = [0.76, 0, 0.24, 1];

  return (
    <TransitionContext.Provider
      value={{
        navigateWithTransition,
        isTransitioning: phase !== 'idle',
      }}
    >
      {children}

      {/* 2. Full-Screen Cream Editorial Curtain Overlay */}
      {phase !== 'idle' && (
        <motion.div
          key="transition-curtain"
          initial={{ y: phase === 'covering' ? '-100%' : '0%' }}
          animate={{ y: phase === 'covering' ? '0%' : '100%' }}
          transition={{
            duration: 0.72,
            ease: editorialEase,
          }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            backgroundColor: '#FAF9F6',
            pointerEvents: 'auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '2.5rem 2rem',
            boxShadow: '0 30px 70px -15px rgba(30, 27, 24, 0.35)',
            borderBottom: '1px solid #E6DAC8',
          }}
        >
          {/* Subtle warm ambient lighting */}
          <div
            className="absolute inset-0 pointer-events-none opacity-40 select-none"
            style={{
              background: 'radial-gradient(ellipse at 50% 40%, rgba(203, 185, 164, 0.5) 0%, transparent 70%)',
            }}
          />

          {/* Top Brand Tag */}
          <div className="relative z-10 w-full flex justify-between items-center max-w-[1280px] text-xs font-mono tracking-[0.25em] text-[#7A6E5D] uppercase select-none">
            <div className="flex items-center gap-3">
              <Logo variant="dark" height={32} withText={false} />
              <span className="font-serif tracking-[0.16em] text-[13px] text-[#1E1B18] font-medium hidden sm:inline">
                DS PHOTOGRAPHY &amp; FILMS
              </span>
            </div>
            <span className="text-[11px] tracking-[0.2em] text-[#7A6E5D]">EDITION 2026</span>
          </div>

          {/* Center Destination Title: RIGHT -> LEFT movement */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 my-auto">
            <span
              className="font-mono text-[11px] sm:text-xs font-semibold tracking-[0.32em] text-[#A48D78] uppercase mb-4 select-none"
            >
              NAVIGATING TO
            </span>

            <motion.h2
              key={`title-${destinationTitle}`}
              initial={{ x: 80, opacity: 0, filter: 'blur(8px)' }}
              animate={{ x: 0, opacity: 1, filter: 'blur(0px)' }}
              exit={{ x: -40, opacity: 0, filter: 'blur(6px)' }}
              transition={{
                duration: 0.62,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(2.8rem, 7.5vw, 6.25rem)',
                fontWeight: 400,
                letterSpacing: '0.06em',
                lineHeight: 1.05,
                color: '#1E1B18',
                textTransform: 'uppercase',
              }}
            >
              {destinationTitle}
            </motion.h2>

            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 72, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="h-[1.5px] bg-[#CBB9A4] mt-6"
            />
          </div>

          {/* Bottom Watermark */}
          <div className="relative z-10 w-full flex justify-between items-center max-w-[1280px] text-[10px] sm:text-xs font-mono tracking-[0.22em] text-[#8C8070] uppercase select-none">
            <span>FINE ART PHOTOGRAPHY &amp; CINEMA</span>
            <span>DS STUDIO FOLIO</span>
          </div>
        </motion.div>
      )}
    </TransitionContext.Provider>
  );
}

/**
 * Reusable PageTransition wrapper component
 */
export default function PageTransition({ children }) {
  return (
    <div className="page-transition-viewport w-full relative">
      {children}
    </div>
  );
}
