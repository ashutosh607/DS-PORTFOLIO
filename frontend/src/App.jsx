import React, { useState, useEffect, Suspense, lazy, useRef } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import HomePage from './pages/home/HomePage';
import { PageTransitionProvider } from './components/common/PageTransition';
import SplashScreen from './components/common/SplashScreen';
import ErrorBoundary from './components/common/ErrorBoundary';
import SmoothScroll from './components/common/SmoothScroll';

// Code-split routes, footer, modals and admin portal for optimal performance and smaller initial JS bundle
const Footer = lazy(() => import('./components/layout/Footer'));
const CollectionsPage = lazy(() => import('./pages/collections/CollectionsPage'));
const ServicesPage = lazy(() => import('./pages/services/ServicesPage'));
const InquiryModal = lazy(() => import('./components/modals/InquiryModal'));
const AboutPage = lazy(() => import('./pages/about/AboutPage'));
const PhotographerInMumbaiPage = lazy(() => import('./pages/landing/PhotographerInMumbaiPage'));
const TermsPage = lazy(() => import('./pages/terms/TermsPage'));
const NotFoundPage = lazy(() => import('./pages/error/NotFoundPage'));
const ErrorPage = lazy(() => import('./pages/error/ErrorPage'));

// Admin Panel bundle completely isolated and lazy loaded on demand
const AdminRoot = lazy(() => import('./pages/admin/AdminRoot'));

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const prevPathRef = useRef(pathname);

  useEffect(() => {
    // Disable browser automatic scroll restoration so it never jumps back
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    const wasCollections = prevPathRef.current.startsWith('/collections');
    const isCollections = pathname.startsWith('/collections');
    prevPathRef.current = pathname;

    // Preserve scroll position when transitioning between collection sub-paths
    if (wasCollections && isCollections) {
      return;
    }

    if (hash) {
      const timer = setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      return () => clearTimeout(timer);
    }

    // Instant scroll to (0, 0) without triggering multiple layout reflows
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}

export default function App() {
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState('');
  const [splashActive, setSplashActive] = useState(true);
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    // If navigating to admin panel, dismiss static HTML splash screen immediately
    if (isAdminRoute) {
      const staticSplash = document.getElementById('initial-splash-screen');
      if (staticSplash) staticSplash.remove();
    }
  }, [isAdminRoute]);
  const normalizedPath = location.pathname.replace(/\/+$/, '') || '/';
  const isErrorOrNotFoundRoute =
    normalizedPath === '/error' ||
    (!isAdminRoute &&
      normalizedPath !== '/' &&
      !normalizedPath.startsWith('/collections') &&
      normalizedPath !== '/services' &&
      normalizedPath !== '/about' &&
      normalizedPath !== '/photographer-in-mumbai' &&
      normalizedPath !== '/terms');

  const showPublicChrome = !isAdminRoute && !isErrorOrNotFoundRoute;

  const handleOpenInquiry = (tier = '') => {
    setSelectedTier(tier);
    setInquiryModalOpen(true);
  };

  const handleCloseInquiry = () => {
    setInquiryModalOpen(false);
    setSelectedTier('');
  };

  return (
    <ErrorBoundary>
      <SmoothScroll>
        <PageTransitionProvider>
          {/* Initial Luxury Brand Intro Splash Screen */}
          {splashActive && !isAdminRoute && (
            <SplashScreen onComplete={() => setSplashActive(false)} />
          )}

          <div className="portfolio-app-root">
            {/* Auto scroll to top on navigation */}
            <ScrollToTop />

            {/* 1. Minimal luxury navigation (only on public site) */}
            {showPublicChrome && <Navbar onOpenInquiry={() => handleOpenInquiry()} />}

            {/* Multi-route content: Public + Admin routes */}
            <Suspense fallback={<div className="min-h-screen bg-[#FDFCF8]" />}>
              <Routes>
                {/* Public Portfolio Routes */}
                <Route path="/" element={<HomePage />} />
                <Route
                  path="/collections"
                  element={<CollectionsPage onOpenInquiry={handleOpenInquiry} />}
                />
                <Route
                  path="/collections/:categorySlug"
                  element={<CollectionsPage onOpenInquiry={handleOpenInquiry} />}
                />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/about" element={<AboutPage onOpenInquiry={handleOpenInquiry} />} />
                <Route path="/about/*" element={<AboutPage onOpenInquiry={handleOpenInquiry} />} />
                <Route path="/photographer-in-mumbai" element={<PhotographerInMumbaiPage onOpenInquiry={handleOpenInquiry} />} />
                <Route path="/photographer-in-mumbai/*" element={<PhotographerInMumbaiPage onOpenInquiry={handleOpenInquiry} />} />
                <Route path="/terms" element={<TermsPage onOpenInquiry={handleOpenInquiry} />} />

                {/* Legacy / Alias Public Route Redirection */}
                <Route path="/portfolio" element={<Navigate to="/collections" replace />} />
                <Route path="/portfolio/:categorySlug" element={<Navigate to="/collections/:categorySlug" replace />} />

                {/* Dedicated Error Testing Route */}
                <Route path="/error" element={<ErrorPage />} />

                {/* Isolated Admin Management Portal */}
                <Route path="/admin/*" element={<AdminRoot />} />

                {/* 404 Page Not Found Route */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>

            {/* Minimal footer with CET studio time and social directory (only on public site) */}
            {showPublicChrome && (
              <Suspense fallback={<div className="min-h-[200px] bg-[#101010]" />}>
                <Footer onOpenInquiry={() => handleOpenInquiry()} />
              </Suspense>
            )}

            {/* Interactive Consultation / Inquiry Modal (only on public site, loaded on demand) */}
            {showPublicChrome && inquiryModalOpen && (
              <Suspense fallback={null}>
                <InquiryModal
                  isOpen={inquiryModalOpen}
                  onClose={handleCloseInquiry}
                  prefillTier={selectedTier}
                />
              </Suspense>
            )}
          </div>
        </PageTransitionProvider>
      </SmoothScroll>
    </ErrorBoundary>
  );
}
