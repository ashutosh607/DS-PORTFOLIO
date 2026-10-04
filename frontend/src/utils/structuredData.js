import { SEO_CONFIG } from './seoConfig';

/**
 * Structured Data (Schema.org / JSON-LD) Generators
 * Generates verified, valid schemas without fabricated information.
 */

export function buildLocalBusinessSchema(currentUrl = SEO_CONFIG.siteUrl) {
  return {
    '@context': 'https://schema.org',
    '@type': ['ProfessionalService', 'LocalBusiness', 'PhotographyBusiness'],
    '@id': `${SEO_CONFIG.siteUrl}/#organization`,
    name: SEO_CONFIG.brandName,
    alternateName: [SEO_CONFIG.alternateBrandName, SEO_CONFIG.shortBrandName, 'Dishant Shelar'],
    url: SEO_CONFIG.siteUrl,
    logo: `${SEO_CONFIG.siteUrl}${SEO_CONFIG.logoDark}`,
    image: [
      `${SEO_CONFIG.siteUrl}${SEO_CONFIG.defaultOgImage}`,
      `${SEO_CONFIG.siteUrl}${SEO_CONFIG.logoDark}`,
    ],
    description: 'Bespoke fine-art wedding photography, pre-wedding films, and editorial monographs studio led by Dishant Shelar in Mumbai, Maharashtra.',
    telephone: SEO_CONFIG.contact.phone,
    email: SEO_CONFIG.contact.email,
    priceRange: '₹₹₹₹',
    address: {
      '@type': 'PostalAddress',
      addressLocality: SEO_CONFIG.contact.addressLocality,
      addressRegion: SEO_CONFIG.contact.addressRegion,
      postalCode: SEO_CONFIG.contact.postalCode,
      addressCountry: SEO_CONFIG.contact.addressCountry,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: SEO_CONFIG.geo.latitude,
      longitude: SEO_CONFIG.geo.longitude,
    },
    founder: {
      '@type': 'Person',
      '@id': `${SEO_CONFIG.siteUrl}/#dishant`,
      name: SEO_CONFIG.photographerName,
      jobTitle: SEO_CONFIG.photographerRole,
      sameAs: [
        SEO_CONFIG.socials.instagram,
        SEO_CONFIG.socials.facebook,
        SEO_CONFIG.socials.youtube,
      ],
    },
    areaServed: SEO_CONFIG.areasServed.map((area) => ({
      '@type': area.type,
      name: area.name,
    })),
    sameAs: [
      SEO_CONFIG.socials.instagram,
      SEO_CONFIG.socials.facebook,
      SEO_CONFIG.socials.youtube,
    ],
    knowsAbout: [
      'Wedding Photography',
      'Pre-Wedding Photography',
      'Candid Cinematography',
      'Editorial Portraiture',
      'Fine Art Photography',
      'Event Photography',
      'Commercial Photography',
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Photography & Cinematography Commissions',
      itemListElement: SEO_CONFIG.services.map((svc, idx) => ({
        '@type': 'OfferCatalog',
        name: svc.name,
        position: idx + 1,
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: svc.name,
              serviceType: svc.serviceType,
              description: svc.description,
              provider: {
                '@id': `${SEO_CONFIG.siteUrl}/#organization`,
              },
            },
          },
        ],
      })),
    },
  };
}

export function buildWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SEO_CONFIG.siteUrl}/#website`,
    url: SEO_CONFIG.siteUrl,
    name: SEO_CONFIG.brandName,
    alternateName: SEO_CONFIG.alternateBrandName,
    description: SEO_CONFIG.tagline,
    publisher: {
      '@id': `${SEO_CONFIG.siteUrl}/#organization`,
    },
    inLanguage: 'en-US',
  };
}

export function buildBreadcrumbSchema(items = []) {
  if (!items || items.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SEO_CONFIG.siteUrl}${item.url}`,
    })),
  };
}

export function buildServicesListSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Photography Services by DS Photography & Films',
    description: 'Professional photography and cinematography commissions in Mumbai, Maharashtra.',
    itemListElement: SEO_CONFIG.services.map((svc, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Service',
        name: svc.name,
        serviceType: svc.serviceType,
        description: svc.description,
        provider: {
          '@id': `${SEO_CONFIG.siteUrl}/#organization`,
        },
        areaServed: {
          '@type': 'AdministrativeArea',
          name: svc.areaServed,
        },
      },
    })),
  };
}

export function buildCollectionGallerySchema({ categoryName, categorySlug, mediaItems = [] }) {
  const images = mediaItems.slice(0, 12).map((item) => ({
    '@type': 'ImageObject',
    contentUrl: item.image?.startsWith('http') ? item.image : `${SEO_CONFIG.siteUrl}${item.image}`,
    caption: item.caption || item.tag || `${categoryName} photograph by Dishant Shelar`,
    name: item.title || item.tag || `${categoryName} specimen`,
    creator: {
      '@type': 'Person',
      name: SEO_CONFIG.photographerName,
    },
    copyrightHolder: {
      '@type': 'Organization',
      name: SEO_CONFIG.brandName,
    },
  }));

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${SEO_CONFIG.siteUrl}/collections/${categorySlug || ''}`,
    url: `${SEO_CONFIG.siteUrl}/collections/${categorySlug || ''}`,
    name: `${categoryName || 'Curated'} Photography Collection — DS Photography & Films`,
    description: `Curated ${categoryName || 'fine art'} photography monograph collection captured in Mumbai and destination estates by Dishant Shelar.`,
    provider: {
      '@id': `${SEO_CONFIG.siteUrl}/#organization`,
    },
    mainEntity: {
      '@type': 'ImageGallery',
      name: `${categoryName || 'Master'} Archive Gallery`,
      image: images,
    },
  };
}
