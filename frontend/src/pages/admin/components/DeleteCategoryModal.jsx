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
        className="w-full max-w-[480px] bg-[#FAF8F5] rounded-[24px] border border-[#E8E2D6] shadow-2xl p-7 relative overflow-hidden"
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
        <p className="text-[13px] text-[#57534E] mt-2 leading-relaxed">
          Are you sure you want to delete this category? This will remove{' '}
          <strong className="text-[#1C1917]">{category.name}</strong> from your collection categories.
        </p>

        {/* Category Preview Tag */}
        <div className="mt-4 p-3 bg-white border border-[#E0D9CE] rounded-xl flex items-center gap-3">
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
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-5 py-2.5 rounded-xl bg-[#EFEAE2] hover:bg-[#E5DFD5] text-[#44403C] hover:text-[#1C1917] text-[13px] font-medium transition-colors cursor-pointer border-none"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-[13px] font-medium transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
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
