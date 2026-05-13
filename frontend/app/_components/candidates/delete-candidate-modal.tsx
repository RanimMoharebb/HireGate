"use client";

import { Loader, Trash2 } from "lucide-react";
import { Candidate } from "@/app/_services/candidate-service";

interface Props {
  candidate: Candidate | null;
  loading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function DeleteCandidateModal({
  candidate,
  loading,
  onCancel,
  onConfirm,
}: Props) {
  if (!candidate) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* MODAL */}
      <div className="relative z-50 bg-white rounded-2xl p-6 w-[420px] shadow-xl text-center pointer-events-auto">

        {/* ICON */}
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
          <Trash2 size={20} className="text-red-600" />
        </div>

        {/* TITLE */}
        <h3 className="text-lg font-semibold mb-2">
          Delete Candidate
        </h3>

        {/* WARNING */}
        <p className="text-sm text-gray-600 mb-4">
          This action cannot be undone.
        </p>

        {/* EMAIL */}
        <p className="text-sm text-gray-900 font-medium mb-6 break-all">
          {candidate.email}
        </p>

        {/* ACTIONS */}
        <div className="flex gap-3">

          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 border rounded-lg py-2 hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 border rounded-lg py-2 hover:bg-gray-100 transition"
          >
            {loading && (
              <Loader size={16} className="animate-spin" />
            )}
            Delete
          </button>

        </div>

      </div>
    </div>
  );
}