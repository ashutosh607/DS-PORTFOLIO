import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './components/AdminSidebar';
import './AdminDashboard.css';

export default function AdminLayout() {
  return (
    <div className="admin-dashboard-container flex flex-col lg:flex-row antialiased min-h-screen">
      {/* Editorial Sidebar */}
      <AdminSidebar />

      {/* Main Spacious Workspace Area */}
      <main className="admin-main-workspace">
        <div className="admin-content-inner">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
