"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import AuthCard from "@/app/_components/AuthCard";

export default function ForgotPassword() {
  const router = useRouter();

  const [email, setEmail] = useState("");

  return (
    <AuthCard title="Forgot Password">

      <input
        className="w-full mb-4 p-3 border rounded-lg"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button
        className="w-full bg-blue-600 text-white py-3 rounded-lg"
        onClick={() => router.push(`/reset-password?email=${email}`)}
      >
        Send OTP
      </button>

    </AuthCard>
  );
}