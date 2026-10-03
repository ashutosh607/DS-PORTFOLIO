import axios from 'axios';

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
