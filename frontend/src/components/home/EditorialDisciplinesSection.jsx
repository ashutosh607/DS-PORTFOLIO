import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Shield, Heart, Film, Camera } from 'lucide-react';
import ScrollCardReveal from '../common/ScrollCardReveal';

export default function EditorialDisciplinesSection() {
  const disciplines = [
    {
      number: '01',
      h2Title: 'Wedding Photographer in Mumbai',
      subtitle: 'Sacred Rituals & Candid Moments',
      description:
        'Documenting timeless wedding stories across Mumbai and destination venues worldwide. We blend medium-format film tonality with spontaneous, unscripted candid observation to capture raw emotion, sacred vows, and joyous celebrations without intrusive posing.',
      link: '/collections/weddings',
      linkLabel: 'Explore Wedding Collections',
      badge: 'Fine Art Wedding',
    },
    {
      number: '02',
      h2Title: 'Pre-Wedding Photography in Mumbai',
      subtitle: 'Intimate Couple Monographs & Films',
      description:
        'Crafted in natural golden-hour luminescence across South Mumbai heritage architecture, coastal beachscapes in Alibaug, and private scenic retreats across Maharashtra. Story-driven couple sessions that celebrate your authentic connection.',
      link: '/collections/pre-wedding',
      linkLabel: 'View Pre-Wedding Shoots',
      badge: 'Couple Monographs',
    },
    {
      number: '03',
      h2Title: 'Professional Portrait Photography',
      subtitle: 'Editorial Personal & Daylight Monographs',
      description:
        'Soulful daylight personal portraits, creative direction, and fine-art monographs in Mumbai. With mindful lighting and intentional composition, every portrait highlights your natural character with depth and understated elegance.',
      link: '/collections/portraits',
      linkLabel: 'View Portrait Monographs',
      badge: 'Editorial Portraiture',
    },
    {
      number: '04',
      h2Title: 'Event & Commercial Photography',
      subtitle: 'Atmospheric Galas & Haute Brand Campaigns',
      description:
        'Sophisticated documentation for luxury soirées, milestone birthday celebrations, cultural galas, and commercial brand commissions. We bring editorial storytelling and polished aesthetics to brand and event imagery.',
      link: '/collections/events',
      linkLabel: 'Explore Event Portfolio',
      badge: 'Events & Commercial',
    },
  ];

  const pillars = [
    {
      icon: <Camera className="w-5 h-5 text-[#8C7764]" />,
      title: 'Direct Creative Leadership',
      text: 'Dishant Shelar personally directs and shoots principal coverage for every single atelier commission, guaranteeing uncompromising artistic quality.',
    },
    {
      icon: <Film className="w-5 h-5 text-[#8C7764]" />,
      title: 'Medium-Format Film Tonality',
      text: 'Soft highlight rolloff, organic film grain, and subtle color palettes inspired by archival medium-format photography.',
    },
    {
      icon: <Heart className="w-5 h-5 text-[#8C7764]" />,
      title: 'Unobtrusive Storytelling',
      text: 'Quiet, observant candid documentation that allows you and your families to be fully present and enjoy your celebration freely.',
    },
    {
      icon: <Shield className="w-5 h-5 text-[#8C7764]" />,
      title: 'Archival Heirlooms & Delivery',
      text: 'Color-graded high-resolution digital master files and handcrafted Italian leather-bound albums delivered within 3 weeks of selection.',
    },
    {
      icon: <Sparkles className="w-5 h-5 text-[#8C7764]" />,
      title: 'Mumbai & Destination Coverage',
      text: 'Extensive on-location expertise across South Mumbai, Bandra, Juhu, Thane, Alibaug, Goa, Rajasthan, and international destination estates.',
    },
  ];

  return (
    <section
      id="disciplines"
      aria-label="Photography Disciplines & Atelier Services"
      className="w-full bg-[#FAF8F5] text-[#101010] py-24 sm:py-32 border-t border-[#E3DBCC]"
    >
      <div className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-20">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 sm:mb-20">
          <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-[#625D55] block mb-3 font-semibold">
            ATELIER DISCIPLINES · MUMBAI
          </span>
          <h2 className="font-serif text-[32px] sm:text-[44px] font-normal text-[#101010] leading-tight mb-4">
            Capturing What Matters With Archival Grace.
          </h2>
          <p className="text-[14px] sm:text-[15.5px] text-[#4A463F] leading-relaxed max-w-2xl font-sans">
            Every celebration has an unrepeatable rhythm. From intimate golden-hour pre-wedding monographs to multi-day wedding rituals, our commissions are approached with quiet observation and artistic reverence.
          </p>
        </div>

        {/* 4 Core Disciplines Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-24">
          {disciplines.map((item, idx) => (
            <ScrollCardReveal
              key={item.number}
              index={idx}
              yOffset={25}
              blurAmount={8}
              className="bg-[#FDFCF8] border border-[#E3DBCC] rounded-2xl p-8 sm:p-10 flex flex-col justify-between hover:border-[#C5B9A5] transition-all duration-300 shadow-[0_4px_20px_-4px_rgba(20,18,15,0.04)]"
            >
              <div>
                <div className="flex items-center justify-between gap-4 mb-6">
                  <span className="font-mono text-xs font-semibold tracking-widest text-[#8C7764]">
                    FOLIO {item.number}
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-[0.18em] px-2.5 py-1 rounded-full bg-[#FAF8F5] text-[#625D55] border border-[#E3DBCC]">
                    {item.badge}
                  </span>
                </div>

                <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#101010] mb-2 leading-snug">
                  {item.h2Title}
                </h2>
                <p className="text-xs font-mono tracking-wider text-[#7A6E5D] uppercase mb-4">
                  {item.subtitle}
                </p>
                <p className="text-[13.5px] sm:text-[14.5px] text-[#4A463F] leading-relaxed mb-6 font-sans">
                  {item.description}
                </p>
              </div>

              <div className="pt-4 border-t border-[#E3DBCC]/60 flex items-center justify-between">
                <Link
                  to={item.link}
                  className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.16em] text-[#101010] hover:text-[#8C7764] transition-colors font-semibold group"
                >
                  <span>{item.linkLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/services#book"
                  className="text-[11px] font-mono uppercase tracking-widest text-[#625D55] hover:text-[#101010] transition-colors"
                >
                  Enquire →
                </Link>
              </div>
            </ScrollCardReveal>
          ))}
        </div>

        {/* Section 7: Why Choose DS Photography & Films? */}
        <div className="pt-16 border-t border-[#E3DBCC]">
          <div className="max-w-2xl mb-12">
            <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-[#625D55] block mb-3 font-semibold">
              ATELIER STANDARDS &amp; PHILOSOPHY
            </span>
            <h2 className="font-serif text-[30px] sm:text-[40px] font-normal text-[#101010] leading-tight mb-4">
              Why Choose DS Photography &amp; Films?
            </h2>
            <p className="text-[14px] sm:text-[15px] text-[#4A463F] leading-relaxed font-sans">
              We accept a limited number of commissions each calendar year to ensure every couple and client receives our undivided creative focus, prompt archival delivery, and bespoke attention.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {pillars.map((pillar, i) => (
              <div
                key={pillar.title}
                className="bg-[#FDFCF8] border border-[#E3DBCC] rounded-xl p-6 sm:p-7 flex flex-col justify-start"
              >
                <div className="w-10 h-10 rounded-full bg-[#FAF8F5] border border-[#E3DBCC] flex items-center justify-center mb-4">
                  {pillar.icon}
                </div>
                <h3 className="font-serif text-lg sm:text-xl font-normal text-[#101010] mb-2">
                  {pillar.title}
                </h3>
                <p className="text-xs sm:text-[13px] text-[#4A463F] leading-relaxed font-sans">
                  {pillar.text}
                </p>
              </div>
            ))}

            {/* CTA Tile */}
            <div className="bg-[#101010] text-[#FDFCF8] rounded-xl p-6 sm:p-7 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#CBB9A4] block mb-2">
                  DATE RESERVATION
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#FDFCF8] mb-3">
                  Reserve Your Date
                </h3>
                <p className="text-xs text-[#E3DBCC]/80 leading-relaxed font-sans mb-6">
                  Peak wedding dates across Mumbai, Goa, and Maharashtra reserve 4 to 9 months in advance. Share your celebration plans with us.
                </p>
              </div>
              <Link
                to="/services#book"
                className="inline-flex items-center justify-center gap-2 bg-[#FDFCF8] text-[#101010] py-3 px-5 rounded-full font-mono text-[11px] font-semibold uppercase tracking-widest hover:bg-[#E3DBCC] transition-colors"
              >
                <span>Check Availability</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

