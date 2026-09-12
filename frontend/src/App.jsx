import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import HomePage from './pages/home/HomePage';
import CollectionsPage from './pages/collections/CollectionsPage';
import ServicesPage from './pages/services/ServicesPage';
import Footer from './components/layout/Footer';
import InquiryModal from './components/modals/InquiryModal';
import { PageTransitionProvider } from './components/common/PageTransition';

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
    <PageTransitionProvider>
      <div className="portfolio-app-root">
        {/* Auto scroll to top on navigation */}
        <ScrollToTop />

        {/* 1. Minimal luxury navigation */}
        <Navbar onOpenInquiry={() => handleOpenInquiry()} />

        {/* Multi-route content: Home, Collections, Services */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/collections"
            element={<CollectionsPage onOpenInquiry={handleOpenInquiry} />}
          />
          <Route path="/services" element={<ServicesPage />} />
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
    </PageTransitionProvider>
  );
}
