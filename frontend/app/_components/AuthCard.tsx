"use client";

import { ReactNode } from "react";

type Props = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  titleClassName?: string;
  size?: "normal" | "compact";
};

export default function AuthCard({
  title,
  subtitle,
  children,
  titleClassName,
  size = "normal",
}: Props){
  return (

<div className="min-h-screen bg-slate-200 flex items-center justify-center p-4">
      <div
       className={`bg-white w-[420px] h-auto rounded-2xl shadow-lg flex flex-col
      ${size === "compact" ? "p-6" : "p-8"}`}>

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