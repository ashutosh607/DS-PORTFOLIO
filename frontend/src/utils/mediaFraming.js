/**
 * Media Framing Utility
 * 
 * Computes CSS styles for images and videos based on saved framing settings:
 * - fit: "cover" | "contain" (or "fit")
 * - position: { x: Number (0-100), y: Number (0-100) }
 * - zoom: Number (1.0 to 2.0+)
 */

export const DEFAULT_DISPLAY = {
  fit: 'cover',
  position: { x: 50, y: 50 },
  zoom: 1,
};

/**
 * Returns inline styling for <img> or <video> elements using saved framing settings
 */
export function getFramingStyle(display, options = {}) {
  const current = display || DEFAULT_DISPLAY;
  const isContain = current.fit === 'contain' || current.fit === 'fit';
  const fit = isContain ? 'contain' : 'cover';

  const posX = typeof current.position?.x === 'number' ? current.position.x : 50;
  const posY = typeof current.position?.y === 'number' ? current.position.y : 50;
  const zoom = typeof current.zoom === 'number' && current.zoom >= 1 ? current.zoom : 1;

  const style = {
    objectFit: fit,
    objectPosition: `${posX}% ${posY}%`,
  };

  if (zoom > 1 && !options.disableZoom) {
    style.transform = `scale(${zoom})`;
    style.transformOrigin = `${posX}% ${posY}%`;
  }

  return style;
}

/**
 * Returns container background color if containment is selected
 */
export function getFramingContainerStyle(display) {
  const isContain = display?.fit === 'contain' || display?.fit === 'fit';
  if (isContain) {
    return {
      backgroundColor: '#FAF8F5',
    };
  }
  return {};
}
