import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HOMEPAGE_FAQS = [
  {
    id: 'photographer-identity',
    question: 'Who is the photographer behind DS Photography & Films?',
    answer:
      'DS Photography & Films is founded and led by Dishant Shelar, a Mumbai-based fine-art photographer and cinematographer. Specializing in candid weddings, intimate pre-wedding monographs, and editorial portraiture, Dishant personally leads creative direction and principal camera coverage for all atelier commissions.',
  },
  {
    id: 'services-available',
    question: 'What photography and film services are available?',
    answer:
      'We provide bespoke wedding photography and cinematic films, intimate pre-wedding couple sessions, editorial personal portraits, milestone birthday celebrations, atmospheric galas and events, and haute commercial brand campaigns across Mumbai and destination venues.',
  },
  {
    id: 'how-to-book',
    question: 'How can I book a wedding photographer in Mumbai?',
    answer:
      'You can enquire directly through the online date reservation form on our Services page or message Dishant Shelar on WhatsApp (+91 90823 78510). Because we accept only a limited number of commissions each season to maintain meticulous quality, early enquiry is strongly advised.',
  },
  {
    id: 'pricing-factors',
    question: 'What affects wedding photography and film pricing in Mumbai?',
    answer:
      'Investment tiers depend on event duration (single-day vs. multi-day rituals), required crew size (candid photographers, traditional documentarians, and cinematographers), geographic venue locations, and requested deliverables such as handcrafted fine-art albums and aerial drone cinematography.',
  },
  {
    id: 'lead-time',
    question: 'How early should we reserve our wedding date?',
    answer:
      'Most couples secure their dates 4 to 9 months in advance, particularly for peak wedding season dates across Mumbai, Goa, and Maharashtra. Dates are reserved on a first-confirmed basis upon payment of the booking retainer.',
  },
  {
    id: 'coverage-inclusion',
    question: 'What is included in full wedding photography coverage?',
    answer:
      'Our commissions include comprehensive ritual documentation, unscripted candid moments, fine-art bridal portraiture, color-graded high-resolution master photographs, private online delivery, and bespoke handcrafted leather-bound heirloom albums based on your selected package.',
  },
  {
    id: 'pre-wedding',
    question: 'Does DS Photography & Films offer pre-wedding shoots?',
    answer:
      'Yes. We create intimate, cinematic pre-wedding monographs across iconic heritage locations in South Mumbai, coastal beachscapes like Alibaug and Goa, and private destination estates, tailored to reflect each couple’s personal narrative.',
  },
  {
    id: 'destination-travel',
    question: 'Does the studio travel for destination weddings?',
    answer:
      'Yes. While based in Mumbai, Dishant Shelar frequently travels across Maharashtra, Goa, Rajasthan, and international destinations. Travel and lodging arrangements are coordinated transparently during date confirmation.',
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
  const [openId, setOpenId] = useState(faqs[0]?.id || null);

  const toggleFaq = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="faq"
      aria-label="Frequently Asked Questions"
      className="w-full bg-[#FAF8F5] text-[#101010] py-20 sm:py-28 border-t border-[#E3DBCC]"
    >
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mb-12 sm:mb-16">
          <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-[#625D55] block mb-3 font-medium">
            FREQUENTLY ASKED QUESTIONS · AEO
          </span>
          <h2 className="font-serif text-[32px] sm:text-[42px] font-normal text-[#101010] leading-tight mb-4">
            Answers to Inquiries Before Your Date.
          </h2>
          <p className="text-[14px] sm:text-[15px] text-[#4A463F] leading-relaxed">
            Direct, factual guidance on wedding coverage, booking timelines, destination commissions, and archival delivery with Dishant Shelar.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="divide-y divide-[#E3DBCC] border-y border-[#E3DBCC]">
          {faqs.map((faq, index) => {
            const isOpen = openId === faq.id;
            return (
              <div key={faq.id || index} className="py-5 sm:py-6 transition-colors">
                <button
                  type="button"
                  onClick={() => toggleFaq(faq.id)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${faq.id}`}
                  className="w-full flex items-start justify-between gap-4 text-left cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#101010] focus-visible:ring-offset-2 rounded-xs"
                >
                  <span className="font-serif text-[18px] sm:text-[21px] text-[#101010] font-normal leading-snug group-hover:text-[#3D3A35] transition-colors">
                    {faq.question}
                  </span>
                  <span
                    className={`mt-1 w-6 h-6 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300 ${
                      isOpen
                        ? 'rotate-180 bg-[#101010] text-[#FAF8F5] border-[#101010]'
                        : 'text-[#625D55] border-[#C5B9A5] group-hover:border-[#101010] group-hover:text-[#101010]'
                    }`}
                  >
                    <ChevronDown size={14} />
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-answer-${faq.id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pt-3.5 pr-8 text-[13.5px] sm:text-[14.5px] text-[#4A463F] leading-relaxed font-sans max-w-3xl">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Helpful Footer CTAs */}
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
