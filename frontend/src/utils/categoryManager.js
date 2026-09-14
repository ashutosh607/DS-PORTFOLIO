import { useState, useEffect, useCallback } from 'react';
import { CATEGORIES as INITIAL_CATEGORIES } from '../pages/collections/data/collectionsData';

const STORAGE_KEY = 'ds_portfolio_dynamic_categories';
const CATEGORIES_EVENT = 'ds_categories_updated';

/**
 * Normalizes a category object to guarantee all required properties exist
 */
function normalizeCategory(cat, index = 0) {
  const slug = (cat.slug || cat.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || `cat-${index}`).toLowerCase();
  const id = cat.id || cat._id || String(index + 1).padStart(2, '0');
  
  return {
    id,
    _id: cat._id || id,
    name: cat.name || 'Untitled Category',
    slug,
    tagline: cat.tagline || 'Honest moments, beautifully preserved as they unfold.',
    quote: cat.quote || 'A story in every frame.',
    medium: cat.medium || 'Leica & Natural Light',
    location: cat.location || 'Studio & Commission',
    coverImage: cat.coverImage || cat.featured?.image || 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop',
    publicId: cat.publicId || '',
    cardShapeStyle: cat.cardShapeStyle || { borderRadius: '9999px 9999px 4px 4px' },
    cardTransform: cat.cardTransform || 'perspective(1200px) rotateY(4deg) translateY(0px)',
    featured: cat.featured || {
      image: cat.coverImage || 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1400&auto=format&fit=crop',
      title: cat.name || 'Featured Work',
      count: '01 / 01',
      caption: cat.quote || '',
      meta: cat.medium || '',
    },
    supporting: Array.isArray(cat.supporting) ? cat.supporting : [],
    isCustom: Boolean(cat.isCustom || cat._id),
  };
}

/**
 * Get current live categories from cache or initial seed
 */
export function getLiveCategories() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(normalizeCategory);
      }
    }
  } catch (err) {
    console.warn('Could not read cached categories:', err);
  }

  // Fallback to normalized initial categories
  const initial = INITIAL_CATEGORIES.map(normalizeCategory);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  } catch {
    // Ignore storage quota errors
  }
  return initial;
}

/**
 * Save updated categories list to cache and broadcast update
 */
function broadcastCategories(categories) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
  } catch (err) {
    console.warn('Could not cache categories:', err);
  }
  window.dispatchEvent(new CustomEvent(CATEGORIES_EVENT, { detail: categories }));
}

/**
 * Helper to retrieve bearer token from headers or local storage
 */
function getAuthToken(authHeaders = {}) {
  if (authHeaders?.Authorization) return authHeaders.Authorization;
  if (authHeaders?.authorization) return authHeaders.authorization;
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('ds_admin_jwt');
    if (token) return `Bearer ${token}`;
  }
  return '';
}

/**
 * Fetch categories from backend API and merge with cache
 */
export async function syncCategoriesWithBackend() {
  try {
    const res = await fetch('/api/categories');
    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json.data) && json.data.length > 0) {
        const live = getLiveCategories();
        const merged = json.data.map((bCat, idx) => {
          const match = live.find((c) => c.slug === bCat.slug || c._id === bCat._id);
          return {
            ...normalizeCategory(bCat, idx),
            supporting: (match?.supporting && match.supporting.length > 0) ? match.supporting : (bCat.supporting || []),
            cardShapeStyle: match?.cardShapeStyle || { borderRadius: '9999px 9999px 4px 4px' },
            cardTransform: match?.cardTransform || 'perspective(1200px) rotateY(4deg) translateY(0px)',
          };
        });
        broadcastCategories(merged);
        return merged;
      }
    }
  } catch (err) {
    console.warn('Backend category sync failed:', err);
  }
  return getLiveCategories();
}

/**
 * Create a new category
 */
export async function createCategory(categoryData, authHeaders = {}) {
  const tokenHeader = getAuthToken(authHeaders);
  const headers = {};
  if (tokenHeader) {
    headers.Authorization = tokenHeader;
  }

  let res;
  if (categoryData instanceof FormData) {
    res = await fetch('/api/categories', {
      method: 'POST',
      headers,
      body: categoryData,
      credentials: 'include',
    });
  } else {
    res = await fetch('/api/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify(categoryData),
      credentials: 'include',
    });
  }

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    const errorMsg = json.message || `Failed to create category (${res.status})`;
    throw new Error(errorMsg);
  }

  const createdCategory = json.data;
  const current = getLiveCategories();
  const normalized = normalizeCategory(createdCategory, current.length);
  const updated = [...current.filter((c) => c.slug !== normalized.slug && c._id !== normalized._id), normalized];
  broadcastCategories(updated);
  return normalized;
}

/**
 * Update an existing category
 */
export async function updateCategory(idOrSlug, updateData, authHeaders = {}) {
  const tokenHeader = getAuthToken(authHeaders);
  const headers = {};
  if (tokenHeader) {
    headers.Authorization = tokenHeader;
  }

  let res;
  if (updateData instanceof FormData) {
    res = await fetch(`/api/categories/${idOrSlug}`, {
      method: 'PUT',
      headers,
      body: updateData,
      credentials: 'include',
    });
  } else {
    res = await fetch(`/api/categories/${idOrSlug}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify(updateData),
      credentials: 'include',
    });
  }

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    const errorMsg = json.message || `Failed to update category (${res.status})`;
    throw new Error(errorMsg);
  }

  const updatedCategory = json.data;
  const current = getLiveCategories();
  const normalized = normalizeCategory(updatedCategory);

  const updated = current.map((c) =>
    c.slug === normalized.slug || c.id === idOrSlug || c._id === idOrSlug
      ? { ...c, ...normalized }
      : c
  );
  broadcastCategories(updated);
  return normalized;
}

/**
 * Delete a category
 */
export async function deleteCategory(idOrSlug, authHeaders = {}) {
  const tokenHeader = getAuthToken(authHeaders);
  const headers = {};
  if (tokenHeader) {
    headers.Authorization = tokenHeader;
  }

  const res = await fetch(`/api/categories/${idOrSlug}`, {
    method: 'DELETE',
    headers,
    credentials: 'include',
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    const errorMsg = json.message || `Failed to delete category (${res.status})`;
    throw new Error(errorMsg);
  }

  const current = getLiveCategories();
  const filtered = current.filter(
    (c) => c.id !== idOrSlug && c._id !== idOrSlug && c.slug !== idOrSlug
  );
  broadcastCategories(filtered);
  return true;
}

/**
 * React Hook for consuming dynamic categories in any component
 */
export function useCategories() {
  const [categories, setCategories] = useState(() => getLiveCategories());
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const synced = await syncCategoriesWithBackend();
      setCategories(synced);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    syncCategoriesWithBackend().then((data) => {
      if (Array.isArray(data)) setCategories(data);
    });

    const handleUpdate = (e) => {
      if (Array.isArray(e.detail)) {
        setCategories(e.detail);
      } else {
        setCategories(getLiveCategories());
      }
    };

    window.addEventListener(CATEGORIES_EVENT, handleUpdate);
    return () => {
      window.removeEventListener(CATEGORIES_EVENT, handleUpdate);
    };
  }, []);

  return {
    categories,
    loading,
    refresh,
  };
}
