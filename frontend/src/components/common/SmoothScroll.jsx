import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

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

    const isMobile = window.innerWidth < 768;

    let lenisInstance = null;
    let tickerUpdate = null;

    // Defer initialization slightly so initial FCP and LCP render uninterrupted
    const initTimer = setTimeout(() => {
      const lenis = new Lenis({
        duration: isMobile ? 1.0 : 1.35,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Deep exponential ease-out for velvet glide
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 0.88,
        touchMultiplier: 1.0,
        syncTouch: false, // Maintain native, zero-lag 120Hz touch scrolling on mobile to keep TBT & INP at 0
        infinite: false,
      });

      lenisInstance = lenis;
      window.lenis = lenis;

      // Connect Lenis to ScrollTrigger for perfectly synchronized scrub & trigger updates
      lenis.on('scroll', ScrollTrigger.update);

      // Sync GSAP ticker with Lenis raf for buttery 60/120fps lockstep execution
      tickerUpdate = (time) => {
        lenis.raf(time * 1000);
      };
      gsap.ticker.add(tickerUpdate);
      gsap.ticker.lagSmoothing(0);
    }, 60);

    return () => {
      clearTimeout(initTimer);
      if (tickerUpdate) {
        gsap.ticker.remove(tickerUpdate);
      }
      if (lenisInstance) {
        lenisInstance.destroy();
        if (window.lenis === lenisInstance) {
          window.lenis = null;
        }
      }
    };
  }, [location.pathname]);

  return children;
}
