/**
 * Media Framing Utility
 * 
 * Computes CSS styles for images and videos based on saved framing settings:
 * - fit: "cover" | "contain" (or "fit")
 * - position: { x: Number (0-100), y: Number (0-100) }
 * - zoom: Number (0.5 to 3.0)
 */

export const DEFAULT_DISPLAY = {
  fit: 'cover',
  position: { x: 50, y: 50 },
  zoom: 1,
};

/**
 * Strips any encoded #dsp_ framing hash from an image/video URL
 */
export function stripFramingHash(url = '') {
  if (!url || typeof url !== 'string') return '';
  return url.split('#dsp_')[0];
}

/**
 * Encodes framing settings into a URL hash fragment (#dsp_fit=...&dsp_x=...&dsp_y=...&dsp_zoom=...)
 * so framing persists across all backends and CDN URLs without altering HTTP asset requests.
 */
export function appendFramingToUrl(url = '', display = DEFAULT_DISPLAY) {
  if (!url || typeof url !== 'string') return '';
  const baseUrl = stripFramingHash(url);
  if (!baseUrl || baseUrl.startsWith('data:')) return url;
  if (!display || typeof display !== 'object') return baseUrl;

  const fit = display.fit === 'contain' || display.fit === 'fit' ? 'contain' : 'cover';
  const posX = typeof display.position?.x === 'number' ? Math.round(display.position.x * 10) / 10 : 50;
  const posY = typeof display.position?.y === 'number' ? Math.round(display.position.y * 10) / 10 : 50;
  const zoom = typeof display.zoom === 'number' && display.zoom > 0 ? Math.round(display.zoom * 100) / 100 : 1;

  return `${baseUrl}#dsp_fit=${fit}&dsp_x=${posX}&dsp_y=${posY}&dsp_zoom=${zoom}`;
}

/**
 * Extracts framing settings from a URL hash fragment (#dsp_fit=...) if present
 */
export function extractFramingFromUrl(url = '') {
  if (!url || typeof url !== 'string' || !url.includes('#dsp_')) return null;
  try {
    const hashPart = url.slice(url.indexOf('#dsp_') + 1);
    const params = new URLSearchParams(hashPart);
    const rawFit = params.get('dsp_fit');
    const fit = rawFit === 'contain' || rawFit === 'fit' ? 'contain' : 'cover';
    const parsedX = parseFloat(params.get('dsp_x'));
    const parsedY = parseFloat(params.get('dsp_y'));
    const parsedZoom = parseFloat(params.get('dsp_zoom'));

    return {
      fit,
      position: {
        x: !isNaN(parsedX) ? Math.max(0, Math.min(100, parsedX)) : 50,
        y: !isNaN(parsedY) ? Math.max(0, Math.min(100, parsedY)) : 50,
      },
      zoom: !isNaN(parsedZoom) && parsedZoom > 0 ? Math.max(0.5, Math.min(3, parsedZoom)) : 1,
    };
  } catch {
    return null;
  }
}

/**
 * Returns true if the given display framing object has non-default framing settings
 */
export function hasCustomFraming(display) {
  if (!display || typeof display !== 'object') return false;
  const isContain = display.fit === 'contain' || display.fit === 'fit';
  const zoom = typeof display.zoom === 'number' ? display.zoom : 1;
  const posX = typeof display.position?.x === 'number' ? display.position.x : 50;
  const posY = typeof display.position?.y === 'number' ? display.position.y : 50;
  return isContain || zoom !== 1 || posX !== 50 || posY !== 50;
}

/**
 * Returns inline styling for <img> or <video> elements using saved framing settings
 */
export function getFramingStyle(display, options = {}) {
  const urlFraming = options.url ? extractFramingFromUrl(options.url) : null;
  const current = hasCustomFraming(display)
    ? display
    : (urlFraming || display || DEFAULT_DISPLAY);
  const isContain = current.fit === 'contain' || current.fit === 'fit';
  const fit = isContain ? 'contain' : 'cover';

  const posX = typeof current.position?.x === 'number' ? current.position.x : 50;
  const posY = typeof current.position?.y === 'number' ? current.position.y : 50;
  const zoom = typeof current.zoom === 'number' && current.zoom > 0 ? current.zoom : 1;

  const style = {
    objectFit: fit,
    objectPosition: `${posX}% ${posY}%`,
  };

  if (isContain) {
    const offsetX = Math.round((posX - 50) * 0.5 * 100) / 100;
    const offsetY = Math.round((posY - 50) * 0.5 * 100) / 100;
    const effectiveZoom = options.disableZoom ? 1 : zoom;

    if (offsetX !== 0 || offsetY !== 0 || effectiveZoom !== 1) {
      style.transform = `translate3d(${offsetX}%, ${offsetY}%, 0) scale(${effectiveZoom})`;
      style.transformOrigin = '50% 50%';
    }
  } else if (zoom !== 1 && !options.disableZoom) {
    style.transform = `scale(${zoom})`;
    style.transformOrigin = `${posX}% ${posY}%`;
  }

  return style;
}

/**
 * Returns container background color if containment is selected
 */
export function getFramingContainerStyle(display, url = '') {
  const urlFraming = url ? extractFramingFromUrl(url) : null;
  const effective = hasCustomFraming(display) ? display : (urlFraming || display);
  const isContain = effective?.fit === 'contain' || effective?.fit === 'fit';
  if (isContain) {
    return {
      backgroundColor: '#FAF8F5',
    };
  }
  return {};
}
