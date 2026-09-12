import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { usePageTransition } from '../../../components/common/PageTransition';

export default function ConfirmationScreen({
  formData,
  inquiryId,
  submissionDate,
}) {
  const navigate = useNavigate();
  const { navigateWithTransition } = usePageTransition();

  // Construct structured WhatsApp click-to-chat URL with pre-filled message
  const generateWhatsAppUrl = () => {
    const phoneNumber = '919876543210'; // Studio contact WhatsApp
    const servicesList = (formData.services || []).join(', ') || 'Full Coverage';
    const message = `*NEW PHOTOGRAPHY INQUIRY*
--------------------------------
*Inquiry Ref:* ${inquiryId}
*Name:* ${formData.name || 'Not provided'}
*Email:* ${formData.email || 'Not provided'}
*Phone:* ${formData.countryCode || '+91'} ${formData.phone || ''}

*Event:* ${formData.eventType || 'Celebration'}
*Location:* ${formData.location || 'Not specified'}${formData.venue ? ` (${formData.venue})` : ''}
*Date:* ${formData.eventDate || 'TBD'}
*Duration:* ${formData.days || 'Multi-day'}

*Services:* ${servicesList}
*Budget:* ${formData.budget || 'Custom'}

*Message / Vision:*
${formData.message || 'None provided'}
--------------------------------
Sent via Raven & Lens Editorial Booking`;

    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, filter: 'blur(8px)', y: 24 }}
      animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="container mx-auto px-6 sm:px-10 md:px-12 max-w-[980px] pb-24 pt-4"
    >
      <div className="bg-[#FAF9F6] border border-[#E5DDD0] rounded-xl p-8 sm:p-14 shadow-sm relative overflow-hidden text-center flex flex-col items-center">
        
        {/* Subtle decorative stamp / corner accent */}
        <div className="absolute top-6 right-8 opacity-40 select-none pointer-events-none hidden sm:block">
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#7A6E5D] border border-[#CBB9A4] px-2.5 py-1 rounded">
            CONFIDENTIAL • STUDIO ARCHIVE
          </span>
        </div>

        {/* Large Elegant Check Icon */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#EFE9DF] border border-[#D5CBB9] flex items-center justify-center text-[#4A3B2C] mb-8 shadow-xs"
        >
          <svg
            className="w-9 h-9 sm:w-11 sm:h-11"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </motion.div>

        {/* Heading: THANK YOU, [NAME]. */}
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2.2rem, 4vw, 3.4rem)',
            lineHeight: 1.1,
            fontWeight: 400,
            color: '#1E1B18',
            marginBottom: '1rem',
          }}
        >
          THANK YOU, {formData.name ? formData.name.trim().split(' ')[0].toUpperCase() : 'FRIEND'}.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.28 }}
          className="text-base sm:text-lg text-[#554E44] max-w-lg mb-8 leading-relaxed font-sans"
        >
          We've received your inquiry. Our team will review your celebration vision and reach out within 24 hours.
        </motion.p>

        {/* Metadata summary card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="w-full max-w-md bg-white/75 border border-[#E5DDD0] rounded-lg p-5 mb-10 text-left space-y-3 shadow-2xs"
        >
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-[#7A6E5D] uppercase tracking-wider">Inquiry Reference</span>
            <span className="font-semibold text-[#1E1B18] tracking-widest">{inquiryId}</span>
          </div>

          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-[#7A6E5D] uppercase tracking-wider">Received On</span>
            <span className="text-[#1E1B18]">{submissionDate || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>

          <div className="flex justify-between items-center text-xs font-mono border-t border-[#F0EAE1] pt-2">
            <span className="text-[#7A6E5D] uppercase tracking-wider">Event Details</span>
            <span className="text-[#1E1B18]">{formData.eventType || 'Session'} • {formData.location || 'India'}</span>
          </div>
        </motion.div>

        {/* CTAs: CONTINUE TO WHATSAPP → & BACK TO HOME */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.42 }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <a
            href={generateWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#4A3B2C] hover:bg-[#382B1E] text-[#FAF8F5] px-8 py-4 rounded-full font-mono text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] transition-all duration-300 shadow-[0_10px_25px_-5px_rgba(74,59,44,0.4)] cursor-pointer group"
          >
            <span>CONTINUE TO WHATSAPP</span>
            <span className="transform transition-transform duration-300 group-hover:translate-x-1">→</span>
          </a>

          <button
            type="button"
            onClick={() => navigateWithTransition('/', 'HOME')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-transparent hover:bg-[#EFE9DF] text-[#4A3B2C] border border-[#CBB9A4] px-7 py-4 rounded-full font-mono text-xs sm:text-sm font-medium uppercase tracking-[0.2em] transition-all duration-200 cursor-pointer"
          >
            BACK TO HOME
          </button>
        </motion.div>

      </div>
    </motion.div>
  );
}
