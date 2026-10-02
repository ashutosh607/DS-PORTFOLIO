import axios from 'axios';

/**
 * DS Photography & Films - Central API & Asset URL Helper
 * Reads VITE_API_URL for production (e.g. Render backend URL).
 * In local Vite development, uses local backend URL or proxy.
 */

const RAW_API_URL = import.meta.env.VITE_API_URL || '';
export const API_BASE_URL = RAW_API_URL.replace(/\/$/, '');

// Centralized Axios instance configured for cross-origin credentials
const api = axios.create({
  baseURL: API_BASE_URL || undefined,
  withCredentials: true,
});

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

export default api;
