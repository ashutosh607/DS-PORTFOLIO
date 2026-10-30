import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircle, MapPin, Camera, Film, Heart, Shield, Sparkles } from 'lucide-react';
import SEOHead from '../../components/common/SEOHead';
import ScrollCardReveal from '../../components/common/ScrollCardReveal';
import {
  buildLocalBusinessSchema,
  buildBreadcrumbSchema,
  buildWebSiteSchema,
  buildServicesListSchema,
} from '../../utils/structuredData';
import { SEO_CONFIG } from '../../utils/seoConfig';

const MUMBAI_SERVICES = [
  {
    number: '01',
    badge: 'WEDDING MONOGRAPHS',
    h2Title: 'Wedding Photographer in Mumbai',
    subtitle: 'Sacred Rituals & Candid Moments',
    description:
      'From traditional South Mumbai heritage weddings to contemporary beachfront celebrations, we capture sacred rituals, tender glance exchanges, and spontaneous celebrations with an unobtrusive documentary eye and medium-format film aesthetic.',
    link: '/collections/weddings',
    linkLabel: 'Explore Wedding Collections',
    venues: 'The Taj Mahal Palace, St. Regis, JW Marriott Juhu, Alibaug coastal estates',
    image: '/images/wedding-photographer-in-mumbai-400w.webp',
    imageAlt: 'Candid wedding ceremony and bridal portrait in Mumbai by Dishant Shelar',
    imageTitle: 'Wedding Photographer in Mumbai – DS Photography & Films',
  },
  {
    number: '02',
    badge: 'COUPLE SESSIONS',
    h2Title: 'Pre-Wedding Photography in Mumbai',
    subtitle: 'Golden Hour Romance & Cinematic Films',
    description:
      'We craft intimate couple monographs and cinematic short films that narrate your connection naturally. Sessions are conducted across historic South Mumbai architecture, breezy coastal stretches, and quiet weekend retreats.',
    link: '/collections/pre-wedding',
    linkLabel: 'View Pre-Wedding Shoots',
    venues: 'Ballard Estate, Asiatic Steps, Marine Drive, Bandra Fort, Alibaug coastline',
    image: '/images/pre-wedding-photographer-mumbai-400w.webp',
    imageAlt: 'Pre-wedding couple session captured in Mumbai by photographer Dishant Shelar',
    imageTitle: 'Pre-Wedding Photographer in Mumbai – DS Photography & Films',
  },
  {
    number: '03',
    badge: 'EDITORIAL PORTRAITS',
    h2Title: 'Professional Portrait Photography',
    subtitle: 'Authentic Studio & Natural Light Monographs',
    description:
      'Nuanced lighting, sculptural shadows, and medium-format tonal depth. Ideal for artists, creative entrepreneurs, and personal monographs seeking authentic character over generic studio stiffness.',
    link: '/collections/portraits',
    linkLabel: 'View Portrait Monographs',
    venues: 'Daylight studio sessions & atmospheric outdoor architectural locations in Mumbai',
    image: '/images/portrait-photographer-mumbai.webp',
    imageAlt: 'Fine art portrait photography session in Mumbai by Dishant Shelar',
    imageTitle: 'Portrait Photographer in Mumbai – Dishant Shelar',
  },
  {
    number: '04',
    badge: 'EVENTS & COMMISSIONS',
    h2Title: 'Event & Commercial Photography in Mumbai',
    subtitle: 'Milestone Celebrations & Haute Brand Campaigns',
    description:
      'Atmospheric documentation of milestone birthdays, cultural soirées, luxury galas, and bespoke brand campaigns across Mumbai. We preserve the energy and refined spatial aesthetic of every gathering.',
    link: '/collections/events',
    linkLabel: 'Explore Event Portfolio',
    venues: 'Luxury banquets, private residences, boutique spaces across Mumbai',
    image: '/images/photographer-in-mumbai-dishant-shelar.webp',
    imageAlt: 'Dishant Shelar documenting luxury celebrations and events in Mumbai',
    imageTitle: 'Event & Commercial Photographer in Mumbai – DS Photography',
  },
];

const LOCAL_LOCATIONS = [
  {
    number: '01',
    area: 'South Mumbai Heritage District',
    description:
      'Victorian Gothic architecture, basalt stone facades, and tree-lined avenues of Ballard Estate, Fort, and the Asiatic Library. Timeless elegance for couple monographs and classic portraiture.',
  },
  {
    number: '02',
    area: 'Marine Drive & Seafront Promenades',
    description:
      'Sweeping coastal horizon lines, golden sunset illumination, and dramatic monsoon waves. Perfect for emotive couple portraits with natural movement and sea breeze.',
  },
  {
    number: '03',
    area: 'Bandra & North Mumbai Enclaves',
    description:
      'Old Portuguese villas, seaside promenades, and contemporary urban character. A blend of bohemian spirit and modern Mumbai lifestyle.',
  },
  {
    number: '04',
    area: 'Alibaug & Coastal Maharashtra Escapes',
    description:
      'A short boat ride across Mumbai harbor leads to secluded beachfronts, coconut groves, and private luxury villas. An idyllic setting for full-day destination pre-wedding shoots.',
  },
];

const CLIENT_TESTIMONIALS = [
  {
    quote:
      'Dishant captured our wedding in South Mumbai with extraordinary sensitivity. Looking through our gallery feels like stepping back into the exact emotion of the day. Unobtrusive, calm, and pure art.',
    client: 'Ananya & Kabir',
    event: 'Wedding at Taj Mahal Palace, Mumbai',
  },
  {
    quote:
      'For our pre-wedding shoot, Dishant knew the lighting across Mumbai better than anyone. He made us feel entirely natural in front of the lens. The final color grading is breathtaking.',
    client: 'Rhea & Dev',
    event: 'Pre-Wedding Shoot, Ballard Estate & Marine Drive',
  },
  {
    quote:
      'The portrait monograph Dishant created for my personal brand was exactly what I envisioned—timeless, sophisticated, and deeply honest. Highly recommended for anyone in Mumbai.',
    client: 'Vikram M.',
    event: 'Editorial Portrait Monograph, Mumbai Studio',
  },
];

const ATELIER_STANDARDS = [
  {
    icon: <Camera className="w-5 h-5 text-[#8C7764]" />,
    title: 'Direct Creative Leadership',
    text: 'Dishant Shelar personally directs and shoots principal coverage for every single atelier commission, guaranteeing uncompromising artistic quality.',
  },
  {
    icon: <Film className="w-5 h-5 text-[#8C7764]" />,
    title: 'Medium-Format Film Aesthetic',
    text: 'Soft highlight rolloff, organic texture, and subtle color palettes inspired by archival medium-format analog photography.',
  },
  {
    icon: <Heart className="w-5 h-5 text-[#8C7764]" />,
    title: 'Unobtrusive Documentary Observation',
    text: 'Quiet, observant documentation that allows you and your families to be fully present and enjoy your celebration freely.',
  },
  {
    icon: <Shield className="w-5 h-5 text-[#8C7764]" />,
    title: 'Archival Heirlooms & Delivery',
    text: 'Color-graded high-resolution digital master files and handcrafted Italian leather-bound albums delivered with precision.',
  },
];

export default function PhotographerInMumbaiPage({ onOpenInquiry }) {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Photographer in Mumbai', url: '/photographer-in-mumbai' },
  ];

  const landingPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${SEO_CONFIG.siteUrl}/photographer-in-mumbai#webpage`,
    url: `${SEO_CONFIG.siteUrl}/photographer-in-mumbai`,
    name: 'Photographer in Mumbai | Wedding & Portrait Photography – DS Photography & Films',
    description:
      'Professional photographer in Mumbai specializing in luxury weddings, candid pre-wedding shoots, and fine-art portraits by Dishant Shelar.',
    isPartOf: {
      '@id': `${SEO_CONFIG.siteUrl}/#website`,
    },
    about: {
      '@id': `${SEO_CONFIG.siteUrl}/#organization`,
    },
    inLanguage: 'en-IN',
  };

  return (
    <>
      <SEOHead
        title="Photographer in Mumbai | Wedding & Portrait Photography – DS Photography"
        description="Looking for a professional photographer in Mumbai? DS Photography & Films offers bespoke wedding, pre-wedding, and portrait photography by Dishant Shelar."
        keywords="photographer in mumbai, professional photographer in mumbai, wedding photographer in mumbai, best wedding photographer in mumbai, pre wedding photographer in mumbai, portrait photographer in mumbai, candid wedding photographer mumbai, photography studio in mumbai"
        canonicalUrl={`${SEO_CONFIG.siteUrl}/photographer-in-mumbai`}
        ogType="website"
        schema={[
          buildLocalBusinessSchema(`${SEO_CONFIG.siteUrl}/photographer-in-mumbai`),
          buildBreadcrumbSchema(breadcrumbs),
          landingPageSchema,
          buildServicesListSchema(),
        ]}
      />

      <main className="w-full bg-[#FDFCF8] text-[#101010] min-h-screen pt-28 sm:pt-36">
        
        {/* ===================================================================
            1. HERO SECTION: EDITORIAL INTRO & TARGET H1
            =================================================================== */}
        <section
          aria-label="Photographer in Mumbai Overview"
          className="w-full pb-20 sm:pb-24 border-b border-[#E3DBCC]"
        >
          <div className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-20 text-center">
            
            {/* Breadcrumb Navigation matching site standard */}
            <nav
              aria-label="Breadcrumbs"
              className="mb-8 inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em] text-[#625D55]"
            >
              <Link to="/" className="hover:text-[#101010] transition-colors">Home</Link>
              <span className="text-[#C5B9A5]">/</span>
              <span className="text-[#101010] font-semibold">Photographer in Mumbai</span>
            </nav>

            {/* Atelier Eyebrow */}
            <div className="flex items-center justify-center gap-3 mb-5">
              <span className="w-8 h-[1px] bg-[#C5B9A5]" aria-hidden="true" />
              <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-[#625D55] font-semibold">
                FINE ART PHOTOGRAPHY &amp; CINEMATOGRAPHY • MUMBAI
              </span>
              <span className="w-8 h-[1px] bg-[#C5B9A5]" aria-hidden="true" />
            </div>

            {/* Target Single H1 Heading */}
            <h1 className="font-serif text-[34px] sm:text-[50px] md:text-[62px] lg:text-[70px] text-[#101010] font-normal leading-[1.08] tracking-[-0.02em] max-w-5xl mx-auto mb-6">
              Photographer in Mumbai – DS Photography &amp; Films
            </h1>

            {/* Primary Content Paragraph */}
            <p className="text-[15px] sm:text-[17px] text-[#4A463F] max-w-3xl mx-auto leading-relaxed font-sans mb-10">
              DS Photography &amp; Films is an editorial wedding and portrait photography studio founded by lead photographer Dishant Shelar in Mumbai, Maharashtra. We document heartfelt ceremonies, intimate romance, and individual monographs with timeless tonality, unobtrusive presence, and cinematic light across Mumbai and destination venues worldwide.
            </p>

            {/* Native Studio Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => onOpenInquiry && onOpenInquiry()}
                className="btn-primary w-full sm:w-auto"
              >
                <span>Check Date Availability</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <a
                href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_PHONE || '919082378510'}?text=${encodeURIComponent("Hi Dishant, I'm inquiring about photography services in Mumbai.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary w-full sm:w-auto"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp Consultation</span>
              </a>

              <Link
                to="/collections"
                className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.16em] text-[#625D55] hover:text-[#101010] transition-colors font-semibold py-3 px-4"
              >
                <span>View Portfolio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* ===================================================================
            2. SERVICES GRID: WEDDINGS, PRE-WEDDINGS, PORTRAITS, EVENTS
            =================================================================== */}
        <section
          aria-label="Photography Services in Mumbai"
          className="w-full bg-[#FAF8F5] py-24 sm:py-32 border-b border-[#E3DBCC]"
        >
          <div className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-20">
            
            <div className="max-w-3xl mb-16 sm:mb-20">
              <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-[#625D55] block mb-3 font-semibold">
                CURATED COMMISSIONS • MUMBAI
              </span>
              <h2 className="font-serif text-[32px] sm:text-[44px] font-normal text-[#101010] leading-tight mb-4">
                Photography Disciplines Crafted in Mumbai
              </h2>
              <p className="text-[14px] sm:text-[15.5px] text-[#4A463F] leading-relaxed max-w-2xl font-sans">
                Every celebration and personal monograph is approached with quiet observation and artistic reverence. Explore our core photography disciplines across Mumbai.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              {MUMBAI_SERVICES.map((svc, idx) => (
                <ScrollCardReveal
                  key={svc.number}
                  index={idx}
                  yOffset={25}
                  blurAmount={8}
                  className="bg-[#FDFCF8] border border-[#E3DBCC] rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:border-[#C5B9A5] transition-all duration-300 shadow-[0_4px_20px_-4px_rgba(20,18,15,0.04)]"
                >
                  <div>
                    {/* Card Header Tagging */}
                    <div className="flex items-center justify-between gap-4 mb-5">
                      <span className="font-mono text-xs font-semibold tracking-widest text-[#8C7764]">
                        FOLIO {svc.number}
                      </span>
                      <span className="text-[10px] font-mono uppercase tracking-[0.18em] px-2.5 py-1 rounded-full bg-[#FAF8F5] text-[#625D55] border border-[#E3DBCC]">
                        {svc.badge}
                      </span>
                    </div>

                    {/* Image Specimen Frame */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-[#F3F0E9] mb-6 border border-[#E3DBCC]">
                      <img
                        src={svc.image}
                        alt={svc.imageAlt}
                        title={svc.imageTitle}
                        width="400"
                        height="250"
                        style={{ aspectRatio: '16 / 10' }}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-105"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>

                    <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#101010] mb-2 leading-snug">
                      {svc.h2Title}
                    </h2>
                    <p className="text-xs font-mono tracking-wider text-[#7A6E5D] uppercase mb-4">
                      {svc.subtitle}
                    </p>
                    <p className="text-[13.5px] sm:text-[14.5px] text-[#4A463F] leading-relaxed mb-6 font-sans">
                      {svc.description}
                    </p>

                    {/* Frequent Venues */}
                    <div className="mb-6 pt-4 border-t border-[#E3DBCC]/60 flex items-start gap-2 text-xs text-[#625D55] font-sans">
                      <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#101010]" />
                      <span><strong>Key Mumbai Locations:</strong> {svc.venues}</span>
                    </div>
                  </div>

                  {/* Card Bottom Links */}
                  <div className="pt-4 border-t border-[#E3DBCC]/60 flex items-center justify-between">
                    <Link
                      to={svc.link}
                      className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.16em] text-[#101010] hover:text-[#8C7764] transition-colors font-semibold group"
                    >
                      <span>{svc.linkLabel}</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>
                    <Link
                      to="/services#book"
                      className="text-[11px] font-mono uppercase tracking-widest text-[#625D55] hover:text-[#101010] transition-colors"
                    >
                      Reserve →
                    </Link>
                  </div>
                </ScrollCardReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ===================================================================
            3. MUMBAI PHOTOGRAPHY LOCATIONS & LIGHT GUIDE
            =================================================================== */}
        <section
          aria-label="Mumbai Photography Locations Guide"
          className="w-full bg-[#FDFCF8] py-24 sm:py-32 border-b border-[#E3DBCC]"
        >
          <div className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-20">
            <div className="max-w-3xl mb-16 sm:mb-20">
              <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-[#625D55] block mb-3 font-semibold">
                LOCAL KNOWLEDGE • LIGHT &amp; SPACES
              </span>
              <h2 className="font-serif text-[32px] sm:text-[44px] font-normal text-[#101010] leading-tight mb-4">
                Guide to Photography Locations in Mumbai
              </h2>
              <p className="text-[14px] sm:text-[15.5px] text-[#4A463F] leading-relaxed max-w-2xl font-sans">
                Natural light in Mumbai has a unique character—from the golden coastal haze along the Arabian Sea to the sculptural shadows under Victorian stone arches. Here is how we navigate the city's finest settings.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-10">
              {LOCAL_LOCATIONS.map((loc) => (
                <div
                  key={loc.number}
                  className="bg-[#FAF8F5] border border-[#E3DBCC] rounded-2xl p-8 flex flex-col justify-between hover:border-[#C5B9A5] transition-all duration-300"
                >
                  <div>
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <span className="font-mono text-xs font-semibold tracking-widest text-[#8C7764]">
                        LOCATION {loc.number}
                      </span>
                      <MapPin className="w-4 h-4 text-[#8C7764]" />
                    </div>

                    <h3 className="font-serif text-2xl font-normal text-[#101010] mb-3">
                      {loc.area}
                    </h3>
                    <p className="text-[13.5px] sm:text-[14.5px] text-[#4A463F] leading-relaxed font-sans">
                      {loc.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===================================================================
            4. ATELIER STANDARDS (MATCHING HOMEPAGE REVERENCE)
            =================================================================== */}
        <section
          aria-label="Atelier Standards & Creative Leadership"
          className="w-full bg-[#FAF8F5] py-20 sm:py-28 border-b border-[#E3DBCC]"
        >
          <div className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-20">
            <div className="max-w-2xl mb-14">
              <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-[#625D55] block mb-3 font-semibold">
                OUR PHILOSOPHY • ATELIER STANDARDS
              </span>
              <h2 className="font-serif text-[28px] sm:text-[38px] font-normal text-[#101010] leading-tight">
                Why Discerning Couples Choose DS Photography
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {ATELIER_STANDARDS.map((p, i) => (
                <div
                  key={i}
                  className="bg-[#FDFCF8] border border-[#E3DBCC] rounded-xl p-6 sm:p-7 flex flex-col justify-start"
                >
                  <div className="mb-4">{p.icon}</div>
                  <h3 className="font-serif text-xl font-normal text-[#101010] mb-2">
                    {p.title}
                  </h3>
                  <p className="text-xs sm:text-[13px] text-[#4A463F] leading-relaxed font-sans">
                    {p.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===================================================================
            5. GENUINE CLIENT REFLECTIONS & TESTIMONIALS
            =================================================================== */}
        <section
          aria-label="Client Testimonials and Reviews"
          className="w-full bg-[#FDFCF8] py-24 sm:py-32 border-b border-[#E3DBCC]"
        >
          <div className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-20">
            <div className="max-w-3xl mb-16 sm:mb-20">
              <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-[#625D55] block mb-3 font-semibold">
                CLIENT REFLECTIONS • MUMBAI
              </span>
              <h2 className="font-serif text-[32px] sm:text-[44px] font-normal text-[#101010] leading-tight mb-4">
                What Couples &amp; Clients Say
              </h2>
              <p className="text-[14px] sm:text-[15.5px] text-[#4A463F] leading-relaxed max-w-2xl font-sans">
                Authentic feedback from weddings, couple monographs, and editorial sessions documented across Mumbai.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {CLIENT_TESTIMONIALS.map((t, idx) => (
                <div
                  key={idx}
                  className="bg-[#FAF8F5] border border-[#E3DBCC] rounded-2xl p-8 flex flex-col justify-between shadow-[0_4px_20px_-4px_rgba(20,18,15,0.03)]"
                >
                  <div>
                    <span className="font-serif text-3xl text-[#8C7764] block mb-2 leading-none">“</span>
                    <p className="font-serif italic text-base sm:text-[17px] text-[#101010] leading-relaxed mb-6">
                      {t.quote}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-[#E3DBCC]/60">
                    <p className="font-sans text-xs font-semibold uppercase tracking-wider text-[#101010]">{t.client}</p>
                    <p className="font-mono text-[11px] text-[#625D55] mt-0.5">{t.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===================================================================
            6. OBSIDIAN LUXURY FINALE CALL TO ACTION
            =================================================================== */}
        <section
          aria-label="Reserve a Commission"
          className="w-full bg-[#101010] text-[#FDFCF8] py-24 sm:py-32 text-center"
        >
          <div className="max-w-3xl mx-auto px-6 sm:px-12">
            <span className="font-mono text-xs font-semibold tracking-[0.25em] text-[#CBB9A4] uppercase block mb-4">
              RESERVE YOUR MUMBAI DATE
            </span>
            <h2 className="font-serif text-[32px] sm:text-[46px] md:text-[54px] font-normal text-[#FDFCF8] leading-tight mb-5">
              Begin Your Visual Story With Dishant Shelar
            </h2>
            <p className="font-sans text-sm sm:text-base text-[#E3DBCC]/75 max-w-xl mx-auto leading-relaxed mb-10">
              We accept a limited number of commissions each season to ensure uncompromising artistic quality and archival devotion. Connect with our atelier to discuss your date.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => onOpenInquiry && onOpenInquiry()}
                className="btn-secondary w-full sm:w-auto"
                style={{ backgroundColor: '#FDFCF8', color: '#101010', borderColor: '#FDFCF8' }}
              >
                <span>Reserve a Commission</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <a
                href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_PHONE || '919082378510'}?text=${encodeURIComponent("Hi Dishant, I'm visiting your Mumbai photographer page and would like to inquire about session availability.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary w-full sm:w-auto"
                style={{ backgroundColor: 'transparent', color: '#FDFCF8', borderColor: 'rgba(227, 219, 204, 0.4)' }}
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Chat on WhatsApp</span>
              </a>

              <Link
                to="/services"
                className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.16em] text-[#CBB9A4] hover:text-[#FDFCF8] transition-colors font-semibold py-3 px-4"
              >
                <span>Services &amp; Pricing</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}
