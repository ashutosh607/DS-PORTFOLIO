import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import HeroSpotlightCarousel from './HeroSpotlightCarousel';
import WhatWeDoEditorial from './WhatWeDoEditorial';
import AboutSection from './AboutSection';

export default function HomePage() {
  const location = useLocation();

  useEffect(() => {
    // Smooth scroll to anchor if present in URL
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location]);

  return (
    <main>
      {/* Hero Spotlight Gallery */}
      <HeroSpotlightCarousel />

      {/* Spacious, Artistic Editorial Photography Section: What We Do */}
      <WhatWeDoEditorial />

      {/* Studio About section with artist portrait, philosophy & exhibition history */}
      <AboutSection />
    </main>
  );
}
