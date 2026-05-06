"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import AuthCard from "@/app/_components/AuthCard";

export default function CompleteRegister() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <AuthCard title="Create Account">

      <input
        className="w-full mb-3 p-3 border rounded-lg"
        placeholder="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />

      <input
        className="w-full mb-3 p-3 border rounded-lg"
        placeholder="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
      />

      <input
        className="w-full mb-3 p-3 border rounded-lg"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="w-full mb-6 p-3 border rounded-lg"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        className="w-full bg-green-600 text-white py-3 rounded-lg"
        onClick={() => router.push("/login")}
      >
        Register
      </button>

    </AuthCard>
  );
}