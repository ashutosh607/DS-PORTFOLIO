import React, { useState, useRef } from 'react';
import { CATEGORIES } from './data/collectionsData';
import CollectionsHero from './components/CollectionsHero';
import CollectionsRibbon from './components/CollectionsRibbon';
import CollectionsGallery from './components/CollectionsGallery';
import CollectionsModal from './components/CollectionsModal';

export default function CollectionsPage({ onOpenInquiry }) {
  const [activeCategoryId, setActiveCategoryId] = useState('01');
  const [viewAllModalOpen, setViewAllModalOpen] = useState(false);
  const categoriesRibbonRef = useRef(null);
  const galleryRevealRef = useRef(null);

  const activeCategory = CATEGORIES.find((c) => c.id === activeCategoryId) || CATEGORIES[0];

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
