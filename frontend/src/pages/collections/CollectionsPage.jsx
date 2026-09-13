import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { CATEGORIES } from './data/collectionsData';
import CollectionsHero from './components/CollectionsHero';
import CollectionsRibbon from './components/CollectionsRibbon';
import CollectionsGallery from './components/CollectionsGallery';

export default function CollectionsPage({ onOpenInquiry }) {
  const { categorySlug } = useParams();
  const [activeCategoryId, setActiveCategoryId] = useState('01');
  const [mediaList, setMediaList] = useState([]);
  const categoriesRibbonRef = useRef(null);
  const galleryRevealRef = useRef(null);

  // Sync with URL category slug (e.g. /collections/weddings)
  useEffect(() => {
    if (categorySlug) {
      const matched = CATEGORIES.find(
        (c) =>
          c.slug?.toLowerCase() === categorySlug.toLowerCase() ||
          c.name?.toLowerCase() === categorySlug.toLowerCase()
      );
      if (matched) {
        setActiveCategoryId(matched.id);
      }
    }
  }, [categorySlug]);

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

  // Dynamically augment categories with newly uploaded media
  const dynamicCategories = CATEGORIES.map((cat) => {
    const customItems = mediaList.filter(
      (m) => m.category?.toLowerCase() === cat.slug.toLowerCase()
    );

    const formattedCustom = customItems.map((item, idx) => ({
      id: item._id || `custom-${cat.id}-${idx}`,
      image: item.url,
      title: item.title || `${cat.name} Specimen`,
      tag: item.title || `${cat.name} Specimen`,
      meta: item.caption || item.meta || 'Atelier Master Archive',
      caption: item.caption || item.meta || 'Atelier Master Archive',
      type: item.type || 'photo',
      isCustom: true,
    }));

    const baseFeatured = {
      id: `${cat.id}-featured`,
      image: cat.featured.image,
      title: cat.featured.title,
      tag: cat.featured.title,
      count: cat.featured.count,
      caption: cat.featured.caption,
      meta: cat.featured.meta,
      type: cat.featured.type || 'photo',
    };

    const baseSupporting = (cat.supporting || []).map((s, idx) => ({
      id: s.id || `${cat.id}-sup-${idx}`,
      image: s.image,
      title: s.tag,
      tag: s.tag,
      meta: s.meta,
      caption: s.meta,
      type: s.type || 'photo',
    }));

    // Comprehensive archive list: base featured, initial supporting, custom uploads, and extra supporting
    const allMedia = [
      baseFeatured,
      ...baseSupporting.slice(0, 4),
      ...formattedCustom,
      ...baseSupporting.slice(4),
    ];

    // If custom uploads exist, feature the latest custom upload
    const featured = formattedCustom.length > 0 ? {
      ...baseFeatured,
      image: formattedCustom[0].image,
      title: formattedCustom[0].tag,
      caption: formattedCustom[0].meta,
      type: formattedCustom[0].type,
    } : baseFeatured;

    const supporting = formattedCustom.length > 0
      ? [...formattedCustom.slice(1), ...baseSupporting].slice(0, 4)
      : baseSupporting.slice(0, 4);

    return {
      ...cat,
      featured,
      supporting,
      allMedia,
      customMedia: formattedCustom,
    };
  });

  const activeCategory =
    dynamicCategories.find((c) => c.id === activeCategoryId) || dynamicCategories[0];

  const handleSelectCategory = (id) => {
    setActiveCategoryId(id);
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
    const currentIndex = CATEGORIES.findIndex((c) => c.id === activeCategoryId);
    const nextIndex = (currentIndex + 1) % CATEGORIES.length;
    handleSelectCategory(CATEGORIES[nextIndex].id);
  };

  const handlePrevCategory = () => {
    const currentIndex = CATEGORIES.findIndex((c) => c.id === activeCategoryId);
    const prevIndex = (currentIndex - 1 + CATEGORIES.length) % CATEGORIES.length;
    handleSelectCategory(CATEGORIES[prevIndex].id);
  };

  return (
    <div
      className="w-full min-h-screen text-[#101010] overflow-x-hidden"
      style={{
        backgroundColor: '#F6F3EC',
        fontFamily: 'var(--font-sans)',
        overflowX: 'hidden',
      }}
    >
      {/* 1. Hero Section Polaroid Collage & Typography */}
      <CollectionsHero
        onScrollToExplore={handleScrollToExplore}
        onSelectCategory={handleSelectCategory}
        onPrevCategory={handlePrevCategory}
        onNextCategory={handleNextCategory}
      />

      {/* 2. Category Cards 3D Ribbon */}
      <CollectionsRibbon
        categories={CATEGORIES}
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
