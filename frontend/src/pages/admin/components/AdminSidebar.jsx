import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';

export default function AdminSidebar() {
  const { logout, adminUser } = useAdminAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard' },
    { label: 'Collections', path: '/admin/collections' },
  ];

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden flex items-center justify-between px-[20px] py-[16px] bg-[#FDFCF8] border-b border-[#E3DBCC] sticky top-0 z-40">
        <div>
          <span className="font-serif text-lg tracking-wider text-[#101010] uppercase">
            DS STUDIO
          </span>
          <span className="block font-mono text-[9px] tracking-[0.22em] text-[#7A7770] uppercase mt-0.5">
            Admin Workspace
          </span>
        </div>
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2.5 border border-[#E3DBCC] rounded-lg text-[#101010] text-sm hover:bg-[#F3F0E9] transition-colors"
          aria-label="Toggle menu"
        >
          {mobileOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Backdrop for mobile */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-xs"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 bottom-0 z-50 w-72 bg-[#FDFCF8] border-r border-[#E3DBCC] flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ height: '100vh' }}
      >
        {/* Top Header / Brand Area */}
        <div className="pt-[28px] px-[20px] pb-[24px] border-b border-[#E3DBCC]">
          <div className="mb-2">
            <span className="font-serif text-xl tracking-[0.06em] text-[#101010] uppercase font-medium">
              STUDIO ADMIN
            </span>
          </div>
          <span className="block font-mono text-[10px] tracking-[0.2em] text-[#7A7770] uppercase">
            DS Photography &amp; Films
          </span>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 py-[24px] px-[20px] overflow-y-auto">
          <nav className="space-y-[10px]">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-[14px] py-[12px] min-h-[44px] rounded-[8px] font-sans text-xs tracking-[0.14em] uppercase transition-colors ${
                    isActive
                      ? 'bg-[#101010] text-[#FDFCF8] font-semibold'
                      : 'text-[#55493A] hover:text-[#101010] hover:bg-[#F3F0E9]'
                  }`
                }
              >
                <span>{item.label}</span>
                <span className="text-[11px] opacity-60">→</span>
              </NavLink>
            ))}
          </nav>

          <div className="pt-[20px] mt-[20px] border-t border-[#E3DBCC]/60">
            <a
              href="/collections"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-[14px] py-[12px] min-h-[44px] rounded-[8px] text-[#7A7770] hover:text-[#101010] hover:bg-[#F3F0E9]/60 font-sans text-xs tracking-[0.12em] uppercase transition-colors"
            >
              <span>View Public Site</span>
              <span className="text-[11px]">↗</span>
            </a>
          </div>
        </div>

        {/* Bottom User Info & Logout */}
        <div className="px-[20px] pb-[28px] pt-[20px] border-t border-[#E3DBCC] bg-[#FAF8F5]">
          <div className="mb-[14px] truncate">
            <span className="block font-mono text-[10px] tracking-wider text-[#7A7770] uppercase mb-1">
              Signed in as
            </span>
            <span className="font-mono text-xs text-[#101010] truncate block" title={adminUser?.email}>
              {adminUser?.email || 'admin@dsphotography.com'}
            </span>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-[14px] py-[12px] min-h-[44px] rounded-[8px] border border-[#E3DBCC] hover:border-[#101010] bg-[#FDFCF8] hover:bg-[#101010] text-[#55493A] hover:text-[#FDFCF8] font-sans text-xs tracking-[0.14em] uppercase transition-all cursor-pointer font-medium"
          >
            <span>LOGOUT</span>
          </button>
        </div>
      </aside>
    </>
  );
}
