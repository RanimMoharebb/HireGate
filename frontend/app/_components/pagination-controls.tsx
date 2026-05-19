'use client';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  loading: boolean;
  onPrev: () => void;
  onNext: () => void;
}

export function PaginationControls({
  currentPage,
  totalPages,
  loading,
  onPrev,
  onNext,
}: PaginationControlsProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="text-sm sm:text-base text-slate-700 text-center sm:text-left">
        <span className="font-semibold">{currentPage}</span> of <span className="font-semibold">{totalPages}</span>
      </div>
      <div className="flex gap-2 justify-center sm:justify-end">
    <button
      onClick={onPrev}
      disabled={currentPage === 1 || loading}
      className="
        px-3 py-2 sm:px-4
        border border-gray-300 rounded-lg
        bg-white text-slate-700
        hover:bg-gray-50
        disabled:bg-gray-100
        disabled:text-gray-400
        disabled:cursor-not-allowed
        cursor-pointer
        text-sm sm:text-base
        focus:outline-none
        focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
      "
    >
      Previous
    </button>

    <button
      onClick={onNext}
      disabled={currentPage === totalPages || loading}
      className="
        px-3 py-2 sm:px-4
        border border-gray-300 rounded-lg
        bg-white text-slate-700
        hover:bg-gray-50
        disabled:bg-gray-100
        disabled:text-gray-400
        disabled:cursor-not-allowed
        cursor-pointer
        text-sm sm:text-base
        focus:outline-none
        focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
      "
    >
      Next
    </button>
      </div>
    </div>
  );
}
