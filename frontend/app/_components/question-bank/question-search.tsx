import Input from "@/app/_components/ui/input";

interface QuestionSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function QuestionSearch({ value, onChange }: QuestionSearchProps) {
  return (
    <div className="max-w-xl">
      <Input
        type="text"
        placeholder="Search questions..."
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
