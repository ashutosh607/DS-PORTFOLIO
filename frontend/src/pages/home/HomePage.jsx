import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useLocation } from 'react-router-dom';
import HeroSpotlightCarousel from '../../components/home/HeroSpotlightCarousel';
import SEOHead from '../../components/common/SEOHead';
import { buildLocalBusinessSchema, buildWebSiteSchema, buildServicesListSchema } from '../../utils/structuredData';
import { SEO_CONFIG } from '../../utils/seoConfig';

// Below-the-fold components lazy loaded on demand to minimize initial mobile JS bundle & LCP blocking
const WhatWeDoEditorial = lazy(() => import('../../components/home/WhatWeDoEditorial'));
const AboutSection = lazy(() => import('../../components/home/AboutSection'));

export default function HomePage() {
  const location = useLocation();
  const [loadBelowTheFold, setLoadBelowTheFold] = useState(false);

  useEffect(() => {
    // If navigated with hash (e.g. #what-we-do or #about), load immediately
    if (location.hash) {
      setLoadBelowTheFold(true);
      const el = document.querySelector(location.hash);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

      // Defer loading below-the-fold components for 3.5s or upon user scroll/touch to give 100% bandwidth & CPU to LCP hero image
      const timer = setTimeout(() => {
        setLoadBelowTheFold(true);
      }, 3500);

      const triggerLoad = () => {
        setLoadBelowTheFold(true);
        window.removeEventListener('scroll', triggerLoad);
        window.removeEventListener('touchstart', triggerLoad);
      };

      window.addEventListener('scroll', triggerLoad, { passive: true, once: true });
      window.addEventListener('touchstart', triggerLoad, { passive: true, once: true });

      return () => {
        clearTimeout(timer);
        window.removeEventListener('scroll', triggerLoad);
        window.removeEventListener('touchstart', triggerLoad);
      };
    }
  }, [location.pathname, location.hash]);

  return (
    <>
      <SEOHead
        title="Wedding Photographer in Mumbai | DS Photography &amp; Films"
        description="Looking for a wedding photographer in Mumbai? Explore wedding photography, pre-wedding sessions, portraits and cinematic films by DS Photography &amp; Films. View our portfolio and enquire about your date."
        keywords="photographer in mumbai, wedding photographer in mumbai, pre-wedding photographer in mumbai, candid wedding photographer in mumbai, portrait photographer in mumbai, event photographer in mumbai, wedding photography and films in mumbai, ds photography, dishant shelar"
        canonicalUrl={`${SEO_CONFIG.siteUrl}/`}
        ogType="website"
        schema={[
          buildLocalBusinessSchema(),
          buildWebSiteSchema(),
          buildServicesListSchema(),
        ]}
      />

      <main>
        {/* Hero Spotlight Gallery - Critical Above The Fold */}
        <HeroSpotlightCarousel />

        {loadBelowTheFold && (
          <Suspense fallback={<div className="min-h-[400px] bg-[var(--color-off-white)]" />}>
            {/* Spacious, Artistic Editorial Photography Section: What We Do */}
            <WhatWeDoEditorial />

            {/* Studio About section with artist portrait, philosophy & exhibition history */}
            <AboutSection />
          </Suspense>
        )}
      </main>
    </>
  );
}
