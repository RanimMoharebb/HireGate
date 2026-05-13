"use client";

import { Candidate } from "@/app/_services/candidate-service";

type Props = {
  candidate: Candidate | null;
  onClose: () => void;
};

export function CandidateDetailsModal({
  candidate,
  onClose,
}: Props) {
  if (!candidate) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-[450px]">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold">
            Candidate Details
          </h2>

          <button
            onClick={onClose}
            className="text-slate-500 text-xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-3 text-sm">
          <p>
            <b>ID:</b> {candidate.id}
          </p>

          <p>
            <b>Name:</b>{" "}
            {candidate.firstName || "-"}{" "}
            {candidate.lastName || ""}
          </p>

          <p>
            <b>Email:</b> {candidate.email}
          </p>

          <p>
            <b>Phone:</b>{" "}
            {candidate.phoneNumber || "-"}
          </p>

          <p>
            <b>Exam ID:</b>{" "}
            {candidate.examId ?? "-"}
          </p>

          <p>
            <b>Score:</b>{" "}
            {candidate.finalScore ?? "-"}
          </p>

          <p>
            <b>Started At:</b>{" "}
            {candidate.startedAt || "-"}
          </p>

          <p>
            <b>Submitted At:</b>{" "}
            {candidate.submittedAt || "-"}
          </p>
        </div>
      </div>
    </div>
  );
}