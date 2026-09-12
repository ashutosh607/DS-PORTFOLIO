import React from 'react';
import { EVENT_TYPES } from '../data/servicesData';

export default function EventTypeSelector({ selectedEventType, onSelect }) {
  return (
    <div className="w-full">
      <label className="block font-mono text-xs font-semibold tracking-[0.2em] text-[#1E1B18] uppercase mb-4">
        What Are You Celebrating? *
      </label>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 sm:gap-4">
        {EVENT_TYPES.map((cat) => {
          const isSelected = selectedEventType === cat.title;

          return (
            <div
              key={cat.id}
              onClick={() => onSelect(cat.title)}
              className={`relative cursor-pointer rounded-lg p-2 transition-all duration-300 flex flex-col items-center group border ${
                isSelected
                  ? 'border-[#685444] bg-[#F5EFE6] shadow-sm ring-1 ring-[#685444]'
                  : 'border-[#D5CBB9] bg-white hover:border-[#8E8373]'
              }`}
            >
              {/* Image Thumbnail */}
              <div className="relative w-full aspect-[16/10] overflow-hidden rounded-[3px] bg-[#E8E2D6] mb-2">
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                {isSelected && (
                  <div className="absolute top-1 right-1 w-4.5 h-4.5 bg-[#685444] text-white rounded-full flex items-center justify-center text-[9px] font-bold shadow-sm">
                    ✓
                  </div>
                )}
              </div>

              {/* Title */}
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.8125rem',
                  fontWeight: isSelected ? 600 : 500,
                  color: isSelected ? '#1E1B18' : '#3E3932',
                }}
              >
                {cat.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
