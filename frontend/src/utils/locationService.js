import { getApiUrl } from './api';

// Fast client-side cache for query autocomplete
const clientLocationCache = new Map();
const MAX_CLIENT_CACHE = 200;

export function resolveDestinationZone(meta = {}) {
  const country = (meta.country || '').trim().toLowerCase();
  const state = (meta.state || '').trim().toLowerCase();
  const district = (meta.district || '').trim().toLowerCase();
  const city = (meta.city || meta.name || '').trim().toLowerCase();
  const fullText = `${meta.name || ''} ${meta.city || ''} ${meta.district || ''} ${meta.state || ''} ${meta.country || ''}`.toLowerCase();

  // 1. International Destination Check
  const internationalKeywords = [
    'paris', 'france', 'italy', 'como', 'lake como', 'rome', 'amalfi', 'tuscany', 'florence',
    'london', 'uk', 'united kingdom', 'dubai', 'uae', 'abu dhabi', 'santorini', 'greece',
    'bali', 'indonesia', 'switzerland', 'swiss', 'zurich', 'geneva', 'new york', 'usa',
    'united states', 'singapore', 'thailand', 'bangkok', 'phuket', 'maldives', 'turkey',
    'istanbul', 'cappadocia', 'spain', 'barcelona', 'madrid', 'germany', 'australia', 'sydney'
  ];

  const hasExplicitNonIndiaCountry = country && !['india', 'in', 'bharat'].includes(country);
  const matchesInternationalKeyword = internationalKeywords.some((k) => fullText.includes(k));

  if (hasExplicitNonIndiaCountry || matchesInternationalKeyword) {
    return {
      zone: 'INTERNATIONAL_DESTINATION',
      badge: 'WORLDWIDE ATELIER RESIDENCY',
      zoneLabel: 'International / Worldwide Destination',
      surchargeNote: 'Worldwide Destination Residency · Passport Ready Atelier Team',
      recommendedTier: 'Luxury',
      recommendedCategory: 'wedding',
      title: 'Worldwide Architectural & Destination Commission',
      description: 'Comprehensive multi-day residency crafted for European villas, Middle Eastern palaces, and worldwide private estates.',
      logistics: 'Atelier travel, carnets, and international coordination inclusive in residency suite.',
      highlights: [
        'Dedicated Creative Director & Principal Cinematographer',
        'Specialist European lab processing for 120 medium format analog film',
        'Handcrafted 14x14 Italian leather master album + 2 parent folios',
      ],
    };
  }

  // 2. Mumbai Metropolitan Region (MMR)
  const mmrKeywords = [
    'mumbai', 'bombay', 'thane', 'navi mumbai', 'bandra', 'colaba', 'juhu',
    'andheri', 'worli', 'dadar', 'borivali', 'kalyan', 'dombivli', 'mira bhayandar',
    'vasai', 'virar', 'chembur', 'powai', 'malabar hill', 'nariman point', 'bkc'
  ];
  const isMMR = mmrKeywords.some((k) => fullText.includes(k));

  if (isMMR) {
    return {
      zone: 'MUMBAI_MMR',
      badge: 'LOCAL ATELIER BASE',
      zoneLabel: 'Mumbai Metropolitan Region (Local Base)',
      surchargeNote: 'Zero Travel Surcharge · Complimentary Studio Dispatch within MMR',
      recommendedTier: 'Signature',
      recommendedCategory: 'wedding',
      title: 'Local Atelier Commission',
      description: 'Direct dispatch from our atelier across Mumbai, Bandra, South Bombay heritage venues, and Thane.',
      logistics: 'Direct atelier dispatch with zero travel surcharges. Rapid proofing turnaround.',
      highlights: [
        'Complimentary studio transit within Mumbai Metropolitan Region',
        'Dual-medium raw digital capture & 35mm analog film rolls',
        'Archival proofing gallery and custom linen USB presentation box',
      ],
    };
  }

  // 3. Maharashtra Regional Destination (Raigad, Alibag, Lonavala, Nashik, Pune, etc.)
  const mhDestinationKeywords = [
    'raigad', 'alibag', 'alibaug', 'lonavala', 'lonavla', 'khandala', 'pune',
    'nashik', 'nasik', 'mahabaleshwar', 'panchgani', 'karjat', 'igatpuri', 'lavasa',
    'matheran', 'kolhapur', 'satara', 'ratnagiri', 'sindhudurg', 'sawantwadi',
    'aurangabad', 'chhatrapati sambhajinagar', 'nagpur', 'solapur', 'amravati',
    'daman', 'silvassa', 'chiplun', 'dapoli', 'malvan', 'tarkarli', 'palghar', 'dahanu'
  ];
  const isMHDestination =
    state.includes('maharashtra') ||
    district.includes('raigad') ||
    district.includes('pune') ||
    district.includes('nashik') ||
    mhDestinationKeywords.some((k) => fullText.includes(k));

  if (isMHDestination) {
    const locName = meta.city || meta.district || meta.name || 'Maharashtra';
    return {
      zone: 'MAHARASHTRA_DESTINATION',
      badge: 'MAHARASHTRA REGIONAL ESCAPE',
      zoneLabel: `Maharashtra Regional Destination (${locName})`,
      surchargeNote: 'Regional Road Dispatch from Mumbai Atelier · Day-Prior Light Scout Included',
      recommendedTier: 'Signature',
      recommendedCategory: 'wedding',
      title: 'Regional Heritage & Scenic Destination',
      description: `Tailored for coastal beachfront villas in Alibaug/Raigad, hilltop estates in Lonavala, and vineyard châteaux in Nashik.`,
      logistics: 'Atelier road team deployed from Mumbai studio with day-prior venue and golden hour lighting scout.',
      highlights: [
        'Natural ambient lighting scout tailored to coastal and hillside terrain',
        '120 Medium Format analog negatives with platinotype tonal gradation',
        'Drone aerial perspective capturing architectural estate landscape',
      ],
    };
  }

  // 4. Pan-India National Destination
  return {
    zone: 'NATIONAL_DESTINATION',
    badge: 'PAN-INDIA DESTINATION COMMISSION',
    zoneLabel: 'National Destination Residency (India)',
    surchargeNote: 'Domestic Air Residency · Full Atelier Equipment Logistics',
    recommendedTier: 'Luxury',
    recommendedCategory: 'wedding',
    title: 'National Heritage Palace & Beachfront Residency',
    description: 'Comprehensive multi-day coverage for royal palace venues in Rajasthan, coastal sanctuaries in Goa, and backwater estates in Kerala.',
    logistics: 'Full production crew deployed via domestic flights with dedicated equipment insurance.',
    highlights: [
      'Full atelier team: Principal Master, Cinema Director & Aerial Pilot',
      'Multi-day narrative monograph & heirloom 14x14 Italian leather album',
      'Priority 3-week proof delivery & live social press batch',
    ],
  };
}

/**
 * Searches locations through backend API with resilient client-side geocoding fallback
 */
export async function fetchLocations(query, signal) {
  const trimmed = (query || '').trim();
  if (!trimmed || trimmed.length < 2) return [];

  const cacheKey = trimmed.toLowerCase();
  if (clientLocationCache.has(cacheKey)) {
    return clientLocationCache.get(cacheKey);
  }

  // 1. Primary: Try Backend Endpoint
  try {
    const backendUrl = getApiUrl(`/api/locations/search?q=${encodeURIComponent(trimmed)}`);
    const res = await fetch(backendUrl, { signal });
    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json.data) && json.data.length > 0) {
        if (clientLocationCache.size >= MAX_CLIENT_CACHE) {
          const firstKey = clientLocationCache.keys().next().value;
          clientLocationCache.delete(firstKey);
        }
        clientLocationCache.set(cacheKey, json.data);
        return json.data;
      }
    }
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    // Silently continue to client fallback
  }

  // 2. Client-side Direct Geocoding Fallback (Photon + Nominatim)
  const results = [];
  const seen = new Set();

  const addResult = (item) => {
    const key = (item.fullAddress || item.title).toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!key || seen.has(key)) return;
    seen.add(key);
    const recommendation = resolveDestinationZone(item);
    results.push({
      ...item,
      recommendation,
    });
  };

  try {
    const photonUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(trimmed)}&limit=6`;
    const res = await fetch(photonUrl, { signal });
    if (res.ok) {
      const text = await res.text();
      if (text.startsWith('{')) {
        const data = JSON.parse(text);
        if (Array.isArray(data.features)) {
          data.features.forEach((f) => {
            const p = f.properties || {};
            const name = p.name || p.city || p.county || 'Location';
            const city = p.city || p.locality || p.town || p.village || '';
            const district = p.county || p.district || '';
            const state = p.state || '';
            const country = p.country || '';

            const parts = [name, district, city, state, country]
              .filter(Boolean)
              .filter((val, idx, arr) => arr.indexOf(val) === idx);

            let lat = f.geometry?.coordinates ? f.geometry.coordinates[1] : null;
            let lng = f.geometry?.coordinates ? f.geometry.coordinates[0] : null;

            if ((!lat || !lng) && p.extent && p.extent.length === 4) {
              lng = (p.extent[0] + p.extent[2]) / 2;
              lat = (p.extent[1] + p.extent[3]) / 2;
            }

            let type = 'LOCATION';
            if (p.osm_value === 'hotel' || p.osm_key === 'tourism') type = 'HOTEL';
            else if (p.osm_value === 'palace' || p.osm_value === 'castle') type = 'PALACE';
            else if (p.type === 'city' || p.osm_value === 'city' || p.osm_value === 'town') type = 'CITY';
            else if (p.type === 'county' || p.osm_value === 'administrative') type = 'DISTRICT';
            else if (p.osm_value === 'water' || p.osm_key === 'natural') type = 'LANDMARK';

            addResult({
              id: 'osm-' + (p.osm_id || Math.random().toString(36).slice(2)),
              title: name,
              subtitle: parts.slice(1).join(', '),
              fullAddress: parts.join(', '),
              city,
              district,
              state,
              country,
              type,
              lat,
              lng,
            });
          });
        }
      }
    }
  } catch (err) {
    if (err.name === 'AbortError') throw err;
  }

  // 3. Guaranteed Safe Fallback if 0 results
  if (results.length === 0) {
    const fallbackRec = resolveDestinationZone({
      name: trimmed,
      city: trimmed,
    });
    results.push({
      id: 'fallback-' + Date.now(),
      title: trimmed,
      subtitle: 'Custom Event Destination',
      fullAddress: trimmed,
      city: trimmed,
      district: '',
      state: '',
      country: '',
      type: 'DESTINATION',
      lat: 18.9220,
      lng: 72.8347,
      recommendation: fallbackRec,
      isFallback: true,
    });
  }

  if (clientLocationCache.size >= MAX_CLIENT_CACHE) {
    const firstKey = clientLocationCache.keys().next().value;
    clientLocationCache.delete(firstKey);
  }
  clientLocationCache.set(cacheKey, results);

  return results;
}
