import React from 'react';
import { SERVICE_OPTIONS } from '../data/servicesData';

export default function ServiceSelector({ selectedServices = [], onToggleService }) {
  return (
    <div className="w-full">
      <span className="block font-mono text-xs font-semibold tracking-[0.2em] text-[#1E1B18] uppercase mb-3">
        What Would You Like Covered?
      </span>

      <div className="flex flex-wrap gap-2.5">
        {SERVICE_OPTIONS.map((service) => {
          const isSelected = selectedServices.includes(service);

          return (
            <button
              key={service}
              type="button"
              onClick={() => onToggleService(service)}
              className={`px-4 py-2 rounded-full text-xs font-medium tracking-wide transition-all duration-200 cursor-pointer flex items-center gap-1.5 border ${
                isSelected
                  ? 'bg-[#685444] text-[#FAF8F5] border-[#685444] shadow-xs'
                  : 'bg-transparent text-[#38332C] border-[#C7BDAE] hover:border-[#8E8373]'
              }`}
            >
              {isSelected && <span className="text-[10px] font-bold">✓</span>}
              <span>{service}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
