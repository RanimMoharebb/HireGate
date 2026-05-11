import type { ReactNode } from "react";
import Sidebar from "@/app/_components/layout/sidebar";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-950">
      <Sidebar />
      <main className="min-w-0 flex-1 overflow-auto">
        <div className="p-4 sm:p-8 pt-16 lg:pt-8">{children}</div>
      </main>
    </div>
  );
}
