import { QuestionDeletedFilter } from "@/app/_lib/question-bank.types";

interface QuestionStatusFilterProps {
  value: QuestionDeletedFilter;
  onChange: (value: QuestionDeletedFilter) => void;
}

export function QuestionStatusFilter({ value, onChange }: QuestionStatusFilterProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
      <span className="text-sm font-medium text-gray-600 whitespace-nowrap">Questions</span>
      <div className="flex gap-2 sm:gap-3">
        <button
          type="button"
          onClick={() => onChange("active")}
          className={`px-3 py-2 sm:px-4 rounded-lg text-sm sm:text-base cursor-pointertransition-colors whitespace-nowrap ${
            value === "active"
              ? "bg-blue-600 text-white"
              : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
          }`}
        >
          Active
        </button>
        <button
          type="button"
          onClick={() => onChange("deleted")}
          className={`px-3 py-2 sm:px-4 rounded-lg text-sm sm:text-base cursor-pointer transition-colors whitespace-nowrap ${
            value === "deleted"
              ? "bg-blue-600 text-white"
              : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
          }`}
        >
          Deleted
        </button>
      </div>
    </div>
  );
}
