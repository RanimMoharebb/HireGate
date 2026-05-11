import { FormEvent } from "react";
import { Loader, X } from "lucide-react";
import { QuestionFormData, Topic } from "@/app/_lib/question-bank.types";

interface QuestionFormModalProps {
  isOpen: boolean;
  isEditingMode: boolean;
  loading: boolean;
  topics: Topic[];
  formData: QuestionFormData;
  formError: string | null;
  onClose: () => void;
  onSubmit: (event: FormEvent) => void;
  setFormData: (data: QuestionFormData) => void;
}

export function QuestionFormModal({
  isOpen,
  isEditingMode,
  loading,
  topics,
  formData,
  formError,
  onClose,
  onSubmit,
  setFormData,
}: QuestionFormModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-white rounded-xl p-4 sm:p-8 max-w-4xl w-full max-h-[95vh] overflow-y-auto">
        <div className="pt-6 sm:pt-8 pb-4 mb-4 border-b border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl sm:text-2xl font-bold">
              {isEditingMode ? "Edit Question" : "Add New Question"}
            </h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 sm:space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Question</label>
            <textarea
              value={formData.questionText}
              onChange={(event) => setFormData({ ...formData, questionText: event.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm sm:text-base"
              rows={3}
              placeholder="Enter your question here"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Image URL (Optional)</label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(event) => setFormData({ ...formData, imageUrl: event.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm sm:text-base"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Topic</label>
              <select
                value={formData.topicId}
                onChange={(event) => setFormData({ ...formData, topicId: event.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm sm:text-base"
              >
                <option value="">Select a topic</option>
                {topics.map((topic) => (
                  <option key={topic.id} value={topic.id.toString()}>
                    {topic.topicName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Answer Options</label>
            <div className="space-y-3">
              {formData.choices.map((choice, index) => (
                <div key={index} className="flex flex-col sm:flex-row sm:items-end gap-2">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={choice.choiceText}
                      onChange={(event) => {
                        const updatedChoices = [...formData.choices];
                        updatedChoices[index] = {
                          ...updatedChoices[index],
                          choiceText: event.target.value,
                        };
                        setFormData({ ...formData, choices: updatedChoices });
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm sm:text-base"
                      placeholder={`Option ${String.fromCharCode(65 + index)}`}
                      required
                    />
                  </div>
                  <label className="flex items-center gap-2 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={choice.isCorrect}
                      onChange={(event) => {
                        const updatedChoices = formData.choices.map((item, itemIndex) => ({
                          ...item,
                          isCorrect: itemIndex === index ? event.target.checked : false,
                        }));
                        setFormData({ ...formData, choices: updatedChoices });
                      }}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-gray-600">Correct</span>
                  </label>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Mark the correct answer by checking one checkbox
            </p>
          </div>

          {formError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {formError}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium order-2 sm:order-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400 flex items-center justify-center gap-2 order-1 sm:order-2"
            >
              {loading && <Loader size={16} className="animate-spin" />}
              {isEditingMode ? "Update Question" : "Add Question"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
