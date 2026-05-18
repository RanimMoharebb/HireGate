"use client";

import { useDisableBodyScroll, restoreBodyScroll } from "@/app/_hooks/useDisableBodyScroll";
import { Loader, Trash2, X } from "lucide-react";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  loading: boolean;
  title: string;
  description: string;
  itemLabel?: string;
  confirmLabel?: string;
  onCancel: () => void;
  onConfirm: () => void;
}
export function DeleteConfirmationModal({
  isOpen,
  loading,
  title,
  description,
  itemLabel,
  confirmLabel = "Delete",
  onCancel,
  onConfirm,
}: DeleteConfirmationModalProps) {
  if (!isOpen) {
    return null;
  }
  useDisableBodyScroll();

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => { restoreBodyScroll(); onCancel(); }}>
      <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl border border-gray-200 relative" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => { restoreBodyScroll(); onCancel(); }}
          aria-label="Close"
          className="absolute top-3 right-3 p-1 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
        >
          <X size={18} />
        </button>
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
            <Trash2 size={20} className="text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-600 mb-4">{description}</p>
          {itemLabel ? <p className="text-sm text-gray-700 mb-6 line-clamp-2">{itemLabel}</p> : null}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => { restoreBodyScroll(); onCancel(); }}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={() => { restoreBodyScroll(); onConfirm(); }}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:bg-gray-400 flex items-center justify-center gap-2"
            >
              {loading && <Loader size={16} className="animate-spin" />}
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
