import React, { useState } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { deleteCategory } from '../../../utils/categoryManager';
import { useAdminAuth } from '../context/AdminAuthContext';
import '../AdminDashboard.css';

export default function DeleteCategoryModal({ isOpen, onClose, onSuccess, category }) {
  const { getAuthHeaders } = useAdminAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !category) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    setError('');

    try {
      await deleteCategory(
        category._id || category.id || category.slug,
        getAuthHeaders()
      );
      if (onSuccess) {
        onSuccess(category);
      }
      onClose();
    } catch (err) {
      console.error('Failed to delete category:', err);
      setError(err.message || 'Failed to delete category.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isDeleting) onClose();
      }}
    >
      <div
        className="w-full max-w-[480px] rounded-[24px] shadow-2xl relative overflow-hidden"
        style={{
          backgroundColor: '#FAF8F5',
          border: '1px solid #E8E2D6',
          padding: '36px 32px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isDeleting}
          className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-[#EFEAE2] hover:bg-[#E5DFD5] text-[#44403C] hover:text-[#1C1917] transition-colors cursor-pointer"
        >
          <X size={16} />
        </button>

        {/* Warning Icon */}
        <div className="w-11 h-11 rounded-xl bg-red-100/70 text-red-600 flex items-center justify-center mb-4">
          <AlertTriangle size={20} />
        </div>

        {/* Title */}
        <span className="block text-[10.5px] tracking-[0.2em] text-[#78716C] uppercase font-semibold mb-1">
          CONFIRM REMOVAL
        </span>
        <h3 className="font-serif text-[24px] text-[#1C1917] font-normal">
          Delete "{category.name}"?
        </h3>

        {/* Message */}
        <p style={{ fontSize: '13px', color: '#57534E', marginTop: '10px', lineHeight: 1.7, padding: '0 4px' }}>
          Are you sure you want to delete this category? This will remove{' '}
          <strong style={{ color: '#1C1917' }}>{category.name}</strong> from your collection categories.
        </p>

        {/* Category Preview Tag */}
        <div style={{ marginTop: '18px', padding: '14px 16px', backgroundColor: '#fff', border: '1px solid #E0D9CE', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <img
            src={category.coverImage || category.featured?.image}
            alt={category.name}
            className="w-12 h-12 rounded-lg object-cover border border-[#E8E2D6]"
          />
          <div className="min-w-0">
            <h4 className="text-[13px] font-semibold text-[#1C1917] truncate">
              {category.name}
            </h4>
            <p className="text-[11px] text-[#78716C] truncate">
              /{category.slug} · {category.tagline || 'Portfolio Category'}
            </p>
          </div>
        </div>

        {error && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 text-red-700 text-[12px] rounded-xl">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ marginTop: '28px', paddingTop: '24px', borderTop: '1px solid rgba(232, 226, 214, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '14px' }}>
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            style={{ padding: '10px 22px', borderRadius: '12px', backgroundColor: '#EFEAE2', color: '#44403C', fontSize: '13px', fontWeight: 500, cursor: isDeleting ? 'not-allowed' : 'pointer', border: 'none', transition: 'background-color 0.2s' }}
            onMouseEnter={(e) => { if (!isDeleting) e.target.style.backgroundColor = '#E5DFD5'; }}
            onMouseLeave={(e) => { e.target.style.backgroundColor = '#EFEAE2'; }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            style={{ padding: '10px 22px', borderRadius: '12px', backgroundColor: '#B91C1C', color: '#FFFFFF', fontSize: '13px', fontWeight: 500, cursor: isDeleting ? 'not-allowed' : 'pointer', border: 'none', transition: 'background-color 0.2s', display: 'flex', alignItems: 'center', gap: '8px', opacity: isDeleting ? 0.5 : 1, boxShadow: '0 1px 3px rgba(0,0,0,0.12)' }}
            onMouseEnter={(e) => { if (!isDeleting) e.target.style.backgroundColor = '#991B1B'; }}
            onMouseLeave={(e) => { e.target.style.backgroundColor = '#B91C1C'; }}
          >
            {isDeleting ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 size={14} />
                <span>Delete Category</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
