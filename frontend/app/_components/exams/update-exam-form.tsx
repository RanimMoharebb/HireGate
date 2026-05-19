"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/app/_components/ui/input";
import { Button } from "@/app/_components/ui/button";
import { Card, CardContent } from "@/app/_components/ui/card";
import ExamQuestionPicker from "@/app/_components/exams/exam-question-picker";
import { updateExam } from "@/app/_services/exam-service";
import type { Exam } from "@/app/_lib/exams/exam.types";
import type { ExamFormState } from "@/app/_lib/exams/exam-form.types";

type ExamFormProps = {
  exam: Exam;
};

function toDateTimeLocalValue(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const offsetMs = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
}

export default function UpdateExamForm({ exam }: ExamFormProps) {
  const router = useRouter();
  const initialQuestionIds = useMemo(() => exam.questionIds ?? [], [exam.questionIds]);

  const [formState, setFormState] = useState<ExamFormState>({
    positionTitle: exam.title,
    durationMinutes: exam.durationMinutes?.toString() ?? "",
    windowStartTime: toDateTimeLocalValue(exam.windowStartTime),
    windowEndTime: toDateTimeLocalValue(exam.windowEndTime),
  });
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<number[]>(initialQuestionIds);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const uniqueIds = Array.from(new Set(selectedQuestionIds));
    const payload = {
      positionTitle: formState.positionTitle.trim(),
      durationMinutes: formState.durationMinutes ? Number(formState.durationMinutes) : null,
      windowStartTime: formState.windowStartTime || null,
      windowEndTime: formState.windowEndTime || null,
      addedQuestionIds: uniqueIds.filter((id) => !initialQuestionIds.includes(id)),
      removedQuestionIds: initialQuestionIds.filter((id) => !uniqueIds.includes(id)),
    };

    try {
      const savedExam = await updateExam(exam.id, payload);
      router.push(`/exams/${savedExam.id}?success=updated`);
      router.refresh();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to update exam");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardContent>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="positionTitle">
              Position title
            </label>
            <Input
              id="positionTitle"
              value={formState.positionTitle}
              onChange={(e) => setFormState((current) => ({ ...current, positionTitle: e.target.value }))}
              placeholder="Frontend Developer"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="durationMinutes">
              Duration in minutes
            </label>
            <Input
              id="durationMinutes"
              type="number"
              min={1}
              value={formState.durationMinutes}
              onChange={(e) => setFormState((current) => ({ ...current, durationMinutes: e.target.value }))}
              placeholder="60"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="windowStartTime">
                Window start
              </label>
              <Input
                id="windowStartTime"
                type="datetime-local"
                value={formState.windowStartTime}
                onChange={(e) => setFormState((current) => ({ ...current, windowStartTime: e.target.value }))}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="windowEndTime">
                Window end
              </label>
              <Input
                id="windowEndTime"
                type="datetime-local"
                value={formState.windowEndTime}
                onChange={(e) => setFormState((current) => ({ ...current, windowEndTime: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Questions</label>
            <ExamQuestionPicker
              selectedQuestionIds={selectedQuestionIds}
              onChange={setSelectedQuestionIds}
            />
          </div>

          {errorMessage ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {errorMessage}
            </div>
          ) : null}

          <div className="flex gap-3">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
            <Button as="link" href={`/exams/${exam.id}`} variant="secondary">
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
