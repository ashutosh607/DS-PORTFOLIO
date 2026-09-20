import React, { useState } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { Home, Folder, SlidersHorizontal, ExternalLink, User, LogOut } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import Logo from '../../../components/layout/Logo';
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
    { label: 'Services', path: '/admin/services', icon: SlidersHorizontal },
  ];

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden flex items-center justify-between px-5 py-3.5 bg-[#FAF8F5] border-b border-[#E8E2D6] sticky top-0 z-40">
        <Link to="/admin/dashboard" className="flex items-center gap-2.5 no-underline">
          <Logo variant="dark" height={28} withText={false} />
          <div>
            <span className="block text-[11px] tracking-[0.18em] text-[#181818] uppercase font-semibold">
              STUDIO ADMIN
            </span>
            <span className="block text-[8.5px] tracking-[0.2em] text-[#7A756D] uppercase mt-0.5 font-medium">
              DS PHOTOGRAPHY &amp; FILMS
            </span>
          </div>
        </Link>
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
        }`}
      >
        {/* Brand Area */}
        <div>
          <Link to="/admin/dashboard" className="mb-8 px-2 flex items-center gap-3 no-underline group block">
            <Logo variant="dark" height={36} withText={false} />
            <div>
              <span className="block text-[12px] tracking-[0.22em] text-[#181818] uppercase font-semibold leading-tight group-hover:text-[#42392F] transition-colors">
                STUDIO ADMIN
              </span>
              <span className="block text-[8px] tracking-[0.12em] text-[#7A756D] uppercase mt-1 font-medium whitespace-nowrap">
                DS PHOTOGRAPHY &amp; FILMS
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-3">
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
        <div className="pt-5 border-t border-[#E8E2D6] space-y-1">
          <div className="flex items-center gap-2.5 px-2 py-1">
            <div className="w-7 h-7 rounded-full bg-[#E5DDD0] text-[#181818] text-[11px] font-bold flex items-center justify-center shrink-0">
              AS
            </div>
            <span className="text-[12px] text-[#5C5852] truncate font-medium" title={adminUser?.email}>
              {adminUser?.email || 'ashutoshkadam507...'}
            </span>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-[8px] text-[#7A756D] hover:text-[#181818] hover:bg-[#EFEAE2] text-[12px] transition-colors cursor-pointer text-left font-medium"
          >
            <LogOut size={14} strokeWidth={1.5} className="shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
