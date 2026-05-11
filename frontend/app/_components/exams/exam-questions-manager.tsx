"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/app/_components/ui/input";
import { Button } from "@/app/_components/ui/button";
import { Card, CardContent } from "@/app/_components/ui/card";
import type { BackendQuestionDto } from "@/app/_services/exam-service";

type ExamQuestionsManagerProps = {
  examId: number;
  initialQuestions: BackendQuestionDto[];
};

export default function ExamQuestionsManager({
  examId,
  initialQuestions,
}: ExamQuestionsManagerProps) {
  const router = useRouter();
  const [questionId, setQuestionId] = useState("");
  const [busyQuestionId, setBusyQuestionId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleAddQuestion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsedQuestionId = Number(questionId);

    if (!Number.isInteger(parsedQuestionId) || parsedQuestionId <= 0) {
      setErrorMessage("Enter a valid numeric question ID.");
      return;
    }

    setIsAdding(true);
    setErrorMessage(null);

    try {
      const response = await fetch(`/api/exams/${examId}/questions/${parsedQuestionId}`, {
        method: "POST",
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error ?? "Failed to add question");
      }

      setQuestionId("");
      router.refresh();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to add question");
    } finally {
      setIsAdding(false);
    }
  }

  async function handleRemoveQuestion(targetQuestionId: number) {
    setBusyQuestionId(targetQuestionId);
    setErrorMessage(null);

    try {
      const response = await fetch(`/api/exams/${examId}/questions/${targetQuestionId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error ?? "Failed to remove question");
      }

      router.refresh();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to remove question");
    } finally {
      setBusyQuestionId(null);
    }
  }

  return (
    <Card>
      <CardContent className="space-y-5">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Exam Questions</h2>
          <p className="mt-1 text-sm text-slate-600">
            Attach an existing question by ID or remove one directly from this exam.
          </p>
        </div>

        <form className="flex flex-col gap-3 md:flex-row" onSubmit={handleAddQuestion}>
          <Input
            value={questionId}
            onChange={(event) => setQuestionId(event.target.value)}
            placeholder="Question ID"
            inputMode="numeric"
          />
          <Button type="submit" disabled={isAdding}>
            {isAdding ? "Adding..." : "Add Question"}
          </Button>
        </form>

        {errorMessage ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {errorMessage}
          </div>
        ) : null}

        {initialQuestions.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 p-4 text-sm text-slate-500">
            No questions are attached to this exam yet.
          </div>
        ) : (
          <div className="space-y-3">
            {initialQuestions.map((question) => (
              <div
                key={question.id}
                className="rounded-lg border border-slate-200 p-4"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      #{question.id} {question.questionText}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Topic: {question.topicName || "Uncategorized"}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="danger"
                    onClick={() => handleRemoveQuestion(question.id)}
                    disabled={busyQuestionId === question.id}
                  >
                    {busyQuestionId === question.id ? "Removing..." : "Remove"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
