import React from 'react';
import { motion } from 'framer-motion';

export default function SelectionBottomBar({
  selectedCollection,
  selectedCategory,
  onOpenCompareMatrix,
  onContinueToBooking,
}) {
  if (!selectedCollection) return null;

  const categoryLabel = selectedCategory
    ? selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)
    : 'Wedding';

  return (
    <motion.div
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-[1040px] bg-[#FDFCF8]/95 backdrop-blur-md text-[#101010] px-5 sm:px-6 py-3.5 rounded-[4px] shadow-[0_12px_36px_-6px_rgba(16,16,16,0.12)] border border-[#E3DBCC] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
    >
      {/* Left Info */}
      <div className="flex items-start sm:items-center gap-3 truncate">
        <div className="w-7 h-7 rounded-[2px] bg-[#F3F0E9] border border-[#E3DBCC] flex items-center justify-center shrink-0 text-[#7A7770]">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
        </div>
        <div className="truncate">
          <div className="flex items-baseline gap-2 font-sans text-xs">
            <span className="font-semibold tracking-[0.06em] text-[#101010] uppercase">
              SELECTED: {categoryLabel} — {selectedCollection.title} Collection
            </span>
            <span className="text-[#C5B9A5]">•</span>
            <span className="text-[#7A7770]">
              Investment: {selectedCollection.price}
            </span>
          </div>
          <p className="font-sans text-[11px] text-[#7A7770] truncate mt-0.5">
            Includes 12h archival coverage, 120 medium format &amp; handcrafted Italian leather heirloom monograph.
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3 sm:gap-4 shrink-0 self-end sm:self-auto">
        <button
          type="button"
          onClick={onOpenCompareMatrix}
          className="font-sans text-[10px] uppercase tracking-[0.14em] text-[#7A7770] hover:text-[#101010] transition-colors cursor-pointer hidden sm:block"
        >
          COMPARE MATRIX
        </button>

        <button
          type="button"
          onClick={onContinueToBooking}
          className="inline-flex items-center gap-2 bg-[#101010] hover:bg-[#2A2825] text-[#FDFCF8] px-5 py-2.5 rounded-[2px] font-sans text-[10px] font-medium uppercase tracking-[0.14em] transition-all cursor-pointer"
        >
          <span>CONTINUE TO BOOKING</span>
          <span>→</span>
        </button>
      </div>
    </motion.div>
  );
}
