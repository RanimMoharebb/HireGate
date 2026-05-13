"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

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
  { href: "/admins", label: "Admins", description: "Owner HR management" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 bg-white rounded-lg shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky inset-y-0 left-0 z-50
        flex h-screen w-72 shrink-0 flex-col border-r border-slate-200 bg-white
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="border-b border-slate-200 px-6 py-6">
          <p className="text-2xl font-bold text-blue-600">HireGate</p>
          <p className="mt-1 text-sm text-slate-500">HR Exam Platform</p>
        </div>

        <nav className="flex-1 space-y-2 px-4 py-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={[
                  "block rounded-lg px-4 py-3 transition-colors",
                  isActive ? "bg-blue-50 text-blue-600" : "text-slate-700 hover:bg-slate-50",
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
                <p className="mt-1 text-xs text-slate-500">{item.description}</p>
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
        </div>
      </aside>
    </>
  );
}
