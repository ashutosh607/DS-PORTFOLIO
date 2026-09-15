import React, { useEffect, useRef, useState } from 'react';
import { MapPin, CheckCircle2, X, Loader2, Sparkles } from 'lucide-react';

const CURATED_DESTINATIONS = [
  { name: 'The Taj Mahal Palace, Mumbai', lat: 18.9217, lng: 72.8332 },
  { name: 'Umaid Bhawan Palace, Jodhpur', lat: 26.281, lng: 73.048 },
  { name: 'The Oberoi Udaivilas, Udaipur', lat: 24.5772, lng: 73.6738 },
  { name: 'Villa Balbiano, Lake Como, Italy', lat: 45.975, lng: 9.201 },
  { name: 'Samode Palace, Jaipur, Rajasthan', lat: 27.2001, lng: 75.8118 },
];

export default function LocationSearchInput({
  value,
  onChangeLocation,
  error,
  coordinates,
}) {
  const [query, setQuery] = useState(value || '');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef(null);
  const debounceTimerRef = useRef(null);

  // Sync internal state if external value changes
  useEffect(() => {
    setQuery(value || '');
  }, [value]);

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
    if (!searchTerm || searchTerm.trim().length < 2) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(
        `https://photon.komoot.io/api/?q=${encodeURIComponent(
          searchTerm.trim()
        )}&limit=6`
      );
      if (!res.ok) throw new Error('Search failed');
      const data = await res.json();

      if (data && data.features) {
        const formatted = data.features.map((item) => {
          const p = item.properties || {};
          const name = p.name || '';
          const parts = [
            name,
            p.street,
            p.city || p.locality,
            p.state,
            p.country,
          ].filter(Boolean);

          // Unique string parts
          const displayParts = [];
          parts.forEach((pt) => {
            if (!displayParts.some((dp) => dp.toLowerCase() === pt.toLowerCase())) {
              displayParts.push(pt);
            }
          });

          return {
            id: item.properties.osm_id || Math.random(),
            title: name || p.city || p.country || 'Destination',
            subtitle: displayParts.slice(1).join(', '),
            fullAddress: displayParts.join(', '),
            lat: item.geometry?.coordinates ? item.geometry.coordinates[1] : null,
            lng: item.geometry?.coordinates ? item.geometry.coordinates[0] : null,
          };
        });

        setSuggestions(formatted);
        setIsOpen(formatted.length > 0);
      }
    } catch (err) {
      console.warn('Location search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    setSelectedIndex(-1);

    onChangeLocation({
      location: val,
      coordinates: null,
      venue: val.split(',')[0],
    });

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (val.trim().length >= 2) {
      setIsLoading(true);
      debounceTimerRef.current = setTimeout(() => {
        searchPlaces(val);
      }, 250);
    } else {
      setSuggestions([]);
      setIsOpen(false);
      setIsLoading(false);
    }
  };

  const handleSelectPlace = (place) => {
    setQuery(place.fullAddress);
    setIsOpen(false);
    setSuggestions([]);

    onChangeLocation({
      location: place.fullAddress,
      coordinates:
        place.lat && place.lng ? { lat: place.lat, lng: place.lng } : null,
      venue: place.title,
    });
  };

  const handleSelectQuick = (dest) => {
    setQuery(dest.name);
    setIsOpen(false);
    onChangeLocation({
      location: dest.name,
      coordinates: { lat: dest.lat, lng: dest.lng },
      venue: dest.name.split(',')[0],
    });
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
    onChangeLocation({
      location: '',
      coordinates: null,
      venue: '',
    });
  };

  const handleKeyDown = (e) => {
    if (!isOpen || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      handleSelectPlace(suggestions[selectedIndex]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="w-full space-y-2.5 relative">
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
          placeholder="Search venue, heritage palace, resort, or destination city..."
          style={{
            width: '100%',
            height: '52px',
            paddingLeft: '44px',
            paddingRight: query ? '80px' : '40px',
            border: error ? '1px solid #992E2E' : '1px solid #E3DBCC',
            borderRadius: '10px',
            background: '#FDFCF8',
            fontSize: '14.5px',
            color: '#101010',
            fontFamily: 'var(--font-sans)',
            boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
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
          style={{
            position: 'absolute',
            top: '56px',
            left: 0,
            right: 0,
            zIndex: 1000,
            backgroundColor: '#FAF8F5',
            border: '1px solid #E3DBCC',
            borderRadius: '12px',
            boxShadow: '0 12px 36px -4px rgba(16,16,16,0.12)',
            overflow: 'hidden',
          }}
        >
          <div className="px-3.5 py-2 border-b border-[#E3DBCC]/60 bg-[#F3EFE6]/50 flex items-center justify-between text-[10.5px] font-mono text-[#7A6E5D] uppercase tracking-wider">
            <span>Location Suggestions</span>
            <span>Use ↑↓ to navigate</span>
          </div>

          <div className="max-h-[260px] overflow-y-auto">
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
                    <MapPin size={13} />
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
                  </div>
                  {item.lat && item.lng && (
                    <span className="text-[10px] font-mono text-[#2E7D32] bg-[#E8F5E9] px-1.5 py-0.5 rounded shrink-0 self-center">
                      PIN
                    </span>
                  )}
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
            <span>Search any hotel, palace, resort, or city.</span>
            {coordinates && (
              <span className="text-[#2E7D32] font-mono text-[11px] font-medium ml-1 flex items-center gap-1">
                <span>●</span>
                <span>Coordinates pinned: {coordinates.lat.toFixed(2)}°, {coordinates.lng.toFixed(2)}°</span>
              </span>
            )}
          </p>
        )}
      </div>

      {/* Quick Curated Editorial Chips */}
      <div className="pt-1">
        <span className="text-[10.5px] uppercase tracking-[0.14em] text-[#8C8070] font-semibold flex items-center gap-1.5 mb-1.5 font-sans">
          <Sparkles size={12} className="text-[#9E8B6E]" />
          <span>Curated Editorial Destinations:</span>
        </span>
        <div className="flex flex-wrap gap-1.5">
          {CURATED_DESTINATIONS.map((dest) => (
            <button
              key={dest.name}
              type="button"
              onClick={() => handleSelectQuick(dest)}
              className="text-[11.5px] px-3 py-1 rounded-full border border-[#E3DBCC] bg-[#FAF8F5] hover:bg-[#101010] hover:text-[#FAF8F5] hover:border-[#101010] text-[#55493A] transition-all cursor-pointer font-sans"
            >
              {dest.name.split(',')[0]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
