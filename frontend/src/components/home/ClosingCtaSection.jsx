import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, MessageCircle } from 'lucide-react';
import { useEditorialReveal } from '../../utils/useEditorialReveal';

export default function ClosingCtaSection() {
  const [ref, isRevealed] = useEditorialReveal(0.15);

  return (
    <section
      aria-label="Reserve Your Date with DS Photography & Films"
      className="w-full bg-[#FAF8F5] py-20 sm:py-28 lg:py-32 border-t border-[#E3DBCC] relative overflow-hidden"
    >
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8 relative z-10">
        
        {/* Calm Dark Rounded Card */}
        <div
          ref={ref}
          className="relative rounded-[28px] sm:rounded-[36px] bg-[#101010] text-[#FDFCF8] p-8 sm:p-14 lg:p-16 overflow-hidden shadow-[0_24px_60px_-12px_rgba(16,14,12,0.28)]"
        >
          {/* Subtle curved arc accent in background */}
          <svg
            className="absolute top-0 right-0 w-[360px] sm:w-[500px] h-[240px] sm:h-[340px] pointer-events-none opacity-20 overflow-visible"
            viewBox="0 0 500 340"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M 500,20 C 380,80 260,190 180,340"
              stroke="#E3DBCC"
              strokeWidth="1"
            />
          </svg>

          {/* Sparkle Accent */}
          <div className="absolute top-8 right-8 sm:top-12 sm:right-14 text-[#CBB9A4] animate-sparkle-twinkle pointer-events-none">
            <Sparkles size={20} aria-hidden="true" />
          </div>

          <div className="relative z-10 max-w-2xl">
            {/* Monospace Eyebrow */}
            <span className="text-[10.5px] sm:text-[11.5px] font-mono tracking-[0.25em] uppercase text-[#CBB9A4] font-semibold block mb-3 sm:mb-4">
              LIMITED ANNUAL COMMISSIONS · MUMBAI &amp; DESTINATION
            </span>

            {/* Serif Heading */}
            <div className="editorial-mask-wrap mb-4 sm:mb-5">
              <h2
                className={`font-serif text-[32px] sm:text-[44px] lg:text-[50px] font-normal leading-[1.12] text-[#FDFCF8] editorial-mask-rise ${
                  isRevealed ? 'is-revealed' : ''
                }`}
              >
                Preserve What Matters Most With Archival Grace.
              </h2>
            </div>

            {/* Booking Notice */}
            <p className="text-[15px] sm:text-[17px] text-[#E3DBCC] font-sans font-normal leading-relaxed mb-2">
              Peak dates book 4 to 9 months ahead.
            </p>

            {/* Supporting Copy Preserved in DOM */}
            <p className="text-[13.5px] sm:text-[14.5px] text-[#A49B8D] font-sans leading-relaxed mb-8 sm:mb-10 max-w-xl">
              We accept a limited number of commissions each calendar year to ensure every celebration receives our undivided artistic focus, prompt archival delivery, and bespoke attention by Dishant Shelar.
            </p>

            {/* Call To Action Buttons */}
            <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
              <Link
                to="/services#book"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 sm:py-4 rounded-full bg-[#FDFCF8] text-[#101010] font-mono text-xs sm:text-[12.5px] font-semibold uppercase tracking-[0.16em] hover:bg-[#E3DBCC] active:scale-[0.98] transition-all duration-300 shadow-md group"
              >
                <span>Check Availability</span>
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>

              <a
                href="https://wa.me/919082378510?text=Hello%20Dishant,%20I%20would%20like%20to%20enquire%20about%20date%20availability%20for%20a%20photography%20commission."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[12px] font-mono uppercase tracking-[0.15em] text-[#CBB9A4] hover:text-[#FDFCF8] transition-colors py-2"
              >
                <MessageCircle size={15} />
                <span>Message on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
