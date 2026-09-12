import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HeroSpotlightCarousel from './components/HeroSpotlightCarousel';
import WhatWeDoEditorial from './components/WhatWeDoEditorial';
import AboutSection from './components/AboutSection';
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

        {/* Spacious, Artistic Editorial Photography Section: What We Do */}
        <WhatWeDoEditorial />

        {/* Studio About section with artist portrait, philosophy & exhibition history */}
        <AboutSection />
      </main>

      {/* Minimal footer with CET studio time and social directory */}
      <Footer onOpenInquiry={() => handleOpenInquiry()} />

      {/* Interactive Consultation / Inquiry Modal */}
      <InquiryModal
        isOpen={inquiryModalOpen}
        onClose={handleCloseInquiry}
        prefillTier={selectedTier}
      />
    </div>
  );
}
