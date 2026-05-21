"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { getExamPageData } from "@/app/_services/candidate-exam-service";

import { handleExamError } from "@/app/_utils/exam-error-handler";

export default function ExamPage() {
  const router = useRouter();
  const params = useParams();

  const token = params.token as string;

  const [examData, setExamData] = useState<any>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

useEffect(() => {
  if (error) {
    router.replace("/candidates/thank-you");
  }
}, [error, router]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        
        // Candidate data (from token)
        const exam = await getExamPageData(token);
        setExamData(exam.data);
        
      } catch (err: any) {
      const message = err.message?.toLowerCase();

  if (handled) return;

  setError("Unable to load exam information.");

      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);


  const handleStartExam = () => {
    router.push(`/candidates/start-exam/${token}`);
  };

  // ---------------- LOADING ----------------
  if (loading) {
    return (
      <div className="p-10 text-center">
        Loading exam information...
      </div>
    );
  }

  // ---------------- ERROR ----------------
  

if (error) {
  return null;
}
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-6">

      <div className="bg-white w-full max-w-2xl rounded-2xl p-8 shadow text-center">

{/* LOGO */}
<div className="flex justify-center mb-6">
  <img
    src="/images/logo.png"
    alt="logo"
    className="h-12 w-auto"
  />
</div>


        {/* GREETING */}
        <div className="mb-6 text-left">


          <p className="mt-2 text-gray-700">
            We are pleased to invite you to the{" "}
            <span className="font-semibold">
              {examData?.examTitle
                ? examData.examTitle.charAt(0).toUpperCase() +
                  examData.examTitle.slice(1)
                : "—"}
            </span>{" "}
            exam.
          </p>
          <p className="mt-2 text-gray-700">
              Please review the instructions below before starting the exam.
          </p>
         
        </div>

        {/* INSTRUCTIONS BOX */}
        <div className="bg-slate-50 rounded-xl p-6 mb-8 text-left border-2 border-gray-300">

          <h2 className="font-semibold mb-4 text-center text-base">
            Exam Instructions
          </h2>

          <div className="text-sm text-gray-600 leading-6 space-y-4">

            {/* DURATION */}
            <div>
              <span className="font-medium">Exam duration and schedule:</span>
              <br />
              • {examData?.durationMinutes ?? "—"} minutes (maximum)
              <br />
              • From{" "}
              {examData?.windowStartTime
                ? new Date(examData.windowStartTime).toLocaleString()
                : "Not available"}
                {" "}
               till {" "}
              {examData?.windowEndTime
                ? new Date(examData.windowEndTime).toLocaleString()
                : "Not available"} 
              <br />
               • {examData?.questionCount ?? "—"} MCQ Questions
            </div>
            {/* Guidelines */}
            <div>
              <span className="font-medium">Exam guidelines:</span>
              <br />
              • You can start the exam whenever you are ready within the allowed period
              <br />
              • Please ensure stable internet connection throughout the exam
              <br />
              • Once submitted, the exam cannot be retaken
              <br />
              • For support: support@eozom.com
            </div>
                
            </div>

          </div>


        {/* BUTTON */}
        <button
          onClick={handleStartExam}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Start Exam
        </button>

      </div>
    </div>
  );
}
/*
function fetchData() {
  throw new Error("Function not implemented.");
}
*/