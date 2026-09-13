import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from './context/AdminAuthContext';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login, isAuthenticated } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      const destination = location.state?.from?.pathname || '/admin/dashboard';
      navigate(destination, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please provide both administrator email and password.');
      return;
    }

    setSubmitting(true);
    try {
      await login(email, password);
      const destination = location.state?.from?.pathname || '/admin/dashboard';
      navigate(destination, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid administrator credentials');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCF8] text-[#101010] flex flex-col justify-center items-center px-[20px] py-[36px] selection:bg-[#E3DBCC] selection:text-[#101010]">
      {/* Container Box */}
      <div className="w-full max-w-[480px]">
        {/* Studio Branding Header */}
        <div className="text-center mb-[32px]">
          <span className="font-mono text-[11px] tracking-[0.25em] text-[#7A7770] uppercase block mb-3">
            ATELIER CURATION SYSTEM
          </span>
          <h1
            style={{ fontFamily: 'var(--font-serif)' }}
            className="text-[32px] sm:text-[38px] font-normal leading-tight text-[#101010] tracking-[-0.01em]"
          >
            Studio Admin
          </h1>
          <p className="font-sans text-xs sm:text-sm text-[#7A7770] mt-[12px]">
            Authenticate to manage portfolio collection media.
          </p>
        </div>

        {/* Card Form: 28-32px padding, 14-16px rounded */}
        <div className="bg-[#FAF8F5] border border-[#E3DBCC] rounded-[16px] p-[24px] sm:p-[32px] md:p-[36px] shadow-[0_4px_24px_-8px_rgba(16,16,16,0.05)]">
          {error && (
            <div className="mb-[24px] p-[14px] rounded-[8px] bg-[#FAF0F0] border border-[#E8C4C4] text-[#992E2E] font-sans text-xs leading-relaxed">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-[24px]">
            <div>
              <label className="block font-sans text-[11px] font-semibold tracking-[0.14em] uppercase text-[#55493A] mb-[8px]">
                Administrator Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@dsphotography.com"
                className="w-full h-[50px] px-[16px] rounded-[8px] bg-[#FDFCF8] border border-[#E3DBCC] text-sm text-[#101010] outline-none transition-colors focus:border-[#101010] placeholder-[#A59C8F]"
              />
            </div>

            <div>
              <label className="block font-sans text-[11px] font-semibold tracking-[0.14em] uppercase text-[#55493A] mb-[8px]">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full h-[50px] px-[16px] rounded-[8px] bg-[#FDFCF8] border border-[#E3DBCC] text-sm text-[#101010] outline-none transition-colors focus:border-[#101010] placeholder-[#A59C8F]"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full h-[50px] px-[24px] rounded-full bg-[#101010] hover:bg-[#262422] text-[#FDFCF8] font-sans text-xs font-semibold tracking-[0.16em] uppercase transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 shadow-md hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>AUTHENTICATING...</span>
                </>
              ) : (
                <>
                  <span>SIGN IN</span>
                  <span>→</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-[32px] pt-[24px] border-t border-[#E3DBCC]/60 text-center">
            <a
              href="/"
              className="font-sans text-xs text-[#7A7770] hover:text-[#101010] tracking-wider uppercase transition-colors"
            >
              ← Return to public portfolio
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
