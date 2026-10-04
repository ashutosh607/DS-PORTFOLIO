import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './components/AdminSidebar';
import SEOHead from '../../components/common/SEOHead';
import './AdminDashboard.css';

export default function AdminLayout() {
  return (
    <>
      <SEOHead
        title="Studio Management Console | DS Photography"
        description="Private administrative management console."
        robots="noindex, nofollow, noarchive"
      />
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
    </>
  );
}
