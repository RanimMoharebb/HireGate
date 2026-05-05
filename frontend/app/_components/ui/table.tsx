import type { ReactNode, ThHTMLAttributes, TdHTMLAttributes } from "react";

type ChildrenProps = {
  children: ReactNode;
};

type HeaderCellProps = ChildrenProps & {
  className?: string;
};

export function Table({ children }: ChildrenProps) {
  return <table className="w-full">{children}</table>;
}

export function TableHead({ children }: ChildrenProps) {
  return <thead className="bg-slate-50 border-b border-slate-200">{children}</thead>;
}

export function TableBody({ children }: ChildrenProps) {
  return <tbody className="divide-y divide-slate-200">{children}</tbody>;
}

export function TableRow({ children }: ChildrenProps) {
  return <tr className="transition-colors hover:bg-slate-50">{children}</tr>;
}

export function TableHeader({
  children,
  className = "",
  ...props
}: HeaderCellProps & ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={[
        "px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </th>
  );
}

export function TableCell({
  children,
  className = "",
  ...props
}: HeaderCellProps & TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={["px-6 py-4", className].join(" ")} {...props}>
      {children}
    </td>
  );
}
