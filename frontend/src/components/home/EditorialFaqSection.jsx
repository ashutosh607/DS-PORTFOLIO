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
    id: 'view-portfolio',
    question: 'How can I view the photography portfolio?',
    answer:
      'You can explore our complete photography portfolio across all collections—including weddings, pre-wedding sessions, portraits, events, and commercial commissions—directly on our Collections page at https://www.dishantshelarphotography.in/collections.',
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

/**
 * Animated word-by-word reveal component.
 * When the accordion panel opens, each word glides up smoothly with subtle blur dissolve.
 */
function AnimatedAnswer({ text }) {
  const words = text.split(' ');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.016,
        delayChildren: 0.06,
      },
    },
  };

  const wordVariants = {
    hidden: {
      opacity: 0,
      y: 10,
      filter: 'blur(4px)',
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.32,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <motion.p
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="pt-3.5 pr-4 sm:pr-8 text-[13.5px] sm:text-[14.5px] text-[#4A463F] leading-relaxed font-sans max-w-3xl flex flex-wrap"
    >
      {words.map((word, i) => {
        const isUrl = word.startsWith('http://') || word.startsWith('https://');
        return (
          <span key={i} className="inline-block overflow-hidden mr-[0.28em] py-0.5">
            <motion.span
              variants={wordVariants}
              className="inline-block will-change-transform"
            >
              {isUrl ? (
                <a
                  href={word}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#101010] underline underline-offset-4 hover:text-[#7A746B] transition-colors"
                >
                  {word}
                </a>
              ) : (
                word
              )}
            </motion.span>
          </span>
        );
      })}
    </motion.p>
  );
}

export default function EditorialFaqSection({ faqs = HOMEPAGE_FAQS }) {
  const [openId, setOpenId] = useState(faqs[0]?.id || null);

  const toggleFaq = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="faq"
      aria-label="Frequently Asked Questions"
      className="w-full bg-[#FAF8F5] text-[#101010] pt-10 sm:pt-14 pb-20 sm:pb-28 border-t border-[#E3DBCC]"
    >
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 22, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl mb-12 sm:mb-16"
        >
          <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-[#625D55] block mb-3 font-medium">
            FREQUENTLY ASKED QUESTIONS · AEO
          </span>
          <h2 className="font-serif text-[32px] sm:text-[42px] font-normal text-[#101010] leading-tight mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-[14px] sm:text-[15px] text-[#4A463F] leading-relaxed">
            Direct, factual guidance on wedding coverage, booking timelines, destination commissions, and archival delivery with Dishant Shelar.
          </p>
        </motion.div>

        {/* FAQ Accordion List with Pop-up Item Entrances */}
        <div className="flex flex-col gap-2.5 sm:gap-3">
          {faqs.map((faq, index) => {
            const isOpen = openId === faq.id;
            return (
              <motion.div
                key={faq.id || index}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{
                  duration: 0.45,
                  delay: Math.min(index * 0.04, 0.35),
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`transition-all duration-350 ease-out rounded-2xl ${
                  isOpen
                    ? 'bg-[#FAF7F2] p-5 sm:p-6 border border-[#E3DBCC] shadow-[0_8px_30px_-6px_rgba(20,18,15,0.06)]'
                    : 'p-4 sm:p-5 hover:bg-[#FAF7F2]/60 border border-[#E3DBCC]/60'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(faq.id)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${faq.id}`}
                  className="w-full flex items-start justify-between gap-4 text-left cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#101010] focus-visible:ring-offset-2 rounded-xs"
                >
                  <h3
                    className={`font-serif text-[18px] sm:text-[21px] leading-snug transition-colors m-0 p-0 inline-block ${
                      isOpen
                        ? 'text-[#101010] font-medium'
                        : 'text-[#2C2722] font-normal group-hover:text-[#101010]'
                    }`}
                  >
                    {faq.question}
                  </h3>
                  <motion.span
                    animate={{
                      rotate: isOpen ? 180 : 0,
                      backgroundColor: isOpen ? '#101010' : '#FAF8F5',
                      borderColor: isOpen ? '#101010' : '#C5B9A5',
                      color: isOpen ? '#FAF8F5' : '#625D55',
                      scale: isOpen ? 1.05 : 1,
                    }}
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                    className="mt-1 w-7 h-7 rounded-full border flex items-center justify-center shrink-0 group-hover:border-[#101010] group-hover:text-[#101010]"
                  >
                    <ChevronDown size={14} />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-answer-${faq.id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <AnimatedAnswer text={faq.answer} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
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
