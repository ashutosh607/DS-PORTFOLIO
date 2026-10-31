import React, { useEffect, useRef, useState, useMemo } from 'react';
import {
  MapPin,
  CheckCircle2,
  X,
  Loader2,
  Building2,
  Landmark,
  Compass,
  Sparkles,
  Navigation,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { fetchLocations, resolveDestinationZone } from '../../../utils/locationService';

/**
 * Curated knowledge base of iconic wedding destinations, heritage palaces,
 * luxury hotels, and Maharashtra/Mumbai/Thane landmarks for instant 0ms autocomplete.
 */
const CURATED_DESTINATIONS = [
  // Thane & Mumbai Landmarks & Venues
  {
    name: 'Talao Pali (Talavpali / Masunda Lake), Thane',
    city: 'Thane West',
    state: 'Maharashtra',
    country: 'India',
    type: 'LANDMARK',
    lat: 19.1866,
    lng: 72.9723,
    aliases: ['talavpali', 'talao pali', 'talav pali', 'talaopali', 'masunda lake', 'talavpali thane', 'thane talav'],
  },
  {
    name: 'Upvan Lake, Thane West',
    city: 'Thane West',
    state: 'Maharashtra',
    country: 'India',
    type: 'LANDMARK',
    lat: 19.2212,
    lng: 72.9649,
    aliases: ['upvan', 'upvan lake', 'upvan thane', 'upvan lake thane'],
  },
  {
    name: 'Yeoor Hills, Thane West',
    city: 'Thane West',
    state: 'Maharashtra',
    country: 'India',
    type: 'LANDMARK',
    lat: 19.2372,
    lng: 72.9511,
    aliases: ['yeoor', 'yeoor hills', 'yeoor thane'],
  },
  {
    name: 'Gaimukh Waterfront, Ghodbunder Road, Thane',
    city: 'Thane',
    state: 'Maharashtra',
    country: 'India',
    type: 'LANDMARK',
    lat: 19.2882,
    lng: 72.9348,
    aliases: ['gaimukh', 'gaimukh chowpatty', 'ghodbunder road thane'],
  },
  {
    name: 'Jio World Convention Centre, BKC, Mumbai',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    type: 'VENUE',
    lat: 19.0645,
    lng: 72.8687,
    aliases: ['jio world', 'jio world convention centre', 'bkc mumbai', 'jio garden bkc'],
  },
  {
    name: 'Dome | NSCI SVP Stadium, Worli, Mumbai',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    type: 'VENUE',
    lat: 18.9862,
    lng: 72.8152,
    aliases: ['dome', 'dome worli', 'nsci dome', 'nsci mumbai'],
  },
  {
    name: 'Gateway of India, Colaba, Mumbai',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    type: 'LANDMARK',
    lat: 18.922,
    lng: 72.8347,
    aliases: ['gateway of india', 'gateway mumbai', 'colaba'],
  },
  {
    name: 'Marine Drive & Queen\'s Necklace, South Mumbai',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    type: 'LANDMARK',
    lat: 18.9432,
    lng: 72.823,
    aliases: ['marine drive', 'queens necklace', 'nariman point'],
  },
  {
    name: 'Bandra Bandstand & Carter Road, Bandra West, Mumbai',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    type: 'LANDMARK',
    lat: 19.0494,
    lng: 72.8197,
    aliases: ['bandra bandstand', 'bandra west', 'carter road'],
  },

  // Taj Hotels & Palaces
  {
    name: 'The Taj Mahal Palace, Colaba, Mumbai',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    type: 'HOTEL',
    lat: 18.9217,
    lng: 72.8332,
    aliases: ['taj', 'taj hotel', 'taj mahal', 'taj mahal palace', 'taj mumbai', 'taj colaba'],
  },
  {
    name: 'Taj Lands End, Bandra West, Mumbai',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    type: 'HOTEL',
    lat: 19.0433,
    lng: 72.8194,
    aliases: ['taj', 'taj hotel', 'taj lands end', 'taj bandra', 'lands end mumbai'],
  },
  {
    name: 'Taj Santacruz, Mumbai Domestic Airport',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    type: 'HOTEL',
    lat: 19.0883,
    lng: 72.8524,
    aliases: ['taj', 'taj hotel', 'taj santacruz', 'taj airport mumbai'],
  },
  {
    name: 'Taj The Trees, Vikhroli, Mumbai',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    type: 'HOTEL',
    lat: 19.0963,
    lng: 72.9238,
    aliases: ['taj', 'taj hotel', 'taj the trees', 'taj vikhroli'],
  },
  {
    name: 'Taj Mahal, Agra, Uttar Pradesh',
    city: 'Agra',
    state: 'Uttar Pradesh',
    country: 'India',
    type: 'HERITAGE',
    lat: 27.1751,
    lng: 78.0421,
    aliases: ['taj', 'taj mahal', 'taj mahal agra', 'agra monument'],
  },
  {
    name: 'Taj Lake Palace, Lake Pichola, Udaipur',
    city: 'Udaipur',
    state: 'Rajasthan',
    country: 'India',
    type: 'PALACE',
    lat: 24.5754,
    lng: 73.6801,
    aliases: ['taj', 'taj hotel', 'taj lake palace', 'lake palace udaipur', 'taj udaipur'],
  },
  {
    name: 'Taj Fateh Prakash Palace, Udaipur',
    city: 'Udaipur',
    state: 'Rajasthan',
    country: 'India',
    type: 'PALACE',
    lat: 24.5762,
    lng: 73.6836,
    aliases: ['taj', 'taj fateh prakash', 'fateh prakash palace', 'taj hotel'],
  },
  {
    name: 'Taj Aravali Resort & Spa, Udaipur',
    city: 'Udaipur',
    state: 'Rajasthan',
    country: 'India',
    type: 'RESORT',
    lat: 24.5985,
    lng: 73.6264,
    aliases: ['taj', 'taj aravali', 'taj aravali resort udaipur', 'taj hotel'],
  },
  {
    name: 'Taj Falaknuma Palace, Hyderabad',
    city: 'Hyderabad',
    state: 'Telangana',
    country: 'India',
    type: 'PALACE',
    lat: 17.3315,
    lng: 78.4674,
    aliases: ['taj', 'taj hotel', 'taj falaknuma', 'falaknuma palace', 'taj hyderabad'],
  },
  {
    name: 'Rambagh Palace (Taj), Jaipur',
    city: 'Jaipur',
    state: 'Rajasthan',
    country: 'India',
    type: 'PALACE',
    lat: 26.8967,
    lng: 75.8087,
    aliases: ['taj', 'taj hotel', 'rambagh palace', 'rambagh palace jaipur'],
  },
  {
    name: 'Jai Mahal Palace (Taj), Jaipur',
    city: 'Jaipur',
    state: 'Rajasthan',
    country: 'India',
    type: 'PALACE',
    lat: 26.9084,
    lng: 75.7876,
    aliases: ['taj', 'taj hotel', 'jai mahal palace', 'jai mahal jaipur'],
  },
  {
    name: 'Umaid Bhawan Palace (Taj), Jodhpur',
    city: 'Jodhpur',
    state: 'Rajasthan',
    country: 'India',
    type: 'PALACE',
    lat: 26.281,
    lng: 73.048,
    aliases: ['taj', 'taj hotel', 'umaid bhawan palace', 'umaid bhawan jodhpur'],
  },
  {
    name: 'Taj Fort Aguada Resort & Spa, Goa',
    city: 'Candolim',
    state: 'Goa',
    country: 'India',
    type: 'RESORT',
    lat: 15.4925,
    lng: 73.7738,
    aliases: ['taj', 'taj hotel', 'taj fort aguada', 'fort aguada goa', 'taj goa'],
  },
  {
    name: 'Taj Exotica Resort & Spa, Benaulim, Goa',
    city: 'Benaulim',
    state: 'Goa',
    country: 'India',
    type: 'RESORT',
    lat: 15.2476,
    lng: 73.9213,
    aliases: ['taj', 'taj hotel', 'taj exotica', 'taj exotica goa', 'taj goa'],
  },
  {
    name: 'Taj Holiday Village Resort & Spa, Candolim, Goa',
    city: 'Candolim',
    state: 'Goa',
    country: 'India',
    type: 'RESORT',
    lat: 15.5022,
    lng: 73.7667,
    aliases: ['taj', 'taj hotel', 'taj holiday village', 'taj goa'],
  },
  {
    name: 'Taj Mahal Hotel, Mansingh Road, New Delhi',
    city: 'New Delhi',
    state: 'Delhi',
    country: 'India',
    type: 'HOTEL',
    lat: 28.6049,
    lng: 77.2272,
    aliases: ['taj', 'taj hotel', 'taj mansingh', 'taj delhi'],
  },
  {
    name: 'Taj Palace, Diplomatic Enclave, New Delhi',
    city: 'New Delhi',
    state: 'Delhi',
    country: 'India',
    type: 'HOTEL',
    lat: 28.5947,
    lng: 77.1685,
    aliases: ['taj', 'taj hotel', 'taj palace delhi', 'taj diplomatic enclave'],
  },
  {
    name: 'Taj West End, Race Course Road, Bengaluru',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    type: 'HOTEL',
    lat: 12.9835,
    lng: 77.5833,
    aliases: ['taj', 'taj hotel', 'taj west end', 'taj bangalore'],
  },
  {
    name: 'Taj Bengal, Alipore, Kolkata',
    city: 'Kolkata',
    state: 'West Bengal',
    country: 'India',
    type: 'HOTEL',
    lat: 22.5338,
    lng: 88.3315,
    aliases: ['taj', 'taj hotel', 'taj bengal', 'taj kolkata'],
  },
  {
    name: 'Taj Coromandel, Nungambakkam, Chennai',
    city: 'Chennai',
    state: 'Tamil Nadu',
    country: 'India',
    type: 'HOTEL',
    lat: 13.0601,
    lng: 80.2449,
    aliases: ['taj', 'taj hotel', 'taj coromandel', 'taj chennai'],
  },
  {
    name: 'Taj Fisherman\'s Cove Resort & Spa, Chennai',
    city: 'Chennai',
    state: 'Tamil Nadu',
    country: 'India',
    type: 'RESORT',
    lat: 12.7885,
    lng: 80.2482,
    aliases: ['taj', 'taj hotel', 'taj fishermans cove', 'covelong chennai'],
  },
  {
    name: 'Taj Bekal Resort & Spa, Kerala',
    city: 'Kasaragod',
    state: 'Kerala',
    country: 'India',
    type: 'RESORT',
    lat: 12.3969,
    lng: 75.0298,
    aliases: ['taj', 'taj hotel', 'taj bekal', 'taj kerala'],
  },
  {
    name: 'Taj Rishikesh Resort & Spa, Uttarakhand',
    city: 'Rishikesh',
    state: 'Uttarakhand',
    country: 'India',
    type: 'RESORT',
    lat: 30.0869,
    lng: 78.4357,
    aliases: ['taj', 'taj hotel', 'taj rishikesh'],
  },

  // Oberoi Hotels & Resorts
  {
    name: 'The Oberoi, Nariman Point, Mumbai',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    type: 'HOTEL',
    lat: 18.9272,
    lng: 72.8206,
    aliases: ['oberoi', 'oberoi mumbai', 'oberoi nariman point', 'trident nariman point'],
  },
  {
    name: 'The Oberoi Udaivilas, Udaipur',
    city: 'Udaipur',
    state: 'Rajasthan',
    country: 'India',
    type: 'PALACE',
    lat: 24.5772,
    lng: 73.6738,
    aliases: ['oberoi', 'oberoi udaivilas', 'udaivilas udaipur', 'oberoi hotel'],
  },
  {
    name: 'The Oberoi Rajvilas, Jaipur',
    city: 'Jaipur',
    state: 'Rajasthan',
    country: 'India',
    type: 'PALACE',
    lat: 26.8797,
    lng: 75.8906,
    aliases: ['oberoi', 'oberoi rajvilas', 'rajvilas jaipur', 'oberoi hotel'],
  },
  {
    name: 'The Oberoi Amarvilas, Agra',
    city: 'Agra',
    state: 'Uttar Pradesh',
    country: 'India',
    type: 'HOTEL',
    lat: 27.1685,
    lng: 78.0483,
    aliases: ['oberoi', 'oberoi amarvilas', 'amarvilas agra', 'oberoi hotel'],
  },
  {
    name: 'The Oberoi Sukhvilas Spa Resort, New Chandigarh',
    city: 'Chandigarh',
    state: 'Punjab',
    country: 'India',
    type: 'RESORT',
    lat: 30.8286,
    lng: 76.7725,
    aliases: ['oberoi', 'oberoi sukhvilas', 'sukhvilas chandigarh'],
  },

  // The Leela Hotels
  {
    name: 'The Leela Palace, Lake Pichola, Udaipur',
    city: 'Udaipur',
    state: 'Rajasthan',
    country: 'India',
    type: 'PALACE',
    lat: 24.5784,
    lng: 73.6787,
    aliases: ['leela', 'leela palace udaipur', 'leela udaipur', 'leela hotel'],
  },
  {
    name: 'The Leela Palace, Jaipur',
    city: 'Jaipur',
    state: 'Rajasthan',
    country: 'India',
    type: 'PALACE',
    lat: 27.0543,
    lng: 75.9082,
    aliases: ['leela', 'leela palace jaipur', 'leela jaipur', 'leela hotel'],
  },
  {
    name: 'The Leela Mumbai, Andheri East',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    type: 'HOTEL',
    lat: 19.1084,
    lng: 72.8799,
    aliases: ['leela', 'leela mumbai', 'leela andheri', 'leela hotel'],
  },
  {
    name: 'The Leela Goa, Cavelossim Beach',
    city: 'Cavelossim',
    state: 'Goa',
    country: 'India',
    type: 'RESORT',
    lat: 15.1764,
    lng: 73.9452,
    aliases: ['leela', 'leela goa', 'leela cavelossim', 'leela resort'],
  },
  {
    name: 'The Leela Palace, Chanakyapuri, New Delhi',
    city: 'New Delhi',
    state: 'Delhi',
    country: 'India',
    type: 'HOTEL',
    lat: 28.5794,
    lng: 77.1896,
    aliases: ['leela', 'leela delhi', 'leela palace chanakyapuri'],
  },

  // Marriott / St. Regis / Luxury Collections
  {
    name: 'The St. Regis Mumbai, Lower Parel',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    type: 'HOTEL',
    lat: 18.995,
    lng: 72.8248,
    aliases: ['st regis', 'st regis mumbai', 'st regis lower parel', 'palladium hotel'],
  },
  {
    name: 'JW Marriott Mumbai Juhu',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    type: 'HOTEL',
    lat: 19.1008,
    lng: 72.8266,
    aliases: ['marriott', 'jw marriott juhu', 'marriott juhu', 'jw marriott mumbai'],
  },
  {
    name: 'JW Marriott Mumbai Sahar, Andheri East',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    type: 'HOTEL',
    lat: 19.1037,
    lng: 72.8682,
    aliases: ['marriott', 'jw marriott sahar', 'marriott airport mumbai', 'jw marriott'],
  },
  {
    name: 'JW Marriott Jaipur Resort & Spa',
    city: 'Jaipur',
    state: 'Rajasthan',
    country: 'India',
    type: 'RESORT',
    lat: 27.0583,
    lng: 75.9328,
    aliases: ['marriott', 'jw marriott jaipur', 'marriott jaipur resort'],
  },
  {
    name: 'Four Seasons Hotel Mumbai, Worli',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    type: 'HOTEL',
    lat: 18.9928,
    lng: 72.8202,
    aliases: ['four seasons', 'four seasons mumbai', 'four seasons worli'],
  },
  {
    name: 'Grand Hyatt Mumbai, Kalina, Santacruz East',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    type: 'HOTEL',
    lat: 19.0772,
    lng: 72.8528,
    aliases: ['hyatt', 'grand hyatt mumbai', 'grand hyatt kalina', 'hyatt mumbai'],
  },
  {
    name: 'ITC Maratha, A Luxury Collection Hotel, Mumbai',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    type: 'HOTEL',
    lat: 19.1042,
    lng: 72.8689,
    aliases: ['itc', 'itc maratha', 'itc maratha mumbai', 'itc hotel'],
  },
  {
    name: 'ITC Grand Central, Parel, Mumbai',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    type: 'HOTEL',
    lat: 19.0042,
    lng: 72.8407,
    aliases: ['itc', 'itc grand central', 'itc parel', 'itc hotel'],
  },

  // Heritage Palaces & Destination Wedding Venues
  {
    name: 'Samode Palace, Jaipur, Rajasthan',
    city: 'Jaipur',
    state: 'Rajasthan',
    country: 'India',
    type: 'PALACE',
    lat: 27.2001,
    lng: 75.8118,
    aliases: ['samode', 'samode palace', 'samode jaipur'],
  },
  {
    name: 'Fairmont Jaipur, Kukas, Rajasthan',
    city: 'Jaipur',
    state: 'Rajasthan',
    country: 'India',
    type: 'PALACE',
    lat: 27.0545,
    lng: 75.9088,
    aliases: ['fairmont', 'fairmont jaipur', 'fairmont hotel'],
  },
  {
    name: 'Suryagarh, Jaisalmer, Rajasthan',
    city: 'Jaisalmer',
    state: 'Rajasthan',
    country: 'India',
    type: 'PALACE',
    lat: 26.8924,
    lng: 70.8388,
    aliases: ['suryagarh', 'suryagarh jaisalmer'],
  },
  {
    name: 'City Palace & Jagmandir Island, Udaipur',
    city: 'Udaipur',
    state: 'Rajasthan',
    country: 'India',
    type: 'PALACE',
    lat: 24.5764,
    lng: 73.6835,
    aliases: ['city palace', 'city palace udaipur', 'jagmandir', 'jagmandir island'],
  },
  {
    name: 'Neemrana Fort-Palace, Alwar, Rajasthan',
    city: 'Alwar',
    state: 'Rajasthan',
    country: 'India',
    type: 'HERITAGE',
    lat: 27.9942,
    lng: 76.3861,
    aliases: ['neemrana', 'neemrana fort', 'neemrana palace'],
  },
  {
    name: 'Villa Balbiano, Lake Como, Italy',
    city: 'Ossuccio',
    state: 'Lombardy',
    country: 'Italy',
    type: 'DESTINATION',
    lat: 45.975,
    lng: 9.201,
    aliases: ['lake como', 'villa balbiano', 'como italy', 'villa del balbianello'],
  },
  {
    name: 'Burj Al Arab, Jumeirah, Dubai',
    city: 'Dubai',
    state: 'Dubai',
    country: 'United Arab Emirates',
    type: 'HOTEL',
    lat: 25.1412,
    lng: 55.1852,
    aliases: ['burj al arab', 'dubai wedding', 'jumeirah dubai'],
  },

  // Popular Maharashtra Destination Hubs
  {
    name: 'Alibaug Beach & Coastal Villas, Raigad',
    city: 'Alibaug',
    state: 'Maharashtra',
    country: 'India',
    type: 'DESTINATION',
    lat: 18.6414,
    lng: 72.8722,
    aliases: ['alibaug', 'alibag', 'alibaug beach', 'mandwa'],
  },
  {
    name: 'Lonavala & Khandala Luxury Resorts, Pune',
    city: 'Lonavala',
    state: 'Maharashtra',
    country: 'India',
    type: 'DESTINATION',
    lat: 18.7557,
    lng: 73.4091,
    aliases: ['lonavala', 'khandala', 'della resorts lonavala', 'aamby valley'],
  },
  {
    name: 'Mahabaleshwar & Panchgani, Satara',
    city: 'Mahabaleshwar',
    state: 'Maharashtra',
    country: 'India',
    type: 'DESTINATION',
    lat: 17.9237,
    lng: 73.6586,
    aliases: ['mahabaleshwar', 'panchgani'],
  },
  {
    name: 'Sula Vineyards, Gangapur Dam, Nashik',
    city: 'Nashik',
    state: 'Maharashtra',
    country: 'India',
    type: 'RESORT',
    lat: 19.9975,
    lng: 73.6874,
    aliases: ['sula', 'sula vineyards', 'sula nashik', 'nashik vineyard'],
  },
  {
    name: 'Goa (North & South Beachfronts), India',
    city: 'Goa',
    state: 'Goa',
    country: 'India',
    type: 'DESTINATION',
    lat: 15.2993,
    lng: 74.124,
    aliases: ['goa', 'north goa', 'south goa', 'goa beach'],
  },
];

/**
 * Searches local knowledge base with alias & multi-word matching
 */
function searchLocalDestinations(rawQuery) {
  const q = rawQuery.toLowerCase().trim();
  const qAlphaNum = q.replace(/[^a-z0-9]/g, '');
  if (qAlphaNum.length < 2) return [];

  const tokens = q.split(/\s+/).filter(Boolean);

  const scored = [];

  CURATED_DESTINATIONS.forEach((item) => {
    const nameLower = item.name.toLowerCase();
    const cityLower = item.city.toLowerCase();
    const stateLower = item.state.toLowerCase();
    const nameAlphaNum = nameLower.replace(/[^a-z0-9]/g, '');

    let score = 0;

    // Exact or direct substring match on clean alphanum
    if (nameAlphaNum.includes(qAlphaNum)) {
      score += 120;
    }

    // Alias matches
    if (item.aliases) {
      for (const alias of item.aliases) {
        const aAlphaNum = alias.replace(/[^a-z0-9]/g, '');
        if (aAlphaNum === qAlphaNum) {
          score += 150;
          break;
        } else if (aAlphaNum.includes(qAlphaNum) || qAlphaNum.includes(aAlphaNum)) {
          score += 90;
          break;
        }
      }
    }

    // Multi-token match (e.g. "taj hotel", "talav pali thane")
    const allTokensMatch = tokens.every((token) => {
      const t = token.replace(/[^a-z0-9]/g, '');
      if (!t) return true;
      return (
        nameAlphaNum.includes(t) ||
        cityLower.includes(t) ||
        stateLower.includes(t) ||
        (item.aliases && item.aliases.some((a) => a.replace(/[^a-z0-9]/g, '').includes(t)))
      );
    });

    if (allTokensMatch && tokens.length > 1) {
      score += 80;
    }

    if (score > 0) {
      scored.push({
        item: {
          id: 'local-' + item.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          title: item.name,
          subtitle: `${item.city}, ${item.state}, ${item.country}`,
          fullAddress: `${item.name}, ${item.city}, ${item.state}, ${item.country}`,
          type: item.type,
          lat: item.lat,
          lng: item.lng,
          isCurated: true,
        },
        score,
      });
    }
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 7).map((s) => s.item);
}

export default function LocationSearchInput({
  value,
  onChangeLocation,
  error,
  coordinates,
  onSelectRecommendedTier,
  initialRecommendation,
}) {
  const [query, setQuery] = useState(value || '');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [activeRecommendation, setActiveRecommendation] = useState(() => {
    if (initialRecommendation) return initialRecommendation;
    if (value && value.trim().length >= 2) {
      return resolveDestinationZone({ name: value });
    }
    return null;
  });

  const containerRef = useRef(null);
  const listRef = useRef(null);
  const debounceTimerRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Sync internal state if external value changes
  useEffect(() => {
    setQuery(value || '');
    if (value && value.trim().length >= 2) {
      setActiveRecommendation((prev) => prev || resolveDestinationZone({ name: value }));
    } else {
      setActiveRecommendation(null);
    }
  }, [value]);

  // Auto-scroll highlighted suggestion into view
  useEffect(() => {
    if (selectedIndex >= 0 && listRef.current) {
      const activeEl = listRef.current.children[selectedIndex];
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [selectedIndex]);

  // Click outside to close suggestions
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchPlaces = async (searchTerm) => {
    const trimmed = (searchTerm || '').trim();
    if (!trimmed || trimmed.length < 2) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    // 1. Get instant curated matches (0ms response for local hubs)
    const localMatches = searchLocalDestinations(trimmed).map((loc) => ({
      ...loc,
      recommendation: resolveDestinationZone(loc),
    }));

    if (localMatches.length > 0) {
      setSuggestions(localMatches);
      setIsOpen(true);
    }

    // Cancel previous in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    setIsLoading(true);

    try {
      // 2. Query dynamic geocoding provider via backend / client fallback
      const apiResults = await fetchLocations(trimmed, signal);

      // Merge local matches and API results with clean deduplication
      const merged = [...localMatches];
      const seenKeys = new Set(
        localMatches.map((m) => (m.fullAddress || m.title).toLowerCase().replace(/[^a-z0-9]/g, ''))
      );

      (apiResults || []).forEach((apiItem) => {
        const itemKey = (apiItem.fullAddress || apiItem.title).toLowerCase().replace(/[^a-z0-9]/g, '');
        if (!seenKeys.has(itemKey)) {
          seenKeys.add(itemKey);
          merged.push({
            ...apiItem,
            recommendation: apiItem.recommendation || resolveDestinationZone(apiItem),
          });
        }
      });

      // 3. Fallback entry if 0 results so user can always confirm any custom location
      if (merged.length === 0) {
        const customRec = resolveDestinationZone({ name: trimmed });
        merged.push({
          id: 'custom-' + Date.now(),
          title: trimmed,
          subtitle: 'Custom destination location · Click to confirm',
          fullAddress: trimmed,
          type: 'DESTINATION',
          lat: 18.9220,
          lng: 72.8347,
          recommendation: customRec,
          isCustom: true,
        });
      }

      setSuggestions(merged);
      setIsOpen(merged.length > 0);
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.warn('Place search API error (showing local results):', err);
        if (localMatches.length > 0) {
          setSuggestions(localMatches);
          setIsOpen(true);
        } else {
          // Guaranteed graceful fallback even on full network disconnection
          const fallbackRec = resolveDestinationZone({ name: trimmed });
          setSuggestions([
            {
              id: 'offline-' + Date.now(),
              title: trimmed,
              subtitle: 'Custom location (Offline geocoding active)',
              fullAddress: trimmed,
              type: 'DESTINATION',
              lat: 18.9220,
              lng: 72.8347,
              recommendation: fallbackRec,
              isCustom: true,
            },
          ]);
          setIsOpen(true);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    setSelectedIndex(-1);

    const liveRec = val.trim().length >= 2 ? resolveDestinationZone({ name: val }) : null;
    setActiveRecommendation(liveRec);

    onChangeLocation({
      location: val,
      coordinates: null,
      venue: val.split(',')[0].trim(),
      recommendation: liveRec,
    });

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (val.trim().length >= 2) {
      const instantLocal = searchLocalDestinations(val.trim()).map((loc) => ({
        ...loc,
        recommendation: resolveDestinationZone(loc),
      }));
      if (instantLocal.length > 0) {
        setSuggestions(instantLocal);
        setIsOpen(true);
      }

      setIsLoading(true);
      debounceTimerRef.current = setTimeout(() => {
        searchPlaces(val);
      }, 200);
    } else {
      setSuggestions([]);
      setIsOpen(false);
      setIsLoading(false);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    }
  };

  const handleSelectPlace = (place) => {
    setQuery(place.fullAddress);
    setIsOpen(false);
    setSuggestions([]);

    const rec = place.recommendation || resolveDestinationZone(place);
    setActiveRecommendation(rec);

    onChangeLocation({
      location: place.fullAddress,
      coordinates: place.lat && place.lng ? { lat: place.lat, lng: place.lng } : null,
      venue: place.title,
      recommendation: rec,
    });
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
    setActiveRecommendation(null);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    onChangeLocation({
      location: '',
      coordinates: null,
      venue: '',
      recommendation: null,
    });
  };

  const handleKeyDown = (e) => {
    if (!isOpen || suggestions.length === 0) {
      // If closed but user hits Enter on a typed string, confirm with geocoded recommendation
      if (e.key === 'Enter' && query.trim().length >= 2) {
        e.preventDefault();
        const rec = resolveDestinationZone({ name: query.trim() });
        setActiveRecommendation(rec);
        onChangeLocation({
          location: query.trim(),
          coordinates: coordinates || { lat: 18.9220, lng: 72.8347 },
          venue: query.split(',')[0].trim(),
          recommendation: rec,
        });
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        handleSelectPlace(suggestions[selectedIndex]);
      } else if (suggestions.length > 0) {
        handleSelectPlace(suggestions[0]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const renderBadge = (type) => {
    switch (type) {
      case 'HOTEL':
        return (
          <span className="text-[9.5px] font-mono tracking-wider text-[#A36B00] bg-[#FFF8E6] border border-[#F2E0B6] px-1.5 py-0.5 rounded shrink-0">
            HOTEL
          </span>
        );
      case 'PALACE':
        return (
          <span className="text-[9.5px] font-mono tracking-wider text-[#7A3E8A] bg-[#FAF0FC] border border-[#EACCF0] px-1.5 py-0.5 rounded shrink-0">
            PALACE
          </span>
        );
      case 'HERITAGE':
        return (
          <span className="text-[9.5px] font-mono tracking-wider text-[#8C3A27] bg-[#FDF0ED] border border-[#F5CFC7] px-1.5 py-0.5 rounded shrink-0">
            HERITAGE
          </span>
        );
      case 'RESORT':
        return (
          <span className="text-[9.5px] font-mono tracking-wider text-[#1B6F67] bg-[#EBF8F6] border border-[#BDE7E2] px-1.5 py-0.5 rounded shrink-0">
            RESORT
          </span>
        );
      case 'LANDMARK':
        return (
          <span className="text-[9.5px] font-mono tracking-wider text-[#1E5D88] bg-[#EEF6FB] border border-[#C2E0F2] px-1.5 py-0.5 rounded shrink-0">
            LANDMARK
          </span>
        );
      case 'VENUE':
        return (
          <span className="text-[9.5px] font-mono tracking-wider text-[#4A4844] bg-[#F3F0E9] border border-[#E3DBCC] px-1.5 py-0.5 rounded shrink-0">
            VENUE
          </span>
        );
      case 'DISTRICT':
        return (
          <span className="text-[9.5px] font-mono tracking-wider text-[#4A4844] bg-[#F0EBE1] border border-[#D8CEBE] px-1.5 py-0.5 rounded shrink-0">
            DISTRICT
          </span>
        );
      case 'CITY':
        return (
          <span className="text-[9.5px] font-mono tracking-wider text-[#4A4844] bg-[#F3F0E9] border border-[#E3DBCC] px-1.5 py-0.5 rounded shrink-0">
            CITY
          </span>
        );
      default:
        return (
          <span className="text-[9.5px] font-mono tracking-wider text-[#666] bg-[#F5F5F5] px-1.5 py-0.5 rounded shrink-0">
            DESTINATION
          </span>
        );
    }
  };

  const renderIcon = (type) => {
    switch (type) {
      case 'HOTEL':
      case 'RESORT':
        return <Building2 size={13} />;
      case 'PALACE':
      case 'HERITAGE':
      case 'LANDMARK':
        return <Landmark size={13} />;
      case 'DESTINATION':
      case 'CITY':
      case 'DISTRICT':
        return <Compass size={13} />;
      default:
        return <MapPin size={13} />;
    }
  };

  return (
    <div ref={containerRef} className="w-full space-y-3 relative">
      {/* Search Input Bar */}
      <div className="relative flex items-center">
        <div className="absolute left-4 pointer-events-none text-[#7A7770] flex items-center">
          {coordinates ? (
            <CheckCircle2 size={18} className="text-[#2E7D32]" />
          ) : (
            <MapPin size={18} className="text-[#8C8070]" />
          )}
        </div>

        <input
          id="booking-field-location"
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) setIsOpen(true);
          }}
          placeholder="Search any city, district (e.g. Raigad), venue, hotel, or destination..."
          style={{
            width: '100%',
            height: '52px',
            paddingTop: '14px',
            paddingBottom: '14px',
            paddingLeft: '44px',
            paddingRight: query ? '80px' : '40px',
            border: error ? '1px solid #992E2E' : '1px solid #E3DBCC',
            borderRadius: '10px',
            background: '#FDFCF8',
            fontSize: '16px',
            color: '#101010',
            fontFamily: 'var(--font-sans)',
            boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
            boxSizing: 'border-box',
          }}
          className="outline-none transition-all duration-200 focus:border-[#101010] focus:shadow-sm placeholder-[#A59C8F]"
          autoComplete="off"
        />

        <div className="absolute right-3.5 flex items-center gap-1.5">
          {isLoading && (
            <Loader2 size={16} className="text-[#8C8070] animate-spin" />
          )}
          {query && !isLoading && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 text-[#8C8070] hover:text-[#101010] rounded-full hover:bg-[#F0EBE1] transition-colors cursor-pointer"
              title="Clear"
            >
              <X size={15} />
            </button>
          )}
          <span className="text-[10px] font-mono tracking-wider px-1.5 py-0.5 rounded bg-[#F0EBE1] text-[#7A6E5D] uppercase">
            MAPS
          </span>
        </div>
      </div>

      {/* Autocomplete Dropdown List */}
      {isOpen && suggestions.length > 0 && (
        <div
          data-lenis-prevent="true"
          style={{
            position: 'absolute',
            top: '56px',
            left: 0,
            right: 0,
            zIndex: 1000,
            backgroundColor: '#FAF8F5',
            border: '1px solid #E3DBCC',
            borderRadius: '12px',
            boxShadow: '0 14px 40px -4px rgba(16,16,16,0.16)',
            overflow: 'hidden',
          }}
        >
          <div className="px-3.5 py-2 border-b border-[#E3DBCC]/60 bg-[#F3EFE6]/50 flex items-center justify-between text-[10.5px] font-mono text-[#7A6E5D] uppercase tracking-wider select-none">
            <span>Location Recommendations</span>
            <span>Use ↑↓ to select · Enter to confirm</span>
          </div>

          <div
            ref={listRef}
            data-lenis-prevent="true"
            onWheel={(e) => {
              e.stopPropagation();
            }}
            onTouchMove={(e) => {
              e.stopPropagation();
            }}
            className="max-h-[300px] overflow-y-auto overscroll-contain"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#D8CEBE transparent',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {suggestions.map((item, idx) => {
              const isHighlighted = idx === selectedIndex;
              return (
                <button
                  key={item.id + '-' + idx}
                  type="button"
                  onClick={() => handleSelectPlace(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors cursor-pointer border-b border-[#E3DBCC]/30 last:border-none ${
                    isHighlighted ? 'bg-[#EFEAE0]' : 'hover:bg-[#F5F1E8]'
                  }`}
                >
                  <div className="mt-0.5 w-6 h-6 rounded-full bg-[#E5DDD0] text-[#55493A] flex items-center justify-center shrink-0">
                    {renderIcon(item.type)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-sans text-[13.5px] font-medium text-[#101010] truncate">
                      {item.title}
                    </div>
                    {item.subtitle && (
                      <div className="font-sans text-[11.5px] text-[#7A7770] truncate mt-0.5">
                        {item.subtitle}
                      </div>
                    )}
                    {item.recommendation && (
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[9px] font-mono tracking-wider px-1.5 py-0.5 rounded bg-[#FAF5EC] text-[#8C6D3B] border border-[#E8DEC9]">
                          {item.recommendation.badge}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="shrink-0 flex items-center gap-1.5 self-center">
                    {renderBadge(item.type)}
                    {item.lat && item.lng && (
                      <span className="text-[9.5px] font-mono text-[#2E7D32] bg-[#E8F5E9] border border-[#C8E6C9] px-1.5 py-0.5 rounded shrink-0">
                        PIN
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Helper text & Status */}
      <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
        {error ? (
          <p className="font-sans text-xs text-[#992E2E]">{error}</p>
        ) : (
          <p className="text-[#7A7770] text-[12px] flex items-center gap-1">
            <span>Supports any city, district (e.g. Raigad), village, or international venue.</span>
            {coordinates && (
              <span className="text-[#2E7D32] font-mono text-[11px] font-medium ml-1 flex items-center gap-1">
                <span>●</span>
                <span>Coordinates: {coordinates.lat.toFixed(2)}°, {coordinates.lng.toFixed(2)}°</span>
              </span>
            )}
          </p>
        )}
      </div>

      {/* DYNAMIC PHOTOGRAPHY SERVICE RECOMMENDATION CARD */}
      {activeRecommendation && (query.trim().length >= 2 || value) && (
        <div
          data-testid="location-recommendation-card"
          className="mt-3 p-4 sm:p-5 rounded-[12px] border border-[#E3DBCC] bg-[#FAF8F5] shadow-xs transition-all"
        >
          {/* Header Badge & Pin Status */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-[#E3DBCC]/60">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#101010]" />
              <span className="font-mono text-[10px] tracking-[0.16em] uppercase font-semibold text-[#55493A]">
                {activeRecommendation.badge}
              </span>
            </div>

            <div className="flex items-center gap-2 text-[10px] font-mono text-[#7A6E5D]">
              <Sparkles size={11} className="text-[#8C6D3B]" />
              <span className="uppercase">ATELIER ADVISORY</span>
            </div>
          </div>

          {/* Recommendation Title & Overview */}
          <h4
            style={{ fontFamily: 'var(--font-serif)' }}
            className="text-[17px] sm:text-[19px] text-[#101010] font-normal leading-tight mb-1.5"
          >
            {activeRecommendation.title}
          </h4>

          <p className="font-sans text-xs sm:text-[12.5px] text-[#55493A] leading-relaxed mb-3">
            {activeRecommendation.description}
          </p>

          {/* Surcharge / Logistics Pill */}
          <div className="p-2 sm:p-2.5 rounded-lg bg-[#F3EFE6] border border-[#E5DDD0] mb-3 flex items-start gap-2">
            <Navigation size={13} className="text-[#8C6D3B] shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <span className="block font-mono text-[9.5px] uppercase tracking-wider text-[#7A6E5D] font-semibold mb-0.5">
                TRAVEL LOGISTICS &amp; CREW DEPLOYMENT
              </span>
              <p className="font-sans text-[11.5px] text-[#222] font-medium leading-normal">
                {activeRecommendation.surchargeNote}
              </p>
            </div>
          </div>

          {/* Highlights & Deliverables */}
          {activeRecommendation.highlights && (
            <div className="space-y-1.5 pt-1">
              <span className="block font-mono text-[9.5px] uppercase tracking-wider text-[#7A6E5D] font-semibold">
                RECOMMENDED ATELIER CAPABILITIES FOR THIS DESTINATION
              </span>
              <ul className="space-y-1 text-xs text-[#55493A]">
                {activeRecommendation.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2 text-[11.5px] leading-relaxed">
                    <span className="text-[#8C6D3B] font-bold">―</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Interactive Action: Apply Recommended Collection */}
          {onSelectRecommendedTier && activeRecommendation.recommendedTier && (
            <div className="mt-3.5 pt-3 border-t border-[#E3DBCC]/60 flex items-center justify-between flex-wrap gap-2">
              <div className="text-[11px] font-sans text-[#7A6E5D]">
                Recommended suite: <span className="font-semibold text-[#101010]">{activeRecommendation.recommendedTier} Collection</span>
              </div>
              <button
                type="button"
                onClick={() => onSelectRecommendedTier(activeRecommendation.recommendedTier.toLowerCase())}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#101010] text-[#FDFCF8] hover:bg-[#2A2724] text-[11px] font-sans font-medium tracking-wide uppercase transition-colors cursor-pointer"
              >
                <span>Select {activeRecommendation.recommendedTier}</span>
                <ArrowRight size={12} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
