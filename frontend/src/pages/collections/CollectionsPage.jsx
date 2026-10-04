import React, { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { CATEGORIES as DEFAULT_CATEGORIES } from './data/collectionsData';
import { useCategories, findBaselineCategory, toCanonicalCategoryKey } from '../../utils/categoryManager';
import CollectionsHero from './components/CollectionsHero';
import CollectionsRibbon from './components/CollectionsRibbon';
import CollectionsGallery from './components/CollectionsGallery';
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
  const [mediaList, setMediaList] = useState([]);
  const categoriesRibbonRef = useRef(null);
  const galleryRevealRef = useRef(null);

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
      const matched = baseCategories.find(
        (c) =>
          c.slug?.toLowerCase() === targetSlug.toLowerCase() ||
          c.name?.toLowerCase() === targetSlug.toLowerCase()
      );
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

  // Fetch dynamic collection media from backend API
  useEffect(() => {
    let isMounted = true;
    async function loadMedia() {
      try {
        const res = await fetch('/api/media');
        if (res.ok) {
          const json = await res.json();
          if (isMounted && Array.isArray(json.data)) {
            setMediaList(json.data);
          }
        }
      } catch {
        // Fall back gracefully to static seed data
      }
    }
    loadMedia();
    return () => {
      isMounted = false;
    };
  }, []);

  // Dynamically augment categories with newly uploaded media & customized baseline items
  const dynamicCategories = baseCategories.map((cat) => {
    // Only true custom uploads (matched by exact or canonical slug)
    const customItems = mediaList.filter(
      (m) =>
        !m.isBaseline &&
        !m.baselineId &&
        (m.category?.toLowerCase() === cat.slug?.toLowerCase() ||
          toCanonicalCategoryKey(m.category) === toCanonicalCategoryKey(cat.slug))
    );

    const formattedCustom = customItems.map((item, idx) => ({
      id: item._id || `custom-${cat.id}-${idx}`,
      image: getApiUrl(item.url),
      title: item.title || `${cat.name} Specimen`,
      tag: item.title || `${cat.name} Specimen`,
      meta: item.caption || item.meta || 'Atelier Master Archive',
      caption: item.caption || item.meta || 'Atelier Master Archive',
      type: item.type || 'photo',
      isCustom: true,
      display: item.display,
    }));

    // Find baseline template for fallback supporting specimens if needed
    const baselineTemplate =
      findBaselineCategory(cat.slug) ||
      findBaselineCategory(cat.id) ||
      findBaselineCategory(cat._id) ||
      findBaselineCategory(cat.name);

    const effectiveSupporting =
      Array.isArray(cat.supporting) && cat.supporting.length > 0
        ? cat.supporting
        : baselineTemplate?.supporting || [];

    // Find any baseline cover overrides for this category across all ID permutations
    const possibleCoverIds = new Set([
      `seed-cover-${cat.id}`,
      `seed-cover-${cat.slug}`,
      `${cat.id}-featured`,
      `${cat.slug}-featured`,
    ]);
    if (cat._id) {
      possibleCoverIds.add(`seed-cover-${cat._id}`);
      possibleCoverIds.add(`${cat._id}-featured`);
    }
    if (cat.order) {
      possibleCoverIds.add(`seed-cover-${cat.order}`);
      possibleCoverIds.add(`seed-cover-${String(cat.order).padStart(2, '0')}`);
    }

    const coverOverride = mediaList.find(
      (m) =>
        (m.isBaseline || m.baselineId) &&
        (possibleCoverIds.has(m.baselineId) || possibleCoverIds.has(m.id))
    );

    const effectiveCoverImage = coverOverride?.url
      ? getApiUrl(coverOverride.url)
      : (cat.coverImage || cat.featured?.image);

    const baseFeatured = {
      id: `${cat.id}-featured`,
      image: effectiveCoverImage,
      title: coverOverride?.title || cat.featured?.title || cat.name,
      tag: coverOverride?.title || cat.featured?.title || cat.name,
      count: cat.featured?.count || '1/08',
      caption: coverOverride?.caption || cat.featured?.caption || cat.tagline,
      meta: coverOverride?.meta || cat.featured?.meta || cat.medium || 'Medium Format Film / 35mm',
      type: coverOverride?.type || cat.featured?.type || 'photo',
      display: coverOverride?.display || cat.featured?.display,
    };

    const baseSupporting = effectiveSupporting.map((s, idx) => {
      const possibleSupIds = new Set([
        `seed-sup-${cat.id}-${idx}`,
        `seed-sup-${cat.slug}-${idx}`,
      ]);
      if (cat._id) possibleSupIds.add(`seed-sup-${cat._id}-${idx}`);
      if (cat.order) {
        possibleSupIds.add(`seed-sup-${cat.order}-${idx}`);
        possibleSupIds.add(`seed-sup-${String(cat.order).padStart(2, '0')}-${idx}`);
      }
      if (s.id) possibleSupIds.add(s.id);

      const supOverride = mediaList.find(
        (m) =>
          (m.isBaseline || m.baselineId) &&
          (possibleSupIds.has(m.baselineId) || possibleSupIds.has(m.id))
      );

      return {
        id: s.id || `${cat.id}-sup-${idx}`,
        image: supOverride?.url ? getApiUrl(supOverride.url) : s.image,
        title: supOverride?.title || s.tag,
        tag: supOverride?.title || s.tag,
        meta: supOverride?.meta || s.meta,
        caption: supOverride?.caption || s.meta,
        type: supOverride?.type || s.type || 'photo',
        display: supOverride?.display || s.display,
      };
    });

    // Comprehensive archive list: base featured, all supporting, custom uploads
    const allMedia = [
      baseFeatured,
      ...baseSupporting,
      ...formattedCustom,
    ];

    // If custom uploads exist, feature the latest custom upload
    const featured = formattedCustom.length > 0 ? {
      ...baseFeatured,
      image: formattedCustom[0].image,
      title: formattedCustom[0].tag,
      caption: formattedCustom[0].meta,
      type: formattedCustom[0].type,
      display: formattedCustom[0].display,
    } : baseFeatured;

    // Preserve all supporting items, prepending any secondary custom uploads without dropping specimens
    const supporting = formattedCustom.length > 0
      ? [...formattedCustom.slice(1), ...baseSupporting]
      : baseSupporting;

    return {
      ...cat,
      coverImage: effectiveCoverImage,
      coverDisplay: coverOverride?.display || cat.coverDisplay || cat.display,
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
    if (galleryRevealRef.current) {
      setTimeout(() => {
        galleryRevealRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
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

  const catSlug = activeCategory?.slug || 'weddings';
  const catName = activeCategory?.name || 'Curated';
  const pageTitle = `${catName} Photography Collection | DS Photography Mumbai`;
  const pageDescription = `Explore curated ${catName.toLowerCase()} photography monographs by Dishant Shelar at DS Photography & Films in Mumbai. Fine-art aesthetic and timeless framing.`;
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
