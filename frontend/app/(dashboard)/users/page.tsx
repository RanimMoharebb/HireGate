"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getUserFromToken } from "@/app/_lib/auth";

export default function UsersPage() {
  const router = useRouter();

  useEffect(() => {
    const user = getUserFromToken();

    if (!user || user.role !== "CEO") {
      router.push("/dashboard");
    }
  }, []);

  return <div>Users Page</div>;
}