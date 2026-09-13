import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Camera } from 'lucide-react';
import { useAdminAuth } from './context/AdminAuthContext';
import './AdminLogin.css';

export default function AdminLoginPage() {
  const [email, setEmail] = useState(() => localStorage.getItem('ds_admin_remember_email') || '');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(() => !!localStorage.getItem('ds_admin_remember_email'));
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login, isAuthenticated } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

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
      setError('Please provide both email and password.');
      return;
    }

    setSubmitting(true);
    try {
      if (rememberMe) {
        localStorage.setItem('ds_admin_remember_email', email.trim());
      } else {
        localStorage.removeItem('ds_admin_remember_email');
      }
      await login(email.trim(), password);
      const destination = location.state?.from?.pathname || '/admin/dashboard';
      navigate(destination, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid administrator credentials');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="admin-login-page"
      style={{
        backgroundImage: `url('/images/admin-login-bg.jpg')`,
      }}
    >
      {/* ─── Top Navigation ─── */}
      <header className="admin-login-header">
        <Link to="/" className="admin-login-brand">
          <Camera className="admin-login-brand-icon" strokeWidth={1.3} />
          <div className="admin-login-brand-name">
            <span className="admin-login-brand-title">Frame &amp; Feel</span>
            <span className="admin-login-brand-sub">PHOTOGRAPHY</span>
          </div>
        </Link>

        <nav className="admin-login-nav">
          <Link to="/collections">CAPTURE</Link>
          <span className="admin-login-nav-sep">/</span>
          <Link to="/services">CREATE</Link>
          <span className="admin-login-nav-sep">/</span>
          <Link to="/collections">KEEP</Link>
        </nav>
      </header>

      {/* ─── Main Content: Left Text + Right Card ─── */}
      <main className="admin-login-content">
        {/* Left — Brand Storytelling */}
        <div className="admin-login-left">
          <h1 className="admin-login-heading">
            Every moment<br />
            deserves to be<br />
            remembered
          </h1>
          <hr className="admin-login-heading-bar" />
          <p className="admin-login-subtitle">
            Log in to access your gallery, book a session or continue your creative journey.
          </p>
        </div>

        {/* Right — Login Card */}
        <div className="admin-login-right">
          <div className="admin-login-card">
            {/* Script Title */}
            <h2 className="admin-login-script-title">Welcome Back</h2>

            {/* Heart Divider */}
            <div className="admin-login-divider">
              <span className="admin-login-divider-line" />
              <span className="admin-login-divider-heart">♡</span>
              <span className="admin-login-divider-line" />
            </div>

            {/* Error */}
            {error && <div className="admin-login-error">{error}</div>}

            {/* Form */}
            <form onSubmit={handleSubmit} className="admin-login-form">
              {/* Email */}
              <div>
                <label htmlFor="admin-email" className="admin-login-label">
                  Email Address
                </label>
                <div className="admin-login-input-wrap">
                  <Mail className="admin-login-input-icon" strokeWidth={1.5} />
                  <input
                    id="admin-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="admin-login-input"
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="admin-password" className="admin-login-label">
                  Password
                </label>
                <div className="admin-login-input-wrap">
                  <Lock className="admin-login-input-icon" strokeWidth={1.5} />
                  <input
                    id="admin-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="admin-login-input"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="admin-login-eye-btn"
                    tabIndex={-1}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff width={17} height={17} strokeWidth={1.5} />
                    ) : (
                      <Eye width={17} height={17} strokeWidth={1.5} />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="admin-login-remember">
                <input
                  type="checkbox"
                  id="remember-me"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="remember-me">Remember me</label>
              </div>

              {/* Submit */}
              <button type="submit" disabled={submitting} className="admin-login-btn">
                {submitting ? (
                  <>
                    <span className="admin-login-spinner" />
                    <span>LOGGING IN...</span>
                  </>
                ) : (
                  <>
                    <span>LOG IN</span>
                    <ArrowRight width={16} height={16} strokeWidth={2} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* ─── Bottom Footer ─── */}
      <footer className="admin-login-footer">
        <Link to="/" className="admin-login-back-link">
          <span className="admin-login-back-arrow">←</span>
          <span>Return to portfolio</span>
        </Link>

        <div className="admin-login-quote-area">
          <svg
            className="admin-login-quote-sprig"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
            <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
          </svg>
          <div className="admin-login-quote-text">
            Good photos<br />
            tell great stories ♡
          </div>
        </div>
      </footer>
    </div>
  );
}
