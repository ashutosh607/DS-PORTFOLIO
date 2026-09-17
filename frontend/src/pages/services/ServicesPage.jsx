import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useSearchParams } from 'react-router-dom';
import { COLLECTIONS, CATEGORIES as DEFAULT_CATEGORIES } from './data/servicesData';
import { useCategories } from '../../utils/categoryManager';
import CollectionTierCard from './components/CollectionTierCard';
import AtelierStandards from './components/AtelierStandards';
import CompareMatrixModal from './components/CompareMatrixModal';
import CommissionSummaryCard from './components/CommissionSummaryCard';
import BookingBriefForm from './components/BookingBriefForm';
import ConfirmationScreen from './components/ConfirmationScreen';
import LocationMapSection from './components/LocationMapSection';
import { handleWhatsAppSubmit } from '../../utils/whatsapp';

export default function ServicesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryCategory = searchParams.get('category');
  const queryTier = searchParams.get('tier') || searchParams.get('id');
  const queryStep = searchParams.get('step') || searchParams.get('action');

  const { categories: dynamicCategories } = useCategories();
  const [backendCategories, setBackendCategories] = useState([]);
  const [allActiveServices, setAllActiveServices] = useState([]);
  const [servicesLoaded, setServicesLoaded] = useState(false);

  // Canonical category matcher
  const toCanonicalKey = (str) =>
    (str || '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]/g, '')
      .replace(/s$/, '');

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((json) => {
        if (Array.isArray(json.data) && json.data.length > 0) {
          setBackendCategories(json.data);
        }
      })
      .catch(() => {});
  }, []);

  // Fetch all active services to determine which categories are published
  const fetchAllServices = React.useCallback(async () => {
    try {
      const res = await fetch('/api/services');
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json.data)) {
          setAllActiveServices(json.data.filter((s) => s.isActive !== false));
        }
      }
    } catch (err) {
      console.warn('Failed to load active services:', err);
    } finally {
      setServicesLoaded(true);
    }
  }, []);

  useEffect(() => {
    fetchAllServices();
    // Live revalidation when window receives focus or page visibility changes
    window.addEventListener('focus', fetchAllServices);
    window.addEventListener('visibilitychange', fetchAllServices);
    return () => {
      window.removeEventListener('focus', fetchAllServices);
      window.removeEventListener('visibilitychange', fetchAllServices);
    };
  }, [fetchAllServices]);

  // Base pool of candidate categories
  const candidateCategories = React.useMemo(() => {
    const base = [
      { id: 'wedding', label: 'WEDDING' },
      { id: 'pre-wedding', label: 'PRE-WEDDING' },
      { id: 'birthday', label: 'BIRTHDAY' },
      { id: 'portrait', label: 'PORTRAIT' },
      { id: 'event', label: 'EVENT' },
      { id: 'commercial', label: 'COMMERCIAL' },
    ];
    const sourcePool = [...(dynamicCategories || []), ...(backendCategories || [])];
    if (sourcePool.length === 0) return base;

    const list = [...base];
    sourcePool.forEach((cat) => {
      const slug = (cat.slug || cat.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || '').toLowerCase().trim();
      if (!slug) return;
      const key = toCanonicalKey(slug);
      const exists = list.some(
        (c) => toCanonicalKey(c.id) === key || toCanonicalKey(c.label) === key
      );
      if (!exists) {
        list.push({
          id: slug,
          label: (cat.name || slug).toUpperCase(),
        });
      }
    });
    return list;
  }, [dynamicCategories, backendCategories]);

  // CORE RULE: A category with 0 services must NEVER show publicly.
  // Perform an explicit length/count check (> 0) on associated active services.
  const categories = React.useMemo(() => {
    const servicePool =
      servicesLoaded && allActiveServices.length > 0
        ? allActiveServices
        : !servicesLoaded
        ? COLLECTIONS
        : allActiveServices;

    return candidateCategories.filter((cat) => {
      const catKey = toCanonicalKey(cat.id);
      const catLabelKey = toCanonicalKey(cat.label);
      const matchingServices = servicePool.filter((s) => {
        if (s.isActive === false) return false;
        const sCat = toCanonicalKey(s.category);
        return sCat === catKey || sCat === catLabelKey;
      });
      // Strict length check: must have at least one active service
      return Array.isArray(matchingServices) && matchingServices.length > 0;
    });
  }, [candidateCategories, allActiveServices, servicesLoaded]);

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
      const normalizedQuery = queryCategory.toLowerCase();
      const matchedCat = categories.find(
        (c) =>
          c.id.toLowerCase() === normalizedQuery ||
          c.id.toLowerCase() === normalizedQuery.replace(/s$/, '') ||
          `${c.id.toLowerCase()}s` === normalizedQuery
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
  }, [queryCategory, queryTier, queryStep, location.hash, categories]);

  // Auto-fallback if currently selected category has 0 services and is not in categories
  useEffect(() => {
    if (categories.length > 0) {
      const isCurrentValid = categories.some(
        (c) => toCanonicalKey(c.id) === toCanonicalKey(selectedCategoryId)
      );
      if (!isCurrentValid) {
        const fallbackCat = categories[0].id;
        setSelectedCategoryId(fallbackCat);
        setSearchParams(
          (prev) => {
            const updated = new URLSearchParams(prev);
            updated.set('category', fallbackCat);
            return updated;
          },
          { replace: true }
        );
      }
    }
  }, [categories, selectedCategoryId, setSearchParams]);

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

  // Dynamic services state fetched from backend MongoDB
  const [dynamicServices, setDynamicServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);

  // Fetch dynamic services when active category changes
  useEffect(() => {
    let isCancelled = false;
    const fetchServices = async () => {
      try {
        setLoadingServices(true);
        const res = await fetch(`/api/services?category=${selectedCategoryId}`);
        if (res.ok) {
          const json = await res.json();
          if (!isCancelled && Array.isArray(json.data)) {
            setDynamicServices(json.data);
          }
        }
      } catch (err) {
        console.error('Failed to load dynamic services:', err);
      } finally {
        if (!isCancelled) {
          setLoadingServices(false);
        }
      }
    };

    fetchServices();
    return () => {
      isCancelled = true;
    };
  }, [selectedCategoryId]);

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
    const matched = categories.find((c) => c.id === categoryId);
    if (matched) {
      updateFormData({
        eventType: matched.label === 'WEDDING' ? 'Wedding' : matched.label,
      });
    }
    // Auto-select the signature or first collection for the newly selected category
    const categoryCols = COLLECTIONS.filter((c) => c.category === categoryId);
    const signatureOrFirst =
      categoryCols.find((c) => c.highlight || c.isAtelierChoice) || categoryCols[0];
    const newTier = signatureOrFirst ? signatureOrFirst.id : 'signature';
    setSelectedCollectionId(newTier);
    setSearchParams(
      { category: categoryId, tier: newTier },
      { replace: true }
    );
  };

  const activeCategoryObj =
    categories.find((c) => c.id === selectedCategoryId) ||
    categories[0];

  // Normalize dynamic services or fallback to static collections
  const normalizedDynamicList = dynamicServices
    .filter((s) => s.isActive !== false)
    .map((s, idx) => ({
      ...s,
      id: s.tier || s._id,
      _id: s._id,
      title: s.eyebrow || s.title || 'Collection',
      subtitle: s.subtitle,
      folio: s.folioLabel || `Folio 0${idx + 1}`,
      folioLabel: s.folioLabel || `Folio 0${idx + 1}`,
      tag: s.badge || (s.isRecommended ? '★ Atelier Choice' : 'THE COLLECTION'),
      badge: s.badge,
      image: s.imageUrl || s.image,
      imageUrl: s.imageUrl || s.image,
      imageLabel: s.imageTag || 'Archive Specimen',
      imageBadge: s.badge,
      price:
        typeof s.price === 'number'
          ? `₹${s.price.toLocaleString('en-IN')}`
          : s.price || 'Price to be added',
      numericPrice: typeof s.price === 'number' ? s.price : null,
      priceNote: s.priceNote,
      description: s.description,
      deliverables: s.deliverables || [],
      curationHighlights: s.deliverables || [],
      isAtelierChoice: s.isRecommended,
      highlight: s.isRecommended,
      category: s.category,
    }));

  const filteredStaticCollections = COLLECTIONS.filter(
    (c) => toCanonicalKey(c.category) === toCanonicalKey(selectedCategoryId)
  );

  const activeCollections =
    normalizedDynamicList.length > 0
      ? normalizedDynamicList
      : allActiveServices.length === 0
      ? filteredStaticCollections
      : [];

  const selectedCollection =
    activeCollections.find(
      (c) => c.id === selectedCollectionId || c._id === selectedCollectionId
    ) ||
    activeCollections.find((c) => c.highlight || c.isAtelierChoice) ||
    activeCollections[0] || {
      id: `${selectedCategoryId}-custom-suite`,
      title: `${activeCategoryObj?.label || 'Custom'} Bespoke Suite`,
      subtitle: 'Tailored Archival Commission',
      price: 'Price on Request',
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000&auto=format&fit=crop',
      imageLabel: 'Archive Specimen',
      deliverables: [
        'Dedicated Creative Director & Principal Master',
        'Custom Pacing & Bespoke Itinerary Direction',
        'Medium Format Analog Film & Digital Masters',
        'Handcrafted Archival Presentation Folio',
      ],
      description: `Bespoke commissioned suite curated specifically for ${activeCategoryObj?.label?.toLowerCase() || 'custom'} celebrations.`,
    };

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
      }).catch(() => { });
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
              className={`font-sans text-[11px] tracking-[0.2em] uppercase transition-colors cursor-pointer flex items-center gap-2 ${stage === 1 ? 'font-semibold text-[#101010]' : 'text-[#7A7770] hover:text-[#101010]'
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
              className={`font-sans text-[11px] tracking-[0.2em] uppercase transition-colors cursor-pointer flex items-center gap-2 ${stage === 2 ? 'font-semibold text-[#101010]' : 'text-[#7A7770] hover:text-[#101010]'
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
                  {categories.map((cat) => {
                    const isCatSelected = selectedCategoryId === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => handleCategorySelect(cat.id)}
                        className={`font-sans text-xs tracking-[0.2em] uppercase transition-all duration-300 cursor-pointer pb-1.5 border-b ${isCatSelected
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

              {/* 3 Collection Cards Grid or Custom Bespoke Notice with smooth Framer Motion transition */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedCategoryId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[clamp(28px,3vw,56px)] items-stretch"
                >
                  {activeCollections.length > 0 ? (
                    activeCollections.map((col) => (
                      <CollectionTierCard
                        key={col.id || col._id}
                        collection={col}
                        isSelected={selectedCollectionId === col.id || selectedCollectionId === col._id}
                        onSelectAndBook={handleSelectAndBook}
                      />
                    ))
                  ) : loadingServices ? (
                    <div className="col-span-full py-20 text-center">
                      <div className="w-6 h-6 border-2 border-[#101010] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                      <p className="text-[10px] tracking-[0.2em] uppercase text-[#7A7770]">Loading Collections...</p>
                    </div>
                  ) : null}
                </motion.div>
              </AnimatePresence>

              {/* Connected Atelier Standards Section with generous 140px whitespace */}
              <AtelierStandards />

              {/* Destination Map Section */}
              <LocationMapSection
                location={formData.location}
                coordinates={formData.coordinates}
                venue={formData.venue}
              />
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

              {/* Destination Map Section */}
              <LocationMapSection
                location={formData.location}
                coordinates={formData.coordinates}
                venue={formData.venue}
              />
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

