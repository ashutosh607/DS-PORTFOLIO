import React, { useEffect, useRef } from 'react';

/**
 * Clean Studio Logo Splash Screen Controller
 * 
 * Directly orchestrates the initial splash screen for a 100% glitch-free,
 * velvety-smooth entrance and exit:
 * - Entrance: Logo smoothly focuses and breathes in via GPU-accelerated CSS from millisecond 0.
 * - Holding: Holds serenely in center for ~1000-1100ms total page load time.
 * - Exit: Dissolves seamlessly (opacity 1 -> 0, subtle scale up) over 0.75s to unveil the website.
 * - Zero flash, zero double-render, zero glitch!
 */
export default function SplashScreen({ onComplete }) {
  const isExitedRef = useRef(false);

  useEffect(() => {
    const staticSplash = document.getElementById('initial-splash-screen');

    // Prevent background scrolling while splash is active
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const triggerExit = () => {
      if (isExitedRef.current) return;
      isExitedRef.current = true;
      window.__dsSplashExiting = true;
      window.dispatchEvent(new CustomEvent('ds-splash-exit'));

      if (staticSplash) {
        staticSplash.classList.add('splash-exit');
        staticSplash.style.pointerEvents = 'none';

        // Wait for CSS transition (750ms) to complete smoothly
        setTimeout(() => {
          document.body.style.overflow = originalOverflow;
          window.__dsSplashDone = true;
          window.dispatchEvent(new CustomEvent('ds-splash-complete'));
          if (staticSplash.parentNode) {
            staticSplash.parentNode.removeChild(staticSplash);
          }
          if (onComplete) onComplete();
        }, 750);
      } else {
        document.body.style.overflow = originalOverflow;
        window.__dsSplashDone = true;
        window.dispatchEvent(new CustomEvent('ds-splash-complete'));
        if (onComplete) onComplete();
      }
    };

    if (staticSplash) {
      // Allow click or keydown to skip splash immediately
      staticSplash.addEventListener('click', triggerExit);
      window.addEventListener('keydown', triggerExit);

      // Holding duration: ensures the logo entrance (750ms) completes + brief elegant pause (~350ms)
      const pageAge = typeof performance !== 'undefined' ? performance.now() : 0;
      const remainingHold = Math.max(350, 1100 - pageAge);

      const timer = setTimeout(triggerExit, remainingHold);

      return () => {
        clearTimeout(timer);
        staticSplash.removeEventListener('click', triggerExit);
        window.removeEventListener('keydown', triggerExit);
        document.body.style.overflow = originalOverflow;
      };
    } else {
      document.body.style.overflow = originalOverflow;
      window.__dsSplashDone = true;
      window.dispatchEvent(new CustomEvent('ds-splash-complete'));
      if (onComplete) onComplete();
    }
  }, [onComplete]);

  return null;
}
