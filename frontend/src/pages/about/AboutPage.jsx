import React, { useEffect } from 'react';
import SEOHead from '../../components/common/SEOHead';
import AboutSection from '../../components/home/AboutSection';
import { buildBreadcrumbSchema, buildLocalBusinessSchema } from '../../utils/structuredData';
import { SEO_CONFIG } from '../../utils/seoConfig';

export default function AboutPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'About', url: '/about' },
  ];

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SEO_CONFIG.siteUrl}/#dishant`,
    name: SEO_CONFIG.photographerName,
    jobTitle: SEO_CONFIG.photographerRole,
    worksFor: {
      '@type': 'LocalBusiness',
      name: SEO_CONFIG.brandName,
      url: SEO_CONFIG.siteUrl,
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Mumbai',
      addressRegion: 'Maharashtra',
      addressCountry: 'IN',
    },
    description: 'Mumbai-based fine-art wedding photographer and cinematographer specializing in candid, documentary-style wedding stories and editorial portraiture.',
    sameAs: [
      SEO_CONFIG.socials.instagram,
      SEO_CONFIG.socials.facebook,
      SEO_CONFIG.socials.youtube,
    ],
  };

  return (
    <>
      <SEOHead
        title="About Dishant Shelar | Photographer in Mumbai"
        description="Learn about Dishant Shelar, professional photographer in Mumbai behind DS Photography & Films. Explore our candid approach, experience and studio philosophy."
        keywords="about dishant shelar, dishant shelar photographer, photographer in mumbai, professional photographer in mumbai, wedding photographer mumbai, portrait photographer mumbai, ds photography"
        canonicalUrl={`${SEO_CONFIG.siteUrl}/about`}
        ogType="profile"
        schema={[
          buildLocalBusinessSchema(`${SEO_CONFIG.siteUrl}/about`),
          buildBreadcrumbSchema(breadcrumbs),
          personSchema,
        ]}
      />

      <main className="min-h-screen bg-[#FDFCF8]">
        <AboutSection />
      </main>
    </>
  );
}
