import Input from "@/app/_components/ui/input";

interface QuestionSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function QuestionSearch({ value, onChange }: QuestionSearchProps) {
  return (
    <div className="w-full min-w-0">
      <label htmlFor="question-bank-search" className="mb-1 block text-sm font-medium text-gray-600">
        Search
      </label>
      <Input
        id="question-bank-search"
        type="text"
        placeholder="Search questions..."
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
