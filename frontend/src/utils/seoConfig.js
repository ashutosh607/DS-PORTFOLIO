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
  
  // Canonical Production Domain
  siteUrl: (typeof window !== 'undefined' && window.location.origin && !window.location.origin.includes('localhost'))
    ? window.location.origin
    : (import.meta.env.VITE_SITE_URL || 'https://dsphotography.com'),

  // NAP Data (Name, Address, Phone)
  contact: {
    phone: '+91 90297 36973',
    phoneRaw: '919029736973',
    email: 'contact@dsphotography.com',
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
    { name: 'Goa', type: 'State' },
    { name: 'Maharashtra', type: 'AdministrativeArea' },
    { name: 'India', type: 'Country' },
    { name: 'Worldwide Destinations', type: 'Place' },
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
      areaServed: 'Mumbai, Maharashtra & Worldwide',
    },
    {
      name: 'Pre-Wedding Cinematography & Couple Monographs',
      serviceType: 'Pre-Wedding Photography',
      description: 'Intimate pre-wedding photography and cinematic couple films capturing authentic romance in natural light and scenic architectural estates.',
      areaServed: 'Mumbai, Alibaug, Lonavala & Destination Locations',
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
      description: 'Sophisticated documentation of luxury galas, private soirées, brand launches, and cultural symposiums with architectural presence.',
      areaServed: 'Mumbai & Across India',
    },
    {
      name: 'Commercial Brand & Haute Editorial Campaigns',
      serviceType: 'Commercial Photography',
      description: 'Spatial poetics, luxury product monograph captures, and haute fashion editorial campaigns for distinguished labels.',
      areaServed: 'Mumbai & Worldwide',
    },
  ],
};

export default SEO_CONFIG;
