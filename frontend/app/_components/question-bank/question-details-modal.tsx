import { Check, X } from "lucide-react";
import { Question } from "@/app/_lib/question-bank.types";

interface QuestionDetailsModalProps {
  question: Question | null;
  onClose: () => void;
}

export function QuestionDetailsModal({ question, onClose }: QuestionDetailsModalProps) {
  if (!question) {
    return null;
  }

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-white rounded-xl p-4 sm:p-8 max-w-4xl w-full max-h-[95vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4 sm:mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center gap-1 text-sm text-gray-600">
                {question.topicName}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{question.questionText}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors ml-4 flex-shrink-0"
          >
            <X size={24} />
          </button>
        </div>

        {question.questionImage && (
          <div className="mb-8">
            <img
              src={question.questionImage}
              alt="Question visual"
              className="w-full h-64 object-cover rounded-lg border border-gray-200"
            />
          </div>
        )}

        <div className="mb-8">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Answer Options</h4>
          <div className="space-y-3">
            {question.choices.map((choice, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 transition-all ${
                  choice.isCorrect
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div
                      className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center ${
                        choice.isCorrect
                          ? "border-green-500 bg-green-500"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      {choice.isCorrect && <Check size={14} className="text-white" />}
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${choice.isCorrect ? "text-green-700" : "text-gray-900"}`}>
                        {String.fromCharCode(65 + index)}) {choice.choiceText}
                      </p>
                    </div>
                  </div>
                  {choice.isCorrect && (
                    <span className="ml-2 px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
                      Correct
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Question ID</p>
              <p className="text-gray-900 font-medium">{question.id}</p>
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
