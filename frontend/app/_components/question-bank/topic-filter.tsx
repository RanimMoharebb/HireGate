import { Topic } from "@/app/_lib/question-bank.types";

interface TopicFilterProps {
  topics: Topic[];
  selectedTopic: string;
  onSelect: (topicId: string) => void;
}

export function TopicFilter({ topics, selectedTopic, onSelect }: TopicFilterProps) {
  return (
    <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 -mx-2 px-2 sm:mx-0 sm:px-0">
      <button
        onClick={() => onSelect("all")}
        className={`flex items-center gap-2 px-3 py-2 sm:px-4 rounded-lg whitespace-nowrap transition-colors text-sm sm:text-base ${
          selectedTopic === "all"
            ? "bg-blue-600 text-white"
            : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
        }`}
      >
        <span className="capitalize">All</span>
      </button>
      {topics.map((topic) => (
        <button
          key={topic.id}
          onClick={() => onSelect(topic.id.toString())}
          className={`flex items-center gap-2 px-3 py-2 sm:px-4 rounded-lg whitespace-nowrap transition-colors text-sm sm:text-base cursor-pointer ${
            selectedTopic === topic.id.toString()
              ? "bg-blue-600 text-white"
              : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
          }`}
        >
          <span>{topic.topicName}</span>
        </button>
      ))}
    </div>
  );
}
