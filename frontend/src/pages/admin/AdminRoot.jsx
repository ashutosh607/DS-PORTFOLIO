import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminAuthProvider } from './context/AdminAuthContext';
import AdminProtectedRoute from './components/AdminProtectedRoute';

const AdminLayout = lazy(() => import('./AdminLayout'));
const AdminLoginPage = lazy(() => import('./AdminLoginPage'));
const AdminDashboardPage = lazy(() => import('./AdminDashboardPage'));
const AdminCollectionsPage = lazy(() => import('./AdminCollectionsPage'));
const AdminServicesPage = lazy(() => import('./AdminServicesPage'));

export default function AdminRoot() {
  return (
    <AdminAuthProvider>
      <Suspense fallback={<div className="min-h-screen bg-[#101010]" />}>
        <Routes>
          <Route path="login" element={<AdminLoginPage />} />
          <Route
            element={
              <AdminProtectedRoute>
                <AdminLayout />
              </AdminProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="collections" element={<AdminCollectionsPage />} />
            <Route path="collections/:category" element={<AdminCollectionsPage />} />
            <Route path="services" element={<AdminServicesPage />} />
            <Route path="services/:category" element={<AdminServicesPage />} />
          </Route>
        </Routes>
      </Suspense>
    </AdminAuthProvider>
  );
}
