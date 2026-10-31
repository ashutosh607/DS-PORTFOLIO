import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { API_BASE_URL } from './utils/api.js'

// In production (Vercel), automatically route relative /api, /uploads, and /categories to Render backend URL
if (typeof window !== 'undefined') {
  const originalFetch = window.fetch;
  window.fetch = function (resource, init) {
    let url = typeof resource === 'string' ? resource : resource?.url || '';
    const isRelativeApiPath =
      url.startsWith('/api') ||
      url.startsWith('/uploads') ||
      url.startsWith('/categories');

    if (API_BASE_URL && isRelativeApiPath) {
      url = `${API_BASE_URL}${url}`;
    }

    const modifiedInit = { ...(init || {}) };

    // Ensure cross-origin cookies & headers are allowed for API requests
    if (url.includes('/api/')) {
      if (!modifiedInit.credentials) {
        modifiedInit.credentials = 'include';
      }

      // Automatically attach Bearer token from localStorage if not already present
      const token = localStorage.getItem('ds_admin_jwt');
      if (token) {
        const headers = new Headers(modifiedInit.headers || {});
        if (!headers.has('Authorization')) {
          headers.set('Authorization', `Bearer ${token}`);
          modifiedInit.headers = headers;
        }
      }
    }

    if (typeof resource === 'string') {
      return originalFetch.call(this, url, modifiedInit);
    }
    return originalFetch.call(this, new Request(url, modifiedInit));
  };
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
