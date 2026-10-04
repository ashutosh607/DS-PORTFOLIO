import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SEO_CONFIG } from '../../utils/seoConfig';

/**
 * SEOHead Component
 * Dynamically synchronizes document <head> elements:
 * - <title>
 * - <meta name="description">
 * - <meta name="keywords">
 * - <meta name="robots">
 * - <link rel="canonical">
 * - Open Graph (og:title, og:description, og:image, og:url, og:type, og:site_name, og:locale)
 * - Twitter Cards (twitter:card, twitter:title, twitter:description, twitter:image)
 * - Structured Data (<script type="application/ld+json">)
 */
export default function SEOHead({
  title,
  description,
  keywords,
  canonicalUrl,
  ogImage,
  ogType = 'website',
  robots = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  schema,
  breadcrumbs,
}) {
  const location = useLocation();

  useEffect(() => {
    // 1. Title
    const formattedTitle = title
      ? (title.includes('DS Photography') ? title : `${title} | ${SEO_CONFIG.shortBrandName} Mumbai`)
      : `${SEO_CONFIG.brandName} — Wedding & Portrait Photographer in Mumbai`;
    document.title = formattedTitle;

    // Helper for upserting meta tags
    const setMetaTag = (attrName, attrVal, content) => {
      if (!content) return;
      let el = document.querySelector(`meta[${attrName}="${attrVal}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attrName, attrVal);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // Helper for upserting link tags
    const setLinkTag = (rel, href) => {
      if (!href) return;
      let el = document.querySelector(`link[rel="${rel}"]`);
      if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        document.head.appendChild(el);
      }
      el.setAttribute('href', href);
    };

    // 2. Standard Meta
    const metaDesc = description || `${SEO_CONFIG.brandName} — Fine art wedding photography, candid pre-wedding cinematography, and editorial monographs in Mumbai by Dishant Shelar.`;
    setMetaTag('name', 'description', metaDesc);

    const metaKeywords = keywords || 'wedding photographer mumbai, photographer in mumbai, pre wedding photographer mumbai, candid wedding photography, fine art wedding cinematography, portrait photographer mumbai, ds photography, dishant shelar';
    setMetaTag('name', 'keywords', metaKeywords);

    // 3. Robots
    setMetaTag('name', 'robots', robots);
    setMetaTag('name', 'googlebot', robots);

    // 4. Canonical URL (cleans query params unless essential, ensures absolute URL)
    const baseSite = SEO_CONFIG.siteUrl.replace(/\/$/, '');
    const cleanPath = location.pathname.replace(/\/$/, '') || '/';
    const computedCanonical = canonicalUrl || `${baseSite}${cleanPath}`;
    setLinkTag('canonical', computedCanonical);

    // 5. Open Graph
    const computedOgImage = ogImage
      ? (ogImage.startsWith('http') ? ogImage : `${baseSite}${ogImage.startsWith('/') ? '' : '/'}${ogImage}`)
      : `${baseSite}${SEO_CONFIG.defaultOgImage}`;

    setMetaTag('property', 'og:title', formattedTitle);
    setMetaTag('property', 'og:description', metaDesc);
    setMetaTag('property', 'og:url', computedCanonical);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:image', computedOgImage);
    setMetaTag('property', 'og:image:width', '1200');
    setMetaTag('property', 'og:image:height', '630');
    setMetaTag('property', 'og:site_name', SEO_CONFIG.brandName);
    setMetaTag('property', 'og:locale', 'en_US');

    // 6. Twitter / X Cards
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', formattedTitle);
    setMetaTag('name', 'twitter:description', metaDesc);
    setMetaTag('name', 'twitter:image', computedOgImage);

    // 7. Dynamic JSON-LD Structured Data
    const scriptId = 'dynamic-seo-schema';
    let scriptEl = document.getElementById(scriptId);
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = scriptId;
      scriptEl.type = 'application/ld+json';
      document.head.appendChild(scriptEl);
    }

    const schemasToInject = [];
    if (schema) {
      if (Array.isArray(schema)) {
        schemasToInject.push(...schema);
      } else {
        schemasToInject.push(schema);
      }
    }

    if (breadcrumbs) {
      schemasToInject.push(breadcrumbs);
    }

    if (schemasToInject.length > 0) {
      scriptEl.textContent = JSON.stringify(
        schemasToInject.length === 1 ? schemasToInject[0] : { '@context': 'https://schema.org', '@graph': schemasToInject }
      );
    } else {
      scriptEl.textContent = '';
    }

    return () => {
      // Clean up script on unmount
      const el = document.getElementById(scriptId);
      if (el) el.remove();
    };
  }, [
    title,
    description,
    keywords,
    canonicalUrl,
    ogImage,
    ogType,
    robots,
    schema,
    breadcrumbs,
    location.pathname,
  ]);

  return null;
}
