"use client";

import { useState } from "react";
import { Candidate } from "@/app/_services/candidate-service";
import { Button } from "@/app/_components/ui/button";

type Exam = {
  id: number;
  positionTitle: string;
};

type Props = {
  candidate: Candidate | null;
  exams: Exam[];
  loading: boolean;
  onClose: () => void;
  onSubmit: (candidateId: number, examId: number) => void;
};

export function SendEmailModal({
  candidate,
  exams,
  loading,
  onClose,
  onSubmit,
}: Props) {
  const [selectedExamId, setSelectedExamId] = useState<number | "">("");

  if (!candidate) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-[420px] space-y-5">

        {/* TITLE */}
        <div>
          <h2 className="text-lg font-bold">Send Exam Email</h2>
          <p className="text-sm text-slate-500 mt-2">
            Select an exam for this candidate
          </p>
        </div>

        {/* EXAM SELECT */}
        <select
          className="w-full border rounded-lg p-3"
          value={selectedExamId}
          onChange={(e) =>
            setSelectedExamId(
              e.target.value === "" ? "" : Number(e.target.value)
            )
          }
        >
          <option value="">-- Choose Exam --</option>

          {exams.map((exam) => (
            <option key={exam.id} value={exam.id}>
              {exam.positionTitle}
            </option>
          ))}
        </select>

        {/* BUTTONS */}
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>

          <Button
            disabled={loading || selectedExamId === ""}
            onClick={() =>
              onSubmit(candidate.id, Number(selectedExamId))
            }
          >
            Send
          </Button>
        </div>

      </div>
    </div>
  );
}