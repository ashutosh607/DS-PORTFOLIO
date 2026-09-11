import React, { useState } from 'react';

export default function ObsidianCTA() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: 'Editorial & Commercial Campaign',
    timeline: 'Autumn 2026',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section
      id="contact"
      style={{
        backgroundColor: 'var(--color-obsidian)',
        color: 'var(--color-off-white)',
        padding: 'clamp(6rem, 12vw, 10rem) 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle Darkroom Glow Accent */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          right: '-10%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(227, 219, 204, 0.08) 0%, rgba(16, 16, 16, 0) 70%)',
          pointerEvents: 'none',
        }}
      />

      <div className="container">
        
        {/* Availability Live Badge */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.65rem',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.75rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--color-nude)',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(227, 219, 204, 0.25)',
              borderRadius: '999px',
              padding: '0.45rem 1.25rem',
            }}
          >
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: '#95C179', // Subtle sage green live dot
                boxShadow: '0 0 8px #95C179',
              }}
            />
            Commissions Open · 2026 / 2027 Calendar
          </span>
        </div>

        {/* Big Editorial Headline */}
        <div style={{ textAlign: 'center', maxWidth: '850px', margin: '0 auto clamp(3rem, 6vw, 5rem)' }}>
          <h2
            style={{
              color: 'var(--color-off-white)',
              fontSize: 'clamp(2.5rem, 5.5vw, 4.75rem)',
              lineHeight: 1.1,
              marginBottom: '1.5rem',
            }}
          >
            Let's compose something{' '}
            <span className="editorial-italic" style={{ color: 'var(--color-nude)' }}>
              unforgettable
            </span>{' '}
            together.
          </h2>
          <p
            style={{
              color: 'rgba(243, 240, 233, 0.75)',
              fontSize: '1.15rem',
              maxWidth: '600px',
              margin: '0 auto',
            }}
          >
            Whether commissioning an international campaign, spatial monograph, or private portrait folio, our atelier invites your inquiry.
          </p>
        </div>

        {/* Two-Column Grid: Left Studio Details / Right Fast Inquiry Panel */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'clamp(3rem, 6vw, 5rem)',
            alignItems: 'start',
          }}
        >
          {/* Left: Studio Locations & Direct Concierge Contacts */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            <div>
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.7rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'var(--color-nude)',
                  fontWeight: 600,
                  display: 'block',
                  marginBottom: '1.25rem',
                }}
              >
                Atelier Locations & Representation
              </span>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <h4 style={{ color: 'var(--color-off-white)', fontSize: '1.35rem', marginBottom: '0.25rem' }}>
                    Paris Atelier & Darkroom
                  </h4>
                  <p style={{ color: 'rgba(243, 240, 233, 0.65)', fontSize: '0.9rem' }}>
                    14 Rue de Beaujolais, Palais-Royal, 75001 Paris
                  </p>
                </div>

                <div>
                  <h4 style={{ color: 'var(--color-off-white)', fontSize: '1.35rem', marginBottom: '0.25rem' }}>
                    Zurich Studio
                  </h4>
                  <p style={{ color: 'rgba(243, 240, 233, 0.65)', fontSize: '0.9rem' }}>
                    Münstergasse 18, Altstadt, 8001 Zürich
                  </p>
                </div>

                <div>
                  <h4 style={{ color: 'var(--color-off-white)', fontSize: '1.35rem', marginBottom: '0.25rem' }}>
                    New York Agency
                  </h4>
                  <p style={{ color: 'rgba(243, 240, 233, 0.65)', fontSize: '0.9rem' }}>
                    84 Mercer Street, SoHo, New York, NY 10012
                  </p>
                </div>
              </div>
            </div>

            {/* Direct Line */}
            <div
              style={{
                borderTop: '1px solid rgba(227, 219, 204, 0.2)',
                paddingTop: '1.75rem',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.7rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'var(--color-nude)',
                  fontWeight: 600,
                  display: 'block',
                  marginBottom: '0.5rem',
                }}
              >
                Direct Commission Inquiries
              </span>
              <a
                href="mailto:atelier@maison-edouard.com"
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.75rem',
                  color: 'var(--color-off-white)',
                  textDecoration: 'none',
                  display: 'inline-block',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-nude)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-off-white)')}
              >
                atelier@maison-edouard.com
              </a>
            </div>
          </div>

          {/* Right: Fast Commission Consultation Form */}
          <div
            style={{
              backgroundColor: '#181818',
              border: '1px solid rgba(227, 219, 204, 0.2)',
              borderRadius: '24px',
              padding: 'clamp(2rem, 4vw, 3rem)',
              boxShadow: 'var(--shadow-deep)',
            }}
          >
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(227, 219, 204, 0.1)',
                    border: '1px solid var(--color-nude)',
                    color: 'var(--color-nude)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3 style={{ color: 'var(--color-off-white)', marginBottom: '0.75rem' }}>
                  Inquiry Received
                </h3>
                <p style={{ color: 'rgba(243, 240, 233, 0.7)', fontSize: '0.95rem', marginBottom: '2rem' }}>
                  Thank you for reaching out to Maison Édouard. Our studio director will review your project brief and reply within 24 business hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="btn-secondary"
                  style={{ backgroundColor: '#222', borderColor: 'rgba(227, 219, 204, 0.3)', color: 'var(--color-off-white)' }}
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <h3 style={{ color: 'var(--color-off-white)', fontSize: '1.65rem' }}>
                  Initiate a Commission
                </h3>

                <div>
                  <label
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.75rem',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: 'var(--color-nude)',
                      display: 'block',
                      marginBottom: '0.5rem',
                    }}
                  >
                    Your Name / Maison
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Lady Vivienne or Studio Kengo"
                    style={{
                      width: '100%',
                      padding: '0.85rem 1.15rem',
                      backgroundColor: '#202020',
                      border: '1px solid rgba(227, 219, 204, 0.25)',
                      borderRadius: '10px',
                      color: 'var(--color-off-white)',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.95rem',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.75rem',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: 'var(--color-nude)',
                      display: 'block',
                      marginBottom: '0.5rem',
                    }}
                  >
                    Contact Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@maison.com"
                    style={{
                      width: '100%',
                      padding: '0.85rem 1.15rem',
                      backgroundColor: '#202020',
                      border: '1px solid rgba(227, 219, 204, 0.25)',
                      borderRadius: '10px',
                      color: 'var(--color-off-white)',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.95rem',
                      outline: 'none',
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '0.75rem',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: 'var(--color-nude)',
                        display: 'block',
                        marginBottom: '0.5rem',
                      }}
                    >
                      Commission Scope
                    </label>
                    <select
                      value={formData.projectType}
                      onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.85rem 1rem',
                        backgroundColor: '#202020',
                        border: '1px solid rgba(227, 219, 204, 0.25)',
                        borderRadius: '10px',
                        color: 'var(--color-off-white)',
                        fontFamily: 'var(--font-sans)',
                        fontSize: '0.85rem',
                        outline: 'none',
                      }}
                    >
                      <option value="Editorial & Commercial Campaign">Editorial Campaign</option>
                      <option value="Architectural Archive">Architectural Archive</option>
                      <option value="The Monograph Edition">Private Monograph</option>
                      <option value="Fine Art Print Acquisition">Print Acquisition</option>
                    </select>
                  </div>

                  <div>
                    <label
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '0.75rem',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: 'var(--color-nude)',
                        display: 'block',
                        marginBottom: '0.5rem',
                      }}
                    >
                      Desired Window
                    </label>
                    <select
                      value={formData.timeline}
                      onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.85rem 1rem',
                        backgroundColor: '#202020',
                        border: '1px solid rgba(227, 219, 204, 0.25)',
                        borderRadius: '10px',
                        color: 'var(--color-off-white)',
                        fontFamily: 'var(--font-sans)',
                        fontSize: '0.85rem',
                        outline: 'none',
                      }}
                    >
                      <option value="Autumn 2026">Autumn 2026</option>
                      <option value="Winter 2026/27">Winter 2026/27</option>
                      <option value="Spring 2027">Spring 2027</option>
                      <option value="Immediate Rush (Subject to fee)">Immediate Rush</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.75rem',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: 'var(--color-nude)',
                      display: 'block',
                      marginBottom: '0.5rem',
                    }}
                  >
                    Project Details & Location
                  </label>
                  <textarea
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Briefly describe the spatial setting, editorial concept, or commission objectives..."
                    style={{
                      width: '100%',
                      padding: '0.85rem 1.15rem',
                      backgroundColor: '#202020',
                      border: '1px solid rgba(227, 219, 204, 0.25)',
                      borderRadius: '10px',
                      color: 'var(--color-off-white)',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.95rem',
                      outline: 'none',
                      resize: 'none',
                    }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    padding: '1rem',
                    borderRadius: '999px',
                    backgroundColor: 'var(--color-off-white)',
                    color: 'var(--color-obsidian)',
                    border: 'none',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.825rem',
                    fontWeight: 600,
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    marginTop: '0.5rem',
                    transition: 'all 0.25s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-nude)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-off-white)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  Transmit Commission Request
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
