import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { API_BASE_URL } from './utils/api.js'

// In production (Vercel), automatically route relative /api, /uploads, and /categories to Render backend URL
if (API_BASE_URL && typeof window !== 'undefined') {
  const originalFetch = window.fetch;
  window.fetch = function (resource, init) {
    if (
      typeof resource === 'string' &&
      (resource.startsWith('/api') || resource.startsWith('/uploads') || resource.startsWith('/categories'))
    ) {
      resource = `${API_BASE_URL}${resource}`;
    }
    return originalFetch.call(this, resource, init);
  };
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
