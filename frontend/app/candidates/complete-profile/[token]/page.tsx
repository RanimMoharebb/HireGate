"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { completeCandidateProfile } from "@/app/_services/candidate-service";


export default function CompleteProfilePage() {
  const router = useRouter();
  const params = useParams();

  const token = params?.token as string;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

const handleContinue = async () => {
  console.log("TOKEN:", token);
  console.log("FORM:", {
    firstName,
    lastName,
    phoneNumber,
  });

  try {
    const res = await completeCandidateProfile(token, {
      FirstName: firstName,
      LastName: lastName,
      PhoneNumber: phoneNumber,
    });

    console.log("API RESULT:", res);

    // ✅ extract backend message
    const message = res.raw?.toLowerCase?.() || "";

    // OR safer (since backend returns string)
    const backendMessage =
      typeof res.raw === "string"
        ? res.raw.toLowerCase()
        : "";

    if (
      backendMessage.includes("invalid token") ||
      backendMessage.includes("already submitted")
    ) {
      router.replace("/candidates/thank-you");
      return;
    }

    router.push(`/candidates/exam-page/${token}`);

  } catch (err: any) {
    console.log("ERROR:", err);

    const message = err.message?.toLowerCase?.() || "";

    if (message.includes("invalid token")) {
      router.replace("/candidates/thank-you");
      return;
    }

    alert(err.message);
  }
};
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white w-full max-w-md rounded-2xl p-8 shadow">


{/* LOGO */}
<div className="flex justify-center mb-6">
  <img
    src="/images/logo.png"
    alt="logo"
    className="h-10 w-auto"
  />
</div>
        {/* TITLE */}
        <h2 className="text-2xl font-bold mb-6">
          Complete Your Profile
        </h2>

{/* FIRST NAME */}
<div className="mb-4">
  <label className="text-sm text-gray-600">First Name</label>
  <input
    className="w-full mt-1 p-3 border rounded-lg"
    placeholder="Enter first name"
    value={firstName}
    onChange={(e) => setFirstName(e.target.value)}
  />
</div>

{/* LAST NAME */}
<div className="mb-4">
  <label className="text-sm text-gray-600">Last Name</label>
  <input
    className="w-full mt-1 p-3 border rounded-lg"
    placeholder="Enter last name"
    value={lastName}
    onChange={(e) => setLastName(e.target.value)}
  />
</div>

{/* PHONE NUMBER */}
<div className="mb-6">
  <label className="text-sm text-gray-600">Phone Number</label>
  <input
    className="w-full mt-1 p-3 border rounded-lg"
    placeholder="Enter phone number"
    value={phoneNumber}
    onChange={(e) => setPhoneNumber(e.target.value)}
  />
</div>

        <button
          onClick={handleContinue}
          className="w-full bg-blue-600 text-white py-3 rounded-lg"
        >
          Continue
        </button>

      </div>
    </div>
  );
}