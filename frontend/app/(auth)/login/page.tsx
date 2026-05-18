"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import AuthCard from "@/app/_components/AuthCard";
import { login } from "@/app/_services/auth-service";
import { useEffect } from "react";
//import { jwtDecode } from "jwt-decode";
import { validateEmail, validatePassword } from "@/app/_validations/auth-validation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

    useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) router.push("/dashboard");
  }, []);

  const handleLogin = async () => {
    try {
      setError("");

      if (!email || !password) {
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


      const res = await login(email, password);
      /*
      // (rare case, but safe):-
            const decoded: any = jwtDecode(res.token);
      if (decoded.exp * 1000 < Date.now()) {
        throw new Error("Token expired");
      }
        */
      localStorage.setItem("token", res.token);

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title="HireGate" subtitle="HR Exam Platform">

      {error && (
        <div className="text-red-500 text-sm mb-3">
          {error}
        </div>
      )}

      {/* EMAIL */}
      <div className="mb-4">
        <label className="text-sm text-gray-600">Email Address</label>
        <input
          className="w-full mt-1 p-3 border rounded-lg"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {/* PASSWORD */}
      <div className="mb-6">
        <label className="text-sm text-gray-600">Password</label>
        <input
          className="w-full mt-1 p-3 border rounded-lg"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {/* LOGIN BUTTON */}
      <button
        className="w-full bg-blue-600 text-white py-3 rounded-lg mb-4"
        onClick={handleLogin}
        disabled={loading}
      >
        {loading ? "Logging in..." : "Sign In"}
      </button>

      {/* LINKS SECTION */}
      <div className="text-center space-y-2">

        <button
          onClick={() => router.push("/complete-register")}
          className="text-sm text-green-600 hover:underline"
        >
          Don’t have an account? Sign up
        </button>

        <br />

        <button
          onClick={() => router.push("/forgot-password")}
          className="text-sm text-blue-600 hover:underline"
        >
          Forgot password? Reset
        </button>

      </div>

    </AuthCard>
  );
}