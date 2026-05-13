"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { getUserFromToken } from "@/app/_lib/auth";
import { useEffect, useState } from "react";

type NavItem = {
  href: string;
  label: string;
  description: string;
};

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", description: "Candidate results" },
  { href: "/exams", label: "Exams", description: "Manage assessments" },
  { href: "/question-bank", label: "Question Bank", description: "MCQ library" },
  { href: "/candidates", label: "Candidates", description: "Submissions and status" },
  { href: "/users", label: "Users", description: "Owner HR management" },
  { href: "/admin/emails", label: "Communication", description: "sending emails" },
];

export default function Sidebar() {
  const router = useRouter();

const logout = () => {
  localStorage.removeItem("token");
  router.push("/login");
};

const [user, setUser] = useState<any>(null);

useEffect(() => {
  setUser(getUserFromToken());
}, []);

  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-72 shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-6 py-6">
        <p className="text-2xl font-bold text-blue-600">HireGate</p>
        <p className="mt-1 text-sm text-slate-500">HR Exam Platform</p>
      </div>

      <nav className="flex-1 space-y-2 px-4 py-4">
{navItems
  .filter((item) => {
    if (item.href === "/users" && user?.role !== "CEO") {
      return false; // hide Users
    }
    return true;
  })
  .map((item) => {
    const isActive =
      pathname === item.href ||
      pathname.startsWith(`${item.href}/`);

    return (
      <Link
        key={item.href}
        href={item.href}
        className={[
          "block rounded-lg px-4 py-3 transition-colors",
          isActive
            ? "bg-blue-50 text-blue-600"
            : "text-slate-700 hover:bg-slate-50",
        ].join(" ")}
      >
        <p
          className={[
            "text-base font-medium",
            isActive ? "text-blue-600" : "text-slate-900",
          ].join(" ")}
        >
          {item.label}
        </p>
        <p className="mt-1 text-xs text-slate-500">
          {item.description}
        </p>
      </Link>
    );
  })}

      </nav>

      <div className="border-t border-slate-200 px-4 py-4">
        <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-600">
            HG
          </div>
          <div>
            <p className="text-sm font-medium text-slate-900">HireGate Team</p>
            <p className="text-xs text-slate-500">Internal dashboard</p>
          </div>
        </div>

        {/* 🔥 LOGOUT BUTTON (NEW) */}
      <button
        onClick={logout}
        className="w-full rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 transition"
      >
        Logout
      </button>
        
      </div>
    </aside>
  );
}
