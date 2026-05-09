"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ThankYouPage() {
  const router = useRouter();

  // prevent going back to exam page
  useEffect(() => {
    // clear history entry for exam pages
    window.history.pushState(null, "", window.location.href);

    const handleBack = () => {
      router.replace("/"); // or login page
    };

    window.addEventListener("popstate", handleBack);

    return () => {
      window.removeEventListener("popstate", handleBack);
    };
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white shadow rounded-2xl p-10 text-center max-w-md">

        {/* ICON */}
        <div className="text-green-600 text-6xl mb-4">
          ✔
        </div>

        {/* TITLE */}
        <h1 className="text-2xl font-bold mb-2">
          Exam Submitted Successfully
        </h1>

        {/* MESSAGE */}
        <p className="text-slate-600 mb-6">
          Thank you for completing your exam.
          Your answers have been recorded successfully.
        </p>

        <div className="text-sm text-slate-500 mb-6">
          You cannot retake or modify this exam.
        </div>

        {/* BUTTON */}
        <button
          onClick={() => router.push("/")}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg"
        >
          Go Home
        </button>

      </div>
    </div>
  );
}