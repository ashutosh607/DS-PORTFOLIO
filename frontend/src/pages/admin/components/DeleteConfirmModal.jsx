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

      {/* Modal Dialog */}
      <div
        className="relative z-10 w-full max-w-md rounded-[20px] shadow-2xl text-center"
        style={{
          backgroundColor: '#FAF8F5',
          border: '1px solid #E3DBCC',
          padding: '36px 32px',
        }}
      >
        {/* Warning icon */}
        <div
          className="flex items-center justify-center mx-auto"
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: '#FAF0F0',
            border: '1px solid #E8C4C4',
            color: '#992E2E',
            fontSize: '18px',
            fontWeight: 'bold',
            marginBottom: '24px',
          }}
        >
          !
        </div>

        <h3
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '24px',
            color: '#101010',
            fontWeight: 400,
            lineHeight: 1.3,
            marginBottom: '14px',
          }}
        >
          Delete this media?
        </h3>

        <p
          style={{
            fontFamily: 'sans-serif',
            fontSize: '14px',
            color: '#7A7770',
            lineHeight: 1.7,
            marginBottom: '28px',
            padding: '0 8px',
          }}
        >
          This action cannot be undone. The media will be permanently removed
          from cloud storage and the live portfolio collection.
        </p>

        {mediaItem?.title && (
          <div
            style={{
              padding: '14px 18px',
              backgroundColor: '#F3F0E9',
              borderRadius: '10px',
              fontFamily: 'monospace',
              fontSize: '12px',
              color: '#55493A',
              marginBottom: '28px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {mediaItem.title}
          </div>
        )}

        {/* Action Buttons */}
        <div
          style={{
            paddingTop: '24px',
            borderTop: '1px solid rgba(227, 219, 204, 0.6)',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
          }}
        >
          <button
            type="button"
            disabled={isDeleting}
            onClick={onClose}
            style={{
              flex: 1,
              height: '48px',
              padding: '0 20px',
              borderRadius: '10px',
              border: '1px solid #E3DBCC',
              backgroundColor: 'transparent',
              color: '#55493A',
              fontFamily: 'sans-serif',
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              cursor: isDeleting ? 'not-allowed' : 'pointer',
              opacity: isDeleting ? 0.5 : 1,
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              if (!isDeleting) e.target.style.backgroundColor = '#F3F0E9';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
            }}
          >
            CANCEL
          </button>

          <button
            type="button"
            disabled={isDeleting}
            onClick={onConfirm}
            style={{
              flex: 1,
              height: '48px',
              padding: '0 20px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: '#B91C1C',
              color: '#FFFFFF',
              fontFamily: 'sans-serif',
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              cursor: isDeleting ? 'not-allowed' : 'pointer',
              opacity: isDeleting ? 0.5 : 1,
              transition: 'background-color 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
            }}
            onMouseEnter={(e) => {
              if (!isDeleting) e.target.style.backgroundColor = '#991B1B';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#B91C1C';
            }}
          >
            {isDeleting ? (
              <>
                <span
                  style={{
                    width: '14px',
                    height: '14px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTop: '2px solid #fff',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    display: 'inline-block',
                  }}
                />
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
