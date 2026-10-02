import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Calendar, CreditCard, Clock, BookOpen, Camera, CheckCircle2, ArrowRight } from 'lucide-react';
import Logo from '../../components/layout/Logo';

export default function TermsPage({ onOpenInquiry }) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const paymentMilestones = [
    {
      percentage: '50%',
      title: 'Advance Payment',
      timeline: 'Booking Confirmation',
      description: 'Required to confirm and block the wedding / event date exclusively on our atelier master calendar.',
      status: 'Initial Milestone',
    },
    {
      percentage: '35%',
      title: 'Mid-Term Payment',
      timeline: 'On the Wedding / Event Day',
      description: 'Payable on the day of the event prior to the commencement of concluding festivities (Total payment received: 85%).',
      status: 'Day of Event',
    },
    {
      percentage: '15%',
      title: 'Balance Payment',
      timeline: 'Album & Video Delivery',
      description: 'Payable at the time of final handcrafted album and edited cinematic film delivery (Total payment: 100%).',
      status: 'Final Delivery',
    },
  ];

  const deliveryTimelines = [
    {
      icon: Clock,
      title: 'Photo Selection Deadline',
      rule: 'Within 3 Months',
      detail:
        'Raw proofs and curated photo previews will not be retained in active studio storage for more than 3 months after the wedding date. Clients are requested to complete and submit their photo selections within this period to ensure archival continuity.',
    },
    {
      icon: BookOpen,
      title: 'Archival Album Delivery',
      rule: 'Within 3 Weeks',
      detail:
        'The bespoke, fine-art handcrafted album will be printed, bound, quality-inspected, and delivered within 3 weeks after the client completes their final photo selection approval.',
    },
    {
      icon: Camera,
      title: 'Cinematic Video Delivery',
      rule: 'Post-Production Turnaround',
      detail:
        'Cinematic wedding teasers, full feature films, and color-graded highlights are edited in high fidelity and delivered alongside the final album package upon balance clearance.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1E1B18] pt-28 sm:pt-36 pb-24 selection:bg-[#E3DBCC] selection:text-[#101010]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
        
        {/* ===================================================================
            BREADCRUMB & BACK LINK
            =================================================================== */}
        <div className="mb-10 flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[#7A6E5D]">
          <Link to="/" className="hover:text-[#1E1B18] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-[#1E1B18] font-semibold">Terms &amp; Conditions</span>
        </div>

        {/* ===================================================================
            HEADER: MATCHING OFFICIAL STUDIO DOCUMENT
            =================================================================== */}
        <header className="text-center pb-12 mb-12 border-b border-[#E5DCD0]">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center justify-center gap-3"
          >
            <div className="mb-2">
              <Logo variant="dark" height={56} withText={false} />
            </div>

            <h1
              style={{ fontFamily: 'var(--font-serif)' }}
              className="text-3xl sm:text-5xl font-medium tracking-[0.14em] uppercase text-[#101010]"
            >
              DS PHOTOGRAPHY
            </h1>

            <p className="font-sans text-[11px] sm:text-xs tracking-[0.26em] uppercase text-[#7A6E5D] font-medium">
              • Photography • Videography • Cinematic Films
            </p>

            <div className="w-16 h-[1.5px] bg-[#CBB9A4] my-3" />

            <div className="inline-block px-4 py-1.5 rounded-full bg-[#EFE8DC] border border-[#DDD3C2] text-[#554737] text-[10px] sm:text-xs font-mono tracking-[0.22em] uppercase font-semibold">
              Payment Terms &amp; Delivery Timeline
            </div>
          </motion.div>
        </header>

        {/* ===================================================================
            SECTION 01: PAYMENT TERMS & SCHEDULE (OFFICIAL DOCUMENT POLICY)
            =================================================================== */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <CreditCard className="w-5 h-5 text-[#9E8159]" />
            <h2
              style={{ fontFamily: 'var(--font-serif)' }}
              className="text-2xl sm:text-3xl text-[#101010] tracking-wide"
            >
              01. Payment Terms &amp; Milestones
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {paymentMilestones.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-[#FFFFFF] border border-[#E3D9CA] rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
              >
                {/* Accent Top Border */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#101010]" />

                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="text-3xl sm:text-4xl font-serif text-[#101010] font-medium">
                      {item.percentage}
                    </span>
                    <span className="text-[10px] font-mono tracking-widest uppercase px-2.5 py-1 rounded-full bg-[#FAF7F0] border border-[#E3D9CA] text-[#7A6E5D]">
                      {item.status}
                    </span>
                  </div>

                  <h3 className="font-serif text-lg text-[#101010] mb-1 font-semibold">
                    {item.title}
                  </h3>

                  <p className="font-sans text-xs font-medium text-[#9E8159] tracking-wider uppercase mb-3">
                    {item.timeline}
                  </p>

                  <p className="font-sans text-xs sm:text-[13px] text-[#554C42] leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-[#F0EBE1] flex items-center gap-2 text-[11px] font-mono text-[#8C8070]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32]" />
                  <span>Binding atelier commission clause</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ===================================================================
            SECTION 02: DELIVERY TIMELINE & SELECTION DEADLINE
            =================================================================== */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <Calendar className="w-5 h-5 text-[#9E8159]" />
            <h2
              style={{ fontFamily: 'var(--font-serif)' }}
              className="text-2xl sm:text-3xl text-[#101010] tracking-wide"
            >
              02. Delivery Timeline &amp; Curation Guidelines
            </h2>
          </div>

          <div className="space-y-5">
            {deliveryTimelines.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-[#FFFFFF] border border-[#E3D9CA] rounded-2xl p-6 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#FAF7F0] border border-[#E3D9CA] flex items-center justify-center shrink-0 text-[#101010] mt-0.5">
                      <Icon className="w-5 h-5" />
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <h3 className="font-serif text-lg sm:text-xl text-[#101010] font-medium">
                          {item.title}
                        </h3>
                        <span className="text-[10px] font-mono tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-[#101010] text-[#FDFCF8]">
                          {item.rule}
                        </span>
                      </div>

                      <p className="font-sans text-xs sm:text-[13.5px] text-[#554C42] leading-relaxed max-w-3xl">
                        {item.detail}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ===================================================================
            SECTION 03: GENERAL ATELIER PROTOCOLS & CLIENT RIGHTS
            =================================================================== */}
        <section className="mb-16 bg-[#FFFFFF] border border-[#E3D9CA] rounded-3xl p-8 sm:p-12 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <ShieldCheck className="w-5 h-5 text-[#9E8159]" />
            <h2
              style={{ fontFamily: 'var(--font-serif)' }}
              className="text-2xl sm:text-3xl text-[#101010] tracking-wide"
            >
              03. Studio Standards &amp; Client Agreement
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs sm:text-[13.5px] text-[#554C42] leading-relaxed">
            <div className="space-y-4">
              <div>
                <h4 className="font-serif text-base text-[#101010] font-semibold mb-1">
                  Copyright &amp; Personal License
                </h4>
                <p>
                  DS Photography &amp; Films retains full artistic copyright of all photographic and video assets. Clients receive lifetime, royalty-free reproduction rights for personal non-commercial printing, social media sharing, and family archiving.
                </p>
              </div>

              <div>
                <h4 className="font-serif text-base text-[#101010] font-semibold mb-1">
                  Rescheduling &amp; Date Changes
                </h4>
                <p>
                  In the event of unforeseen rescheduling, dates may be transferred subject to studio availability with written notice provided at least 30 days prior to the original booking date.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-serif text-base text-[#101010] font-semibold mb-1">
                  Equipment Redundancy &amp; Dual Storage
                </h4>
                <p>
                  All weddings and events are captured using high-end cinema bodies and prime lenses with dual SD/CFexpress card recording, backed up to multi-redundant secure cloud and on-premise storage immediately post-event.
                </p>
              </div>

              <div>
                <h4 className="font-serif text-base text-[#101010] font-semibold mb-1">
                  Creative Discretion &amp; Color Grading
                </h4>
                <p>
                  Editing, color balancing, and cinematic grading are executed in our signature warm editorial style. Adjustments and album layout proofs are reviewed in collaboration with clients prior to binding.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================
            BOTTOM COMMISSION ACTION
            =================================================================== */}
        <div className="text-center pt-6">
          <p className="font-sans text-xs tracking-widest uppercase text-[#7A6E5D] mb-4">
            Have questions regarding payment schedules or bespoke commissions?
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/services#book"
              className="inline-flex items-center gap-2 bg-[#101010] text-[#FDFCF8] hover:bg-[#262422] px-8 py-3.5 rounded-full font-sans text-xs font-semibold uppercase tracking-[0.16em] transition-all shadow-md group"
            >
              <span>Book Your Wedding / Event</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <button
              type="button"
              onClick={onOpenInquiry}
              className="inline-flex items-center gap-2 bg-[#FAF8F5] border border-[#101010] text-[#101010] hover:bg-[#101010] hover:text-[#FAF8F5] px-8 py-3.5 rounded-full font-sans text-xs font-semibold uppercase tracking-[0.16em] transition-all cursor-pointer"
            >
              <span>Contact Atelier Directly</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
