import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ScrollCardReveal from '../common/ScrollCardReveal';
import WhyChooseSection from './WhyChooseSection';

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
        <WhyChooseSection />
      </div>
    </section>
  );
}

