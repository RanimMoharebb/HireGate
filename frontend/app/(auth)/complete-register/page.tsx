"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import AuthCard from "@/app/_components/AuthCard";
import { completeRegistration } from "@/app/_services/auth-service";
import { validateEmail, validatePassword } from "@/app/_validations/auth-validation";

export default function CompleteRegister() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async () => {
    try {
      setError("");
      setMessage("");

      if (!firstName || !lastName || !email || !password) {
        setError("All fields are required");
        return;
      }

      if (!validateEmail(email)) {
        setError("Invalid email format");
        return;
      }

      if (!validatePassword(password)) {
        setError("Password must be at least 8 characters");
        return;
      }

      setLoading(true);

      const res = await completeRegistration({
        firstName,
        lastName,
        email,
        password,
      });



      setMessage(res.message);

      // redirect after success
      setTimeout(() => {
        router.push("/login");
      }, 1500);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title="Create Account">

      {error && (
        <div className="text-red-500 text-sm mb-3">
          {error}
        </div>
      )}

      {message && (
        <div className="text-green-600 text-sm mb-3">
          {message}
        </div>
      )}

    {/* EMAIL */}
    <div className="mb-3">
      <label className="text-sm text-gray-600">Email Address</label>
      <input
        className="w-full mt-1 p-3 border rounded-lg"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
    </div>

    {/* FIRST NAME */}
    <div className="mb-3">
      <label className="text-sm text-gray-600">First Name</label>
      <input
        className="w-full mt-1 p-3 border rounded-lg"
        placeholder="Enter first name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />
    </div>

    {/* LAST NAME */}
    <div className="mb-3">
      <label className="text-sm text-gray-600">Last Name</label>
      <input
        className="w-full mt-1 p-3 border rounded-lg"
        placeholder="Enter last name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
      />
    </div>

    {/* PASSWORD */}
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

      {/* REGISTER BUTTON */}
      <button
        onClick={handleRegister}
        disabled={loading}
        className="w-full bg-green-600 text-white py-3 rounded-lg"
      >
        {loading ? "Creating account..." : "Register"}
      </button>
       <button
          onClick={() => router.push("/login")}
          className="text-sm text-blue-600 hover:underline"
        >
          Already have an account? Login
        </button>
    </AuthCard>
  );
}