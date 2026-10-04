import { useState, useEffect, useCallback } from 'react';
import { CATEGORIES as INITIAL_CATEGORIES } from '../pages/collections/data/collectionsData.js';

const STORAGE_KEY = 'ds_portfolio_dynamic_categories';
const CATEGORIES_EVENT = 'ds_categories_updated';

/**
 * Canonical category key generator (strips non-alphanumeric, removes trailing 's')
 * to seamlessly reconcile singular/plural variants like 'wedding' / 'weddings', 'birthday' / 'birthdays'.
 */
export const toCanonicalCategoryKey = (str) =>
  (str || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, '')
    .replace(/s$/, '');

/**
 * Finds baseline template category from INITIAL_CATEGORIES using slug, ID, or canonical key.
 */
export const findBaselineCategory = (slugOrId) => {
  if (!slugOrId) return undefined;
  const raw = String(slugOrId).toLowerCase().trim();
  const key = toCanonicalCategoryKey(raw);
  return INITIAL_CATEGORIES.find((c) => {
    if (c.id === slugOrId || c.slug === slugOrId) return true;
    if (c.slug?.toLowerCase() === raw) return true;
    if (toCanonicalCategoryKey(c.slug) === key) return true;
    if (toCanonicalCategoryKey(c.id) === key) return true;
    if (toCanonicalCategoryKey(c.name) === key) return true;
    return false;
  });
};

/**
 * Normalizes a category object to guarantee all required properties exist
 * and ensures baseline collections never lose their stable IDs or supporting photos.
 */
export function normalizeCategory(cat, index = 0) {
  const explicitSlug = cat.slug
    ? String(cat.slug).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
    : '';

  const rawSlug = (
    explicitSlug ||
    cat.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') ||
    `cat-${index}`
  ).toLowerCase();

  // Find initial template category if it's one of the baseline collections
  const initialMatch =
    findBaselineCategory(cat.id) ||
    findBaselineCategory(cat._id) ||
    (explicitSlug ? findBaselineCategory(explicitSlug) : undefined) ||
    findBaselineCategory(cat.name) ||
    findBaselineCategory(rawSlug);

  const nameDerivedSlug = cat.name
    ? cat.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
    : '';

  // If the category was renamed from the baseline name (e.g. "Events" -> "Engagement"),
  // but the slug was stuck on the old baseline slug ("events"), auto-heal to the new name's slug!
  let effectiveSlug = explicitSlug;
  if (
    initialMatch &&
    nameDerivedSlug &&
    explicitSlug === initialMatch.slug &&
    toCanonicalCategoryKey(cat.name) !== toCanonicalCategoryKey(initialMatch.name)
  ) {
    effectiveSlug = nameDerivedSlug;
  }

  // If explicitSlug exists, use it! Otherwise fallback to rawSlug, then initialMatch.slug
  const slug = effectiveSlug || rawSlug || initialMatch?.slug;

  // Preserve stable human-friendly ID ('01', '02', etc.) for baseline categories
  const id = initialMatch?.id || cat.id || cat._id || String(index + 1).padStart(2, '0');

  // Preserve supporting images: if cat has non-empty supporting array, use it;
  // otherwise fallback to initialMatch supporting if available; else empty array
  let supporting = [];
  if (Array.isArray(cat.supporting) && cat.supporting.length > 0) {
    supporting = cat.supporting;
  } else if (initialMatch?.supporting && Array.isArray(initialMatch.supporting)) {
    supporting = initialMatch.supporting;
  }

  const cardShapeStyle =
    cat.cardShapeStyle ||
    initialMatch?.cardShapeStyle ||
    { borderRadius: '9999px 9999px 4px 4px' };

  const cardTransform =
    cat.cardTransform ||
    initialMatch?.cardTransform ||
    'perspective(1200px) rotateY(4deg) translateY(0px)';

  const featured = {
    ...(initialMatch?.featured || {}),
    ...(cat.featured || {}),
    image:
      cat.coverImage ||
      cat.featured?.image ||
      initialMatch?.featured?.image ||
      initialMatch?.coverImage ||
      'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1400&auto=format&fit=crop',
    title: cat.name || cat.featured?.title || initialMatch?.featured?.title || initialMatch?.name || 'Featured Work',
    count: cat.featured?.count || initialMatch?.featured?.count || '01 / 01',
    caption: cat.quote || cat.featured?.caption || initialMatch?.featured?.caption || '',
    meta: cat.medium || cat.featured?.meta || initialMatch?.featured?.meta || '',
  };

  return {
    id,
    _id: cat._id || id,
    name: cat.name || initialMatch?.name || 'Untitled Category',
    slug,
    tagline: cat.tagline || initialMatch?.tagline || 'Honest moments, beautifully preserved as they unfold.',
    quote: cat.quote || initialMatch?.quote || 'A story in every frame.',
    medium: cat.medium || initialMatch?.medium || 'Leica & Natural Light',
    location: cat.location || initialMatch?.location || 'Studio & Commission',
    coverImage:
      cat.coverImage ||
      cat.featured?.image ||
      initialMatch?.coverImage ||
      'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop',
    publicId: cat.publicId || '',
    cardShapeStyle,
    cardTransform,
    featured,
    supporting,
    display: cat.display || cat.coverDisplay || initialMatch?.display || { fit: 'cover', position: { x: 50, y: 50 }, zoom: 1 },
    coverDisplay: cat.coverDisplay || cat.display || initialMatch?.coverDisplay || { fit: 'cover', position: { x: 50, y: 50 }, zoom: 1 },
    isCustom: Boolean(cat.isCustom || (!initialMatch && cat._id)),
  };
}

/**
 * Get current live categories from cache or initial seed.
 * Automatically heals any cached categories that lost supporting photos or baseline IDs.
 */
export function getLiveCategories() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Heal any cached categories that might have lost their supporting photos
        // or had their stable ID corrupted by MongoDB ObjectId
        const healed = parsed.map((cat, idx) => {
          const initial = findBaselineCategory(cat.id) || findBaselineCategory(cat._id) || findBaselineCategory(cat.slug) || findBaselineCategory(cat.name);
          if (initial) {
            const hasSupporting = Array.isArray(cat.supporting) && cat.supporting.length > 0;
            return normalizeCategory(
              {
                ...initial,
                ...cat,
                id: initial.id, // always preserve '01', '02', etc. for seed collections
                name: cat.name || initial.name,
                slug: cat.slug || initial.slug,
                supporting: hasSupporting ? cat.supporting : initial.supporting,
                cardShapeStyle: cat.cardShapeStyle || initial.cardShapeStyle,
                cardTransform: cat.cardTransform || initial.cardTransform,
              },
              idx
            );
          }
          return normalizeCategory(cat, idx);
        });

        // Ensure all baseline categories from INITIAL_CATEGORIES are present in the list
        INITIAL_CATEGORIES.forEach((initCat, idx) => {
          if (!healed.some((c) => c.id === initCat.id)) {
            healed.push(normalizeCategory(initCat, idx));
          }
        });

        return healed;
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
 * Fetch categories from backend API and merge with cache & initial baseline
 */
export async function syncCategoriesWithBackend() {
  try {
    const res = await fetch('/api/categories');
    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json.data) && json.data.length > 0) {
        const live = getLiveCategories();
        const merged = json.data.map((bCat, idx) => {
          const initialMatch = findBaselineCategory(bCat.slug) || findBaselineCategory(bCat.id) || findBaselineCategory(bCat._id) || findBaselineCategory(bCat.name);
          const match = live.find(
            (c) =>
              c.slug === bCat.slug ||
              c._id === bCat._id ||
              (initialMatch && (c.id === initialMatch.id || c.slug === initialMatch.slug)) ||
              toCanonicalCategoryKey(c.slug) === toCanonicalCategoryKey(bCat.slug)
          );

          const preservedId =
            initialMatch?.id || match?.id || bCat.id || bCat._id || String(idx + 1).padStart(2, '0');

          const preservedSupporting =
            (match?.supporting && match.supporting.length > 0)
              ? match.supporting
              : (bCat.supporting && bCat.supporting.length > 0)
              ? bCat.supporting
              : (initialMatch?.supporting || []);

          return normalizeCategory(
            {
              ...initialMatch,
              ...match,
              ...bCat,
              id: preservedId,
              supporting: preservedSupporting,
              cardShapeStyle:
                match?.cardShapeStyle ||
                initialMatch?.cardShapeStyle ||
                { borderRadius: '9999px 9999px 4px 4px' },
              cardTransform:
                match?.cardTransform ||
                initialMatch?.cardTransform ||
                'perspective(1200px) rotateY(4deg) translateY(0px)',
            },
            idx
          );
        });

        // Preserve any custom category that exists in live but not in backend response
        live.forEach((liveCat) => {
          if (!merged.some((m) => m.slug === liveCat.slug || m._id === liveCat._id || m.id === liveCat.id)) {
            merged.push(liveCat);
          }
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
 * Update an existing category while strictly preserving its stable ID,
 * supporting gallery photos, card styles, and animations.
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

  const initialMatch =
    findBaselineCategory(updatedCategory.slug) ||
    findBaselineCategory(idOrSlug) ||
    findBaselineCategory(updatedCategory.name) ||
    findBaselineCategory(updatedCategory._id);

  // Find the existing category to preserve existing client-side attributes (like supporting photos)
  const existing =
    current.find(
      (c) =>
        c.slug === updatedCategory.slug ||
        c.id === idOrSlug ||
        c._id === idOrSlug ||
        c.slug === idOrSlug ||
        (initialMatch && (c.id === initialMatch.id || c.slug === initialMatch.slug)) ||
        toCanonicalCategoryKey(c.slug) === toCanonicalCategoryKey(updatedCategory.slug)
    ) || initialMatch;

  // Preserve supporting items, card shape style, transform, and stable ID
  const preservedId =
    initialMatch?.id || existing?.id || updatedCategory.id || updatedCategory._id;

  const preservedSupporting =
    (Array.isArray(existing?.supporting) && existing.supporting.length > 0)
      ? existing.supporting
      : (Array.isArray(updatedCategory.supporting) && updatedCategory.supporting.length > 0)
      ? updatedCategory.supporting
      : (initialMatch?.supporting || []);

  const preservedCardShapeStyle =
    existing?.cardShapeStyle ||
    initialMatch?.cardShapeStyle ||
    { borderRadius: '9999px 9999px 4px 4px' };

  const preservedCardTransform =
    existing?.cardTransform ||
    initialMatch?.cardTransform ||
    'perspective(1200px) rotateY(4deg) translateY(0px)';

  const merged = {
    ...initialMatch,
    ...existing,
    ...updatedCategory,
    id: preservedId,
    _id: updatedCategory._id || existing?._id || preservedId,
    name: updatedCategory.name || existing?.name,
    slug: updatedCategory.slug || existing?.slug,
    supporting: preservedSupporting,
    cardShapeStyle: preservedCardShapeStyle,
    cardTransform: preservedCardTransform,
    display:
      updatedCategory.display ||
      updateData?.display ||
      existing?.display ||
      initialMatch?.display,
    coverDisplay:
      updatedCategory.coverDisplay ||
      updatedCategory.display ||
      updateData?.coverDisplay ||
      updateData?.display ||
      existing?.coverDisplay ||
      existing?.display ||
      initialMatch?.coverDisplay,
    featured: {
      ...(initialMatch?.featured || {}),
      ...(existing?.featured || {}),
      image: updatedCategory.coverImage || existing?.coverImage || initialMatch?.coverImage,
      title: updatedCategory.name || existing?.name || initialMatch?.name,
    },
  };

  const normalized = normalizeCategory(merged);

  const updated = current.map((c) => {
    const isTarget =
      c.slug === normalized.slug ||
      c.id === idOrSlug ||
      c._id === idOrSlug ||
      c.slug === idOrSlug ||
      c.id === normalized.id ||
      c._id === normalized._id ||
      (existing && (c.slug === existing.slug || c.id === existing.id || c._id === existing._id));
    return isTarget ? { ...c, ...normalized, supporting: preservedSupporting } : c;
  });

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
