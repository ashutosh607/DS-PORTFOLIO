import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HeroSpotlightCarousel from './components/HeroSpotlightCarousel';
import SelectedWork from './components/SelectedWork';
import ServicesExperience from './components/ServicesExperience';
import Collections from './components/Collections';
import AboutSection from './components/AboutSection';
import ObsidianCTA from './components/ObsidianCTA';
import Footer from './components/Footer';
import InquiryModal from './components/InquiryModal';

export default function App() {
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState('');

  const handleOpenInquiry = (tier = '') => {
    setSelectedTier(tier);
    setInquiryModalOpen(true);
  };

  const handleCloseInquiry = () => {
    setInquiryModalOpen(false);
    setSelectedTier('');
  };

  return (
    <div className="portfolio-app-root">
      {/* 1. Minimal luxury navigation */}
      <Navbar onOpenInquiry={() => handleOpenInquiry()} />

      {/* 2 & 3. Hero section with editorial heading & the 3D Concave Arc Spotlight Carousel */}
      <main>
        <HeroSpotlightCarousel />

        {/* 4. Selected Work section with category filtering & museum-grade placeholders */}
        <SelectedWork onSelectWork={(work) => handleOpenInquiry(work.title)} />

        {/* 5. Services & The Experience section with 3 atelier pillars and 4-step creative methodology */}
        <ServicesExperience onOpenInquiry={() => handleOpenInquiry()} />

        {/* 6. Featured Collections & Investment packages */}
        <Collections onOpenInquiry={(pkgName) => handleOpenInquiry(pkgName)} />

        {/* 7. Short About section with artist portrait, philosophy & exhibition history */}
        <AboutSection />

        {/* 8. Strong final CTA on Obsidian background with interactive consultation panel */}
        <ObsidianCTA onOpenInquiry={() => handleOpenInquiry()} />
      </main>

      {/* 9. Minimal footer with CET studio time and social directory */}
      <Footer />

      {/* Interactive Consultation / Inquiry Modal */}
      <InquiryModal
        isOpen={inquiryModalOpen}
        onClose={handleCloseInquiry}
        prefillTier={selectedTier}
      />
    </div>
  );
}
