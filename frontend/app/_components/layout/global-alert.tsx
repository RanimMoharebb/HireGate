"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { AlertMessage } from "@/app/_components/question-bank/alert-message";

function getSuccessMessage(successParam: string | null) {
  if (successParam === "created") return "Exam created successfully.";
  if (successParam === "updated") return "Exam updated successfully.";
  if (successParam === "deleted") return "Exam deleted successfully.";
  if (successParam) return "Action completed successfully.";
  return null;
}

function GlobalAlertInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [isExiting, setIsExiting] = useState(false);
  const successParam = searchParams.get("success");
  const message = getSuccessMessage(successParam);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setIsExiting(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Handle the animation unmount
  useEffect(() => {
    if (isExiting) {
      const timer = setTimeout(() => {
        const newSearchParams = new URLSearchParams(searchParams.toString());
        newSearchParams.delete("success");
        const newUrl = newSearchParams.toString() ? `${pathname}?${newSearchParams.toString()}` : pathname;
        router.replace(newUrl, { scroll: false });
        setIsExiting(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isExiting, pathname, router, searchParams]);

  const handleClose = () => {
    setIsExiting(true);
  };

  if (!message) return null;

  return (
    <div className={`mb-6 transition-all duration-300 ${isExiting ? "opacity-0 -translate-y-4" : "opacity-100 translate-y-0"}`}>
      <AlertMessage
        type="success"
        message={message}
        visible={true}
        onClose={handleClose}
      />
    </div>
  );
}

export function GlobalAlert() {
  return (
    <Suspense fallback={null}>
      <GlobalAlertInner />
    </Suspense>
  );
}
