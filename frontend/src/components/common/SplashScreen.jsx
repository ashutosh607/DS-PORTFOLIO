import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dsLogoDark from '../../assets/ds-logo-dark.png';

/**
 * Clean Studio Logo Splash Screen
 * 
 * Displays ONLY the logo in the middle in a big, proper size on initial visit,
 * and then smoothly fades out to reveal the website.
 */
export default function SplashScreen({ onComplete }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Prevent background scrolling while splash is active
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Start smooth fade-out after ~1.6s
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 1600);

    // Optional: allow click or keypress to immediately start fade-out
    const handleDismiss = () => {
      setIsVisible(false);
    };

    window.addEventListener('keydown', handleDismiss);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleDismiss);
      document.body.style.overflow = originalOverflow;
    };
  }, []);

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
              className="object-contain w-auto select-none pointer-events-none"
              style={{
                height: 'clamp(180px, 32vh, 340px)',
                maxWidth: 'min(90vw, 560px)',
                display: 'block',
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
