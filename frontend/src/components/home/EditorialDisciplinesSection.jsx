import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Plus, Minus, Sparkles } from 'lucide-react';
import { useEditorialReveal } from '../../utils/useEditorialReveal';

// Collection imagery matching destination /collections/ galleries
const weddingImg = 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80';
const preWeddingImg = 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80';
const portraitImg = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80';
const eventImg = 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80';

const DISCIPLINES = [
  {
    number: '01',
    h2Title: 'Wedding Photographer in Mumbai',
    subtitle: 'Sacred Rituals & Candid Moments',
    shortText: 'Documenting timeless wedding stories across Mumbai and destination venues worldwide with medium-format film tonality.',
    fullText:
      'Your wedding is a once-in-a-lifetime milestone deserving of timeless preservation. As a leading wedding photographer in Mumbai, Dishant Shelar documents sacred rituals, heartfelt family emotions, and spontaneous celebrations with an editorial eye and medium-format film aesthetic. From traditional South Mumbai heritage ceremonies to contemporary beachfront celebrations, our team captures raw emotion without intrusive posing.',
    image: weddingImg,
    alt: 'Candid fine-art bridal and wedding ceremony in Mumbai by Dishant Shelar',
    link: '/collections/weddings',
    linkLabel: 'Explore Wedding Collections',
    badge: 'Fine Art Wedding',
  },
  {
    number: '02',
    h2Title: 'Pre-Wedding Photography in Mumbai',
    subtitle: 'Intimate Couple Monographs & Films',
    shortText: 'Crafted in natural golden-hour luminescence across South Mumbai heritage architecture and coastal beachscapes.',
    fullText:
      'Our pre-wedding shoots in Mumbai capture the authentic connection between couples in natural golden-hour luminescence. Whether navigating historic South Mumbai architecture, the shores of Alibaug, or private scenic retreats in Maharashtra, we craft intimate couple monographs and cinematic short films that narrate your love story truthfully.',
    image: preWeddingImg,
    alt: 'Romantic pre-wedding couple promenade session in Mumbai by Dishant Shelar',
    link: '/collections/pre-wedding',
    linkLabel: 'View Pre-Wedding Shoots',
    badge: 'Couple Monographs',
  },
  {
    number: '03',
    h2Title: 'Professional Portrait Photography',
    subtitle: 'Editorial Personal & Daylight Monographs',
    shortText: 'Soulful daylight personal portraits, creative direction, and fine-art monographs in Mumbai.',
    fullText:
      'We create fine-art personal portraits, executive headshots, and editorial fashion monographs in Mumbai. With mindful lighting and thoughtful composition, each portrait session brings out your natural character with depth, soul, and timeless elegance.',
    image: portraitImg,
    alt: 'Editorial personal portrait photography and fine-art daylight monograph in Mumbai studio by Dishant Shelar',
    link: '/collections/portraits',
    linkLabel: 'View Portrait Monographs',
    badge: 'Editorial Portraiture',
  },
  {
    number: '04',
    h2Title: 'Event & Commercial Photography',
    subtitle: 'Atmospheric Galas & Haute Brand Campaigns',
    shortText: 'Sophisticated documentation for luxury soirées, milestone celebrations, and brand commissions.',
    fullText:
      'Beyond weddings, DS Photography & Films documents exclusive cultural galas, milestone birthday celebrations, corporate soirées, and commercial brand campaigns across Mumbai. Our commercial work brings narrative storytelling and refined visual aesthetics to brand imagery.',
    image: eventImg,
    alt: 'Atmospheric luxury gala event and commercial brand campaign in Mumbai by Dishant Shelar',
    link: '/collections/events',
    linkLabel: 'Explore Event Portfolio',
    badge: 'Events & Commercial',
  },
];

export default function EditorialDisciplinesSection() {
  const [headerRef, headerRevealed] = useEditorialReveal(0.12);
  const [activeCard, setActiveCard] = useState(null);
  const [expandedDetails, setExpandedDetails] = useState({});

  const toggleDetail = (e, index) => {
    e.stopPropagation();
    setExpandedDetails((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleCardClick = (index) => {
    setActiveCard((prev) => (prev === index ? null : index));
  };

  return (
    <section
      id="disciplines"
      aria-label="Photography Disciplines & Atelier Services"
      className="w-full bg-[#FAF8F5] text-[#101010] pt-20 sm:pt-28 lg:pt-32 pb-16 sm:pb-24 border-t border-[#E3DBCC] relative overflow-hidden"
    >
      {/* Decorative hairline arc accent */}
      <svg
        className="absolute top-0 right-0 w-[320px] sm:w-[480px] h-[220px] sm:h-[300px] pointer-events-none opacity-30 z-0"
        viewBox="0 0 500 300"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M 500,20 C 360,70 280,180 200,300"
          stroke="#CBB9A4"
          strokeWidth="1"
          strokeDasharray="450"
          strokeDashoffset={headerRevealed ? '0' : '450'}
          style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.22, 1, 0.36, 1) 0.2s' }}
        />
      </svg>

      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 md:px-10 lg:px-10 xl:px-16 relative z-10">
        {/* Section Header */}
        <div ref={headerRef} className="max-w-3xl mb-12 sm:mb-16 lg:mb-20">
          <div className="flex items-center gap-2 mb-2.5 sm:mb-3">
            <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-[#625D55] font-semibold">
              ATELIER DISCIPLINES · MUMBAI
            </span>
            <Sparkles size={12} className="text-[#CBB9A4] animate-sparkle-twinkle" aria-hidden="true" />
          </div>

          <div className="editorial-mask-wrap mb-3.5 sm:mb-4">
            <h2
              className={`font-serif text-[32px] sm:text-[42px] lg:text-[48px] font-normal text-[#101010] leading-[1.12] editorial-mask-rise ${
                headerRevealed ? 'is-revealed' : ''
              }`}
            >
              Capturing What Matters With Archival Grace.
            </h2>
          </div>

          {/* Underline hairline */}
          <div className="w-16 sm:w-24 lg:w-48 h-[1px] bg-[#E3DBCC] mb-3.5 sm:mb-4 overflow-hidden">
            <div
              className={`h-full bg-[#101010]/30 editorial-draw-line ${
                headerRevealed ? 'is-revealed' : ''
              }`}
            />
          </div>

          {/* Subheading: short visible lead, full SEO preserved in DOM */}
          <p
            className={`text-[14.5px] sm:text-[16px] text-[#4A463F] leading-relaxed max-w-2xl font-sans editorial-fade-up ${
              headerRevealed ? 'is-revealed' : ''
            }`}
          >
            Every celebration has an unrepeatable rhythm.
            <span className="sr-only">
              {' '}From intimate golden-hour pre-wedding monographs to multi-day wedding rituals, our commissions are approached with quiet observation and artistic reverence across Mumbai and destination venues worldwide.
            </span>
          </p>
        </div>

        {/* 4 Tall Image-Led Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7 lg:gap-6">
          {DISCIPLINES.map((item, idx) => {
            const isHoveredOrActive = activeCard === idx;
            const isExpanded = !!expandedDetails[idx];

            return (
              <div
                key={item.number}
                onClick={() => handleCardClick(idx)}
                onMouseEnter={() => setActiveCard(idx)}
                onMouseLeave={() => setActiveCard(null)}
                className="group relative h-[480px] sm:h-[520px] lg:h-[560px] rounded-[24px] sm:rounded-[28px] overflow-hidden bg-[#1E1B18] shadow-[0_12px_36px_-8px_rgba(16,14,12,0.12)] cursor-pointer transition-all duration-500 ease-out flex flex-col justify-end p-6 sm:p-7 border border-[#E3DBCC]/30 hover:border-[#CBB9A4]"
              >
                {/* Background Image with subtle zoom on hover */}
                <img
                  src={item.image}
                  alt={item.alt}
                  title={`${item.h2Title} — DS Photography & Films`}
                  width="400"
                  height="600"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 select-none"
                  loading="lazy"
                />

                {/* Subtle base gradient so resting typography remains legible */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-400 group-hover:opacity-0" />

                {/* Sliding Soft Dark Overlay on hover/tap */}
                <div
                  className={`absolute inset-0 bg-[#101010]/92 backdrop-blur-sm transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] p-6 sm:p-7 flex flex-col justify-between ${
                    isHoveredOrActive ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
                  }`}
                >
                  {/* Overlay Top Bar */}
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <span className="font-mono text-xs font-semibold tracking-widest text-[#CBB9A4]">
                        FOLIO {item.number}
                      </span>
                      <span className="text-[10px] font-mono uppercase tracking-[0.18em] px-2.5 py-0.5 rounded-full bg-white/10 text-[#FDFCF8] border border-white/15">
                        {item.badge}
                      </span>
                    </div>

                    <h2 className="font-serif text-2xl sm:text-[26px] font-normal text-[#FDFCF8] leading-tight mb-2">
                      {item.h2Title}
                    </h2>
                    <p className="text-[11px] font-mono tracking-wider text-[#CBB9A4] uppercase mb-4">
                      {item.subtitle}
                    </p>

                    {/* Short 2-line visible lead */}
                    <p className="text-[13.5px] text-[#E3DBCC] leading-relaxed font-sans mb-3">
                      {item.shortText}
                    </p>

                    {/* Expandable Disclosure: Keeps 100% full original SEO paragraph in DOM */}
                    <button
                      type="button"
                      onClick={(e) => toggleDetail(e, idx)}
                      aria-expanded={isExpanded}
                      className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-widest text-[#FDFCF8] hover:text-[#CBB9A4] transition-colors py-1 cursor-pointer"
                    >
                      {isExpanded ? <Minus size={11} /> : <Plus size={11} />}
                      <span>{isExpanded ? 'Less overview' : 'Full overview +'}</span>
                    </button>

                    <div
                      className={`editorial-expandable-grid ${
                        isExpanded ? 'is-expanded' : ''
                      }`}
                    >
                      <div className="editorial-expandable-content">
                        <p className="text-[12.5px] text-[#A49B8D] leading-relaxed font-sans pt-2">
                          {item.fullText}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Overlay Bottom Links */}
                  <div className="pt-4 border-t border-white/15 flex items-center justify-between">
                    <Link
                      to={item.link}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.16em] text-[#FDFCF8] hover:text-[#CBB9A4] transition-colors font-semibold group/link"
                    >
                      <span>Explore →</span>
                    </Link>
                    <Link
                      to="/services#book"
                      onClick={(e) => e.stopPropagation()}
                      className="text-[11px] font-mono uppercase tracking-widest text-[#CBB9A4] hover:text-[#FDFCF8] transition-colors"
                    >
                      Enquire
                    </Link>
                  </div>
                </div>

                {/* Resting State Content (Bottom of Card) */}
                <div className="relative z-10 transition-opacity duration-300 group-hover:opacity-0 pointer-events-none">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-semibold tracking-widest text-[#E3DBCC]">
                      FOLIO {item.number}
                    </span>
                    <span className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm border border-white/25 flex items-center justify-center text-white">
                      <ArrowRight size={13} />
                    </span>
                  </div>
                  <h2 className="font-serif text-2xl font-normal text-[#FDFCF8] leading-tight">
                    {item.h2Title}
                  </h2>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
