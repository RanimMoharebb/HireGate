"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { getExamPageData } from "@/app/_services/candidate-exam-service";

export default function ExamPage() {
  const router = useRouter();
  const params = useParams();

  const token = params.token as string;

  const [examData, setExamData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const data = await getExamPageData(token);
        setExamData(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExam();
  }, [token]);

  const handleStartExam = () => {
    router.push(`/candidates/start-exam/${token}`);
  };

  if (loading) {
    return (
      <div className="p-10 text-center">
        Loading exam information...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white w-full max-w-2xl rounded-2xl p-8 shadow">

        <h1 className="text-3xl font-bold mb-4">
          Exam Information
        </h1>

        <div className="space-y-3 mb-8">

          <p>
            <span className="font-semibold">Candidate:</span>{" "}
            {examData.candidateName}
          </p>

          <p>
            <span className="font-semibold">Exam:</span>{" "}
            {examData.positionTitle}
          </p>

          <p>
            <span className="font-semibold">Duration:</span>{" "}
            {examData.durationMinutes} minutes
          </p>

        </div>

        <button
          onClick={handleStartExam}
          className="w-full bg-blue-600 text-white py-3 rounded-lg"
        >
          Start Exam
        </button>

      </div>
    </div>
  );
}