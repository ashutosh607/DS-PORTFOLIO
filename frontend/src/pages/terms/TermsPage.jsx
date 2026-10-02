import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Calendar, CreditCard, Clock, BookOpen, Camera, CheckCircle2, ArrowRight } from 'lucide-react';
import Logo from '../../components/layout/Logo';

/**
 * Editorial Word-by-Word Blur-to-Clear Reveal
 * Words glide into view from an artistic lens blur (blur(12px) -> blur(0px))
 * with organic micro-staggering, delivering high-end editorial elegance.
 */
function WordBlurReveal({
  text,
  as: Component = 'div',
  className = '',
  style = {},
  delay = 0,
  stagger = 0.035,
  blur = 10,
}) {
  const words = typeof text === 'string' ? text.split(' ') : [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  const wordVariants = {
    hidden: {
      opacity: 0,
      filter: `blur(${blur}px)`,
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  if (!words.length) return null;

  return (
    <Component className={className} style={style}>
      <motion.span
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-30px' }}
        style={{ display: 'inline' }}
      >
        {words.map((word, i) => (
          <motion.span
            key={i}
            variants={wordVariants}
            style={{
              display: 'inline-block',
              willChange: 'transform, opacity, filter',
            }}
          >
            {word}&nbsp;
          </motion.span>
        ))}
      </motion.span>
    </Component>
  );
}

/**
 * Editorial Pop-Up Card Entrance
 * Cards pop up into focus with subtle spring scaling (0.94 -> 1.0),
 * vertical glide (y: 32 -> 0), and optical lens de-blurring.
 */
function PopUpCard({
  children,
  index = 0,
  delay = 0,
  className = '',
  style = {},
  enableHover = true,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32, scale: 0.94, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.65,
        delay: delay + index * 0.12,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={
        enableHover
          ? {
              y: -5,
              transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
            }
          : undefined
      }
      className={className}
      style={{
        willChange: 'transform, opacity, filter',
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Silky Blur Fade-In Block
 */
function BlurFadeIn({
  children,
  delay = 0,
  y = 18,
  blur = 8,
  className = '',
  style = {},
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y, filter: `blur(${blur}px)` }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
      style={{
        willChange: 'transform, opacity, filter',
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
}

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
        <BlurFadeIn delay={0.05} y={10} blur={6} className="mb-10 flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[#7A6E5D]">
          <Link to="/" className="hover:text-[#1E1B18] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-[#1E1B18] font-semibold">Terms &amp; Conditions</span>
        </BlurFadeIn>

        {/* ===================================================================
            HEADER: MATCHING OFFICIAL STUDIO DOCUMENT
            =================================================================== */}
        <header className="text-center pb-12 mb-12 border-b border-[#E5DCD0]">
          <div className="flex flex-col items-center justify-center gap-3">
            {/* Studio Logo with Optical Scaling Entrance */}
            <motion.div
              initial={{ opacity: 0, scale: 0.82, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="mb-2"
            >
              <Logo variant="dark" height={56} withText={false} />
            </motion.div>

            {/* Title: Words Blur-to-Clear */}
            <WordBlurReveal
              as="h1"
              text="DS PHOTOGRAPHY"
              delay={0.12}
              stagger={0.08}
              blur={14}
              style={{ fontFamily: 'var(--font-serif)' }}
              className="text-3xl sm:text-5xl font-medium tracking-[0.14em] uppercase text-[#101010]"
            />

            {/* Subtitle: Words Blur-to-Clear */}
            <WordBlurReveal
              as="p"
              text="• Photography • Videography • Cinematic Films"
              delay={0.28}
              stagger={0.04}
              blur={8}
              className="font-sans text-[11px] sm:text-xs tracking-[0.26em] uppercase text-[#7A6E5D] font-medium"
            />

            {/* Divider Hairline with ScaleX Reveal */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.75, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="w-16 h-[1.5px] bg-[#CBB9A4] my-3 origin-center"
            />

            {/* Official Document Pill Badge */}
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.9, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.55, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="inline-block px-4 py-1.5 rounded-full bg-[#EFE8DC] border border-[#DDD3C2] text-[#554737] text-[10px] sm:text-xs font-mono tracking-[0.22em] uppercase font-semibold shadow-xs"
            >
              Payment Terms &amp; Delivery Timeline
            </motion.div>
          </div>
        </header>

        {/* ===================================================================
            SECTION 01: PAYMENT TERMS & SCHEDULE (OFFICIAL DOCUMENT POLICY)
            =================================================================== */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -8 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <CreditCard className="w-5 h-5 text-[#9E8159]" />
            </motion.div>
            <WordBlurReveal
              as="h2"
              text="01. Payment Terms & Milestones"
              delay={0.06}
              stagger={0.04}
              blur={10}
              style={{ fontFamily: 'var(--font-serif)' }}
              className="text-2xl sm:text-3xl text-[#101010] tracking-wide"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {paymentMilestones.map((item, idx) => (
              <PopUpCard
                key={idx}
                index={idx}
                className="bg-[#FFFFFF] border border-[#E3D9CA] rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
              >
                {/* Accent Top Border with Hover Glow */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#101010] group-hover:bg-[#9E8159] transition-colors duration-300" />

                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <motion.span
                      initial={{ scale: 0.85, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.45, delay: idx * 0.12 + 0.15, ease: [0.16, 1, 0.3, 1] }}
                      className="text-3xl sm:text-4xl font-serif text-[#101010] font-medium"
                    >
                      {item.percentage}
                    </motion.span>
                    <span className="text-[10px] font-mono tracking-widest uppercase px-2.5 py-1 rounded-full bg-[#FAF7F0] border border-[#E3D9CA] text-[#7A6E5D]">
                      {item.status}
                    </span>
                  </div>

                  <WordBlurReveal
                    as="h3"
                    text={item.title}
                    delay={idx * 0.1 + 0.12}
                    blur={8}
                    className="font-serif text-lg text-[#101010] mb-1 font-semibold"
                  />

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
              </PopUpCard>
            ))}
          </div>
        </section>

        {/* ===================================================================
            SECTION 02: DELIVERY TIMELINE & SELECTION DEADLINE
            =================================================================== */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -8 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <Calendar className="w-5 h-5 text-[#9E8159]" />
            </motion.div>
            <WordBlurReveal
              as="h2"
              text="02. Delivery Timeline & Curation Guidelines"
              delay={0.06}
              stagger={0.035}
              blur={10}
              style={{ fontFamily: 'var(--font-serif)' }}
              className="text-2xl sm:text-3xl text-[#101010] tracking-wide"
            />
          </div>

          <div className="space-y-5">
            {deliveryTimelines.map((item, idx) => {
              const Icon = item.icon;
              return (
                <PopUpCard
                  key={idx}
                  index={idx}
                  delay={0.08}
                  className="bg-[#FFFFFF] border border-[#E3D9CA] rounded-2xl p-6 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="flex items-start gap-4">
                    <motion.div
                      whileHover={{ scale: 1.08, rotate: 5 }}
                      transition={{ duration: 0.2 }}
                      className="w-10 h-10 rounded-xl bg-[#FAF7F0] border border-[#E3D9CA] flex items-center justify-center shrink-0 text-[#101010] mt-0.5 group-hover:border-[#CBB9A4] transition-colors"
                    >
                      <Icon className="w-5 h-5" />
                    </motion.div>

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
                </PopUpCard>
              );
            })}
          </div>
        </section>

        {/* ===================================================================
            SECTION 03: GENERAL ATELIER PROTOCOLS & CLIENT RIGHTS
            =================================================================== */}
        <PopUpCard delay={0.05} enableHover={false} className="mb-16 bg-[#FFFFFF] border border-[#E3D9CA] rounded-3xl p-8 sm:p-12 shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-3 mb-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <ShieldCheck className="w-5 h-5 text-[#9E8159]" />
            </motion.div>
            <WordBlurReveal
              as="h2"
              text="03. Studio Standards & Client Agreement"
              delay={0.06}
              stagger={0.035}
              blur={10}
              style={{ fontFamily: 'var(--font-serif)' }}
              className="text-2xl sm:text-3xl text-[#101010] tracking-wide"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs sm:text-[13.5px] text-[#554C42] leading-relaxed">
            <div className="space-y-4">
              <BlurFadeIn delay={0.1}>
                <h4 className="font-serif text-base text-[#101010] font-semibold mb-1">
                  Copyright &amp; Personal License
                </h4>
                <p>
                  DS Photography &amp; Films retains full artistic copyright of all photographic and video assets. Clients receive lifetime, royalty-free reproduction rights for personal non-commercial printing, social media sharing, and family archiving.
                </p>
              </BlurFadeIn>

              <BlurFadeIn delay={0.18}>
                <h4 className="font-serif text-base text-[#101010] font-semibold mb-1">
                  Rescheduling &amp; Date Changes
                </h4>
                <p>
                  In the event of unforeseen rescheduling, dates may be transferred subject to studio availability with written notice provided at least 30 days prior to the original booking date.
                </p>
              </BlurFadeIn>
            </div>

            <div className="space-y-4">
              <BlurFadeIn delay={0.26}>
                <h4 className="font-serif text-base text-[#101010] font-semibold mb-1">
                  Equipment Redundancy &amp; Dual Storage
                </h4>
                <p>
                  All weddings and events are captured using high-end cinema bodies and prime lenses with dual SD/CFexpress card recording, backed up to multi-redundant secure cloud and on-premise storage immediately post-event.
                </p>
              </BlurFadeIn>

              <BlurFadeIn delay={0.34}>
                <h4 className="font-serif text-base text-[#101010] font-semibold mb-1">
                  Creative Discretion &amp; Color Grading
                </h4>
                <p>
                  Editing, color balancing, and cinematic grading are executed in our signature warm editorial style. Adjustments and album layout proofs are reviewed in collaboration with clients prior to binding.
                </p>
              </BlurFadeIn>
            </div>
          </div>
        </PopUpCard>

        {/* ===================================================================
            BOTTOM COMMISSION ACTION
            =================================================================== */}
        <div className="text-center pt-6">
          <WordBlurReveal
            as="p"
            text="Have questions regarding payment schedules or bespoke commissions?"
            delay={0.08}
            stagger={0.03}
            blur={8}
            className="font-sans text-xs tracking-widest uppercase text-[#7A6E5D] mb-5"
          />

          <BlurFadeIn delay={0.2} y={15} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.div
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                to="/services#book"
                className="inline-flex items-center gap-2 bg-[#101010] text-[#FDFCF8] hover:bg-[#262422] px-8 py-3.5 rounded-full font-sans text-xs font-semibold uppercase tracking-[0.16em] transition-all shadow-md group"
              >
                <span>Book Your Wedding / Event</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2 }}
            >
              <button
                type="button"
                onClick={onOpenInquiry}
                className="inline-flex items-center gap-2 bg-[#FAF8F5] border border-[#101010] text-[#101010] hover:bg-[#101010] hover:text-[#FAF8F5] px-8 py-3.5 rounded-full font-sans text-xs font-semibold uppercase tracking-[0.16em] transition-all cursor-pointer shadow-xs"
              >
                <span>Contact Atelier Directly</span>
              </button>
            </motion.div>
          </BlurFadeIn>
        </div>

      </div>
    </div>
  );
}
