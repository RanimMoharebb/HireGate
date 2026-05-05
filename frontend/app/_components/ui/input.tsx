import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  className?: string;
};

export default function Input({ className = "", ...props }: InputProps) {
  return (
    <input
      className={[
        "w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition",
        "placeholder:text-slate-400 focus:border-transparent focus:ring-2 focus:ring-blue-500",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}
