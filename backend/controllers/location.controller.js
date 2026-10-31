const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

// In-memory LRU-style cache for geocoding queries (max 500 entries)
const queryCache = new Map();
const CACHE_MAX_SIZE = 500;
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

function getFromCache(key) {
  const item = queryCache.get(key);
  if (!item) return null;
  if (Date.now() - item.timestamp > CACHE_TTL_MS) {
    queryCache.delete(key);
    return null;
  }
  return item.data;
}

function setInCache(key, data) {
  if (queryCache.size >= CACHE_MAX_SIZE) {
    const oldestKey = queryCache.keys().next().value;
    queryCache.delete(oldestKey);
  }
  queryCache.set(key, { timestamp: Date.now(), data });
}

/**
 * Intelligent Destination Zone & Photography Recommendation Engine
 */
function resolveDestinationZone(meta = {}) {
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

  // 3. Maharashtra Regional Destination
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
 * Normalizes spelling variations common in Indian geography
 */
function expandQuery(q) {
  let cleaned = (q || '').trim();
  const lower = cleaned.toLowerCase();

  const spellingMap = {
    alibag: 'Alibag, Raigad, Maharashtra',
    alibaug: 'Alibag, Raigad, Maharashtra',
    raigad: 'Raigad District, Maharashtra',
    raigarh: 'Raigad, Maharashtra',
    lonavla: 'Lonavala, Pune, Maharashtra',
    lonavala: 'Lonavala, Maharashtra',
    khandala: 'Khandala, Maharashtra',
    bombay: 'Mumbai, Maharashtra',
    mumbai: 'Mumbai, Maharashtra',
    nasik: 'Nashik, Maharashtra',
    nashik: 'Nashik, Maharashtra',
    poona: 'Pune, Maharashtra',
    pune: 'Pune, Maharashtra',
    baramati: 'Baramati, Pune, Maharashtra',
  };

  if (spellingMap[lower]) {
    return spellingMap[lower];
  }

  return cleaned;
}

/**
 * Controller: Search Locations with Dynamic Geocoding & Photography Recommendations
 * Route: GET /api/locations/search?q=...
 */
const searchLocations = asyncHandler(async (req, res) => {
  const query = (req.query.q || '').trim();
  if (!query || query.length < 2) {
    return res.status(200).json(
      new ApiResponse(200, [], "Provide at least 2 characters to search")
    );
  }

  const cacheKey = query.toLowerCase();
  const cached = getFromCache(cacheKey);
  if (cached) {
    return res.status(200).json(
      new ApiResponse(200, cached, "Locations retrieved from cache")
    );
  }

  const expandedQuery = expandQuery(query);
  const results = [];
  const seenAddresses = new Set();

  // Helper to add suggestion
  const addResult = (item) => {
    const key = (item.fullAddress || item.title).toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!key || seenAddresses.has(key)) return;
    seenAddresses.add(key);

    const recommendation = resolveDestinationZone({
      name: item.title,
      city: item.city,
      district: item.district,
      state: item.state,
      country: item.country,
    });

    results.push({
      id: item.id || 'loc-' + Math.random().toString(36).slice(2, 9),
      title: item.title,
      subtitle: item.subtitle,
      fullAddress: item.fullAddress,
      city: item.city || '',
      district: item.district || '',
      state: item.state || '',
      country: item.country || '',
      type: item.type || 'LOCATION',
      lat: item.lat || null,
      lng: item.lng || null,
      recommendation,
    });
  };

  // 1. Primary: Photon (Fast OpenStreetMap Search API)
  try {
    const photonUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(expandedQuery)}&limit=8`;
    const response = await fetch(photonUrl, {
      headers: { 'User-Agent': 'DSPhotographyPortfolio/1.0 (contact@dishantshelarphotography.in)' },
      signal: AbortSignal.timeout(3500),
    });

    if (response.ok) {
      const text = await response.text();
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
    // Graceful fallback to Nominatim
  }

  // 2. Secondary Fallback: Nominatim OpenStreetMap
  if (results.length < 3) {
    try {
      const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        expandedQuery
      )}&addressdetails=1&limit=5`;
      const nomRes = await fetch(nominatimUrl, {
        headers: { 'User-Agent': 'DSPhotographyPortfolio/1.0 (contact@dishantshelarphotography.in)' },
        signal: AbortSignal.timeout(3500),
      });

      if (nomRes.ok) {
        const nomData = await nomRes.json();
        if (Array.isArray(nomData)) {
          nomData.forEach((item) => {
            const addr = item.address || {};
            const name = item.name || (item.display_name ? item.display_name.split(',')[0] : 'Destination');
            const city = addr.city || addr.town || addr.village || addr.municipality || '';
            const district = addr.state_district || addr.county || '';
            const state = addr.state || '';
            const country = addr.country || '';

            const parts = [name, district, city, state, country]
              .filter(Boolean)
              .filter((val, idx, arr) => arr.indexOf(val) === idx);

            addResult({
              id: 'nom-' + (item.place_id || Math.random().toString(36).slice(2)),
              title: name,
              subtitle: parts.slice(1).join(', '),
              fullAddress: parts.join(', ') || item.display_name,
              city,
              district,
              state,
              country,
              type: item.type === 'city' || item.type === 'administrative' ? 'CITY' : 'LOCATION',
              lat: item.lat ? parseFloat(item.lat) : null,
              lng: item.lon ? parseFloat(item.lon) : null,
            });
          });
        }
      }
    } catch (e) {
      // Ignore secondary network timeout
    }
  }

  // 3. Fallback: If 0 results returned by external APIs (e.g. offline / network blocked),
  // construct an instant sensible geocoded recommendation based on query text so the system NEVER fails!
  if (results.length === 0) {
    const fallbackRecommendation = resolveDestinationZone({
      name: query,
      city: query,
      country: query.toLowerCase().includes('india') ? 'India' : '',
    });

    results.push({
      id: 'fallback-' + Date.now(),
      title: query,
      subtitle: 'Custom Event Destination',
      fullAddress: query,
      city: query,
      district: '',
      state: '',
      country: '',
      type: 'DESTINATION',
      lat: 18.9220, // Default to Mumbai Atelier coordinates
      lng: 72.8347,
      recommendation: fallbackRecommendation,
      isFallback: true,
    });
  }

  // Cache for 1 hour
  setInCache(cacheKey, results);

  return res.status(200).json(
    new ApiResponse(200, results, "Locations and recommendations retrieved successfully")
  );
});

module.exports = {
  searchLocations,
  resolveDestinationZone,
};
