import React, { useState } from 'react';
import {
  DURATION_OPTIONS,
  CREATIVE_DISCIPLINES,
  PROVENANCE_OPTIONS,
  COUNTRY_CODES,
} from '../data/servicesData';
import { handleWhatsAppSubmit } from '../../../utils/whatsapp';
import { handleEmailSubmit } from '../../../utils/email';
import LocationSearchInput from './LocationSearchInput';

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

  const handleToggleDiscipline = (id) => {
    const current = formData.disciplines || ['fine-art-photo', 'archival-album'];
    if (current.includes(id)) {
      updateFormData({ disciplines: current.filter((item) => item !== id) });
    } else {
      updateFormData({ disciplines: [...current, id] });
    }
  };

  const handleFormSubmit = (e, channel = 'whatsapp') => {
    if (e && e.preventDefault) e.preventDefault();
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
      const firstErrorKey = Object.keys(newErrors)[0];
      const targetEl = document.getElementById(`booking-field-${firstErrorKey}`);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        targetEl.focus();
      } else {
        const el = document.getElementById('booking-form-top');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    setErrors({});
    if (onSubmit) {
      onSubmit(channel);
    } else {
      if (channel === 'email') {
        handleEmailSubmit({ formData, selectedCollection });
      } else {
        handleWhatsAppSubmit({ formData, selectedCollection });
      }
    }
  };

  const currentDisciplines = formData.disciplines || ['fine-art-photo', 'archival-album'];

  const availableTiers =
    Array.isArray(categoryCollections) && categoryCollections.length > 0
      ? categoryCollections
      : (selectedCollection ? [selectedCollection] : []);

  return (
    <form
      id="booking-form-top"
      onSubmit={handleFormSubmit}
      className="bg-transparent"
    >
      {/* =========================================================
          SECTION 01: YOUR DETAILS
          - 64px vertical space between end of section & next heading
          ========================================================= */}
      <section
        data-testid="form-section-01"
        style={{
          paddingBottom: '32px',
          marginBottom: '64px',
          borderBottom: '1px solid #E3DBCC',
        }}
      >
        {/* Section Header: 24px gap below before first field */}
        <div style={{ marginBottom: '24px' }}>
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

        {/* Full Name: 8px label->input, 28px bottom margin */}
        <div style={{ marginBottom: '28px' }}>
          <label
            style={{
              display: 'block',
              marginBottom: '8px',
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
            id="booking-field-name"
            type="text"
            value={formData.name || ''}
            onChange={(e) => {
              updateFormData({ name: e.target.value });
              if (errors.name) setErrors((prev) => ({ ...prev, name: null }));
            }}
            placeholder="e.g., Katherine Bell & Henri Dubois"
            style={{
              width: '100%',
              minHeight: '52px',
              padding: '14px 16px',
              border: '1px solid #E3DBCC',
              borderRadius: '8px',
              background: '#FDFCF8',
              fontSize: '15px',
              color: '#101010',
              boxSizing: 'border-box',
            }}
            className="outline-none transition-colors focus:border-[#101010] placeholder-[#A59C8F]"
          />
          {errors.name && (
            <p className="font-sans text-xs text-[#992E2E] mt-1.5">{errors.name}</p>
          )}
        </div>

        {/* Email & Phone Two-Field Row (24px horizontal gap, 52px matching height) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '24px',
          }}
        >
          <div>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
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
              id="booking-field-email"
              type="email"
              value={formData.email || ''}
              onChange={(e) => {
                updateFormData({ email: e.target.value });
                if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
              }}
              placeholder="atelier@domain.com"
              style={{
                width: '100%',
                minHeight: '52px',
                padding: '14px 16px',
                border: '1px solid #E3DBCC',
                borderRadius: '8px',
                background: '#FDFCF8',
                fontSize: '15px',
                color: '#101010',
                boxSizing: 'border-box',
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
                marginBottom: '8px',
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
                  minHeight: '52px',
                  padding: '14px 12px',
                  border: '1px solid #E3DBCC',
                  borderRadius: '8px',
                  background: '#FDFCF8',
                  fontSize: '14px',
                  color: '#101010',
                  boxSizing: 'border-box',
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
                id="booking-field-phone"
                type="tel"
                value={formData.phone || ''}
                onChange={(e) => {
                  updateFormData({ phone: e.target.value });
                  if (errors.phone) setErrors((prev) => ({ ...prev, phone: null }));
                }}
                placeholder="98765 43210"
                style={{
                  width: '100%',
                  minHeight: '52px',
                  padding: '14px 16px',
                  border: '1px solid #E3DBCC',
                  borderRadius: '8px',
                  background: '#FDFCF8',
                  fontSize: '15px',
                  color: '#101010',
                  boxSizing: 'border-box',
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
          - 64px vertical space between end of section & next heading
          ========================================================= */}
      <section
        data-testid="form-section-02"
        style={{
          paddingBottom: '32px',
          marginBottom: '64px',
          borderBottom: '1px solid #E3DBCC',
        }}
      >
        {/* Section Header: 24px gap below before first field */}
        <div style={{ marginBottom: '24px' }}>
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

        {/* Celebration Type Selectable Pills: 12px gap, 12px x 20px padding, 28px bottom */}
        <div style={{ marginBottom: '28px' }}>
          <label
            style={{
              display: 'block',
              marginBottom: '8px',
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
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            {celebrationTypes.map((type) => {
              const isSelected = (formData.eventType || 'Wedding') === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => updateFormData({ eventType: type })}
                  style={{
                    padding: '12px 20px',
                    minHeight: '46px',
                    borderRadius: '999px',
                    border: isSelected ? '1px solid #101010' : '1px solid #E3DBCC',
                    background: isSelected ? '#101010' : '#FDFCF8',
                    color: isSelected ? '#FDFCF8' : '#101010',
                    fontSize: '13px',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-sans)',
                    transition: 'all 200ms ease',
                    boxSizing: 'border-box',
                  }}
                  className="hover:-translate-y-0.5 shadow-2xs"
                >
                  {type}
                </button>
              );
            })}
          </div>
        </div>

        {/* Target Event Date + Duration Two-Field Row (24px gap, 28px bottom margin) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '24px',
            marginBottom: '28px',
          }}
        >
          <div>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
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
              id="booking-field-eventDate"
              type="date"
              value={formData.eventDate || ''}
              onChange={(e) => {
                updateFormData({ eventDate: e.target.value });
                if (errors.eventDate) setErrors((prev) => ({ ...prev, eventDate: null }));
              }}
              style={{
                width: '100%',
                minHeight: '52px',
                padding: '14px 16px',
                border: '1px solid #E3DBCC',
                borderRadius: '8px',
                background: '#FDFCF8',
                fontSize: '15px',
                color: '#101010',
                fontFamily: 'monospace',
                boxSizing: 'border-box',
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
                marginBottom: '8px',
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
            <div
              style={{
                display: 'flex',
                gap: '12px',
              }}
            >
              {DURATION_OPTIONS.map((dur) => {
                const isSelected = (formData.duration || '2 Days') === dur;
                return (
                  <button
                    key={dur}
                    type="button"
                    onClick={() => updateFormData({ duration: dur })}
                    style={{
                      flex: 1,
                      minHeight: '52px',
                      padding: '12px 16px',
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
                      boxSizing: 'border-box',
                    }}
                  >
                    {dur}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Location & Venue: 8px label->input */}
        <div>
          <label
            style={{
              display: 'block',
              marginBottom: '8px',
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
          <LocationSearchInput
            value={formData.location || ''}
            coordinates={formData.coordinates}
            onChangeLocation={(data) => {
              updateFormData({
                location: data.location,
                coordinates: data.coordinates,
                venue: data.venue,
              });
              if (errors.location) setErrors((prev) => ({ ...prev, location: null }));
            }}
            error={errors.location}
          />
        </div>
      </section>

      {/* =========================================================
          SECTION 03: YOUR PREFERENCES
          - 64px vertical space between end of section & next heading
          ========================================================= */}
      <section
        data-testid="form-section-03"
        style={{
          paddingBottom: '32px',
          marginBottom: '64px',
          borderBottom: '1px solid #E3DBCC',
        }}
      >
        {/* Section Header: 24px gap below before first field */}
        <div style={{ marginBottom: '24px' }}>
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

        {/* COLLECTION SUITE CARDS: 32px padding, 20px gap, 28px bottom */}
        <div style={{ marginBottom: '28px' }}>
          <label
            style={{
              display: 'block',
              marginBottom: '8px',
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

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px',
            }}
          >
            {availableTiers.map((tier) => {
              const isChosen = selectedCollection?.id === tier.id;
              return (
                <div
                  key={tier.id}
                  data-testid={`collection-suite-card-${tier.id}`}
                  onClick={() => onSelectCollection && onSelectCollection(tier.id)}
                  style={{
                    padding: '32px',
                    minHeight: '140px',
                    border: isChosen ? '1.5px solid #101010' : '1px solid #E3DBCC',
                    borderRadius: '12px',
                    background: isChosen ? '#F3F0E9' : '#FDFCF8',
                    cursor: 'pointer',
                    transition: 'all 200ms ease',
                    boxSizing: 'border-box',
                  }}
                  className="flex flex-col justify-between hover:shadow-xs group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span
                        style={{ marginBottom: '8px' }}
                        className="block font-serif text-lg font-medium text-[#101010] uppercase"
                      >
                        {tier.title}
                      </span>
                      <span className="block font-sans text-xs text-[#7A7770]">
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

                  <div
                    style={{
                      marginTop: '16px',
                      paddingTop: '16px',
                      borderTop: '1px solid rgba(227, 219, 204, 0.6)',
                    }}
                    className="flex items-baseline justify-between"
                  >
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

        {/* CREATIVE DISCIPLINES CARDS: 32px padding, 20px gap */}
        <div>
          <label
            style={{
              display: 'block',
              marginBottom: '8px',
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
              gap: '20px',
            }}
          >
            {CREATIVE_DISCIPLINES.map((disc) => {
              const checked = currentDisciplines.includes(disc.id);
              return (
                <div
                  key={disc.id}
                  data-testid={`creative-discipline-card-${disc.id}`}
                  onClick={() => handleToggleDiscipline(disc.id)}
                  style={{
                    padding: '32px',
                    minHeight: '140px',
                    border: checked ? '1.5px solid #101010' : '1px solid #E3DBCC',
                    borderRadius: '12px',
                    background: checked ? '#FAF8F5' : '#FDFCF8',
                    cursor: 'pointer',
                    transition: 'all 200ms ease',
                    boxSizing: 'border-box',
                  }}
                  className="flex flex-col justify-between hover:shadow-xs"
                >
                  <div className="flex items-start gap-4">
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
                          marginBottom: '8px',
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
                          margin: 0,
                        }}
                      >
                        {disc.subtitle}
                      </p>
                    </div>
                  </div>

                  <div
                    style={{
                      marginTop: '16px',
                      paddingTop: '16px',
                      borderTop: '1px solid rgba(227, 219, 204, 0.4)',
                    }}
                    className="flex justify-end"
                  >
                    <span
                      style={{
                        fontSize: '10px',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        fontWeight: 600,
                        padding: '4px 10px',
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
          - 64px vertical space between end of section & next heading
          ========================================================= */}
      <section
        data-testid="form-section-04"
        style={{
          paddingBottom: '32px',
          marginBottom: '64px',
          borderBottom: '1px solid #E3DBCC',
        }}
      >
        {/* Section Header: 24px gap below before textarea */}
        <div style={{ marginBottom: '24px' }}>
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
              marginBottom: '8px',
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
              padding: '16px 18px',
              border: '1px solid #E3DBCC',
              borderRadius: '10px',
              background: '#FDFCF8',
              fontSize: '14px',
              lineHeight: 1.6,
              color: '#101010',
              boxSizing: 'border-box',
            }}
            className="outline-none transition-colors focus:border-[#101010] placeholder-[#A59C8F]"
          />
        </div>
      </section>

      {/* =========================================================
          SECTION 05: HOW DID YOU FIND US?
          - 64px vertical space between end of section & submit row
          ========================================================= */}
      <section
        data-testid="form-section-05"
        style={{
          paddingBottom: '32px',
          marginBottom: '64px',
          borderBottom: '1px solid #E3DBCC',
        }}
      >
        {/* Section Header: 24px gap below before pills */}
        <div style={{ marginBottom: '24px' }}>
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

        {/* Provenance Pills: 12px gap, 12px x 20px padding */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          {PROVENANCE_OPTIONS.map((item) => {
            const isSelected = (formData.source || 'Instagram') === item;
            return (
              <button
                key={item}
                type="button"
                onClick={() => updateFormData({ source: item })}
                style={{
                  padding: '12px 20px',
                  borderRadius: '999px',
                  border: isSelected ? '1px solid #101010' : '1px solid #E3DBCC',
                  background: isSelected ? '#101010' : '#FDFCF8',
                  color: isSelected ? '#FDFCF8' : '#101010',
                  fontSize: '13px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-sans)',
                  transition: 'all 200ms ease',
                  boxSizing: 'border-box',
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
          BOTTOM SUBMIT ROW
          - 24px space between Return link, Submit button, and explanatory text
          ========================================================= */}
      <div
        data-testid="bottom-submit-row"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px',
          paddingTop: '8px',
        }}
      >
        <button
          type="button"
          onClick={onScrollToCollections}
          className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-[#7A7770] hover:text-[#101010] flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <span>←</span>
          <span>RETURN TO COLLECTIONS</span>
        </button>

        <div className="w-full sm:w-auto flex flex-col items-stretch sm:items-end gap-3">
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            {/* 1. Submit & Continue to WhatsApp */}
            <button
              type="button"
              disabled={isSubmitting}
              onClick={(e) => handleFormSubmit(e, 'whatsapp')}
              style={{
                minWidth: '260px',
                minHeight: '52px',
                padding: '13px 24px',
                borderRadius: '999px',
                background: '#101010',
                color: '#FDFCF8',
                fontSize: '11.5px',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                border: '1.5px solid #101010',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                transition: 'all 250ms ease',
                boxSizing: 'border-box',
              }}
              className="w-full sm:w-auto hover:-translate-y-0.5 hover:bg-[#262422] shadow-md group"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#25D366]">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
              <span>SUBMIT &amp; CONTINUE TO WHATSAPP</span>
              <span className="transform transition-transform duration-200 group-hover:translate-x-1">→</span>
            </button>

            {/* 2. Submit & Continue to Email */}
            <button
              type="button"
              disabled={isSubmitting}
              onClick={(e) => handleFormSubmit(e, 'email')}
              style={{
                minWidth: '260px',
                minHeight: '52px',
                padding: '13px 24px',
                borderRadius: '999px',
                background: '#FAF8F5',
                color: '#101010',
                fontSize: '11.5px',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                border: '1.5px solid #101010',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                transition: 'all 250ms ease',
                boxSizing: 'border-box',
              }}
              className="w-full sm:w-auto hover:-translate-y-0.5 hover:bg-[#101010] hover:text-[#FAF8F5] shadow-sm group"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              <span>SUBMIT &amp; CONTINUE TO EMAIL</span>
              <span className="transform transition-transform duration-200 group-hover:translate-x-1">→</span>
            </button>
          </div>

          <p
            data-testid="submit-explanatory-text"
            style={{
              marginTop: '12px',
              fontSize: '12px',
              color: '#7A7770',
              fontFamily: 'var(--font-sans)',
            }}
          >
            Submitting instantly generates a pre-composed atelier brief via WhatsApp or your Email client.
          </p>
        </div>
      </div>
    </form>
  );
}
