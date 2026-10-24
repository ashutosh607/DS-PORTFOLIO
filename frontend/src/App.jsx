import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import HomePage from './pages/home/HomePage';
import Footer from './components/layout/Footer';
import { PageTransitionProvider } from './components/common/PageTransition';
import SplashScreen from './components/common/SplashScreen';
import ErrorBoundary from './components/common/ErrorBoundary';
import SmoothScroll from './components/common/SmoothScroll';

// Code-split routes and modals for optimal performance and smaller initial JS bundle
const CollectionsPage = lazy(() => import('./pages/collections/CollectionsPage'));
const ServicesPage = lazy(() => import('./pages/services/ServicesPage'));
const InquiryModal = lazy(() => import('./components/modals/InquiryModal'));
const TermsPage = lazy(() => import('./pages/terms/TermsPage'));
const NotFoundPage = lazy(() => import('./pages/error/NotFoundPage'));
import ErrorPage from './pages/error/ErrorPage';

// Admin Panel lazy imports (excluded from public user bundle)
import { AdminAuthProvider } from './pages/admin/context/AdminAuthContext';
import AdminProtectedRoute from './pages/admin/components/AdminProtectedRoute';
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage'));
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'));
const AdminCollectionsPage = lazy(() => import('./pages/admin/AdminCollectionsPage'));
const AdminServicesPage = lazy(() => import('./pages/admin/AdminServicesPage'));

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Disable browser automatic scroll restoration so it never jumps back
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
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
  const isErrorOrNotFoundRoute =
    location.pathname === '/error' ||
    (!isAdminRoute &&
      location.pathname !== '/' &&
      !location.pathname.startsWith('/collections') &&
      location.pathname !== '/services' &&
      location.pathname !== '/terms');

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
      <AdminAuthProvider>
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
                <Route path="/terms" element={<TermsPage onOpenInquiry={handleOpenInquiry} />} />

                {/* Legacy / Alias Public Route Redirection */}
                <Route path="/portfolio" element={<Navigate to="/collections" replace />} />
                <Route path="/portfolio/:categorySlug" element={<Navigate to="/collections/:categorySlug" replace />} />

                {/* Dedicated Error Testing Route */}
                <Route path="/error" element={<ErrorPage />} />

                {/* Admin Authentication */}
                <Route path="/admin/login" element={<AdminLoginPage />} />

                {/* Protected Admin Panel */}
                <Route
                  path="/admin"
                  element={
                    <AdminProtectedRoute>
                      <AdminLayout />
                    </AdminProtectedRoute>
                  }
                >
                  <Route index element={<Navigate to="/admin/dashboard" replace />} />
                  <Route path="dashboard" element={<AdminDashboardPage />} />
                  <Route path="collections" element={<AdminCollectionsPage />} />
                  <Route path="collections/:category" element={<AdminCollectionsPage />} />
                  <Route path="services" element={<AdminServicesPage />} />
                  <Route path="services/:category" element={<AdminServicesPage />} />
                </Route>

                {/* 404 Page Not Found Route */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>

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
    </AdminAuthProvider>
  </ErrorBoundary>
  );
}
