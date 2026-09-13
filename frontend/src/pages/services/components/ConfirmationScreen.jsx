import React from 'react';
import { motion } from 'framer-motion';
import { buildWhatsAppMessage, getWhatsAppUrl } from '../../../utils/whatsapp';

export default function ConfirmationScreen({
  formData,
  inquiryId,
  selectedCollection,
  onReset,
}) {
  const collectionName = selectedCollection ? selectedCollection.title : 'Signature';

  // Construct structured WhatsApp transmission draft
  const generateWhatsAppUrl = () => {
    const message = buildWhatsAppMessage({ formData, selectedCollection });
    return getWhatsAppUrl(message);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="container mx-auto px-4 sm:px-6 max-w-3xl pb-24 pt-8"
    >
      <div className="bg-[#FAF8F5] border border-[#E0D7C9] rounded-3xl p-8 sm:p-14 shadow-lg text-center relative overflow-hidden">
        
        {/* Subtle decorative stamp */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EDE5D8] border border-[#DDD3C2] text-[#635341] text-[10px] font-sans font-semibold tracking-[0.24em] uppercase mb-8">
          <span>ATELIER DOSSIER RECORDED</span>
        </div>

        {/* Checkmark Icon */}
        <div className="w-20 h-20 rounded-full bg-[#EFE8DC] border border-[#D5C9B7] text-[#4A3B2C] flex items-center justify-center mx-auto mb-6 shadow-sm">
          <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        {/* Heading */}
        <h2
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
            lineHeight: 1.1,
            color: '#1E1B18',
            fontWeight: 400,
            marginBottom: '1rem',
          }}
        >
          COMMISSION RECEIVED.
        </h2>

        <p className="font-sans text-sm sm:text-base text-[#615546] max-w-md mx-auto mb-8 leading-relaxed">
          Your brief has been provisionally registered on our master schedule for the <strong>{collectionName} Collection</strong>.
        </p>

        {/* Summary Card */}
        <div className="bg-[#F2ECE2] border border-[#E3D9CA] rounded-2xl p-6 text-left space-y-3 mb-10 max-w-md mx-auto text-xs font-sans">
          <div className="flex justify-between items-center">
            <span className="text-[#7A6E5D] uppercase tracking-wider text-[11px] font-semibold">Transmission Reference</span>
            <span className="font-mono font-bold text-[#1E1B18] text-sm">{inquiryId || 'RL-2025-D98'}</span>
          </div>
          <div className="flex justify-between items-center border-t border-[#E5DCD0] pt-2">
            <span className="text-[#7A6E5D] uppercase tracking-wider text-[11px] font-semibold">Client</span>
            <span className="font-medium text-[#1E1B18]">{formData.name}</span>
          </div>
          <div className="flex justify-between items-center border-t border-[#E5DCD0] pt-2">
            <span className="text-[#7A6E5D] uppercase tracking-wider text-[11px] font-semibold">Event Horizon</span>
            <span className="font-medium text-[#1E1B18]">{formData.eventType || 'Wedding'} • {formData.location}</span>
          </div>
          <div className="flex justify-between items-center border-t border-[#E5DCD0] pt-2">
            <span className="text-[#7A6E5D] uppercase tracking-wider text-[11px] font-semibold">Target Date</span>
            <span className="font-mono text-[#1E1B18]">{formData.eventDate || 'TBD'}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <a
            href={generateWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#423326] hover:bg-[#2D2218] text-[#FAF6F0] px-8 py-4 rounded-full font-sans text-xs font-semibold uppercase tracking-[0.18em] transition-all shadow-md cursor-pointer group"
          >
            <span>OPEN WHATSAPP TRANSMISSION</span>
            <span className="transform transition-transform duration-300 group-hover:translate-x-1">→</span>
          </a>

          <button
            type="button"
            onClick={onReset}
            className="w-full sm:w-auto px-6 py-4 rounded-full border border-[#D5CABB] text-[#55493A] hover:bg-[#EFE9DF] font-sans text-xs font-semibold uppercase tracking-[0.16em] transition-colors cursor-pointer"
          >
            RETURN TO ATELIER
          </button>
        </div>

      </div>
    </motion.div>
  );
}
