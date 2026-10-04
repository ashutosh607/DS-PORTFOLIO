import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { COMPARISON_MATRIX_FEATURES } from '../data/servicesData';

export default function CompareMatrixModal({
  isOpen,
  onClose,
  selectedCollectionId,
  onSelectCollection,
  collections = [],
}) {
  if (!isOpen) return null;

  const displayCols = Array.isArray(collections) && collections.length > 0 ? collections : [];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#161310]/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-5xl bg-[#FAF8F5] rounded-2xl shadow-2xl border border-[#E2D8C9] overflow-hidden my-auto max-h-[90vh] flex flex-col z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 sm:px-10 py-6 border-b border-[#E8DFC0]/60 bg-[#F4EFE7]">
            <div>
              <span className="font-sans text-[10px] sm:text-[11px] font-semibold tracking-[0.24em] text-[#7A6E5D] uppercase block mb-1">
                ATELIER SPECIFICATION ARCHIVE
              </span>
              <h3
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(1.6rem, 2.2vw, 2.1rem)',
                  color: '#1E1B18',
                  fontWeight: 400,
                  lineHeight: 1.1,
                }}
              >
                Collection Comparison Matrix
              </h3>
            </div>

            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-[#EDE5D8] hover:bg-[#DDD3C2] text-[#42372A] flex items-center justify-center transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto p-6 sm:p-10 flex-1">
            <table className="w-full text-left border-collapse min-w-[650px]">
              <thead>
                <tr className="border-b border-[#E3D9CC]">
                  <th className="pb-5 font-sans text-xs font-semibold tracking-wider text-[#736554] uppercase w-1/4">
                    Dimension
                  </th>
                  {displayCols.map((col) => {
                    const colId = col.id || col._id || col.tier;
                    const isSelected =
                      Boolean(selectedCollectionId) &&
                      String(selectedCollectionId).toLowerCase().trim() === String(colId).toLowerCase().trim();

                    return (
                      <th key={colId} className="pb-5 text-center px-4">
                        <div className="font-serif text-lg font-normal text-[#1E1B18] tracking-wider uppercase">
                          {col.title || col.tier || 'Collection'}
                        </div>
                        <div className="font-sans text-[11px] text-[#7A6E5D] font-mono mt-0.5">
                          {col.price || 'Price on Request'}
                        </div>
                        <button
                          type="button"
                          onClick={() => onSelectCollection(colId)}
                          className={`mt-2.5 px-3.5 py-1 rounded-full text-[11px] font-sans font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#1E1B18] text-[#FAF8F5]'
                              : 'bg-[#ECE5D9] hover:bg-[#DFD5C6] text-[#42372A]'
                          }`}
                        >
                          {isSelected ? 'Selected' : 'Select'}
                        </button>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {COMPARISON_MATRIX_FEATURES.map((section, sIdx) => (
                  <React.Fragment key={sIdx}>
                    <tr className="bg-[#F2ECE2]/80">
                      <td
                        colSpan={Math.max(4, displayCols.length + 1)}
                        className="py-2.5 px-3 font-sans text-[11px] font-bold tracking-[0.2em] text-[#635546] uppercase"
                      >
                        {section.category}
                      </td>
                    </tr>
                    {section.items.map((row, rIdx) => (
                      <tr key={rIdx} className="border-b border-[#EBE4D8] hover:bg-white/50 transition-colors">
                        <td className="py-3.5 px-3 font-sans text-xs sm:text-[13px] font-medium text-[#2E2721]">
                          {row.name}
                        </td>
                        {displayCols.map((col, cIdx) => {
                          const colDeliverables = Array.isArray(col.deliverables) ? col.deliverables : [];
                          const keyword = row.name.toLowerCase().split(' ')[0];
                          const matched = colDeliverables.find((d) => d.toLowerCase().includes(keyword));

                          let fallbackVal = row.essential;
                          if (cIdx === 1) fallbackVal = row.signature;
                          else if (cIdx >= 2) fallbackVal = row.luxury;

                          const cellText = matched || fallbackVal || 'Included in atelier commission';
                          const isHighlighted = col.highlight || col.isAtelierChoice;

                          return (
                            <td
                              key={col.id || col._id || cIdx}
                              className={`py-3.5 px-4 text-center font-sans text-xs sm:text-[13px] text-[#55493C] ${
                                isHighlighted ? 'font-medium bg-[#FAF6F0]/60' : ''
                              }`}
                            >
                              {cellText}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-6 sm:px-10 py-4 border-t border-[#E8DFC0]/60 bg-[#F4EFE7] flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-full bg-[#1E1B18] text-[#FAF8F5] font-sans text-xs font-semibold uppercase tracking-[0.16em] hover:bg-[#332C24] transition-colors cursor-pointer"
            >
              Close &amp; Return
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
