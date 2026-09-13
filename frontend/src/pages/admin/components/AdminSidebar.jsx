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
      <div className="lg:hidden flex items-center justify-between px-5 py-3.5 bg-[#FAF8F5] border-b border-[#E8E2D6] sticky top-0 z-40">
        <div>
          <span className="block text-[12px] tracking-[0.18em] text-[#181818] uppercase font-semibold">
            STUDIO ADMIN
          </span>
          <span className="block text-[9px] tracking-[0.2em] text-[#7A756D] uppercase mt-0.5 font-medium">
            DS PHOTOGRAPHY &amp; FILMS
          </span>
        </div>
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="w-9 h-9 flex items-center justify-center border border-[#E8E2D6] rounded-lg text-[#181818] text-sm hover:bg-[#F0EAE0] transition-colors"
          aria-label="Toggle menu"
        >
          {mobileOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Backdrop for mobile */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`admin-sidebar-shell transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } fixed lg:sticky top-0 left-0 bottom-0 z-50`}
      >
        {/* Brand Area */}
        <div>
          <div className="pt-9 px-8 pb-8">
            <span className="block text-[13px] tracking-[0.22em] text-[#181818] uppercase font-semibold leading-tight">
              STUDIO ADMIN
            </span>
            <span className="block text-[9px] tracking-[0.2em] text-[#7A756D] uppercase mt-2 font-medium">
              DS PHOTOGRAPHY &amp; FILMS
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="px-5 space-y-1.5">
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
        <div className="px-6 pb-8">
          <div className="border-t border-[#E8E2D6] pt-6 space-y-1">
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
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[10px] text-[#6E6960] hover:text-[#181818] hover:bg-[#F0EAE0] text-[12px] transition-colors cursor-pointer text-left font-normal"
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
