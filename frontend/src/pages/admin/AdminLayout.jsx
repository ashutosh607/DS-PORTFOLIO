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
      <main className="flex-1 min-w-0 overflow-y-auto bg-[#FAF8F5]">
        <div className="w-full max-w-[1440px] mx-auto px-7 py-9 sm:px-12 sm:py-12 lg:px-16 lg:py-14">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
