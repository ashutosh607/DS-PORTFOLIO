import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import HeroSpotlightCarousel from '../../components/home/HeroSpotlightCarousel';
import WhatWeDoEditorial from '../../components/home/WhatWeDoEditorial';
import AboutSection from '../../components/home/AboutSection';
import SEOHead from '../../components/common/SEOHead';
import { buildLocalBusinessSchema, buildWebSiteSchema, buildServicesListSchema } from '../../utils/structuredData';
import { SEO_CONFIG } from '../../utils/seoConfig';

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
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  }, [location.pathname, location.hash]);

  return (
    <>
      <SEOHead
        title="Wedding &amp; Portrait Photographer in Mumbai | DS Photography &amp; Films"
        description="Fine art luxury wedding photographer and cinematographer based in Mumbai by Dishant Shelar. Candid wedding monographs, pre-wedding films, portraits, and heirloom albums."
        keywords="wedding photographer mumbai, photographer in mumbai, pre wedding photographer mumbai, candid wedding photography mumbai, wedding cinematography mumbai, portrait photographer mumbai, ds photography, dishant shelar"
        canonicalUrl={`${SEO_CONFIG.siteUrl}/`}
        ogType="website"
        schema={[
          buildLocalBusinessSchema(),
          buildWebSiteSchema(),
          buildServicesListSchema(),
        ]}
      />

      <main>
        {/* Hero Spotlight Gallery */}
        <HeroSpotlightCarousel />

        {/* Spacious, Artistic Editorial Photography Section: What We Do */}
        <WhatWeDoEditorial />

        {/* Studio About section with artist portrait, philosophy & exhibition history */}
        <AboutSection />
      </main>
    </>
  );
}
