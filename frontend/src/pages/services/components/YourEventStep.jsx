import React, { useState } from 'react';
import { motion } from 'framer-motion';
import EventTypeSelector from './EventTypeSelector';
import ServiceSelector from './ServiceSelector';
import { DAYS_OPTIONS } from '../data/servicesData';

export default function YourEventStep({
  formData,
  updateFormData,
  onNextStep,
}) {
  const [error, setError] = useState(null);

  const handleToggleService = (service) => {
    const current = formData.services || [];
    if (current.includes(service)) {
      updateFormData({ services: current.filter((s) => s !== service) });
    } else {
      updateFormData({ services: [...current, service] });
    }
  };

  const validateAndProceed = (e) => {
    e.preventDefault();
    if (!formData.eventType) {
      setError('Please select an event type.');
      return;
    }
    setError(null);
    onNextStep();
  };

  return (
    <motion.div
      initial={{ opacity: 0, filter: 'blur(6px)', y: 20 }}
      animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
      exit={{ opacity: 0, filter: 'blur(6px)', y: -15 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="container mx-auto px-6 sm:px-10 md:px-12 max-w-[1240px] pb-20"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">

        {/* Left Column: Heading & Photography/Equipment Details Frame */}
        <div className="lg:col-span-4 flex flex-col items-start">
          <span className="font-mono text-xs font-semibold tracking-[0.24em] text-[#7A6E5D] uppercase mb-2">
            STEP 02 ──
          </span>

          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.4rem, 3.4vw, 3.25rem)',
              lineHeight: 1.08,
              fontWeight: 400,
              color: '#1E1B18',
              marginBottom: '0.75rem',
            }}
          >
            TELL US ABOUT
            <br />
            THE DAY.
          </h2>

          <p className="text-base font-sans text-[#554E44] mb-8">
            Help us understand what you're planning.
          </p>

          {/* Photography image of camera, details & flowers */}
          <div className="relative w-full aspect-[4/3] rounded-[2px] overflow-hidden shadow-[0_20px_50px_-10px_rgba(30,27,24,0.18)] border border-[#E0D8CA] bg-[#ECE7DC]">
            <img
              src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop"
              alt="Vintage analog camera and delicate wedding florals"
              className="w-full h-full object-cover object-center filter grayscale contrast-110"
              loading="lazy"
            />
          </div>
        </div>

        {/* Right Column: Event Customizer Form */}
        <div className="lg:col-span-8 bg-[#FAF9F6] p-6 sm:p-12 rounded-xl border border-[#E5DDD0] shadow-xs">
          <form onSubmit={validateAndProceed} className="space-y-10">

            {/* Event Type Cards */}
            <div>
              <EventTypeSelector
                selectedEventType={formData.eventType}
                onSelect={(type) => {
                  updateFormData({ eventType: type });
                  setError(null);
                }}
              />
              {error && (
                <p className="text-xs font-mono text-[#8C3A3A] pt-2">{error}</p>
              )}
            </div>

            {/* Split: Where Will It Take Place? vs When? */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-[#E8DFD3]">

              {/* Event Location */}
              <div className="space-y-6">
                <label className="block font-mono text-xs font-semibold tracking-[0.2em] text-[#1E1B18] uppercase">
                  WHERE WILL IT TAKE PLACE?
                </label>

                <div className="space-y-1.5">
                  <span className="block text-xs font-mono text-[#7A6E5D] uppercase">CITY / VENUE *</span>
                  <div className="flex items-center gap-2 border-b border-[#CBB9A4] focus-within:border-[#1E1B18] py-2 transition-colors">
                    <span className="text-[#685444] text-sm">📍</span>
                    <input
                      type="text"
                      value={formData.location || ''}
                      onChange={(e) => updateFormData({ location: e.target.value })}
                      placeholder="Mumbai, Maharashtra"
                      className="w-full bg-transparent text-base text-[#1E1B18] placeholder-[#8C8070] outline-none"
                      style={{ fontFamily: 'var(--font-sans)' }}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="block text-xs font-mono text-[#7A6E5D] uppercase">VENUE (optional)</span>
                  <input
                    type="text"
                    value={formData.venue || ''}
                    onChange={(e) => updateFormData({ venue: e.target.value })}
                    placeholder="e.g. The Taj Mahal Palace"
                    className="w-full bg-transparent border-b border-[#CBB9A4] focus:border-[#1E1B18] py-2 text-base text-[#1E1B18] placeholder-[#8C8070] outline-none transition-colors"
                    style={{ fontFamily: 'var(--font-sans)' }}
                  />
                </div>
              </div>

              {/* When & Duration */}
              <div className="space-y-6">
                <label className="block font-mono text-xs font-semibold tracking-[0.2em] text-[#1E1B18] uppercase">
                  WHEN?
                </label>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <span className="block text-xs font-mono text-[#7A6E5D] uppercase">EVENT DATE</span>
                    <input
                      type="date"
                      value={formData.eventDate || ''}
                      onChange={(e) => updateFormData({ eventDate: e.target.value })}
                      className="w-full bg-transparent border-b border-[#CBB9A4] focus:border-[#1E1B18] py-2 text-sm text-[#1E1B18] font-mono outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <span className="block text-xs font-mono text-[#7A6E5D] uppercase">NUMBER OF DAYS</span>
                    <select
                      value={formData.days || '2 Days'}
                      onChange={(e) => updateFormData({ days: e.target.value })}
                      className="w-full bg-transparent border-b border-[#CBB9A4] focus:border-[#1E1B18] py-2 text-sm text-[#1E1B18] outline-none cursor-pointer"
                    >
                      {DAYS_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Services Pills */}
                <div className="pt-2">
                  <ServiceSelector
                    selectedServices={formData.services || []}
                    onToggleService={handleToggleService}
                  />
                </div>
              </div>

            </div>

            {/* Bottom-right NEXT STEP → */}
            <div className="flex justify-end pt-8">
              <button
                type="submit"
                className="inline-flex items-center gap-3 bg-[#685444] hover:bg-[#524133] text-[#FAF8F5] px-9 py-4 rounded-full font-mono text-xs font-semibold uppercase tracking-[0.2em] transition-all duration-300 shadow-[0_8px_20px_-4px_rgba(104,84,68,0.35)] cursor-pointer group"
              >
                <span>NEXT STEP</span>
                <span className="transform transition-transform duration-300 group-hover:translate-x-1">→</span>
              </button>
            </div>

          </form>
        </div>

      </div>
    </motion.div>
  );
}
