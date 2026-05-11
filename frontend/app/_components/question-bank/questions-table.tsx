import { Edit2, Eye, Loader, Trash2 } from "lucide-react";
import { Question } from "@/app/_lib/question-bank.types";

interface QuestionsTableProps {
  questions: Question[];
  loading: boolean;
  onView: (question: Question) => void;
  onEdit: (question: Question) => void;
  onDelete: (question: Question) => void;
}

export function QuestionsTable({
  questions,
  loading,
  onView,
  onEdit,
  onDelete,
}: QuestionsTableProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Question
              </th>
              <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Topic
              </th>
              <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Options
              </th>
              <th className="px-3 sm:px-6 py-3 sm:py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-3 sm:px-6 py-6 sm:py-8 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Loader size={20} className="animate-spin" />
                    Loading questions...
                  </div>
                </td>
              </tr>
            ) : questions.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-3 sm:px-6 py-6 sm:py-8 text-center text-gray-500">
                  No questions found
                </td>
              </tr>
            ) : (
              questions.map((question) => (
                <tr key={question.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-3 sm:px-6 py-3 sm:py-4">
                    <div className="flex gap-2 sm:gap-3">
                      {question.questionImage && (
                        <img
                          src={question.questionImage}
                          alt="Question visual"
                          className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg border border-gray-200 flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 line-clamp-2 text-sm sm:text-base">
                          {question.questionText}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4">
                    <span className="inline-flex items-center gap-1 text-xs sm:text-sm text-gray-700">
                      {question.topicName}
                    </span>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-600">
                    {question.choices.length} choices
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4">
                    <div className="flex gap-1 sm:gap-2 justify-center">
                      <button
                        onClick={() => onView(question)}
                        className="p-1.5 sm:p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                        title="View details"
                      >
                        <Eye size={14} className="sm:w-4 sm:h-4" />
                      </button>
                      <button
                        onClick={() => onEdit(question)}
                        className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        title="Edit question"
                      >
                        <Edit2 size={14} className="sm:w-4 sm:h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(question)}
                        disabled={loading}
                        className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:text-gray-400 cursor-pointer"
                        title="Delete question"
                      >
                        <Trash2 size={14} className="sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
