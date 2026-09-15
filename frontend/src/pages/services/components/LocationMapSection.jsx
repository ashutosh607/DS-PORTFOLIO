import React from 'react';
import { MapPin, ExternalLink, Compass, Navigation } from 'lucide-react';

export default function LocationMapSection({
  location,
  coordinates,
  venue,
}) {
  const activeQuery = location || 'The Taj Mahal Palace, Mumbai, Maharashtra, India';

  // Construct Google Maps search URL & dynamic embed URL
  const googleMapsSearchUrl = coordinates
    ? `https://www.google.com/maps/search/?api=1&query=${coordinates.lat},${coordinates.lng}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activeQuery)}`;

  const embedUrl = coordinates
    ? `https://maps.google.com/maps?q=${coordinates.lat},${coordinates.lng}&t=m&z=15&ie=UTF8&iwloc=&output=embed`
    : `https://maps.google.com/maps?q=${encodeURIComponent(activeQuery)}&t=m&z=14&ie=UTF8&iwloc=&output=embed`;

  return (
    <section className="w-full mt-16 sm:mt-24 pt-12 border-t border-[#E3DBCC]">
      <div className="max-w-[1240px] mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2 font-mono text-xs font-semibold tracking-[0.2em] text-[#7A6E5D] uppercase">
              <Compass size={14} className="text-[#8C8070]" />
              <span>DESTINATION &amp; VENUE ITINERARY</span>
            </div>
            <h3
              style={{ fontFamily: 'var(--font-serif)' }}
              className="text-[28px] sm:text-[34px] text-[#101010] font-normal leading-tight"
            >
              {location ? 'Your Destination on the Map' : 'Destination Map Preview'}
            </h3>
            <p className="font-sans text-sm text-[#7A7770] mt-1.5 max-w-xl">
              {location
                ? `Live Google Map view for ${location}. Our atelier travels worldwide for commissioned assignments.`
                : 'Select your event venue in the form above to pin and preview your celebration destination.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={googleMapsSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#E3DBCC] bg-[#FAF8F5] hover:bg-[#101010] hover:text-white text-[#55493A] font-sans text-xs font-medium tracking-wider uppercase transition-all duration-200 shadow-2xs"
            >
              <Navigation size={14} />
              <span>Open in Google Maps</span>
              <ExternalLink size={13} />
            </a>
          </div>
        </div>

        {/* Google Map View Container */}
        <div className="relative w-full h-[420px] sm:h-[480px] rounded-[16px] overflow-hidden border border-[#E3DBCC] shadow-md bg-[#FAF8F5]">
          <iframe
            title="Google Maps Destination Preview"
            src={embedUrl}
            width="100%"
            height="100%"
            style={{ border: 0, filter: 'contrast(102%) brightness(99%)' }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />

          {/* Floating Luxury Specimen Card */}
          <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-md bg-[#FAF8F5]/95 backdrop-blur-md border border-[#E3DBCC] rounded-xl p-4 shadow-xl pointer-events-auto">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-[#101010] text-[#FAF8F5] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                <MapPin size={17} />
              </div>
              <div className="min-w-0 flex-1">
                <span className="block font-mono text-[10px] tracking-[0.16em] text-[#7A6E5D] uppercase font-semibold mb-0.5">
                  SELECTED VENUE &amp; COORDINATES
                </span>
                <h4 className="font-serif text-[16px] sm:text-[18px] text-[#101010] font-normal truncate">
                  {venue || (location ? location.split(',')[0] : 'The Taj Mahal Palace')}
                </h4>
                <p className="font-sans text-xs text-[#7A7770] line-clamp-2 mt-0.5">
                  {location || 'Apollo Bandar, Colaba, Mumbai, Maharashtra 400001'}
                </p>

                {coordinates && (
                  <div className="mt-2 pt-2 border-t border-[#E3DBCC]/60 flex items-center justify-between text-[11px] font-mono text-[#55493A]">
                    <span>LAT: {coordinates.lat.toFixed(4)}°</span>
                    <span>LNG: {coordinates.lng.toFixed(4)}°</span>
                    <span className="text-[#2E7D32] font-semibold flex items-center gap-1">
                      <span>●</span> PINNED
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
