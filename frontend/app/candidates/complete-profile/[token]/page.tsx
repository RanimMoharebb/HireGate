"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { completeCandidateProfile } from "@/app/_services/candidate-exam-service";

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

    router.push(`/candidates/exam-page/${token}`);
  } catch (err: any) {
    console.log("ERROR:", err);
    alert(err.message);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white w-full max-w-md rounded-2xl p-8 shadow">

        <h1 className="text-2xl font-bold mb-6">
          Complete Your Profile
        </h1>

        <input
          className="w-full mb-4 p-3 border rounded-lg"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />

        <input
          className="w-full mb-4 p-3 border rounded-lg"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />

        <input
          className="w-full mb-6 p-3 border rounded-lg"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />

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