import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import CollectionsPage from './components/CollectionsPage';
import Footer from './components/Footer';
import InquiryModal from './components/InquiryModal';

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}

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
      {/* Auto scroll to top on navigation */}
      <ScrollToTop />

      {/* 1. Minimal luxury navigation */}
      <Navbar onOpenInquiry={() => handleOpenInquiry()} />

      {/* Multi-route content: Home & Collections */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/collections"
          element={<CollectionsPage onOpenInquiry={handleOpenInquiry} />}
        />
      </Routes>

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
