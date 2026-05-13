"use client";

import { ReactNode } from "react";

type Props = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  titleClassName?: string;
};

export default function AuthCard({
  title,
  subtitle,
  children,
  titleClassName,
}: Props) {
  return (
    <div className="min-h-screen bg-slate-200 flex items-start justify-center pt-16 pb-16">

      <div className="bg-white w-[420px] min-h-[520px] p-10 rounded-2xl shadow-lg flex flex-col">

        {/* LOGO */}
        <div className="flex flex-col items-center mb-6 shrink-0">
          <img
            src="/images/logo.png"
            alt="logo"
            className="h-14 w-auto object-contain mb-3"
          />

          <h1 className={`font-bold text-blue-600 ${titleClassName ?? "text-2xl"}`}>
            {title}
          </h1>

          {subtitle && (
            <p className="text-gray-500 text-sm text-center">
              {subtitle}
            </p>
          )}
        </div>

        {/* CONTENT */}
        <div className="flex-1 flex flex-col justify-center">
          {children}
        </div>

      </div>
    </div>
  );
}