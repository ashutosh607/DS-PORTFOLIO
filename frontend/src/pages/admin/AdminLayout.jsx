import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './components/AdminSidebar';

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-[#FDFCF8] text-[#101010] flex flex-col lg:flex-row antialiased selection:bg-[#E3DBCC] selection:text-[#101010]">
      {/* Editorial Sidebar */}
      <AdminSidebar />

      {/* Main Workspace Area */}
      <main className="flex-1 min-w-0 overflow-y-auto bg-[#FDFCF8]">
        <div className="w-full max-w-[1440px] mx-auto px-[20px] py-[28px] md:px-[36px] md:py-[40px] lg:px-[56px] lg:pt-[48px] lg:pb-[64px]">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
