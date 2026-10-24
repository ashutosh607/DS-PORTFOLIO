import React from 'react';
import dsLogoDarkWebp from '../../assets/ds-logo-dark-opt.webp';
import dsLogoDarkPng from '../../assets/ds-logo-dark-opt.png';
import dsLogoLightWebp from '../../assets/ds-logo-light-opt.webp';
import dsLogoLightPng from '../../assets/ds-logo-light-opt.png';

/**
 * Theme-aware Logo Component
 * - 'dark' (default): Inverted dark obsidian (#101010) logo on transparent background for light backgrounds.
 * - 'light': Warm ivory/off-white (#FDFCF8) logo on transparent background for dark obsidian backgrounds.
 */
export default function Logo({
  variant = 'dark',
  height = 42,
  withText = false,
  className = '',
  style = {},
  imgStyle = {},
}) {
  const isLight = variant === 'light';
  const webpSrc = isLight ? dsLogoLightWebp : dsLogoDarkWebp;
  const pngSrc = isLight ? dsLogoLightPng : dsLogoDarkPng;
  const numHeight = typeof height === 'number' ? height : parseInt(height, 10) || 42;
  const intrinsicWidth = Math.round(numHeight * (240 / 173));

  return (
    <div
      className={`inline-flex items-center select-none ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.75rem',
        ...style,
      }}
    >
      <picture>
        <source srcSet={webpSrc} type="image/webp" />
        <img
          src={pngSrc}
          alt="DS Photography & Films"
          width={intrinsicWidth}
          height={numHeight}
          loading="eager"
          decoding="async"
          style={{
            height: `${numHeight}px`,
            width: `${intrinsicWidth}px`,
            aspectRatio: '240 / 173',
            objectFit: 'contain',
            display: 'block',
            ...imgStyle,
          }}
        />
      </picture>
      {withText && (
        <div
          className="hidden sm:flex flex-col justify-center"
          style={{
            borderLeft: `1px solid ${isLight ? 'rgba(227, 219, 204, 0.25)' : 'var(--color-nude)'}`,
            paddingLeft: '0.75rem',
            lineHeight: 1.15,
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.15rem',
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: isLight ? 'var(--color-off-white)' : 'var(--color-obsidian)',
            }}
          >
            DS Photography & Films
          </span>
          <span
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.575rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: isLight ? 'rgba(243, 240, 233, 0.65)' : 'var(--color-obsidian-light)',
              marginTop: '3px',
              fontWeight: 500,
            }}
          >
            Visual Folio & Cinema
          </span>
        </div>
      )}
    </div>
  );
}
