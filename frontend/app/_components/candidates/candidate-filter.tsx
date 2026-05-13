"use client";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export function CandidateFilter({
  value,
  onChange,
}: Props) {
  return (
    <div className="flex gap-3">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          border
          border-slate-300
          rounded-lg
          bg-white
          px-4
          py-2.5
          text-sm
          text-slate-900
          outline-none
        "
      >
        <option value="All">All</option>
        <option value="Pending">Pending</option>
        <option value="In Progress">In Progress</option>
        <option value="Submitted">Submitted</option>
      </select>
    </div>
  );
}