import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

/**
 * SmoothScroll Component
 * Integrates Studio Freight's Lenis for buttery-smooth, momentum-driven
 * scrolling across the portfolio, harmonizing with pinned editorial scroll animations.
 */
export default function SmoothScroll({ children }) {
  const location = useLocation();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Respect user preference for reduced motion
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    // Keep admin panel scroll native and immediate for data tables
    if (location.pathname.startsWith('/admin')) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.35,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Deep exponential ease-out for velvet glide
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.88, // Soft, controlled wheel stroke eliminating harsh notch jumps
      touchMultiplier: 1.5,
      infinite: false,
    });

    window.lenis = lenis;

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      if (window.lenis === lenis) {
        window.lenis = null;
      }
    };
  }, [location.pathname]);

  return children;
}
