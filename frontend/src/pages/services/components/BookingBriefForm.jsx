import React, { useState } from 'react';
import {
  DURATION_OPTIONS,
  CREATIVE_DISCIPLINES,
  PROVENANCE_OPTIONS,
  COUNTRY_CODES,
  COLLECTIONS,
} from '../data/servicesData';

export default function BookingBriefForm({
  formData,
  updateFormData,
  selectedCollection,
  selectedCategory,
  onScrollToCollections,
  onSelectCollection,
  categoryCollections,
  onSubmit,
  isSubmitting,
}) {
  const [errors, setErrors] = useState({});

  const celebrationTypes = [
    'Wedding',
    'Pre-Wedding',
    'Portrait',
    'Birthday / Milestone',
    'Private Event',
    'Commercial',
  ];

  // Derive available tiers for the active category
  const availableTiers =
    categoryCollections && categoryCollections.length > 0
      ? categoryCollections
      : COLLECTIONS.filter((c) => c.category === selectedCategory).length > 0
      ? COLLECTIONS.filter((c) => c.category === selectedCategory)
      : COLLECTIONS.slice(0, 3);

  const handleToggleDiscipline = (id) => {
    const current = formData.disciplines || ['fine-art-photo', 'archival-album'];
    if (current.includes(id)) {
      updateFormData({ disciplines: current.filter((item) => item !== id) });
    } else {
      updateFormData({ disciplines: [...current, id] });
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Full name is required';
    }
    if (!formData.email?.trim()) {
      newErrors.email = 'Primary email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please provide a valid email';
    }
    if (!formData.phone?.trim()) {
      newErrors.phone = 'Phone / WhatsApp is required';
    }
    if (!formData.eventDate) {
      newErrors.eventDate = 'Target event date is required';
    }
    if (!formData.location?.trim()) {
      newErrors.location = 'Location & venue is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const el = document.getElementById('booking-form-top');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    setErrors({});
    onSubmit();
  };

  const currentDisciplines = formData.disciplines || ['fine-art-photo', 'archival-album'];

  return (
    <form
      id="booking-form-top"
      onSubmit={handleFormSubmit}
      className="bg-transparent"
    >
      {/* =========================================================
          SECTION 01: YOUR DETAILS
          ========================================================= */}
      <section
        style={{
          paddingBottom: '40px',
          marginBottom: '40px',
          borderBottom: '1px solid #E3DBCC',
        }}
      >
        {/* Section Header */}
        <div style={{ marginBottom: '28px' }}>
          <div className="flex items-baseline justify-between gap-4">
            <h3
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '34px',
                lineHeight: 1.1,
                fontWeight: 400,
                color: 'var(--color-obsidian)',
                margin: 0,
              }}
            >
              01 YOUR DETAILS
            </h3>
            <span
              style={{
                fontSize: '13px',
                letterSpacing: '0.08em',
                color: '#7A7770',
                fontFamily: 'var(--font-sans)',
              }}
            >
              Required fields marked *
            </span>
          </div>
        </div>

        {/* Full Name */}
        <div style={{ marginBottom: '24px' }}>
          <label
            style={{
              display: 'block',
              marginBottom: '9px',
              fontSize: '11px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#55493A',
              fontWeight: 600,
              fontFamily: 'var(--font-sans)',
            }}
          >
            FULL NAME / COUPLE NAMES *
          </label>
          <input
            type="text"
            value={formData.name || ''}
            onChange={(e) => {
              updateFormData({ name: e.target.value });
              if (errors.name) setErrors((prev) => ({ ...prev, name: null }));
            }}
            placeholder="e.g., Katherine Bell & Henri Dubois"
            style={{
              width: '100%',
              height: '50px',
              padding: '0 16px',
              border: '1px solid #E3DBCC',
              borderRadius: '8px',
              background: '#FDFCF8',
              fontSize: '15px',
              color: '#101010',
            }}
            className="outline-none transition-colors focus:border-[#101010] placeholder-[#A59C8F]"
          />
          {errors.name && (
            <p className="font-sans text-xs text-[#992E2E] mt-1.5">{errors.name}</p>
          )}
        </div>

        {/* Email & Phone Two-Field Row (20px gap) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '20px',
          }}
        >
          <div>
            <label
              style={{
                display: 'block',
                marginBottom: '9px',
                fontSize: '11px',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#55493A',
                fontWeight: 600,
                fontFamily: 'var(--font-sans)',
              }}
            >
              PRIMARY EMAIL *
            </label>
            <input
              type="email"
              value={formData.email || ''}
              onChange={(e) => {
                updateFormData({ email: e.target.value });
                if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
              }}
              placeholder="atelier@domain.com"
              style={{
                width: '100%',
                height: '50px',
                padding: '0 16px',
                border: '1px solid #E3DBCC',
                borderRadius: '8px',
                background: '#FDFCF8',
                fontSize: '15px',
                color: '#101010',
              }}
              className="outline-none transition-colors focus:border-[#101010] placeholder-[#A59C8F]"
            />
            {errors.email && (
              <p className="font-sans text-xs text-[#992E2E] mt-1.5">{errors.email}</p>
            )}
          </div>

          <div>
            <label
              style={{
                display: 'block',
                marginBottom: '9px',
                fontSize: '11px',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#55493A',
                fontWeight: 600,
                fontFamily: 'var(--font-sans)',
              }}
            >
              PHONE / WHATSAPP *
            </label>
            <div className="flex gap-2">
              <select
                value={formData.countryCode || '+91'}
                onChange={(e) => updateFormData({ countryCode: e.target.value })}
                style={{
                  height: '50px',
                  padding: '0 12px',
                  border: '1px solid #E3DBCC',
                  borderRadius: '8px',
                  background: '#FDFCF8',
                  fontSize: '14px',
                  color: '#101010',
                }}
                className="outline-none transition-colors focus:border-[#101010] shrink-0 cursor-pointer"
              >
                {COUNTRY_CODES.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.code} ({item.country})
                  </option>
                ))}
              </select>

              <input
                type="tel"
                value={formData.phone || ''}
                onChange={(e) => {
                  updateFormData({ phone: e.target.value });
                  if (errors.phone) setErrors((prev) => ({ ...prev, phone: null }));
                }}
                placeholder="98765 43210"
                style={{
                  width: '100%',
                  height: '50px',
                  padding: '0 16px',
                  border: '1px solid #E3DBCC',
                  borderRadius: '8px',
                  background: '#FDFCF8',
                  fontSize: '15px',
                  color: '#101010',
                }}
                className="outline-none transition-colors focus:border-[#101010] placeholder-[#A59C8F]"
              />
            </div>
            {errors.phone && (
              <p className="font-sans text-xs text-[#992E2E] mt-1.5">{errors.phone}</p>
            )}
          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION 02: YOUR EVENT
          ========================================================= */}
      <section
        style={{
          paddingBottom: '40px',
          marginBottom: '40px',
          borderBottom: '1px solid #E3DBCC',
        }}
      >
        {/* Section Header */}
        <div style={{ marginBottom: '28px' }}>
          <div className="flex items-baseline justify-between gap-4">
            <h3
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '34px',
                lineHeight: 1.1,
                fontWeight: 400,
                color: 'var(--color-obsidian)',
                margin: 0,
              }}
            >
              02 YOUR EVENT
            </h3>
            <span
              style={{
                fontSize: '13px',
                letterSpacing: '0.08em',
                color: '#7A7770',
                fontFamily: 'var(--font-sans)',
              }}
            >
              Chronicle &amp; Destination
            </span>
          </div>
        </div>

        {/* Celebration Type Selectable Pills */}
        <div style={{ marginBottom: '24px' }}>
          <label
            style={{
              display: 'block',
              marginBottom: '9px',
              fontSize: '11px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#55493A',
              fontWeight: 600,
              fontFamily: 'var(--font-sans)',
            }}
          >
            TYPE OF CELEBRATION / ASSIGNMENT
          </label>
          <div className="flex flex-wrap gap-2.5">
            {celebrationTypes.map((type) => {
              const isSelected = (formData.eventType || 'Wedding') === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => updateFormData({ eventType: type })}
                  style={{
                    padding: '12px 18px',
                    minHeight: '44px',
                    borderRadius: '999px',
                    border: isSelected ? '1px solid #101010' : '1px solid #E3DBCC',
                    background: isSelected ? '#101010' : '#FDFCF8',
                    color: isSelected ? '#FDFCF8' : '#101010',
                    fontSize: '13px',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-sans)',
                    transition: 'all 200ms ease',
                  }}
                  className="hover:-translate-y-0.5 shadow-2xs"
                >
                  {type}
                </button>
              );
            })}
          </div>
        </div>

        {/* Target Event Date + Duration Two-Field Row (20px gap) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '20px',
            marginBottom: '24px',
          }}
        >
          <div>
            <label
              style={{
                display: 'block',
                marginBottom: '9px',
                fontSize: '11px',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#55493A',
                fontWeight: 600,
                fontFamily: 'var(--font-sans)',
              }}
            >
              TARGET EVENT DATE *
            </label>
            <input
              type="date"
              value={formData.eventDate || ''}
              onChange={(e) => {
                updateFormData({ eventDate: e.target.value });
                if (errors.eventDate) setErrors((prev) => ({ ...prev, eventDate: null }));
              }}
              style={{
                width: '100%',
                height: '50px',
                padding: '0 16px',
                border: '1px solid #E3DBCC',
                borderRadius: '8px',
                background: '#FDFCF8',
                fontSize: '15px',
                color: '#101010',
                fontFamily: 'monospace',
              }}
              className="outline-none transition-colors focus:border-[#101010] cursor-pointer"
            />
            {errors.eventDate && (
              <p className="font-sans text-xs text-[#992E2E] mt-1.5">{errors.eventDate}</p>
            )}
          </div>

          <div>
            <label
              style={{
                display: 'block',
                marginBottom: '9px',
                fontSize: '11px',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#55493A',
                fontWeight: 600,
                fontFamily: 'var(--font-sans)',
              }}
            >
              DURATION
            </label>
            <div className="flex gap-2">
              {DURATION_OPTIONS.map((dur) => {
                const isSelected = (formData.duration || '2 Days') === dur;
                return (
                  <button
                    key={dur}
                    type="button"
                    onClick={() => updateFormData({ duration: dur })}
                    style={{
                      flex: 1,
                      height: '50px',
                      borderRadius: '8px',
                      border: isSelected ? '1px solid #101010' : '1px solid #E3DBCC',
                      background: isSelected ? '#101010' : '#FDFCF8',
                      color: isSelected ? '#FDFCF8' : '#101010',
                      fontSize: '13px',
                      fontWeight: 600,
                      letterSpacing: '0.04em',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-sans)',
                      transition: 'all 200ms ease',
                    }}
                  >
                    {dur}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Location & Venue */}
        <div style={{ marginBottom: '0' }}>
          <label
            style={{
              display: 'block',
              marginBottom: '9px',
              fontSize: '11px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#55493A',
              fontWeight: 600,
              fontFamily: 'var(--font-sans)',
            }}
          >
            LOCATION, CITY, &amp; VENUE NAME *
          </label>
          <input
            type="text"
            value={formData.location || ''}
            onChange={(e) => {
              updateFormData({ location: e.target.value });
              if (errors.location) setErrors((prev) => ({ ...prev, location: null }));
            }}
            placeholder="e.g., Villa Balbiano, Lake Como, Italy or Umaid Bhawan, Jodhpur"
            style={{
              width: '100%',
              height: '50px',
              padding: '0 16px',
              border: '1px solid #E3DBCC',
              borderRadius: '8px',
              background: '#FDFCF8',
              fontSize: '15px',
              color: '#101010',
            }}
            className="outline-none transition-colors focus:border-[#101010] placeholder-[#A59C8F]"
          />
          {errors.location && (
            <p className="font-sans text-xs text-[#992E2E] mt-1.5">{errors.location}</p>
          )}
        </div>
      </section>

      {/* =========================================================
          SECTION 03: YOUR PREFERENCES
          ========================================================= */}
      <section
        style={{
          paddingBottom: '40px',
          marginBottom: '40px',
          borderBottom: '1px solid #E3DBCC',
        }}
      >
        {/* Section Header */}
        <div style={{ marginBottom: '28px' }}>
          <div className="flex items-baseline justify-between gap-4">
            <h3
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '34px',
                lineHeight: 1.1,
                fontWeight: 400,
                color: 'var(--color-obsidian)',
                margin: 0,
              }}
            >
              03 YOUR PREFERENCES
            </h3>
            <span
              style={{
                fontSize: '13px',
                letterSpacing: '0.08em',
                color: '#7A7770',
                fontFamily: 'var(--font-sans)',
              }}
            >
              Curated Suite &amp; Disciplines
            </span>
          </div>
        </div>

        {/* 10. COLLECTION / PLAN SELECTION CARDS */}
        <div style={{ marginBottom: '32px' }}>
          <label
            style={{
              display: 'block',
              marginBottom: '12px',
              fontSize: '11px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#55493A',
              fontWeight: 600,
              fontFamily: 'var(--font-sans)',
            }}
          >
            SELECT COLLECTION SUITE
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {availableTiers.map((tier) => {
              const isChosen = selectedCollection?.id === tier.id;
              return (
                <div
                  key={tier.id}
                  onClick={() => onSelectCollection && onSelectCollection(tier.id)}
                  style={{
                    padding: '22px',
                    minHeight: '120px',
                    border: isChosen ? '1.5px solid #101010' : '1px solid #E3DBCC',
                    borderRadius: '12px',
                    background: isChosen ? '#F3F0E9' : '#FDFCF8',
                    cursor: 'pointer',
                    transition: 'all 200ms ease',
                  }}
                  className="flex flex-col justify-between hover:shadow-xs group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="block font-serif text-lg font-medium text-[#101010] uppercase">
                        {tier.title}
                      </span>
                      <span className="block font-sans text-xs text-[#7A7770] mt-0.5">
                        {tier.folio || tier.tag}
                      </span>
                    </div>

                    {/* Radio / Select Indicator */}
                    <div
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '999px',
                        border: isChosen ? '5px solid #101010' : '1.5px solid #C5B9A5',
                        background: '#FDFCF8',
                        flexShrink: 0,
                      }}
                    />
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#E3DBCC]/60 flex items-baseline justify-between">
                    <span className="font-serif text-[15px] font-semibold text-[#101010]">
                      {tier.price}
                    </span>
                    {tier.specs?.[0]?.title && (
                      <span className="font-sans text-[10px] text-[#7A7770]">
                        {tier.specs[0].title}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 11. CREATIVE DISCIPLINES CARDS (2-column grid, 16px gap, 22px padding) */}
        <div>
          <label
            style={{
              display: 'block',
              marginBottom: '12px',
              fontSize: '11px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#55493A',
              fontWeight: 600,
              fontFamily: 'var(--font-sans)',
            }}
          >
            SELECT CREATIVE DISCIPLINES REQUIRED
          </label>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '16px',
            }}
          >
            {CREATIVE_DISCIPLINES.map((disc) => {
              const checked = currentDisciplines.includes(disc.id);
              return (
                <div
                  key={disc.id}
                  onClick={() => handleToggleDiscipline(disc.id)}
                  style={{
                    padding: '22px',
                    minHeight: '130px',
                    border: checked ? '1.5px solid #101010' : '1px solid #E3DBCC',
                    borderRadius: '12px',
                    background: checked ? '#FAF8F5' : '#FDFCF8',
                    cursor: 'pointer',
                    transition: 'all 200ms ease',
                  }}
                  className="flex flex-col justify-between hover:shadow-xs"
                >
                  <div className="flex items-start gap-4">
                    {/* Checkbox (20px x 20px with >= 16px space to text) */}
                    <div
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '4px',
                        border: checked ? 'none' : '1.5px solid #C5B9A5',
                        background: checked ? '#101010' : '#FDFCF8',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: '2px',
                      }}
                    >
                      {checked && (
                        <span className="text-white text-xs font-bold leading-none">✓</span>
                      )}
                    </div>

                    <div className="flex-1">
                      <h4
                        style={{
                          fontSize: '21px',
                          marginBottom: '10px',
                          fontFamily: 'var(--font-serif)',
                          color: '#101010',
                          lineHeight: 1.15,
                          fontWeight: 500,
                        }}
                      >
                        {disc.title}
                      </h4>
                      <p
                        style={{
                          lineHeight: 1.5,
                          fontSize: '12.5px',
                          color: '#7A7770',
                          fontFamily: 'var(--font-sans)',
                        }}
                      >
                        {disc.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Status Badge positioned naturally inside card */}
                  <div className="mt-4 pt-2.5 border-t border-[#E3DBCC]/40 flex justify-end">
                    <span
                      style={{
                        fontSize: '10px',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        fontWeight: 600,
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontFamily: 'var(--font-sans)',
                        background: disc.isIncluded ? '#EDE4D6' : '#F3F0E9',
                        color: disc.isIncluded ? '#55493A' : '#7A7770',
                      }}
                    >
                      {disc.isIncluded ? 'INCLUDED IN SUITE' : '+ BESPOKE ADD-ON'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION 04: YOUR VISION
          ========================================================= */}
      <section
        style={{
          paddingBottom: '40px',
          marginBottom: '40px',
          borderBottom: '1px solid #E3DBCC',
        }}
      >
        {/* Section Header */}
        <div style={{ marginBottom: '28px' }}>
          <div className="flex items-baseline justify-between gap-4">
            <h3
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '34px',
                lineHeight: 1.1,
                fontWeight: 400,
                color: 'var(--color-obsidian)',
                margin: 0,
              }}
            >
              04 YOUR VISION
            </h3>
            <span
              style={{
                fontSize: '13px',
                letterSpacing: '0.08em',
                color: '#7A7770',
                fontFamily: 'var(--font-sans)',
              }}
            >
              Atmosphere &amp; Nuances
            </span>
          </div>
        </div>

        <div>
          <label
            style={{
              display: 'block',
              marginBottom: '9px',
              fontSize: '11px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#55493A',
              fontWeight: 600,
              fontFamily: 'var(--font-sans)',
            }}
          >
            TELL US ABOUT YOUR CELEBRATION, AESTHETIC IDEAS, OR SPECIAL NUANCES
          </label>
          <textarea
            rows={4}
            value={formData.message || ''}
            onChange={(e) => updateFormData({ message: e.target.value })}
            placeholder="Describe the atmosphere, light, venue nuances, or meaningful family traditions. For example: candlelight dinner under olive trees, relaxed editorial styling, unposed moments, black tie dress code..."
            style={{
              width: '100%',
              minHeight: '150px',
              padding: '18px',
              border: '1px solid #E3DBCC',
              borderRadius: '10px',
              background: '#FDFCF8',
              fontSize: '14px',
              lineHeight: 1.6,
              color: '#101010',
            }}
            className="outline-none transition-colors focus:border-[#101010] placeholder-[#A59C8F]"
          />
        </div>
      </section>

      {/* =========================================================
          SECTION 05: HOW DID YOU FIND US?
          ========================================================= */}
      <section
        style={{
          paddingBottom: '40px',
          marginBottom: '40px',
          borderBottom: '1px solid #E3DBCC',
        }}
      >
        {/* Section Header */}
        <div style={{ marginBottom: '28px' }}>
          <div className="flex items-baseline justify-between gap-4">
            <h3
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '34px',
                lineHeight: 1.1,
                fontWeight: 400,
                color: 'var(--color-obsidian)',
                margin: 0,
              }}
            >
              05 HOW DID YOU FIND US?
            </h3>
            <span
              style={{
                fontSize: '13px',
                letterSpacing: '0.08em',
                color: '#7A7770',
                fontFamily: 'var(--font-sans)',
              }}
            >
              Provenance
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {PROVENANCE_OPTIONS.map((item) => {
            const isSelected = (formData.source || 'Instagram') === item;
            return (
              <button
                key={item}
                type="button"
                onClick={() => updateFormData({ source: item })}
                style={{
                  padding: '10px 16px',
                  borderRadius: '999px',
                  border: isSelected ? '1px solid #101010' : '1px solid #E3DBCC',
                  background: isSelected ? '#101010' : '#FDFCF8',
                  color: isSelected ? '#FDFCF8' : '#101010',
                  fontSize: '12.5px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-sans)',
                  transition: 'all 200ms ease',
                }}
                className="hover:-translate-y-0.5 shadow-2xs"
              >
                {item}
              </button>
            );
          })}
        </div>
      </section>

      {/* =========================================================
          14. SUBMIT / WHATSAPP BUTTON (Never disappears, large premium CTA)
          ========================================================= */}
      <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <button
          type="button"
          onClick={onScrollToCollections}
          className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-[#7A7770] hover:text-[#101010] flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <span>←</span>
          <span>RETURN TO COLLECTIONS</span>
        </button>

        <div className="w-full sm:w-auto flex flex-col items-start sm:items-end">
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              minWidth: '280px',
              height: '54px',
              padding: '0 28px',
              borderRadius: '999px',
              background: '#101010',
              color: '#FDFCF8',
              fontSize: '12.5px',
              fontWeight: 600,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              transition: 'all 250ms ease',
            }}
            className="w-full sm:w-auto hover:-translate-y-0.5 hover:bg-[#262422] shadow-md group"
          >
            <span>SUBMIT &amp; CONTINUE TO WHATSAPP</span>
            <span className="transform transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>
          </button>

          <p
            style={{
              marginTop: '14px',
              fontSize: '12px',
              color: '#7A7770',
              fontFamily: 'var(--font-sans)',
            }}
          >
            Submitting opens a pre-composed WhatsApp brief directly with the atelier.
          </p>
        </div>
      </div>
    </form>
  );
}
