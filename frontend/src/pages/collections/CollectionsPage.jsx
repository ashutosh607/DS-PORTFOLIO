import React, { useState, useEffect, useRef } from 'react';
import { CATEGORIES } from './data/collectionsData';
import CollectionsHero from './components/CollectionsHero';
import CollectionsRibbon from './components/CollectionsRibbon';
import CollectionsGallery from './components/CollectionsGallery';
import CollectionsModal from './components/CollectionsModal';

export default function CollectionsPage({ onOpenInquiry }) {
  const [activeCategoryId, setActiveCategoryId] = useState('01');
  const [viewAllModalOpen, setViewAllModalOpen] = useState(false);
  const [mediaList, setMediaList] = useState([]);
  const categoriesRibbonRef = useRef(null);
  const galleryRevealRef = useRef(null);

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

    if (customItems.length === 0) {
      return cat;
    }

    const formattedCustom = customItems.map((item) => ({
      id: item._id,
      image: item.url,
      tag: item.title || `${cat.name} Specimen`,
      meta: item.caption || item.meta || 'Atelier Master Archive',
      type: item.type || 'photo',
    }));

    // If custom items exist, use the newest as featured, and prepend others to supporting
    const featured = {
      image: formattedCustom[0].image,
      title: formattedCustom[0].tag,
      count: `01 / 0${Math.max(6, formattedCustom.length)}`,
      caption: formattedCustom[0].meta,
      meta: cat.featured.meta,
      type: formattedCustom[0].type,
    };

    const remainingCustom = formattedCustom.slice(1);
    const supporting = [...remainingCustom, ...cat.supporting].slice(0, 8);

    return {
      ...cat,
      featured,
      supporting,
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

      {/* 3. Weddings / Active Category Gallery Detail */}
      <CollectionsGallery
        activeCategory={activeCategory}
        onOpenViewAll={() => setViewAllModalOpen(true)}
        onPrevCategory={handlePrevCategory}
        onNextCategory={handleNextCategory}
        galleryRef={galleryRevealRef}
      />

      {/* 4. Archival Contact Sheet View-All Modal */}
      <CollectionsModal
        isOpen={viewAllModalOpen}
        onClose={() => setViewAllModalOpen(false)}
        activeCategory={activeCategory}
        onOpenInquiry={onOpenInquiry}
      />
    </div>
  );
}
