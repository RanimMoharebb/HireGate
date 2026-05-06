"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import AuthCard from "@/app/_components/AuthCard";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <AuthCard title="HireGate" subtitle="HR Exam Platform">

      <div className="mb-4">
        <label className="text-sm text-gray-600">Email Address</label>
        <input
          className="w-full mt-1 p-3 border rounded-lg"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="mb-6">
        <label className="text-sm text-gray-600">Password</label>
        <input
          className="w-full mt-1 p-3 border rounded-lg"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button
        className="w-full bg-blue-600 text-white py-3 rounded-lg mb-3"
        onClick={() => console.log("login")}
      >
        Sign In
      </button>

      <div className="text-center space-y-2">
        <button
          onClick={() => router.push("/complete-register")}
          className="text-sm text-green-600"
        >
          Create Account
        </button>

        <br />

        <button
          onClick={() => router.push("/forgot-password")}
          className="text-sm text-blue-600"
        >
          Forgot Password?
        </button>
      </div>

    </AuthCard>
  );
}