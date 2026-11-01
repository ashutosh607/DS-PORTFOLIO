import React, { useEffect, Suspense, lazy } from 'react';
import { useLocation } from 'react-router-dom';
import HeroSpotlightCarousel from '../../components/home/HeroSpotlightCarousel';
import KeywordMarqueeSection from '../../components/home/KeywordMarqueeSection';
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
const EditorialDisciplinesSection = lazy(() => import('../../components/home/EditorialDisciplinesSection'));
const ArtAndApproachSection = lazy(() => import('../../components/home/ArtAndApproachSection'));
const WhyChooseSection = lazy(() => import('../../components/home/WhyChooseSection'));
const WhatWeDoEditorial = lazy(() => import('../../components/home/WhatWeDoEditorial'));
const ClosingCtaSection = lazy(() => import('../../components/home/ClosingCtaSection'));

export default function HomePage() {
  const location = useLocation();

  useEffect(() => {
    // If navigated with hash (e.g. #disciplines, #why-choose, #about, or #faq), scroll to target
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 120);
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
        title="Photographer in Mumbai | Wedding & Portrait Photography – DS Photography"
        description="Leading photographer in Mumbai, DS Photography & Films captures bespoke weddings, candid pre-wedding shoots, and fine-art portraits by Dishant Shelar."
        keywords="photographer in mumbai, wedding photographer in mumbai, pre wedding photographer in mumbai, professional photographer in mumbai, portrait photographer in mumbai, event photographer in mumbai, wedding photography in mumbai, photography studio in mumbai, candid wedding photographer mumbai, dishant shelar"
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
        {/* Section A: Hero Spotlight Gallery & Story Disclosure */}
        <HeroSpotlightCarousel />

        {/* Section F: Studio Disciplines & Locations Marquee */}
        <KeywordMarqueeSection />

        <Suspense fallback={<div className="min-h-[300px] bg-[var(--color-off-white)]" />}>
          {/* Section B: 4 Tall Image-Led Discipline Cards with Sliding Overlays */}
          <EditorialDisciplinesSection />

          {/* Section C: The Art & Approach Scroll-Linked Word Reveal & Arch Photo */}
          <ArtAndApproachSection />

          {/* Section D: Why Choose DS Photography & Films (5 Rows, Arch Photo & Dark Card) */}
          <WhyChooseSection />

          {/* Section 5: Pinned Scroll Monograph Deck ("Our Photography Portfolio") */}
          <WhatWeDoEditorial />

          {/* Section E: Minimalist Numbered Accordion FAQ */}
          <EditorialFaqSection />

          {/* Section G: Closing Atmospheric Call-To-Action Card */}
          <ClosingCtaSection />
        </Suspense>
      </main>
    </>
  );
}
