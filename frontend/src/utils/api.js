/**
 * DS Photography & Films - Central API & Asset URL Helper
 * Reads VITE_API_URL for production (e.g. Render backend URL).
 * In local Vite development, uses local backend URL or proxy.
 */

const isClient = typeof window !== 'undefined';
const isLocalhost = isClient && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

// Prefer explicit environment variable, then localStorage override, then production Render fallback
const DEFAULT_RENDER_URL = 'https://ds-portfolio-backend.onrender.com';
const storedApiUrl = isClient ? localStorage.getItem('ds_api_url') : '';

const RAW_API_URL =
  import.meta.env.VITE_API_URL ||
  storedApiUrl ||
  (!isLocalhost && import.meta.env.PROD ? DEFAULT_RENDER_URL : '');

export const API_BASE_URL = RAW_API_URL.replace(/\/$/, '');

/**
 * Automatically applies Cloudinary f_auto,q_auto transformations and responsive sizing
 * @param {string} url - Image source URL
 * @param {object} options - { width, quality, format }
 * @returns {string} Optimized URL
 */
export const optimizeCloudinaryUrl = (url = '', { width, quality = 'auto', format = 'auto' } = {}) => {
  if (!url || typeof url !== 'string') return url;
  if (url.includes('res.cloudinary.com') && url.includes('/upload/')) {
    if (url.includes('/f_auto') || url.includes('/q_auto')) return url;
    const transforms = [`f_${format}`, `q_${quality}`];
    if (width) transforms.push(`w_${width}`);
    return url.replace('/upload/', `/upload/${transforms.join(',')}/`);
  }
  return url;
};

/**
 * Normalizes relative API/asset paths to full URLs in production
 * and applies automatic modern image format and quality compression for Cloudinary media.
 * @param {string} path - e.g. '/api/media' or '/uploads/...'
 * @param {object} options - Optional { width, quality, format }
 * @returns {string}
 */
export const getApiUrl = (path = '', options = {}) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return optimizeCloudinaryUrl(path, options);
  }
  const normalized = path.startsWith('/') ? path : `/${path}`;
  const full = API_BASE_URL ? `${API_BASE_URL}${normalized}` : normalized;
  return optimizeCloudinaryUrl(full, options);
};
