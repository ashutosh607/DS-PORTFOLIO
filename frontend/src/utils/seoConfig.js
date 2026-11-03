/**
 * DS Photography & Films — Centralized SEO Configuration
 * Provides single source of truth for NAP, schemas, geographic relevance,
 * canonical domains, and page-specific metadata.
 */

export const SEO_CONFIG = {
  brandName: 'DS Photography & Films',
  shortBrandName: 'DS Photography',
  alternateBrandName: 'Dishant Shelar Photography',
  photographerName: 'Dishant Shelar',
  photographerRole: 'Lead Photographer, Cinematographer & Creative Director',
  tagline: 'Luxury Editorial Photography, Fine Art Cinematography & Portfolio',
  
  // Canonical Production Domain (Single source of truth for SEO canonical tags, Open Graph, and Structured Data)
  siteUrl: (import.meta.env.VITE_SITE_URL || 'https://www.dishantshelarphotography.in').replace(/\/$/, ''),

  // NAP Data (Name, Address, Phone)
  contact: {
    phone: '+91 90823 78510',
    phoneRaw: '919082378510',
    email: 'dishantshelar59@gmail.com',
    addressLocality: 'Mumbai',
    addressRegion: 'Maharashtra',
    postalCode: '400001',
    addressCountry: 'IN',
    countryName: 'India',
  },

  // Geo Relevance (Mumbai)
  geo: {
    region: 'IN-MH',
    placename: 'Mumbai, Maharashtra',
    latitude: 18.9220,
    longitude: 72.8347,
  },

  // Areas Served
  areasServed: [
    { name: 'Mumbai', type: 'City' },
    { name: 'South Mumbai', type: 'AdministrativeArea' },
    { name: 'Bandra', type: 'AdministrativeArea' },
    { name: 'Alibaug', type: 'City' },
    { name: 'Lonavala', type: 'City' },
    { name: 'Thane', type: 'City' },
    { name: 'Maharashtra', type: 'AdministrativeArea' },
    { name: 'India', type: 'Country' },
    { name: 'Pune', type: 'City' },
  ],

  // Social Profiles
  socials: {
    instagram: 'https://www.instagram.com/dishant_shelar_photography/',
    facebook: 'https://www.facebook.com/people/D-S-Photography/100063684198604/',
    youtube: 'https://www.youtube.com/@utopia_47',
  },

  // Default Assets
  defaultOgImage: '/og-image.jpg',
  logoDark: '/ds-logo-dark.png',
  logoLight: '/ds-logo-light.png',

  // Services Catalog for Schema.org
  services: [
    {
      name: 'Luxury Wedding Photography',
      serviceType: 'Wedding Photography',
      description: 'Candid wedding stories, timeless rituals, fine-art bridal portraiture, and heirloom albums crafted across Mumbai, Maharashtra, and destination venues.',
      areaServed: 'Mumbai & Maharashtra',
    },
    {
      name: 'Pre-Wedding Cinematography & Couple Monographs',
      serviceType: 'Pre-Wedding Photography',
      description: 'Intimate pre-wedding photography and cinematic couple films capturing authentic romance in natural light and scenic architectural estates.',
      areaServed: 'Mumbai, Alibaug, Lonavala & Maharashtra Venues',
    },
    {
      name: 'Fine Art & Editorial Portrait Photography',
      serviceType: 'Portrait Photography',
      description: 'Authentic studio and natural-light portraits with nuanced lighting, sculptural chiaroscuro, and medium-format editorial depth.',
      areaServed: 'Mumbai & Maharashtra',
    },
    {
      name: 'Milestone Birthday Celebrations & Social Gatherings',
      serviceType: 'Birthday Photography',
      description: 'Atmospheric coverage of milestone birthdays, intimate family galas, and lively celebrations with unstaged warmth.',
      areaServed: 'Mumbai & Maharashtra',
    },
    {
      name: 'Gala, Cultural & Corporate Event Photography',
      serviceType: 'Event Photography',
      description: 'Professional documentation of celebrations, private parties, brand launches, and cultural gatherings with timeless style.',
      areaServed: 'Mumbai & Maharashtra',
    },
    {
      name: 'Commercial Brand & Editorial Campaigns',
      serviceType: 'Commercial Photography',
      description: 'Creative direction, luxury product photography, and modern fashion editorial campaigns for distinguished labels.',
      areaServed: 'Mumbai & Maharashtra',
    },
  ],
};

export default SEO_CONFIG;
