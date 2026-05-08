"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import AuthCard from "@/app/_components/AuthCard";
<<<<<<< Updated upstream
=======
import { resetPassword, resendOtp } from "@/app/_services/auth-service";
import { validatePassword,validateOTP } from "@/app/_validations/auth-validation";
>>>>>>> Stashed changes

export default function ResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();

<<<<<<< Updated upstream
  const email = searchParams.get("email") || "";
=======
  //const email = searchParams.get("email") || "";
const email =
  typeof window !== "undefined"
    ? localStorage.getItem("reset_email") || ""
    : "";
>>>>>>> Stashed changes

  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
<<<<<<< Updated upstream
=======
  const [resendLoading, setResendLoading] = useState(false);
>>>>>>> Stashed changes

  if (!email) {
    return (
      <div className="text-center mt-10">
        Invalid access. Please go back to Forgot Password.
      </div>
    );
  }

<<<<<<< Updated upstream
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
=======
  // RESET PASSWORD
  const handleReset = async () => {
    try {
      setError("");
      setMessage("");
if (!validateOTP(otp)) {
  setError("OTP is required");
  return;
}

if (!validatePassword(password)) {
  setError("Password must be at least 8 characters");
  return;
}

if (password !== confirmPassword) {
  setError("Passwords do not match");
  return;
}
      setLoading(true);

      const res = await resetPassword({
        email,
        otp,
        newPassword: password,
        confirmPassword: confirmPassword,

      });

      setMessage(res);

      setTimeout(() => {
        localStorage.removeItem("reset_email");
        router.push("/login");
      }, 1500);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // RESEND OTP (NOW CONNECTED TO API)
  const handleResendOtp = async () => {
    try {
      setResendLoading(true);
      setError("");
      setMessage("");
/*
      if (!validateOTP(otp)) {
  setError("OTP is required");
  return;
}
  */

      const res = await resendOtp(email);

      //setMessage(res);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setResendLoading(false);
    }
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
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
=======
      {/* EMAIL */}
<div className="mb-3">
  <label className="text-sm text-gray-600">Email Address</label>

  <input
    className="w-full mt-1 p-3 border rounded-lg bg-gray-100"
    value={email}
    disabled
  />
</div>

      {/* OTP */}
<div className="mb-2">
  <label className="text-sm text-gray-600">OTP Code</label>

  <input
    className="w-full mt-1 p-3 border rounded-lg"
    placeholder="Enter OTP"
    value={otp}
    onChange={(e) => setOtp(e.target.value)}
  />
</div>


<div className="flex justify-center gap-6 mb-4">
  {/* CHANGE EMAIL */}
  <button
    onClick={() => router.push("/forgot-password")}
    className="text-sm text-blue-600 underline"
  >
    Change Email
  </button>

  {/* RESEND OTP */}
  <button
    onClick={handleResendOtp}
    disabled={resendLoading}
    className="text-sm text-blue-600 underline"
  >
    {resendLoading ? "Sending OTP..." : "Resend OTP"}
  </button>
</div>




{/* PASSWORD */}
<div className="mb-3">
  <label className="text-sm text-gray-600">New Password</label>

  <input
    className="w-full mt-1 p-3 border rounded-lg"
    type="password"
    placeholder="••••••••"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
  />
</div>

{/* CONFIRM PASSWORD (FIXED) */}
<div className="mb-3">
  <label className="text-sm text-gray-600">Confirm Password</label>

  <input
    className="w-full mt-1 p-3 border rounded-lg"
    type="password"
    placeholder="••••••••"
    value={confirmPassword}   // ✅ FIX
    onChange={(e) => setConfirmPassword(e.target.value)}  // ✅ FIX
  />
</div>

      {/* RESET BUTTON */}
      <button
        onClick={handleReset}
>>>>>>> Stashed changes
        disabled={loading}
        className="w-full bg-green-600 text-white py-3 rounded-lg"
      >
        {loading ? "Processing..." : "Reset Password"}
      </button>

    </AuthCard>
  );
}