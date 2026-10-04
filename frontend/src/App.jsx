import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import HomePage from './pages/home/HomePage';
import CollectionsPage from './pages/collections/CollectionsPage';
import ServicesPage from './pages/services/ServicesPage';
import Footer from './components/layout/Footer';
import InquiryModal from './components/modals/InquiryModal';
import { PageTransitionProvider } from './components/common/PageTransition';
import SplashScreen from './components/common/SplashScreen';
import ErrorBoundary from './components/common/ErrorBoundary';
import NotFoundPage from './pages/error/NotFoundPage';
import ErrorPage from './pages/error/ErrorPage';

// Code-split routes for optimal performance and smaller initial JS bundle
const TermsPage = lazy(() => import('./pages/terms/TermsPage'));
const JournalIndexPage = lazy(() => import('./pages/journal/JournalIndexPage'));
const JournalArticlePage = lazy(() => import('./pages/journal/JournalArticlePage'));

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
    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
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
      !location.pathname.startsWith('/journal') &&
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

                {/* Editorial Journal & Guides */}
                <Route path="/journal" element={<JournalIndexPage />} />
                <Route path="/journal/:slug" element={<JournalArticlePage />} />

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

            {/* Minimal footer with CET studio time and social directory (only on public site) */}
            {showPublicChrome && <Footer onOpenInquiry={() => handleOpenInquiry()} />}

            {/* Interactive Consultation / Inquiry Modal (only on public site) */}
            {showPublicChrome && (
              <InquiryModal
                isOpen={inquiryModalOpen}
                onClose={handleCloseInquiry}
                prefillTier={selectedTier}
              />
            )}
          </div>
        </PageTransitionProvider>
      </AdminAuthProvider>
    </ErrorBoundary>
  );
}
