"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import AuthCard from "@/app/_components/AuthCard";
import { forgotPassword } from "@/app/_services/auth-service";
import { validateEmail } from "@/app/_validations/auth-validation";

export default function ForgotPassword() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleSendOtp = async () => {
    try {
      setError("");

    if (!email) {
      setError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Invalid email format");
      return;
    }

      setLoading(true);


      await forgotPassword(email);

      localStorage.setItem("reset_email", email);
      router.push("/reset-password");

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
        <AuthCard
          title="Forgot Password"
          subtitle="Enter your email to receive an OTP for password reset"
        >

      {error && (
        <div className="text-red-500 text-sm mb-3">
          {error}
        </div>
      )}

<div className="mb-4">
  <label className="text-sm text-gray-600">Email Address</label>

  <input
    className="w-full mt-1 p-3 border rounded-lg"
    placeholder="you@example.com"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
  />
</div>

      <button
        onClick={handleSendOtp}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg"
      >
        {loading ? "Sending OTP..." : "Send OTP"}
      </button>

    </AuthCard>
  );
}

