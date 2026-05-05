import type { ReactNode } from "react";

const variants = {
  success: "bg-green-100 text-green-700",
  danger: "bg-red-100 text-red-700",
  warning: "bg-yellow-100 text-yellow-700",
  neutral: "bg-slate-100 text-slate-700",
  info: "bg-blue-100 text-blue-700",
} as const;

type BadgeVariant = keyof typeof variants;

type BadgeProps = {
  variant?: BadgeVariant;
  children: ReactNode;
};

export default function Badge({ variant = "neutral", children }: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex rounded-full px-3 py-1 text-xs font-medium",
        variants[variant],
      ].join(" ")}
    >
      {children}
    </span>
  );
}
