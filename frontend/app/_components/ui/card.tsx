import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className = "" }: CardProps) {
  return (
    <div className={["rounded-xl border border-slate-200 bg-white shadow-sm", className].join(" ")}>
      {children}
    </div>
  );
}

export function CardContent({ children, className = "" }: CardProps) {
  return <div className={["p-6", className].join(" ")}>{children}</div>;
}
