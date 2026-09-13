import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Folder, ExternalLink, User, LogOut } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import '../AdminDashboard.css';

export default function AdminSidebar() {
  const { logout, adminUser } = useAdminAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: Home },
    { label: 'Collections', path: '/admin/collections', icon: Folder },
  ];

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden flex items-center justify-between px-6 py-4 bg-[#FAF8F5] border-b border-[#E8E2D6] sticky top-0 z-40">
        <div>
          <span className="font-sans text-[13px] font-semibold tracking-[0.18em] text-[#181818] uppercase block">
            STUDIO ADMIN
          </span>
          <span className="block font-sans text-[9px] tracking-[0.22em] text-[#7A756D] uppercase mt-0.5">
            DS PHOTOGRAPHY &amp; FILMS
          </span>
        </div>
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 border border-[#E8E2D6] rounded-lg text-[#181818] text-sm hover:bg-[#F0EAE0] transition-colors"
          aria-label="Toggle menu"
        >
          {mobileOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Backdrop for mobile */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/30 z-40 lg:hidden backdrop-blur-xs"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`admin-sidebar-shell transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } fixed lg:sticky top-0 left-0 bottom-0 z-50`}
      >
        {/* Top Header / Brand Area */}
        <div>
          <div className="pt-9 px-7 pb-8">
            <span className="block text-[13px] tracking-[0.2em] text-[#181818] uppercase font-semibold">
              STUDIO ADMIN
            </span>
            <span className="block text-[9px] tracking-[0.22em] text-[#7A756D] uppercase mt-1 font-medium">
              DS PHOTOGRAPHY &amp; FILMS
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="px-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `admin-sidebar-nav-item ${isActive ? 'active' : ''}`
                  }
                >
                  <Icon size={16} strokeWidth={1.5} className="shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}

            {/* View Public Site */}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="admin-sidebar-nav-item"
            >
              <ExternalLink size={16} strokeWidth={1.5} className="shrink-0" />
              <span>View Public Site</span>
            </a>
          </nav>
        </div>

        {/* Bottom User Info & Logout */}
        <div className="px-5 pb-7">
          <div className="border-t border-[#E8E2D6] pt-4 space-y-1">
            {/* User Email */}
            <div className="flex items-center gap-2.5 px-3 py-2 text-[#6E6960]">
              <User size={15} strokeWidth={1.5} className="text-[#8E887E] shrink-0" />
              <span className="text-[12px] truncate" title={adminUser?.email}>
                {adminUser?.email || 'admin@dsphotography.com'}
              </span>
            </div>

            {/* Logout */}
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[8px] text-[#6E6960] hover:text-[#181818] hover:bg-[#F0EAE0] text-[12px] transition-colors cursor-pointer text-left font-normal"
            >
              <LogOut size={15} strokeWidth={1.5} className="text-[#8E887E] shrink-0" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
