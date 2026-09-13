import React from 'react';

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
  mediaItem,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-[20px] sm:p-[28px]">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/55 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Dialog: 28-32px padding, 16px radius */}
      <div className="relative z-10 w-full max-w-md bg-[#FAF8F5] border border-[#E3DBCC] rounded-[16px] p-[24px] sm:p-[32px] shadow-2xl text-center">
        <div className="w-14 h-14 rounded-full bg-[#FAF0F0] border border-[#E8C4C4] text-[#992E2E] flex items-center justify-center mx-auto mb-[20px] text-lg font-bold">
          !
        </div>

        <h3
          style={{ fontFamily: 'var(--font-serif)' }}
          className="text-[24px] text-[#101010] font-normal leading-tight mb-[12px]"
        >
          Delete this media?
        </h3>

        <p className="font-sans text-xs sm:text-sm text-[#7A7770] leading-relaxed mb-[24px]">
          This action cannot be undone. The media will be permanently removed from cloud storage and the live portfolio collection.
        </p>

        {mediaItem?.title && (
          <div className="p-[14px] bg-[#F3F0E9] rounded-[8px] text-xs font-mono text-[#55493A] truncate mb-[28px]">
            {mediaItem.title}
          </div>
        )}

        <div className="pt-[24px] border-t border-[#E3DBCC]/60 flex items-center gap-[12px]">
          <button
            type="button"
            disabled={isDeleting}
            onClick={onClose}
            className="flex-1 h-[48px] px-[20px] rounded-[8px] border border-[#E3DBCC] hover:bg-[#F3F0E9] text-[#55493A] font-sans text-xs font-semibold tracking-[0.14em] uppercase transition-colors cursor-pointer disabled:opacity-50"
          >
            CANCEL
          </button>

          <button
            type="button"
            disabled={isDeleting}
            onClick={onConfirm}
            className="flex-1 h-[48px] px-[20px] rounded-[8px] bg-[#992E2E] hover:bg-[#7D2424] text-white font-sans text-xs font-semibold tracking-[0.14em] uppercase transition-all duration-200 cursor-pointer shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isDeleting ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>DELETING...</span>
              </>
            ) : (
              <span>DELETE</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
