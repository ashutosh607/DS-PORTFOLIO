import React from 'react';

/**
 * PhotoPlaceholder
 * A museum-grade, editorial image placeholder designed for luxury photography websites.
 * Supports both high-fashion darkroom tint (dark=true) and fine gallery proof (dark=false).
 */
export default function PhotoPlaceholder({
  aspectRatio = '4/5',
  label = 'CLIENT IMAGE — TO BE ADDED',
  meta = 'Hasselblad H6D · 80mm · Natural Light',
  title = '',
  className = '',
  style = {},
  imageUrl = null,
  showBadge = true,
  dark = false,
  borderRadius = null,
}) {
  if (imageUrl) {
    return (
      <div
        className={`photo-placeholder-wrap relative overflow-hidden ${className}`}
        style={{
          aspectRatio,
          backgroundColor: dark ? '#161616' : 'var(--color-ivory)',
          ...style,
        }}
      >
        <img
          src={imageUrl}
          alt={title || label}
          className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-105"
        />
      </div>
    );
  }

  // Dark variant for the Spotlight Carousel (creates the deep photographic contrast of the reference)
  if (dark) {
    return (
      <div
        className={`photo-placeholder-wrap ${className}`}
        style={{
          aspectRatio,
          position: 'relative',
          width: '100%',
          height: '100%',
          backgroundColor: '#161616',
          backgroundImage: `
            radial-gradient(circle at 50% 35%, rgba(45, 45, 45, 0.8) 0%, rgba(16, 16, 16, 0.98) 100%),
            linear-gradient(to right, rgba(227, 219, 204, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(227, 219, 204, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 20px 20px, 20px 20px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.25rem',
          userSelect: 'none',
          ...style,
        }}
      >
        {/* Corner Crop Marks */}
        <span style={{ position: 'absolute', top: '10px', left: '12px', color: 'rgba(227, 219, 204, 0.35)', fontSize: '12px', lineHeight: 1, fontFamily: 'monospace' }}>+</span>
        <span style={{ position: 'absolute', top: '10px', right: '12px', color: 'rgba(227, 219, 204, 0.35)', fontSize: '12px', lineHeight: 1, fontFamily: 'monospace' }}>+</span>
        <span style={{ position: 'absolute', bottom: '10px', left: '12px', color: 'rgba(227, 219, 204, 0.35)', fontSize: '12px', lineHeight: 1, fontFamily: 'monospace' }}>+</span>
        <span style={{ position: 'absolute', bottom: '10px', right: '12px', color: 'rgba(227, 219, 204, 0.35)', fontSize: '12px', lineHeight: 1, fontFamily: 'monospace' }}>+</span>

        {/* Center Camera Aperture Icon */}
        <div
          style={{
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(227, 219, 204, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '0.85rem',
            color: 'rgba(243, 240, 233, 0.8)',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="14.31" y1="8" x2="20.05" y2="17.94" />
            <line x1="9.69" y1="8" x2="21.17" y2="8" />
            <line x1="7.38" y1="12" x2="13.12" y2="2.06" />
            <line x1="9.69" y1="16" x2="3.95" y2="6.06" />
            <line x1="14.31" y1="16" x2="2.83" y2="16" />
            <line x1="16.62" y1="12" x2="10.88" y2="21.94" />
          </svg>
        </div>

        {/* Subtle Label */}
        {showBadge && (
          <span
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.625rem',
              fontWeight: 600,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--color-ivory)',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(227, 219, 204, 0.25)',
              borderRadius: '999px',
              padding: '0.3rem 0.75rem',
              marginBottom: '0.4rem',
              textAlign: 'center',
            }}
          >
            {label}
          </span>
        )}

        {/* Technical Spec Metadata */}
        <span
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.6rem',
            letterSpacing: '0.14em',
            color: 'rgba(243, 240, 233, 0.45)',
            textAlign: 'center',
            textTransform: 'uppercase',
          }}
        >
          {meta}
        </span>
      </div>
    );
  }

  // Light variant for portfolio grid
  return (
    <div
      className={`photo-placeholder-wrap ${className}`}
      style={{
        aspectRatio,
        position: 'relative',
        width: '100%',
        height: '100%',
        backgroundColor: '#EFECE4',
        backgroundImage: `
          radial-gradient(circle at 50% 40%, rgba(253, 252, 248, 0.6) 0%, rgba(235, 230, 220, 0.95) 100%),
          linear-gradient(to right, rgba(227, 219, 204, 0.15) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(227, 219, 204, 0.15) 1px, transparent 1px)
        `,
        backgroundSize: '100% 100%, 24px 24px, 24px 24px',
        border: '1px solid var(--color-nude)',
        borderRadius: borderRadius !== null ? borderRadius : (style.borderRadius || '16px'),
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        userSelect: 'none',
        transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease, border-color 0.3s ease',
        ...style,
      }}
    >
      {/* Corner Crop Marks */}
      <span style={{ position: 'absolute', top: '12px', left: '12px', color: 'var(--color-nude)', fontSize: '14px', lineHeight: 1, fontFamily: 'monospace', opacity: 0.8 }}>+</span>
      <span style={{ position: 'absolute', top: '12px', right: '12px', color: 'var(--color-nude)', fontSize: '14px', lineHeight: 1, fontFamily: 'monospace', opacity: 0.8 }}>+</span>
      <span style={{ position: 'absolute', bottom: '12px', left: '12px', color: 'var(--color-nude)', fontSize: '14px', lineHeight: 1, fontFamily: 'monospace', opacity: 0.8 }}>+</span>
      <span style={{ position: 'absolute', bottom: '12px', right: '12px', color: 'var(--color-nude)', fontSize: '14px', lineHeight: 1, fontFamily: 'monospace', opacity: 0.8 }}>+</span>

      {/* Subtle Frame Inset */}
      <div
        style={{
          position: 'absolute',
          inset: '8px',
          border: '1px dashed rgba(227, 219, 204, 0.7)',
          borderRadius: (borderRadius === '0px' || borderRadius === 0 || style.borderRadius === '0px' || style.borderRadius === 0) ? '0px' : '12px',
          pointerEvents: 'none',
        }}
      />

      {/* Center Camera Aperture Icon & Subtle Glow */}
      <div
        style={{
          width: '54px',
          height: '54px',
          borderRadius: '50%',
          backgroundColor: 'rgba(253, 252, 248, 0.85)',
          border: '1px solid var(--color-nude)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1rem',
          boxShadow: '0 8px 18px -4px rgba(16, 16, 16, 0.05)',
          color: 'var(--color-obsidian)',
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="14.31" y1="8" x2="20.05" y2="17.94" />
          <line x1="9.69" y1="8" x2="21.17" y2="8" />
          <line x1="7.38" y1="12" x2="13.12" y2="2.06" />
          <line x1="9.69" y1="16" x2="3.95" y2="6.06" />
          <line x1="14.31" y1="16" x2="2.83" y2="16" />
          <line x1="16.62" y1="12" x2="10.88" y2="21.94" />
        </svg>
      </div>

      {/* Subtle Label */}
      {showBadge && (
        <span
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.675rem',
            fontWeight: 600,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'var(--color-obsidian)',
            backgroundColor: 'rgba(253, 252, 248, 0.95)',
            border: '1px solid var(--color-nude)',
            borderRadius: '999px',
            padding: '0.35rem 0.85rem',
            marginBottom: '0.5rem',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(16, 16, 16, 0.04)',
          }}
        >
          {label}
        </span>
      )}

      {/* Optional Title */}
      {title && (
        <h4
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.25rem',
            color: 'var(--color-obsidian)',
            marginTop: '0.25rem',
            marginBottom: '0.25rem',
            textAlign: 'center',
          }}
        >
          {title}
        </h4>
      )}

      {/* Technical Spec Metadata */}
      <span
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '0.65rem',
          letterSpacing: '0.12em',
          color: 'var(--color-obsidian-light)',
          textAlign: 'center',
          textTransform: 'uppercase',
          marginTop: '0.25rem',
        }}
      >
        {meta}
      </span>
    </div>
  );
}
