import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function AboutYouStep({
  formData,
  updateFormData,
  onNextStep,
}) {
  const [errors, setErrors] = useState({});

  const validateAndProceed = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.name || !formData.name.trim()) {
      newErrors.name = 'Please enter your full name';
    }
    if (!formData.email || !formData.email.trim()) {
      newErrors.email = 'Please enter your email address';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.phone || !formData.phone.trim()) {
      newErrors.phone = 'Please enter your phone/WhatsApp number';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
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

        {/* Left Column: Editorial Photo & Step Heading */}
        <div className="lg:col-span-5 flex flex-col items-start">
          {/* Editorial photograph of a bride/woman in warm natural light */}
          <div className="relative w-full max-w-[360px] aspect-[3/4] rounded-[2px] overflow-hidden shadow-[0_20px_50px_-10px_rgba(30,27,24,0.18)] border border-[#E0D8CA] mb-8 bg-[#ECE7DC]">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop"
              alt="Bride portrait in warm natural daylight"
              className="w-full h-full object-cover object-center filter brightness-[1.01]"
              loading="lazy"
            />
          </div>

          {/* Step Metadata & Title */}
          <span className="font-mono text-xs font-semibold tracking-[0.24em] text-[#7A6E5D] uppercase mb-2">
            STEP 01 ──
          </span>

          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.4rem, 3.6vw, 3.25rem)',
              lineHeight: 1.08,
              fontWeight: 400,
              color: '#1E1B18',
              marginBottom: '0.75rem',
            }}
          >
            A LITTLE
            <br />
            ABOUT YOU
          </h2>

          <p className="text-base font-sans text-[#554E44] mb-8">
            Let's start with the basics.
          </p>

          <div className="flex items-center gap-3 text-xs font-mono font-semibold tracking-[0.22em] text-[#7A6E5D] uppercase">
            <span className="w-10 h-[1px] bg-[#CBB9A4]" />
            <span>YOUR DETAILS</span>
          </div>
        </div>

        {/* Right Column: Thin-line Editorial Inputs (NO large rounded boxes) */}
        <div className="lg:col-span-7 bg-[#FAF9F6] p-6 sm:p-12 rounded-xl border border-[#E5DDD0] shadow-xs">
          <form onSubmit={validateAndProceed} className="space-y-10">

            {/* FULL NAME */}
            <div className="space-y-2">
              <label className="block font-mono text-xs font-semibold tracking-[0.2em] text-[#1E1B18] uppercase">
                FULL NAME *
              </label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => {
                  updateFormData({ name: e.target.value });
                  if (errors.name) setErrors((prev) => ({ ...prev, name: null }));
                }}
                placeholder="Your full name"
                className="w-full bg-transparent border-b border-[#CBB9A4] focus:border-[#1E1B18] py-3 text-lg text-[#1E1B18] placeholder-[#8C8070] outline-none transition-colors"
                style={{ fontFamily: 'var(--font-serif)' }}
              />
              {errors.name && (
                <p className="text-xs font-mono text-[#8C3A3A] pt-1">{errors.name}</p>
              )}
            </div>

            {/* EMAIL ADDRESS */}
            <div className="space-y-2">
              <label className="block font-mono text-xs font-semibold tracking-[0.2em] text-[#1E1B18] uppercase">
                EMAIL ADDRESS *
              </label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => {
                  updateFormData({ email: e.target.value });
                  if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
                }}
                placeholder="you@example.com"
                className="w-full bg-transparent border-b border-[#CBB9A4] focus:border-[#1E1B18] py-3 text-lg text-[#1E1B18] placeholder-[#8C8070] outline-none transition-colors"
                style={{ fontFamily: 'var(--font-serif)' }}
              />
              {errors.email && (
                <p className="text-xs font-mono text-[#8C3A3A] pt-1">{errors.email}</p>
              )}
            </div>

            {/* PHONE / WHATSAPP */}
            <div className="space-y-2">
              <label className="block font-mono text-xs font-semibold tracking-[0.2em] text-[#1E1B18] uppercase">
                PHONE / WHATSAPP *
              </label>
              <div className="flex items-center gap-3 border-b border-[#CBB9A4] focus-within:border-[#1E1B18] py-2 transition-colors">
                <select
                  value={formData.countryCode || '+91'}
                  onChange={(e) => updateFormData({ countryCode: e.target.value })}
                  className="bg-[#EFE9DF] font-mono text-xs font-semibold text-[#1E1B18] px-3 py-1.5 rounded outline-none cursor-pointer border border-[#D5CBB9]"
                >
                  <option value="+91">+91 (IN)</option>
                  <option value="+1">+1 (US)</option>
                  <option value="+44">+44 (UK)</option>
                  <option value="+971">+971 (UAE)</option>
                  <option value="+33">+33 (FR)</option>
                  <option value="+61">+61 (AU)</option>
                </select>
                <input
                  type="tel"
                  value={formData.phone || ''}
                  onChange={(e) => {
                    updateFormData({ phone: e.target.value });
                    if (errors.phone) setErrors((prev) => ({ ...prev, phone: null }));
                  }}
                  placeholder="Your phone number"
                  className="w-full bg-transparent py-1 text-lg text-[#1E1B18] placeholder-[#8C8070] outline-none"
                  style={{ fontFamily: 'var(--font-serif)' }}
                />
              </div>
              {errors.phone && (
                <p className="text-xs font-mono text-[#8C3A3A] pt-1">{errors.phone}</p>
              )}
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
