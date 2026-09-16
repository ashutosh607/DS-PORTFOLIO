import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import HomePage from './pages/home/HomePage';
import CollectionsPage from './pages/collections/CollectionsPage';
import ServicesPage from './pages/services/ServicesPage';
import Footer from './components/layout/Footer';
import InquiryModal from './components/modals/InquiryModal';
import { PageTransitionProvider } from './components/common/PageTransition';
import ErrorBoundary from './components/common/ErrorBoundary';
import NotFoundPage from './pages/error/NotFoundPage';
import ErrorPage from './pages/error/ErrorPage';

// Admin Panel imports
import { AdminAuthProvider } from './pages/admin/context/AdminAuthContext';
import AdminProtectedRoute from './pages/admin/components/AdminProtectedRoute';
import AdminLayout from './pages/admin/AdminLayout';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminCollectionsPage from './pages/admin/AdminCollectionsPage';
import AdminServicesPage from './pages/admin/AdminServicesPage';

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
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith('/admin');
  const isErrorOrNotFoundRoute =
    location.pathname === '/error' ||
    (!isAdminRoute &&
      location.pathname !== '/' &&
      !location.pathname.startsWith('/collections') &&
      location.pathname !== '/services');

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
          <div className="portfolio-app-root">
            {/* Auto scroll to top on navigation */}
            <ScrollToTop />

            {/* 1. Minimal luxury navigation (only on public site) */}
            {showPublicChrome && <Navbar onOpenInquiry={() => handleOpenInquiry()} />}

            {/* Multi-route content: Public + Admin routes */}
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
