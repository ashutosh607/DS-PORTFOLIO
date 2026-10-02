import React, { useState } from 'react';
import { handleWhatsAppSubmit } from '../../utils/whatsapp';
import { handleEmailSubmit } from '../../utils/email';

export default function InquiryModal({ isOpen, onClose, prefillTier = '' }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [scope, setScope] = useState(prefillTier || 'Editorial & Commercial Campaign');
  const [details, setDetails] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [prevPrefill, setPrevPrefill] = useState(prefillTier);

  if (prefillTier !== prevPrefill) {
    setPrevPrefill(prefillTier);
    if (prefillTier) setScope(prefillTier);
  }

  if (!isOpen) return null;

  const handleSubmit = (e, channel = 'whatsapp') => {
    if (e && e.preventDefault) e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const modalFormData = {
      name,
      email,
      eventType: scope,
      message: details,
      source: 'Direct Website Inquiry',
    };
    const modalCollection = {
      title: scope,
      price: 'Custom Quote',
    };

    if (channel === 'email') {
      handleEmailSubmit({ formData: modalFormData, selectedCollection: modalCollection });
    } else {
      handleWhatsAppSubmit({ formData: modalFormData, selectedCollection: modalCollection });
    }

    setIsSuccess(true);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2000,
        backgroundColor: 'rgba(16, 16, 16, 0.75)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        animation: 'fadeIn 0.3s ease',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '560px',
          backgroundColor: 'var(--color-off-white)',
          border: '1px solid var(--color-nude)',
          borderRadius: '24px',
          padding: 'clamp(2rem, 4vw, 3rem)',
          boxShadow: 'var(--shadow-deep)',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Icon */}
        <button
          onClick={onClose}
          aria-label="Close inquiry modal"
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-ivory)',
            border: '1px solid var(--color-nude)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--color-obsidian)',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {isSuccess ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-ivory)',
                border: '1px solid var(--color-nude)',
                color: 'var(--color-obsidian)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3 style={{ marginBottom: '0.5rem', color: 'var(--color-obsidian)' }}>
              Transmission Received
            </h3>
            <p style={{ color: 'var(--color-obsidian-muted)', fontSize: '0.95rem', marginBottom: '2rem' }}>
              Thank you for reaching out to Maison Édouard. Our atelier director will review your inquiry and follow up within 24 hours.
            </p>
            <button
              onClick={() => {
                setIsSuccess(false);
                onClose();
              }}
              className="btn-primary"
              style={{ width: '100%' }}
            >
              Return to Portfolio
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <span className="eyebrow" style={{ marginBottom: '0.5rem' }}>
                Private Inquiry
              </span>
              <h3 style={{ color: 'var(--color-obsidian)', fontSize: '1.85rem' }}>
                Commission the Atelier
              </h3>
            </div>

            <div>
              <label
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.75rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--color-obsidian-light)',
                  display: 'block',
                  marginBottom: '0.4rem',
                  fontWeight: 600,
                }}
              >
                Name or Organization
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Charlotte & Henry"
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem',
                  backgroundColor: 'var(--color-ivory)',
                  border: '1px solid var(--color-nude)',
                  borderRadius: '10px',
                  color: 'var(--color-obsidian)',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.95rem',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.75rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--color-obsidian-light)',
                  display: 'block',
                  marginBottom: '0.4rem',
                  fontWeight: 600,
                }}
              >
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contact@domain.com"
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem',
                  backgroundColor: 'var(--color-ivory)',
                  border: '1px solid var(--color-nude)',
                  borderRadius: '10px',
                  color: 'var(--color-obsidian)',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.95rem',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.75rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--color-obsidian-light)',
                  display: 'block',
                  marginBottom: '0.4rem',
                  fontWeight: 600,
                }}
              >
                Commission Type
              </label>
              <select
                value={scope}
                onChange={(e) => setScope(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem',
                  backgroundColor: 'var(--color-ivory)',
                  border: '1px solid var(--color-nude)',
                  borderRadius: '10px',
                  color: 'var(--color-obsidian)',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.9rem',
                  outline: 'none',
                }}
              >
                <option value="The Editorial Campaign">The Editorial Campaign</option>
                <option value="The Monograph Edition">The Monograph Edition</option>
                <option value="The Architectural Archive">The Architectural Archive</option>
                <option value="Private Portrait Commission">Private Portrait Commission</option>
              </select>
            </div>

            <div>
              <label
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.75rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--color-obsidian-light)',
                  display: 'block',
                  marginBottom: '0.4rem',
                  fontWeight: 600,
                }}
              >
                Brief Vision or Desired Dates
              </label>
              <textarea
                rows={3}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Share location, intended dates, or visual goals..."
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem',
                  backgroundColor: 'var(--color-ivory)',
                  border: '1px solid var(--color-nude)',
                  borderRadius: '10px',
                  color: 'var(--color-obsidian)',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.95rem',
                  outline: 'none',
                  resize: 'none',
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={(e) => handleSubmit(e, 'whatsapp')}
                style={{
                  width: '100%',
                  padding: '0.85rem 1.25rem',
                  backgroundColor: '#101010',
                  color: '#FDFCF8',
                  borderRadius: '999px',
                  border: '1.5px solid #101010',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.65rem',
                  transition: 'all 0.25s ease',
                }}
                className="hover:-translate-y-0.5 hover:bg-[#242424]"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#25D366]">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
                <span>CONTINUE TO WHATSAPP →</span>
              </button>

              <button
                type="button"
                onClick={(e) => handleSubmit(e, 'email')}
                style={{
                  width: '100%',
                  padding: '0.85rem 1.25rem',
                  backgroundColor: 'var(--color-ivory)',
                  color: 'var(--color-obsidian)',
                  borderRadius: '999px',
                  border: '1.5px solid var(--color-obsidian)',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.65rem',
                  transition: 'all 0.25s ease',
                }}
                className="hover:-translate-y-0.5 hover:bg-[#101010] hover:text-[#FAF8F5]"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <span>CONTINUE TO EMAIL →</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
