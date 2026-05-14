"use client";

import Input from "@/app/_components/ui/input";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export function CandidateSearch({
  value,
  onChange,
}: Props) {
  return (
    <div className="flex-1">
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by name, email, exam id..."
        className="w-full"
      />
    </div>
  );
}