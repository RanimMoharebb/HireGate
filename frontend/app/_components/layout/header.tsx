import type { ReactNode } from "react";

type HeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
};

export default function Header({ eyebrow, title, description, action }: HeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div>
        {eyebrow ? (
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-600">{eyebrow}</p>
        ) : null}
        <h1 className="mt-2 text-3xl font-bold text-slate-900">{title}</h1>
        {description ? <p className="mt-2 text-slate-600">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
