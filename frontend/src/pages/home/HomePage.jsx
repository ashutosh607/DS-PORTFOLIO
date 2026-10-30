import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useLocation } from 'react-router-dom';
import HeroSpotlightCarousel from '../../components/home/HeroSpotlightCarousel';
import SEOHead from '../../components/common/SEOHead';
import {
  buildLocalBusinessSchema,
  buildWebSiteSchema,
  buildServicesListSchema,
  buildFaqSchema,
} from '../../utils/structuredData';
import { SEO_CONFIG } from '../../utils/seoConfig';
import EditorialFaqSection, { HOMEPAGE_FAQS } from '../../components/home/EditorialFaqSection';

// Below-the-fold components lazily loaded via React Suspense
const WhatWeDoEditorial = lazy(() => import('../../components/home/WhatWeDoEditorial'));
const AboutSection = lazy(() => import('../../components/home/AboutSection'));

export default function HomePage() {
  const location = useLocation();

  useEffect(() => {
    // If navigated with hash (e.g. #what-we-do, #about, or #faq), scroll to target
    if (location.hash) {
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
    }
  }, [location.pathname, location.hash]);

  const faqSchema = buildFaqSchema(HOMEPAGE_FAQS);

  return (
    <>
      <SEOHead
        title="Wedding Photographer in Mumbai | DS Photography &amp; Films"
        description="DS Photography &amp; Films captures weddings, pre-wedding moments and portraits in Mumbai through timeless photography and cinematic films. Enquire today."
        keywords="photographer in mumbai, wedding photographer in mumbai, pre-wedding photographer in mumbai, candid wedding photographer in mumbai, portrait photographer in mumbai, event photographer in mumbai, wedding photography and films in mumbai, ds photography, dishant shelar"
        canonicalUrl={`${SEO_CONFIG.siteUrl}/`}
        ogType="website"
        schema={[
          buildLocalBusinessSchema(),
          buildWebSiteSchema(),
          buildServicesListSchema(),
          ...(faqSchema ? [faqSchema] : []),
        ]}
      />

      <main>
        {/* Hero Spotlight Gallery - Critical Above The Fold */}
        <HeroSpotlightCarousel />

        <Suspense fallback={<div className="min-h-[300px] bg-[var(--color-off-white)]" />}>
          {/* Spacious, Artistic Editorial Photography Section: What We Do */}
          <WhatWeDoEditorial />

          {/* Studio About section with artist portrait, philosophy & identity */}
          <AboutSection />

          {/* Answer Engine Optimization (AEO) Editorial FAQ Section */}
          <EditorialFaqSection />
        </Suspense>
      </main>
    </>
  );
}
