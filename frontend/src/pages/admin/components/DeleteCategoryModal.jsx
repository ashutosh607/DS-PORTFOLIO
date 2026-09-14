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
        className="w-full max-w-[460px] bg-white rounded-2xl border border-[#E8E2D6] shadow-2xl p-6 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isDeleting}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-[#8E887E] hover:text-[#181818] hover:bg-[#F0EAE0] transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Warning Icon */}
        <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-4">
          <AlertTriangle size={22} />
        </div>

        {/* Title */}
        <h3 className="font-serif text-[22px] text-[#181818] font-normal">
          Delete Category "{category.name}"?
        </h3>

        {/* Message */}
        <p className="text-[13px] text-[#5C5852] mt-2 leading-relaxed">
          Are you sure you want to delete this category? This will remove{' '}
          <strong className="text-[#181818]">{category.name}</strong> and its portfolio collection entry.
        </p>

        {/* Category Preview Tag */}
        <div className="mt-4 p-3 bg-[#FAF8F5] border border-[#E8E2D6] rounded-xl flex items-center gap-3">
          <img
            src={category.coverImage || category.featured?.image}
            alt={category.name}
            className="w-12 h-12 rounded-lg object-cover border border-[#E8E2D6]"
          />
          <div className="min-w-0">
            <h4 className="text-[13px] font-semibold text-[#181818] truncate">
              {category.name}
            </h4>
            <p className="text-[11px] text-[#7A756D] truncate">
              /{category.slug} · {category.tagline || 'Portfolio Category'}
            </p>
          </div>
        </div>

        {error && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 text-red-700 text-[12px] rounded-lg">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 h-[38px] rounded-lg border border-[#E8E2D6] text-[#5C5852] hover:text-[#181818] hover:bg-[#FAF8F5] text-[12px] font-medium transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-5 h-[38px] rounded-lg bg-red-600 hover:bg-red-700 text-white text-[12px] font-medium transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
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
