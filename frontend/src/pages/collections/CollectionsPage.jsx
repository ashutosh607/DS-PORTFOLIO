import React, { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useCategories, toCanonicalCategoryKey, findBaselineCategory } from '../../utils/categoryManager';
import CollectionsHero from './components/CollectionsHero';
import CollectionsRibbon from './components/CollectionsRibbon';
import CollectionsGallery from './components/CollectionsGallery';
import { CATEGORIES as DEFAULT_CATEGORIES } from './data/collectionsData';
import { getApiUrl } from '../../utils/api';
import SEOHead from '../../components/common/SEOHead';
import { buildCollectionGallerySchema, buildBreadcrumbSchema } from '../../utils/structuredData';
import { SEO_CONFIG } from '../../utils/seoConfig';

export default function CollectionsPage({ onOpenInquiry }) {
  const { categorySlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryCategory = searchParams.get('category');
  const queryId = searchParams.get('id');

  const { categories: rawCategories } = useCategories();
  const baseCategories = (rawCategories && rawCategories.length > 0) ? rawCategories : DEFAULT_CATEGORIES;
  const [activeCategoryId, setActiveCategoryId] = useState('01');
  
  // Initialize mediaList immediately from localStorage cache so uploaded images appear on frame 0
  const [mediaList, setMediaList] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('ds_portfolio_cached_media');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (err) {
        console.warn('Could not read cached media:', err);
      }
    }
    return [];
  });

  const categoriesRibbonRef = useRef(null);
  const galleryRevealRef = useRef(null);

  // Guarantee page opens strictly at the very top from the start on mobile and desktop
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  // Sync with URL query string (e.g. /collections?category=weddings&id=...) or path param (/collections/weddings)
  useEffect(() => {
    if (queryId) {
      const matchedById = baseCategories.find((c) => c.id === queryId);
      if (matchedById) {
        setActiveCategoryId(matchedById.id);
        return;
      }
    }
    const targetSlug = queryCategory || categorySlug;
    if (targetSlug) {
      let matched = baseCategories.find(
        (c) =>
          c.slug?.toLowerCase() === targetSlug.toLowerCase() ||
          c.name?.toLowerCase() === targetSlug.toLowerCase()
      );
      if (!matched) {
        const baseline = findBaselineCategory(targetSlug);
        if (baseline) {
          matched = baseCategories.find((c) => c.id === baseline.id);
        }
      }
      if (matched) {
        setActiveCategoryId(matched.id);
        return;
      }
    }
    if (baseCategories.length > 0 && !baseCategories.some((c) => c.id === activeCategoryId)) {
      setActiveCategoryId(baseCategories[0].id);
    }
  }, [categorySlug, queryCategory, queryId, baseCategories]);

  // Ensure professional query URL (?category=...&id=...) is set on initial load
  useEffect(() => {
    if (baseCategories.length > 0 && !searchParams.get('category') && !searchParams.get('id')) {
      const current = baseCategories.find((c) => c.id === activeCategoryId) || baseCategories[0];
      if (current) {
        setSearchParams(
          { category: current.slug || current.name.toLowerCase(), id: current.id },
          { replace: true }
        );
      }
    }
  }, [baseCategories, activeCategoryId, searchParams, setSearchParams]);

  // Fetch dynamic collection media with multi-endpoint fallback & automatic retries
  useEffect(() => {
    let isMounted = true;
    let retryTimer = null;

    async function loadMedia(attempt = 1) {
      try {
        const endpoints = [
          getApiUrl('/api/media'),
          '/api/media',
          'http://localhost:5000/api/media',
        ];

        let success = false;
        for (const ep of endpoints) {
          if (!ep) continue;
          try {
            const res = await fetch(ep);
            if (res.ok) {
              const json = await res.json();
              if (isMounted && Array.isArray(json.data) && json.data.length > 0) {
                setMediaList(json.data);
                try {
                  localStorage.setItem('ds_portfolio_cached_media', JSON.stringify(json.data));
                } catch {}
                success = true;
                break;
              }
            }
          } catch {
            // Try next endpoint candidate
          }
        }

        // If server is waking up from sleep, retry with progressive delay
        if (!success && isMounted && attempt <= 3) {
          retryTimer = setTimeout(() => {
            if (isMounted) loadMedia(attempt + 1);
          }, attempt * 1800);
        }
      } catch {
        // Fall back gracefully to cache
      }
    }

    loadMedia();

    // Listen for real-time media updates broadcast from admin modals
    const handleMediaUpdated = (e) => {
      if (e?.detail && Array.isArray(e.detail)) {
        setMediaList(e.detail);
      } else {
        loadMedia(1);
      }
    };

    window.addEventListener('ds_media_updated', handleMediaUpdated);

    return () => {
      isMounted = false;
      if (retryTimer) clearTimeout(retryTimer);
      window.removeEventListener('ds_media_updated', handleMediaUpdated);
    };
  }, []);

  // Dynamically augment categories with newly uploaded media
  const dynamicCategories = baseCategories.map((cat) => {
    // Robust category matching across slug, name, and id variants
    const categoryItems = mediaList.filter((m) => {
      if (!m.category) return false;
      const mCat = m.category.toLowerCase().trim();
      const catSlug = (cat.slug || '').toLowerCase().trim();
      const catName = (cat.name || '').toLowerCase().trim();
      const catId = (cat.id || '').toLowerCase().trim();

      return (
        mCat === catSlug ||
        mCat === catName ||
        mCat === catId ||
        toCanonicalCategoryKey(mCat) === toCanonicalCategoryKey(catSlug) ||
        toCanonicalCategoryKey(mCat) === toCanonicalCategoryKey(catName) ||
        toCanonicalCategoryKey(mCat) === toCanonicalCategoryKey(catId)
      );
    });

    const formattedCustom = categoryItems.map((item, idx) => ({
      id: item._id || `custom-${cat.id}-${idx}`,
      image: getApiUrl(item.url),
      title: item.title || `${cat.name} Specimen`,
      tag: item.title || `${cat.name} Specimen`,
      meta: item.caption || item.meta || cat.medium || 'Atelier Master Archive',
      caption: item.caption || item.meta || cat.tagline || 'Atelier Master Archive',
      type: item.type || 'photo',
      isCustom: true,
      display: item.display,
    }));

    const effectiveCoverImage = cat.coverImage || cat.featured?.image;

    const baseFeatured = {
      id: `${cat.id}-featured`,
      image: effectiveCoverImage,
      title: cat.featured?.title || cat.name,
      tag: cat.featured?.title || cat.name,
      count: '01',
      caption: cat.quote || cat.tagline || 'A story in every frame.',
      meta: cat.medium || 'Medium Format Film / 35mm',
      type: 'photo',
      display: cat.coverDisplay || cat.display || cat.featured?.display,
    };

    // If custom uploads exist for this category, use ONLY the custom uploaded media
    const featured = formattedCustom.length > 0 ? formattedCustom[0] : baseFeatured;
    const supporting = formattedCustom.length > 1
      ? formattedCustom.slice(1)
      : (formattedCustom.length === 0 && Array.isArray(cat.supporting) ? cat.supporting : []);
    const allMedia = formattedCustom.length > 0
      ? formattedCustom
      : [baseFeatured, ...(Array.isArray(cat.supporting) ? cat.supporting : [])];

    return {
      ...cat,
      coverImage: effectiveCoverImage,
      coverDisplay: cat.coverDisplay || cat.display,
      featured,
      supporting,
      allMedia,
      customMedia: formattedCustom,
    };
  });

  const activeCategory =
    dynamicCategories.find(
      (c) =>
        c.id === activeCategoryId ||
        c.slug === activeCategoryId ||
        toCanonicalCategoryKey(c.slug) === toCanonicalCategoryKey(activeCategoryId)
    ) || dynamicCategories[0];

  const handleSelectCategory = (id) => {
    setActiveCategoryId(id);
    const cat = baseCategories.find((c) => c.id === id);
    if (cat) {
      setSearchParams(
        { category: cat.slug || cat.name.toLowerCase(), id: cat.id },
        { replace: true }
      );
    }

    const scrollToGallery = () => {
      const el = galleryRevealRef.current || document.getElementById('collection-gallery-detail');
      if (!el) return;
      if (window.lenis && typeof window.lenis.scrollTo === 'function') {
        window.lenis.scrollTo(el, { offset: -70, duration: 1.1, immediate: false });
      } else {
        const yOffset = -70;
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
      }
    };

    scrollToGallery();
    setTimeout(scrollToGallery, 120);
  };

  const handleScrollToExplore = () => {
    if (categoriesRibbonRef.current) {
      categoriesRibbonRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleNextCategory = () => {
    const currentIndex = baseCategories.findIndex((c) => c.id === activeCategoryId);
    const nextIndex = (currentIndex + 1) % baseCategories.length;
    handleSelectCategory(baseCategories[nextIndex].id);
  };

  const handlePrevCategory = () => {
    const currentIndex = baseCategories.findIndex((c) => c.id === activeCategoryId);
    const prevIndex = (currentIndex - 1 + baseCategories.length) % baseCategories.length;
    handleSelectCategory(baseCategories[prevIndex].id);
  };

  const catSlug = activeCategory?.slug?.toLowerCase() || 'weddings';
  const catName = activeCategory?.name || 'Curated';

  const CATEGORY_SEO_MAP = {
    weddings: {
      title: 'Wedding Photographer in Mumbai | DS Photography & Films',
      description: 'Explore candid wedding stories and luxury wedding films in Mumbai by Dishant Shelar. Timeless editorial monographs and fine-art albums.',
      keywords: 'wedding photographer in mumbai, candid wedding photographer in mumbai, wedding photography and films in mumbai, luxury wedding photography mumbai',
    },
    'pre-wedding': {
      title: 'Pre-Wedding Photographer in Mumbai | DS Photography & Films',
      description: 'Intimate pre-wedding photography and cinematic couple films across Mumbai, Alibaug, and destination estates by Dishant Shelar.',
      keywords: 'pre-wedding photographer in mumbai, couple photoshoot mumbai, pre wedding films mumbai, candid couple photographer mumbai',
    },
    portraits: {
      title: 'Portrait Photographer in Mumbai | DS Photography & Films',
      description: 'Fine art editorial portraits, studio daylight monographs, and candid personal portraiture in Mumbai by Dishant Shelar.',
      keywords: 'portrait photographer in mumbai, editorial portrait photography mumbai, studio photographer mumbai, fine art portraits mumbai',
    },
    birthdays: {
      title: 'Birthday Celebration Photographer in Mumbai | DS Photography',
      description: 'Atmospheric milestone birthday photography and intimate family celebration documentation in Mumbai by DS Photography & Films.',
      keywords: 'birthday photographer mumbai, celebration photographer in mumbai, event photography mumbai, milestone birthday shoot',
    },
    events: {
      title: 'Event Photographer in Mumbai | DS Photography & Films',
      description: 'Luxury gala, cultural soirée, and private event photography in Mumbai capturing unscripted elegance by DS Photography & Films.',
      keywords: 'event photographer in mumbai, corporate event photography mumbai, gala photography mumbai, soirée documentation mumbai',
    },
    commercial: {
      title: 'Commercial Photography in Mumbai | DS Photography & Films',
      description: 'Haute commercial brand campaigns, luxury product monographs, and fashion editorial photography in Mumbai by Dishant Shelar.',
      keywords: 'commercial photography in mumbai, brand campaign photographer mumbai, editorial fashion photographer mumbai, product monograph',
    },
  };

  const currentSeo = categorySlug && CATEGORY_SEO_MAP[catSlug]
    ? CATEGORY_SEO_MAP[catSlug]
    : {
        title: 'Photography Collections & Monographs in Mumbai | DS Photography & Films',
        description: 'Explore curated wedding, pre-wedding, portrait, event, and commercial photography collections in Mumbai by Dishant Shelar.',
        keywords: 'photographer in mumbai, wedding photographer in mumbai, pre-wedding photographer in mumbai, portrait photographer in mumbai, event photographer in mumbai, ds photography collections',
      };

  const pageTitle = currentSeo.title;
  const pageDescription = currentSeo.description;
  const pageKeywords = currentSeo.keywords;

  const canonical = categorySlug
    ? `${SEO_CONFIG.siteUrl}/collections/${categorySlug}`
    : `${SEO_CONFIG.siteUrl}/collections`;
  const breadcrumbs = buildBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Collections', url: '/collections' },
    ...(categorySlug ? [{ name: catName, url: `/collections/${categorySlug}` }] : []),
  ]);
  const schema = buildCollectionGallerySchema({
    categoryName: catName,
    categorySlug: catSlug,
    mediaItems: activeCategory?.allMedia || [],
  });

  return (
    <div
      className="w-full min-h-screen text-[#101010] overflow-x-hidden"
      style={{
        backgroundColor: '#F6F3EC',
        fontFamily: 'var(--font-sans)',
        overflowX: 'hidden',
      }}
    >
      <SEOHead
        title={pageTitle}
        description={pageDescription}
        keywords={pageKeywords}
        canonicalUrl={canonical}
        schema={schema}
        breadcrumbs={breadcrumbs}
      />
      {/* 1. Hero Section Polaroid Collage & Typography */}
      <CollectionsHero
        onScrollToExplore={handleScrollToExplore}
        onSelectCategory={handleSelectCategory}
        onPrevCategory={handlePrevCategory}
        onNextCategory={handleNextCategory}
        categorySlug={categorySlug}
        activeCategory={activeCategory}
      />

      {/* 2. Category Cards 3D Ribbon */}
      <CollectionsRibbon
        categories={dynamicCategories}
        activeCategoryId={activeCategoryId}
        onSelectCategory={handleSelectCategory}
        ribbonRef={categoriesRibbonRef}
      />

      {/* 3. Weddings / Active Category Gallery Detail with In-Place Master Update & Horizontal Rail */}
      <CollectionsGallery
        activeCategory={activeCategory}
        onPrevCategory={handlePrevCategory}
        onNextCategory={handleNextCategory}
        galleryRef={galleryRevealRef}
      />
    </div>
  );
}
