import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Minus, ArrowRight, Sparkles } from 'lucide-react';
import { useEditorialReveal } from '../../utils/useEditorialReveal';

export const HOMEPAGE_FAQS = [
  {
    id: 'pricing-factors',
    question: 'How much does wedding photography cost in Mumbai?',
    answer:
      'Wedding photography investment in Mumbai depends on event duration (single-day versus multi-day ceremonies), required crew size (candid photographers, traditional photographers, and cinematographers), venue locations, and selected deliverables such as handcrafted fine-art heirloom albums or aerial drone coverage. We provide bespoke quotes tailored to each celebration.',
  },
  {
    id: 'how-to-book',
    question: 'How can I book DS Photography & Films?',
    answer:
      'You can reserve your date through the online booking brief on our Services page (https://www.dishantshelarphotography.in/services) or message Dishant Shelar directly on WhatsApp at +91 90823 78510. We recommend reserving 4 to 9 months in advance.',
  },
  {
    id: 'pre-wedding',
    question: 'Does DS Photography & Films offer pre-wedding photography?',
    answer:
      'Yes, we specialize in intimate, cinematic pre-wedding photography sessions across Mumbai, coastal retreats in Alibaug and Goa, and destination estates across India.',
  },
  {
    id: 'services-available',
    question: 'What types of photography services are available?',
    answer:
      'We provide luxury wedding photography and films, candid pre-wedding couple sessions, editorial personal portraits, milestone birthday celebrations, atmospheric events, and commercial brand commissions.',
  },
  {
    id: 'view-portfolio',
    question: 'How can I view the photography portfolio?',
    answer:
      'You can explore our complete photography portfolio across all collections—including weddings, pre-wedding sessions, portraits, events, and commercial commissions—directly on our Collections page at https://www.dishantshelarphotography.in/collections.',
  },
  {
    id: 'destination-travel',
    question: 'Does DS Photography & Films travel outside Mumbai?',
    answer:
      'Yes. While based in Mumbai, Dishant Shelar regularly travels across Maharashtra, Goa, Rajasthan, and destination venues worldwide. Travel logistics are coordinated during booking.',
  },
  {
    id: 'photographer-identity',
    question: 'Who is the photographer behind DS Photography & Films?',
    answer:
      'DS Photography & Films is founded and led by Dishant Shelar, a Mumbai-based fine-art photographer and cinematographer. Specializing in candid weddings, intimate pre-wedding monographs, and editorial portraiture, Dishant personally leads creative direction and principal camera coverage for all atelier commissions.',
  },
  {
    id: 'delivery-timeline',
    question: 'How long does photo editing and album delivery take?',
    answer:
      'Curated digital previews and color-graded proofs are shared via a private client gallery. Bespoke handcrafted fine-art albums are printed, bound, quality-inspected, and delivered within 3 weeks following the client’s final photo selection approval.',
  },
  {
    id: 'service-locations',
    question: 'Which locations in Mumbai and Maharashtra does the studio serve?',
    answer:
      'Our primary coverage spans all across Mumbai (including South Mumbai, Bandra, Juhu, Thane, and Navi Mumbai), coastal retreats in Alibaug, hill destinations in Lonavala, and beach weddings in Goa.',
  },
];

export default function EditorialFaqSection({ faqs = HOMEPAGE_FAQS }) {
  // First item open by default
  const [openId, setOpenId] = useState(faqs[0]?.id || null);
  const [headerRef, headerRevealed] = useEditorialReveal(0.12);

  const toggleFaq = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="faq"
      aria-label="Frequently Asked Questions"
      className="w-full bg-[#FDFCF8] text-[#101010] py-20 sm:py-28 lg:py-32 border-t border-[#E3DBCC] relative overflow-hidden"
    >
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8 relative z-10">
        
        {/* Section Header */}
        <div ref={headerRef} className="max-w-2xl mb-12 sm:mb-16">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-[#625D55] font-semibold">
              FREQUENTLY ASKED QUESTIONS · ATELIER AEO
            </span>
            <Sparkles size={12} className="text-[#CBB9A4] animate-sparkle-twinkle" aria-hidden="true" />
          </div>

          <div className="editorial-mask-wrap mb-3.5 sm:mb-4">
            <h2
              className={`font-serif text-[32px] sm:text-[42px] lg:text-[46px] font-normal text-[#101010] leading-tight editorial-mask-rise ${
                headerRevealed ? 'is-revealed' : ''
              }`}
            >
              Frequently Asked Questions
            </h2>
          </div>

          {/* Underline hairline */}
          <div className="w-16 sm:w-24 h-[1px] bg-[#E3DBCC] mb-4 overflow-hidden">
            <div
              className={`h-full bg-[#101010]/30 editorial-draw-line ${
                headerRevealed ? 'is-revealed' : ''
              }`}
            />
          </div>

          <p
            className={`text-[14px] sm:text-[15.5px] text-[#4A463F] leading-relaxed editorial-fade-up ${
              headerRevealed ? 'is-revealed' : ''
            }`}
          >
            Direct, factual guidance on wedding coverage, booking timelines, destination commissions, and archival delivery with Dishant Shelar.
          </p>
        </div>

        {/* Minimalist Numbered Accordion List: 100% crawlable in DOM, zero display:none */}
        <div className="flex flex-col border-t border-[#E3DBCC]">
          {faqs.map((faq, index) => {
            const isOpen = openId === faq.id;
            const numberFormatted = String(index + 1).padStart(2, '0');

            return (
              <div
                key={faq.id || index}
                className={`border-b border-[#E3DBCC] transition-colors duration-300 ${
                  isOpen ? 'bg-[#FAF7F2]/70' : 'hover:bg-[#FAF8F5]'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(faq.id)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${faq.id}`}
                  className="w-full py-5 sm:py-6 px-3 sm:px-4 flex items-center justify-between gap-4 text-left cursor-pointer group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#101010]"
                >
                  <div className="flex items-center gap-4 sm:gap-6 min-w-0">
                    {/* Number in light serif matching Why Choose */}
                    <span
                      className={`font-serif text-lg sm:text-xl transition-colors duration-300 shrink-0 ${
                        isOpen ? 'text-[#101010] font-normal' : 'text-[#8C7764] font-light group-hover:text-[#101010]'
                      }`}
                    >
                      {numberFormatted}
                    </span>

                    <h3
                      className={`font-serif text-[18px] sm:text-[21px] leading-snug transition-colors m-0 ${
                        isOpen ? 'text-[#101010] font-medium' : 'text-[#2C2722] font-normal group-hover:text-[#101010]'
                      }`}
                    >
                      {faq.question}
                    </h3>
                  </div>

                  {/* Thin + turning into - icon */}
                  <span
                    className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300 ${
                      isOpen
                        ? 'border-[#101010] bg-[#101010] text-[#FDFCF8] rotate-180'
                        : 'border-[#CBB9A4] bg-transparent text-[#625D55] group-hover:border-[#101010] group-hover:text-[#101010]'
                    }`}
                  >
                    {isOpen ? <Minus size={13} strokeWidth={1.5} /> : <Plus size={13} strokeWidth={1.5} />}
                  </span>
                </button>

                {/* Answer Container: permanently in DOM for crawlers via CSS grid rows */}
                <div
                  id={`faq-answer-${faq.id}`}
                  className={`editorial-expandable-grid px-3 sm:px-4 ${
                    isOpen ? 'is-expanded' : ''
                  }`}
                >
                  <div className="editorial-expandable-content">
                    <div className="pl-9 sm:pl-12 pr-4 sm:pr-8 pb-5 sm:pb-6 text-[14px] sm:text-[15px] text-[#4A463F] leading-relaxed font-sans">
                      <p>
                        {faq.answer.split(' ').map((word, i) => {
                          const isUrl = word.startsWith('http://') || word.startsWith('https://');
                          if (isUrl) {
                            return (
                              <React.Fragment key={i}>
                                <a
                                  href={word}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[#101010] underline underline-offset-4 hover:text-[#7A746B] transition-colors"
                                >
                                  {word}
                                </a>{' '}
                              </React.Fragment>
                            );
                          }
                          return word + ' ';
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Helpful Footer Inquiries Link */}
        <div className="mt-12 pt-8 border-t border-[#E3DBCC] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-[13px] text-[#625D55]">
            Have a custom destination wedding or date in mind?
          </p>
          <div className="flex items-center gap-4 flex-wrap">
            <Link
              to="/services"
              className="inline-flex items-center gap-1.5 text-[12px] uppercase tracking-[0.15em] font-semibold text-[#101010] hover:text-[#3D3A35] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#101010]"
            >
              <span>Explore Services &amp; Pricing</span>
              <ArrowRight size={13} />
            </Link>
            <span className="text-[#9E9587]" aria-hidden="true">•</span>
            <Link
              to="/terms"
              className="inline-flex items-center gap-1.5 text-[12px] uppercase tracking-[0.15em] font-semibold text-[#101010] hover:text-[#3D3A35] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#101010]"
            >
              <span>View Client Terms</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
