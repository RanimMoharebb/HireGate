import { Loader, Trash2 } from "lucide-react";
import { Question } from "@/app/_lib/question-bank.types";

interface DeleteQuestionModalProps {
  question: Question | null;
  loading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function DeleteQuestionModal({
  question,
  loading,
  onCancel,
  onConfirm,
}: DeleteQuestionModalProps) {
  if (!question) {
    return null;
  }

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl border border-gray-200">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
            <Trash2 size={20} className="text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Question</h3>
          <p className="text-sm text-gray-600 mb-4">
            Are you sure you want to delete this question? This action cannot be undone.
          </p>
          <p className="text-sm text-gray-700 mb-6 line-clamp-2">{question.questionText}</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onCancel}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:bg-gray-400 flex items-center justify-center gap-2"
            >
              {loading && <Loader size={16} className="animate-spin" />}
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
