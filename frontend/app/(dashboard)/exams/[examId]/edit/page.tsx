"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Header from "@/app/_components/layout/header";
import UpdateExamForm from "@/app/_components/exams/update-exam-form";
import { getExamById } from "@/app/_services/exam-service";
import type { Exam } from "@/app/_lib/exams/exam.types";

export default function EditExamPage() {
  const params = useParams<{ examId: string }>();
  const examId = Number(params.examId);

  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchExam() {
      if (Number.isNaN(examId)) {
        setErrorMessage("Invalid exam id.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setErrorMessage(null);

      try {
        const result = await getExamById(examId);
        setExam(result);
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Unable to load this exam right now.",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchExam();
  }, [examId]);

  if (loading) {
    return (
      <section className="space-y-6">
        <Header title="Edit Exam" description="Loading exam settings..." />
      </section>
    );
  }

  if (errorMessage || !exam) {
    return (
      <section className="space-y-6">
        <Header title="Edit Exam" description="We could not load this exam." />
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {errorMessage ?? "Exam not found."}
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <Header
        title={`Edit ${exam.title}`}
        description="Update exam settings and add or remove Questions."
      />
      <UpdateExamForm exam={exam} />
    </section>
  );
}
