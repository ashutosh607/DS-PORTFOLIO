import React from 'react';
import { motion } from 'framer-motion';
import BudgetSelector from './BudgetSelector';
import { SOURCE_OPTIONS } from '../data/servicesData';

export default function YourVisionStep({
  formData,
  updateFormData,
  onSubmit,
  isSubmitting,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  const handleMessageChange = (e) => {
    if (e.target.value.length <= 500) {
      updateFormData({ message: e.target.value });
    }
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

        {/* Left Column: Heading & Wide Cinematic Banquet Photo */}
        <div className="lg:col-span-4 flex flex-col items-start">
          <span className="font-mono text-xs font-semibold tracking-[0.24em] text-[#7A6E5D] uppercase mb-2">
            STEP 03 ──
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
            NOW, TELL US
            <br />
            YOUR VISION.
          </h2>

          <p className="text-base font-sans text-[#554E44] mb-8">
            The more you share, the better we can create something truly special for you.
          </p>

          {/* Wide cinematic photograph */}
          <div className="relative w-full aspect-[4/3] rounded-[2px] overflow-hidden shadow-[0_20px_50px_-10px_rgba(30,27,24,0.18)] border border-[#E0D8CA] bg-[#ECE7DC]">
            <img
              src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop"
              alt="Atmospheric candlelit evening reception banquet"
              className="w-full h-full object-cover object-center"
              loading="lazy"
            />
          </div>
        </div>

        {/* Right Column: Vision Form Fields */}
        <div className="lg:col-span-8 bg-[#FAF9F6] p-6 sm:p-12 rounded-xl border border-[#E5DDD0] shadow-xs relative">
          <form onSubmit={handleSubmit} className="space-y-10">

            {/* Budget Selector */}
            <BudgetSelector
              selectedBudget={formData.budget || '₹1L – ₹2L'}
              onSelectBudget={(tier) => updateFormData({ budget: tier })}
            />

            {/* Message / Tell Us More */}
            <div className="space-y-2">
              <label className="block font-mono text-xs font-semibold tracking-[0.2em] text-[#1E1B18] uppercase">
                TELL US MORE
              </label>

              <textarea
                rows={4}
                value={formData.message || ''}
                onChange={handleMessageChange}
                placeholder="Tell us about your event, your ideas, or anything else we should know..."
                className="w-full bg-white/70 border border-[#CBB9A4] rounded-lg p-4 text-base text-[#1E1B18] placeholder-[#8C8070] outline-none focus:border-[#1E1B18] transition-colors resize-none leading-relaxed"
                style={{ fontFamily: 'var(--font-sans)' }}
              />

              <div className="flex justify-end pt-1 text-xs font-mono text-[#7A6E5D]">
                {formData.message ? formData.message.length : 0}/500
              </div>
            </div>

            {/* How Did You Find Us? + Polaroid Accent */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pt-4 border-t border-[#E8DFD3]">
              {/* Pills */}
              <div className="md:col-span-8 space-y-3">
                <label className="block font-mono text-xs font-semibold tracking-[0.2em] text-[#1E1B18] uppercase">
                  HOW DID YOU FIND US?
                </label>

                <div className="flex flex-wrap gap-2.5">
                  {SOURCE_OPTIONS.map((source) => {
                    const isSelected = formData.source === source;

                    return (
                      <button
                        key={source}
                        type="button"
                        onClick={() => updateFormData({ source })}
                        className={`px-4 py-2 rounded-full text-xs font-medium tracking-wide transition-all duration-200 cursor-pointer border ${
                          isSelected
                            ? 'bg-[#685444] text-[#FAF8F5] border-[#685444] shadow-xs'
                            : 'bg-transparent text-[#38332C] border-[#C7BDAE] hover:border-[#8E8373]'
                        }`}
                      >
                        {source}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Floating Polaroid Accent with cursive note */}
              <div className="md:col-span-4 relative flex justify-center md:justify-end">
                <div
                  className="bg-white p-2.5 pb-6 shadow-[0_16px_35px_-8px_rgba(30,27,24,0.18)] border border-[#E0D8CA] rounded-[2px]"
                  style={{ transform: 'rotate(3deg)', maxWidth: '180px' }}
                >
                  <div className="aspect-[4/3] w-full overflow-hidden bg-[#ECE7DC] rounded-[1px] mb-2">
                    <img
                      src="https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=400&auto=format&fit=crop"
                      alt="Candlelit table details"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p
                    className="text-center text-[#554E44]"
                    style={{ fontFamily: 'Caveat, cursive', fontSize: '1.15rem', lineHeight: 1 }}
                  >
                    Every detail matters
                  </p>
                </div>
              </div>
            </div>

            {/* Final CTA: START THE CONVERSATION → */}
            <div className="flex justify-end pt-8 border-t border-[#E8DFD3]">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-3 bg-[#685444] hover:bg-[#524133] disabled:opacity-50 text-[#FAF8F5] px-10 py-4 sm:py-5 rounded-full font-mono text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] transition-all duration-300 shadow-[0_10px_25px_-5px_rgba(104,84,68,0.4)] hover:shadow-[0_16px_35px_-6px_rgba(104,84,68,0.5)] cursor-pointer group"
              >
                <span>{isSubmitting ? 'SENDING INQUIRY...' : 'START THE CONVERSATION'}</span>
                <span className="transform transition-transform duration-300 group-hover:translate-x-1.5">→</span>
              </button>
            </div>

          </form>
        </div>

      </div>
    </motion.div>
  );
}
