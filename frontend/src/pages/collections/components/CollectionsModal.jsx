import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CollectionsModal({
  isOpen,
  onClose,
  activeCategory,
  onOpenInquiry,
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 sm:p-6 md:p-10">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[rgba(16,16,16,0.86)] backdrop-blur-md"
          />

          {/* Modal Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-5xl max-h-[92vh] bg-[#FAF8F5] rounded-xl border border-[#E0D8CA] shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 sm:p-8 border-b border-[#E0D8CA] flex items-center justify-between">
              <div>
                <span className="font-mono text-[0.65rem] tracking-[0.22em] text-[#8A857D] uppercase">
                  Archival Contact Sheet · {activeCategory.id}
                </span>
                <h3
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.85rem',
                    color: '#101010',
                    fontWeight: 400,
                  }}
                >
                  {activeCategory.name} Collection
                </h3>
              </div>

              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full border border-[#D5CDBC] bg-white hover:bg-[#101010] hover:text-white transition-colors flex items-center justify-center text-sm cursor-pointer"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 sm:p-8 overflow-y-auto max-h-[calc(92vh-180px)] space-y-8">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-[#7A746B] pb-3 border-b border-[#ECE6DB]">
                <span>{activeCategory.medium}</span>
                <span>{activeCategory.location}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {/* Featured Frame */}
                <div className="flex flex-col gap-2">
                  <div className="relative aspect-[4/3] rounded-[3px] overflow-hidden bg-[#1A1917] border border-[#E0D8CA]">
                    {activeCategory.featured.type === 'video' ? (
                      <video
                        src={activeCategory.featured.image}
                        controls
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={activeCategory.featured.image}
                        alt={activeCategory.featured.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <span className="font-mono text-[0.6rem] uppercase tracking-wider text-[#7A746B]">
                    01 / Master Hero Frame
                  </span>
                </div>

                {/* Supporting Frames */}
                {activeCategory.supporting.map((sup, i) => (
                  <div key={sup.id} className="flex flex-col gap-2">
                    <div className="relative aspect-[4/3] rounded-[3px] overflow-hidden bg-[#1A1917] border border-[#E0D8CA]">
                      {sup.type === 'video' ? (
                        <video
                          src={sup.image}
                          controls
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <img
                          src={sup.image}
                          alt={sup.tag}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <span className="font-mono text-[0.6rem] uppercase tracking-wider text-[#7A746B]">
                      0{i + 2} / {sup.tag.split('—')[0]}
                    </span>
                  </div>
                ))}

                {/* Sixth Frame */}
                <div className="flex flex-col gap-2">
                  <div className="relative aspect-[4/3] rounded-[3px] overflow-hidden bg-[#1A1917] border border-[#E0D8CA]">
                    <img
                      src={activeCategory.coverImage}
                      alt="Archival Close"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="font-mono text-[0.6rem] uppercase tracking-wider text-[#7A746B]">
                    06 / Atmospheric Close
                  </span>
                </div>
              </div>

              {/* Consultation CTA Inside Modal */}
              <div className="p-6 rounded-lg bg-[#F0EBE1] border border-[#DDD5C5] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.25rem',
                      color: '#101010',
                    }}
                  >
                    Commission The {activeCategory.name} Collection
                  </h4>
                  <p className="text-xs text-[#5C5852] mt-1">
                    Each project is tailored with bespoke lighting, medium-format capture, and archival print delivery.
                  </p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    if (onOpenInquiry) {
                      onOpenInquiry(activeCategory.name);
                    }
                  }}
                  className="btn-primary flex-shrink-0"
                >
                  Inquire For {activeCategory.name}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
