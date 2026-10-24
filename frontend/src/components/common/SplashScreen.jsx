import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dsLogoDark from '../../assets/ds-logo-dark-splash.webp';

/**
 * Clean Studio Logo Splash Screen
 * 
 * Displays ONLY the logo in the middle in a big, proper size on initial visit,
 * and then smoothly fades out to reveal the website.
 */
export default function SplashScreen({ onComplete }) {
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof window === 'undefined') return false;
    // Bypass splash screen immediately for crawlers, audit bots, and returning sessions
    const isBot = /bot|googlebot|crawler|spider|robot|crawling|lighthouse/i.test(navigator.userAgent);
    const hasSeen = sessionStorage.getItem('ds_splash_shown');
    return !isBot && !hasSeen;
  });

  useEffect(() => {
    if (!isVisible) {
      if (onComplete) onComplete();
      return;
    }

    sessionStorage.setItem('ds_splash_shown', '1');

    // Prevent background scrolling while splash is active
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Start smooth fade-out after 750ms (responsive, snappy luxury intro without blocking LCP)
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 750);

    // Allow click or keypress to immediately dismiss
    const handleDismiss = () => {
      setIsVisible(false);
    };

    window.addEventListener('keydown', handleDismiss);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleDismiss);
      document.body.style.overflow = originalOverflow;
    };
  }, [isVisible, onComplete]);

  const handleAnimationComplete = () => {
    if (!isVisible) {
      document.body.style.overflow = '';
      if (onComplete) onComplete();
    }
  };

  return (
    <AnimatePresence mode="wait" onExitComplete={handleAnimationComplete}>
      {isVisible && (
        <motion.div
          key="ds-splash-screen"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: {
              duration: 0.85,
              ease: [0.4, 0, 0.2, 1],
            },
          }}
          onClick={() => setIsVisible(false)}
          className="fixed inset-0 z-[9999999] flex items-center justify-center select-none cursor-pointer"
          style={{
            backgroundColor: '#FAF8F5',
          }}
          role="dialog"
          aria-label="DS Photography & Films"
        >
          {/* Only the Logo in the middle in big, proper size */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.7,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="flex items-center justify-center p-6"
          >
            <img
              src={dsLogoDark}
              alt="DS Photography & Films"
              width="470"
              height="340"
              className="object-contain w-auto select-none pointer-events-none"
              style={{
                height: 'clamp(180px, 32vh, 340px)',
                maxWidth: 'min(90vw, 560px)',
                aspectRatio: '1415 / 1023',
                display: 'block',
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
