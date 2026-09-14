import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useSearchParams } from 'react-router-dom';
import { COLLECTIONS, CATEGORIES } from './data/servicesData';
import CollectionTierCard from './components/CollectionTierCard';
import AtelierStandards from './components/AtelierStandards';
import CompareMatrixModal from './components/CompareMatrixModal';
import CommissionSummaryCard from './components/CommissionSummaryCard';
import BookingBriefForm from './components/BookingBriefForm';
import ConfirmationScreen from './components/ConfirmationScreen';
import { handleWhatsAppSubmit } from '../../utils/whatsapp';

export default function ServicesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryCategory = searchParams.get('category');
  const queryTier = searchParams.get('tier') || searchParams.get('id');
  const queryStep = searchParams.get('step') || searchParams.get('action');

  const [stage, setStage] = useState(queryStep === 'book' ? 2 : 1); // 1 = Collections, 2 = Booking Form, 3 = Confirmation
  const [selectedCategoryId, setSelectedCategoryId] = useState('wedding');
  const [selectedCollectionId, setSelectedCollectionId] = useState('signature');
  const [compareMatrixOpen, setCompareMatrixOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inquiryId, setInquiryId] = useState('RL-2025-D98');

  const location = useLocation();

  // Sync state from URL query parameters
  useEffect(() => {
    if (queryCategory) {
      const matchedCat = CATEGORIES.find(
        (c) => c.id.toLowerCase() === queryCategory.toLowerCase()
      );
      if (matchedCat) {
        setSelectedCategoryId(matchedCat.id);
        updateFormData({
          eventType: matchedCat.label === 'WEDDING' ? 'Wedding' : matchedCat.label,
        });
      }
    }
    if (queryTier) {
      const matchedCol = COLLECTIONS.find(
        (c) => c.id.toLowerCase() === queryTier.toLowerCase()
      );
      if (matchedCol) {
        setSelectedCollectionId(matchedCol.id);
      }
    }
    if (queryStep === 'book' || location.hash === '#book') {
      setStage(2);
    }
  }, [queryCategory, queryTier, queryStep, location.hash]);

  // Ensure professional query URL on initial load if none set
  useEffect(() => {
    if (!searchParams.get('category')) {
      setSearchParams(
        { category: selectedCategoryId, tier: selectedCollectionId },
        { replace: true }
      );
    }
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    countryCode: '+91',
    eventType: 'Wedding',
    eventDate: '',
    duration: '2 Days',
    location: '',
    disciplines: ['fine-art-photo', 'archival-album'],
    message: '',
    source: 'Instagram',
  });

  // Listen for Navbar "Book a Session" event or URL hash #book
  useEffect(() => {
    if (location.hash === '#book') {
      setStage(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    const handleOpenBooking = () => {
      setStage(2);
      setSearchParams(
        { category: selectedCategoryId, tier: selectedCollectionId, step: 'book' },
        { replace: true }
      );
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('open-booking-form', handleOpenBooking);
    return () => window.removeEventListener('open-booking-form', handleOpenBooking);
  }, [location, selectedCategoryId, selectedCollectionId, setSearchParams]);

  const updateFormData = (fields) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategoryId(categoryId);
    const matched = CATEGORIES.find((c) => c.id === categoryId);
    if (matched) {
      updateFormData({
        eventType: matched.label === 'WEDDING' ? 'Wedding' : matched.label,
      });
    }
    // Auto-select the signature or first collection for the newly selected category
    const categoryCols = COLLECTIONS.filter((c) => c.category === categoryId);
    const signatureOrFirst =
      categoryCols.find((c) => c.highlight || c.isAtelierChoice) || categoryCols[0];
    const newTier = signatureOrFirst ? signatureOrFirst.id : selectedCollectionId;
    if (signatureOrFirst) {
      setSelectedCollectionId(signatureOrFirst.id);
    }
    setSearchParams(
      { category: categoryId, tier: newTier },
      { replace: true }
    );
  };

  const filteredCollections = COLLECTIONS.filter(
    (c) => c.category === selectedCategoryId
  );
  const activeCollections =
    filteredCollections.length > 0 ? filteredCollections : COLLECTIONS.slice(0, 3);

  const selectedCollection =
    COLLECTIONS.find((c) => c.id === selectedCollectionId) ||
    activeCollections.find((c) => c.highlight || c.isAtelierChoice) ||
    activeCollections[0];

  const handleSelectAndBook = (collectionId, proceed = false) => {
    setSelectedCollectionId(collectionId);
    if (proceed) {
      setStage(2);
      setSearchParams(
        { category: selectedCategoryId, tier: collectionId, step: 'book' },
        { replace: true }
      );
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setSearchParams(
        { category: selectedCategoryId, tier: collectionId },
        { replace: true }
      );
    }
  };

  const handleBackToCollections = () => {
    setStage(1);
    setSearchParams(
      { category: selectedCategoryId, tier: selectedCollectionId },
      { replace: true }
    );
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFormSubmit = async () => {
    setIsSubmitting(true);
    const generatedRef = `RL-2025-${Math.floor(100 + Math.random() * 900)}`;
    setInquiryId(generatedRef);

    // 1. Open WhatsApp with pre-filled encoded message synchronously (preserves user gesture)
    handleWhatsAppSubmit({ formData, selectedCollection });

    // 2. Background persistence resilience
    try {
      fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inquiryId: generatedRef,
          collection: selectedCollection.title,
          ...formData,
          createdAt: new Date().toISOString(),
        }),
      }).catch(() => {});
    } catch {
      // Resilience
    }

    // 3. Keep current page intact and reset submission status after debounce
    setTimeout(() => {
      setIsSubmitting(false);
    }, 1200);
  };

  const handleReset = () => {
    setStage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      className="min-h-screen bg-[#FDFCF8] text-[#101010] selection:bg-[#E3DBCC] selection:text-[#101010]"
      style={{
        paddingTop: 'clamp(120px, 11vw, 160px)',
      }}
    >
      <div
        style={{
          maxWidth: '1440px',
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: 'clamp(24px, 5vw, 80px)',
          paddingRight: 'clamp(24px, 5vw, 80px)',
          width: '100%',
        }}
      >

        {/* 1. Top Stage Ribbon */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 mb-16 sm:mb-20 border-b border-[#E3DBCC]">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => {
                setStage(1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`font-sans text-[11px] tracking-[0.2em] uppercase transition-colors cursor-pointer flex items-center gap-2 ${
                stage === 1 ? 'font-semibold text-[#101010]' : 'text-[#7A7770] hover:text-[#101010]'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${stage === 1 ? 'bg-[#101010]' : 'bg-[#C5B9A5]'}`} />
              <span>01 CHOOSE COLLECTION</span>
            </button>

            <span className="text-[#C5B9A5]">—</span>

            <button
              type="button"
              onClick={() => {
                setStage(2);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`font-sans text-[11px] tracking-[0.2em] uppercase transition-colors cursor-pointer flex items-center gap-2 ${
                stage === 2 ? 'font-semibold text-[#101010]' : 'text-[#7A7770] hover:text-[#101010]'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${stage === 2 ? 'bg-[#101010]' : 'bg-transparent'}`} />
              <span>02 BOOK YOUR SLOT</span>
            </button>

            {stage === 3 && (
              <>
                <span className="text-[#C5B9A5]">—</span>
                <span className="font-sans text-[11px] font-semibold text-[#101010] tracking-[0.2em] uppercase">
                  03 CONFIRMATION
                </span>
              </>
            )}
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[#7A7770] font-sans text-[11px] tracking-[0.2em] uppercase">
            <span>ATELIER SCHEDULE OPEN</span>
            <span className="text-[#C5B9A5]">•</span>
            <span>2025–2026</span>
          </div>
        </div>

        <AnimatePresence mode="wait">

          {/* =========================================================
              STAGE 01: COMMISSION SELECTION ("Choose Your Experience")
              ========================================================= */}
          {stage === 1 && (
            <motion.div
              key="stage-01"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              {/* Hero Header Section */}
              <div className="text-center mb-6">
                <span className="font-sans text-[10px] sm:text-[11px] font-semibold tracking-[0.25em] text-[#7A7770] uppercase block mb-4">
                  STAGE 01 · COMMISSION SELECTION
                </span>

                <h1
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 'clamp(2.6rem, 4.8vw, 4.4rem)',
                    lineHeight: 1.1,
                    letterSpacing: '-0.015em',
                    color: 'var(--color-obsidian)',
                    fontWeight: 400,
                    textAlign: 'center',
                  }}
                >
                  Choose Your Experience
                </h1>

                <p
                  style={{
                    maxWidth: '650px',
                    margin: '24px auto 0',
                    textAlign: 'center',
                    fontFamily: 'var(--font-serif)',
                    fontStyle: 'italic',
                    fontSize: 'clamp(1rem, 1.25vw, 1.2rem)',
                    color: '#7A7770',
                    lineHeight: 1.65,
                  }}
                >
                  Every story deserves a collection that feels right for you. Curated with archival permanence, medium format tonality, and understated elegance.
                </p>
              </div>

              {/* Category Navigation with 55px top / 45px bottom margin and thin underline */}
              <div style={{ marginTop: '55px', marginBottom: '45px' }} className="w-full overflow-x-auto no-scrollbar">
                <div className="flex items-center justify-center min-w-max gap-6 sm:gap-9 px-4">
                  {CATEGORIES.map((cat) => {
                    const isCatSelected = selectedCategoryId === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => handleCategorySelect(cat.id)}
                        className={`font-sans text-xs tracking-[0.2em] uppercase transition-all duration-300 cursor-pointer pb-1.5 border-b ${
                          isCatSelected
                            ? 'text-[#101010] font-semibold border-[#101010]'
                            : 'text-[#7A7770] hover:text-[#101010] border-transparent hover:border-[#C5B9A5]'
                        }`}
                      >
                        {cat.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3 Collection Cards Grid with smooth Framer Motion transition */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedCategoryId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[clamp(28px,3vw,56px)] items-stretch"
                >
                  {activeCollections.map((col) => (
                    <CollectionTierCard
                      key={col.id}
                      collection={col}
                      isSelected={selectedCollectionId === col.id}
                      onSelectAndBook={handleSelectAndBook}
                    />
                  ))}
                </motion.div>
              </AnimatePresence>

              {/* Connected Atelier Standards Section with generous 140px whitespace */}
              <AtelierStandards />
            </motion.div>
          )}

          {/* =========================================================
              STAGE 02: BOOKING BRIEF FORM ("LET'S MAKE IT OFFICIAL.")
              ========================================================= */}
          {stage === 2 && (
            <motion.div
              key="stage-02"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              {/* Top Page Header (60px bottom spacing) */}
              <div style={{ marginBottom: '60px' }}>
                <div style={{ marginBottom: '20px' }}>
                  <button
                    type="button"
                    onClick={handleBackToCollections}
                    className="text-[#7A7770] hover:text-[#101010] font-sans text-xs font-semibold uppercase tracking-[0.16em] flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <span>←</span>
                    <span>RETURN TO COLLECTIONS</span>
                  </button>
                </div>

                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
                  <div>
                    <h1
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: 'clamp(34px, 4.5vw, 56px)',
                        lineHeight: 1.05,
                        fontWeight: 400,
                        color: 'var(--color-obsidian)',
                        margin: 0,
                        letterSpacing: '-0.02em',
                      }}
                    >
                      LET'S MAKE IT OFFICIAL.
                    </h1>

                    <p
                      style={{
                        marginTop: '20px',
                        maxWidth: '850px',
                        fontFamily: 'var(--font-sans)',
                        fontSize: 'clamp(15px, 1.4vw, 20px)',
                        lineHeight: 1.6,
                        color: '#7A7770',
                      }}
                    >
                      Tell us a little about your plans and we'll review our atelier calendar to respond within 24 hours.
                    </p>
                  </div>

                  <div className="font-sans text-xs text-[#7A7770] tracking-[0.14em] uppercase shrink-0 pb-1">
                    Autumn / Spring Cadence · 18 Commissions Per Cycle
                  </div>
                </div>
              </div>

              {/* Main Form Layout: Desktop 38% / 62% Two-Column with EXACTLY 64px gap */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr',
                  gap: '64px',
                  alignItems: 'start',
                }}
                className="lg:!grid-cols-[38%_calc(62%-64px)]"
              >
                {/* Left Column (Sticky Commission Summary: 38%) */}
                <div className="w-full lg:sticky lg:top-24">
                  <CommissionSummaryCard
                    collection={selectedCollection}
                    category={selectedCategoryId}
                    formData={formData}
                    onScrollToCollections={handleBackToCollections}
                  />
                </div>

                {/* Right Column (5-Part Form: 62%) */}
                <div className="w-full">
                  <BookingBriefForm
                    formData={formData}
                    updateFormData={updateFormData}
                    selectedCollection={selectedCollection}
                    selectedCategory={selectedCategoryId}
                    onScrollToCollections={handleBackToCollections}
                    onSelectCollection={setSelectedCollectionId}
                    categoryCollections={activeCollections}
                    onSubmit={handleFormSubmit}
                    isSubmitting={isSubmitting}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* =========================================================
              STAGE 03: CONFIRMATION DOSSIER
              ========================================================= */}
          {stage === 3 && (
            <ConfirmationScreen
              key="stage-03"
              formData={formData}
              inquiryId={inquiryId}
              selectedCollection={selectedCollection}
              onReset={handleReset}
            />
          )}

        </AnimatePresence>
      </div>

      {/* Compare Matrix Modal */}
      <CompareMatrixModal
        isOpen={compareMatrixOpen}
        onClose={() => setCompareMatrixOpen(false)}
        selectedCollectionId={selectedCollectionId}
        onSelectCollection={(id) => {
          setSelectedCollectionId(id);
          setCompareMatrixOpen(false);
        }}
      />
    </div>
  );
}

