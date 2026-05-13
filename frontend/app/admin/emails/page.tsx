"use client";

import { useEffect, useState } from "react";
import { sendExamEmail, sendBulkExamEmail } from "@/app/_services/email-service";
import { getCandidates } from "@/app/_services/candidate-service";
import { Candidate } from "@/app/_services/candidate-service";

type Exam = {
  id: number;
  positionTitle: string;
};

export default function EmailPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);

const [selectedExamId, setSelectedExamId] = useState<number | "">("");  const [selectedCandidates, setSelectedCandidates] = useState<number[]>([]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

// =========================
// FETCH DATA
// =========================
useEffect(() => {
  const fetchData = async () => {
    try {
      const [candRes, examRes] = await Promise.all([
        getCandidates(),

        fetch("http://localhost:5116/api/exam/")
          .then(async (r) => {
            if (!r.ok) {
              throw new Error("Failed to fetch exams");
            }

            return await r.json();
          }),
      ]);

      setCandidates(candRes);
      setExams(Array.isArray(examRes) ? examRes : []);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  fetchData();
}, []);

  // =========================
  // TOGGLE CANDIDATE
  // =========================
  const toggleCandidate = (id: number) => {
    setSelectedCandidates((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  // =========================
  // SEND EMAIL
  // =========================
  const handleSend = async () => {
    try {
      setLoading(true);
      setMessage("");

      if (!selectedExamId) {
        setMessage("Please select an exam");
        return;
      }

      if (selectedCandidates.length === 0) {
        setMessage("Please select at least one candidate");
        return;
      }

      // SINGLE
      if (selectedCandidates.length === 1) {
        const res = await sendExamEmail(
          selectedCandidates[0],
          selectedExamId
        );

        setMessage(res);
        return;
      }

      // BULK
      const res = await sendBulkExamEmail({
        examId: selectedExamId,
        candidateIds: selectedCandidates,
      });

      setMessage(res);
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center p-10">

      <div className="bg-white w-full max-w-3xl rounded-2xl shadow p-8">

        <h1 className="text-2xl font-bold mb-6">
          Email Center
        </h1>

        <label className="text-sm font-medium">
          Select Exam
        </label>

        <select
          className="w-full mb-6 p-3 border rounded-lg"
          onChange={(e) =>
            setSelectedExamId(Number(e.target.value))
          }
        >
          <option value="">-- Choose Exam --</option>

          {exams.map((exam) => (
            <option key={exam.id} value={exam.id}>
              {exam.positionTitle}
            </option>
          ))}
        </select>

        <label className="text-sm font-medium">
          Select Candidates
        </label>

        <div className="border rounded-lg p-4 max-h-72 overflow-y-auto space-y-2">

          {candidates.map((c) => (
            <label
              key={c.id}
              className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded"
            >
              <input
                type="checkbox"
                checked={selectedCandidates.includes(c.id)}
                onChange={() => toggleCandidate(c.id)}
              />

<span>
  {`${c.firstName ?? ""} ${c.lastName ?? ""}`.trim()} — {c.email}
</span>
            </label>
          ))}

        </div>

        <button
          onClick={handleSend}
          disabled={loading}
          className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg font-semibold"
        >
          {loading ? "Sending..." : "Send Emails"}
        </button>

        {message && (
          <p className="mt-4 text-sm text-blue-600">
            {message}
          </p>
        )}

      </div>
    </div>
  );
}
