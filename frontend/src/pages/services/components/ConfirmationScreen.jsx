import React from 'react';
import { motion } from 'framer-motion';
import { buildWhatsAppMessage, getWhatsAppUrl } from '../../../utils/whatsapp';
import { getMailtoUrl, getGmailUrl, STUDIO_EMAIL } from '../../../utils/email';

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

  // Construct structured Email transmission draft (mailto)
  const generateMailtoUrl = () => {
    return getMailtoUrl({ formData, selectedCollection, inquiryId, toEmail: STUDIO_EMAIL });
  };

  // Construct structured Web Gmail transmission draft
  const generateGmailUrl = () => {
    return getGmailUrl({ formData, selectedCollection, inquiryId, toEmail: STUDIO_EMAIL });
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
        <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 max-w-2xl mx-auto">
          <a
            href={generateWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#101010] hover:bg-[#262422] text-[#FAF6F0] px-5 py-3 rounded-full font-sans text-xs font-semibold uppercase tracking-[0.14em] transition-all shadow-md cursor-pointer group"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#25D366]">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
            <span>OPEN WHATSAPP</span>
            <span className="transform transition-transform duration-300 group-hover:translate-x-1">→</span>
          </a>

          <a
            href={generateMailtoUrl()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#FAF8F5] border border-[#101010] hover:bg-[#101010] hover:text-[#FAF8F5] text-[#101010] px-5 py-3 rounded-full font-sans text-xs font-semibold uppercase tracking-[0.14em] transition-all shadow-sm cursor-pointer group"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
            <span>OPEN EMAIL APP</span>
            <span className="transform transition-transform duration-300 group-hover:translate-x-1">→</span>
          </a>

          <a
            href={generateGmailUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#FAF8F5] border border-[#EA4335] text-[#EA4335] hover:bg-[#EA4335] hover:text-[#FAF8F5] px-5 py-3 rounded-full font-sans text-xs font-semibold uppercase tracking-[0.14em] transition-all shadow-sm cursor-pointer group"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            <span>OPEN IN GMAIL</span>
            <span className="transform transition-transform duration-300 group-hover:translate-x-1">→</span>
          </a>

          <button
            type="button"
            onClick={onReset}
            className="w-full sm:w-auto px-4 py-3 rounded-full border border-[#D5CABB] text-[#55493A] hover:bg-[#EFE9DF] font-sans text-xs font-semibold uppercase tracking-[0.14em] transition-colors cursor-pointer"
          >
            RETURN
          </button>
        </div>

      </div>
    </motion.div>
  );
}
