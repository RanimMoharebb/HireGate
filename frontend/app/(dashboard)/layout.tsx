
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getUserFromToken } from "@/app/_lib/auth";

import type { ReactNode } from "react";
import Sidebar from "@/app/_components/layout/sidebar";

// import { useAuthGuard } from "@/app/_hooks/useAuthGuard";



type DashboardLayoutProps = {
  children: ReactNode;
};


export default function DashboardLayout({ children }: DashboardLayoutProps) {

  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // You are doing two different auth systems at the same time:
  
  useEffect(() => {
    const user = getUserFromToken();

    if (!user) {
      router.push("/login");
    } else {
      setLoading(false);
    }
  }, []);

  // useAuthGuard();


  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }



  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-950">
      <Sidebar />
      <main className="min-w-0 flex-1 overflow-auto">
        <div className="p-4 sm:p-8 pt-16 lg:pt-8">{children}</div>
      </main>
    </div>
  );
}
