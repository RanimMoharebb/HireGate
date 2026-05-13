/*
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserFromToken } from "@/app/_lib/auth";

export function useAuthGuard() {
  const router = useRouter();

  useEffect(() => {
    const user = getUserFromToken();

    if (!user) {
      localStorage.removeItem("token");
      router.push("/login");
    }
  }, [router]);
}
*/