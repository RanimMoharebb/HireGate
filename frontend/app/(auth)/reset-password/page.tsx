"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import AuthCard from "@/app/_components/AuthCard";

export default function ResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  if (!email) {
    return (
      <div className="text-center mt-10">
        Invalid access. Please go back to Forgot Password.
      </div>
    );
  }

  const resetPassword = async () => {
    setError("");
    setMessage("");

    if (!otp) return setError("OTP is required");
    if (password.length < 6)
      return setError("Password must be at least 6 characters");
    if (password !== confirmPassword)
      return setError("Passwords do not match");

    setLoading(true);

    console.log({ email, otp, password });

    setMessage("Password reset successfully");

    setTimeout(() => {
      router.push("/login");
    }, 1500);

    setLoading(false);
  };

  const resendOtp = () => {
    setMessage("OTP sent again");
    console.log("Resend OTP to:", email);
  };

  return (
    <AuthCard
      title="Reset Password"
      titleClassName="text-xl"
      subtitle="Enter OTP and new password"
    >

      {error && (
        <div className="text-red-500 mb-3 text-sm">{error}</div>
      )}

      {message && (
        <div className="text-green-600 mb-3 text-sm">{message}</div>
      )}

      <input
        className="w-full mb-3 p-3 border rounded-lg bg-gray-100"
        value={email}
        disabled
      />

      <input
        className="w-full mb-2 p-3 border rounded-lg"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />

      <button
        onClick={resendOtp}
        className="text-sm text-blue-600 underline mb-4"
      >
        Resend OTP
      </button>

      <input
        className="w-full mb-3 p-3 border rounded-lg"
        type="password"
        placeholder="New Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <input
        className="w-full mb-4 p-3 border rounded-lg"
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <button
        onClick={resetPassword}
        disabled={loading}
        className="w-full bg-green-600 text-white py-3 rounded-lg"
      >
        {loading ? "Processing..." : "Reset Password"}
      </button>

    </AuthCard>
  );
}