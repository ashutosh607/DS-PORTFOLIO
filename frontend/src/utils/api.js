/**
 * DS Photography & Films - Central API & Asset URL Helper
 * Reads VITE_API_URL for production (e.g. Render backend URL).
 * In local Vite development, leaves paths relative so Vite dev proxy forwards them.
 */

const RAW_API_URL = import.meta.env.VITE_API_URL || '';
export const API_BASE_URL = RAW_API_URL.replace(/\/$/, '');

/**
 * Normalizes relative API/asset paths to full URLs in production
 * @param {string} path - e.g. '/api/media' or '/uploads/...'
 * @returns {string}
 */
export const getApiUrl = (path = '') => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return API_BASE_URL ? `${API_BASE_URL}${normalized}` : normalized;
};
