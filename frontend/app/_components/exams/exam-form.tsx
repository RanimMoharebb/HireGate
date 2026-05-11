"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/app/_components/ui/input";
import { Button } from "@/app/_components/ui/button";
import { Card, CardContent } from "@/app/_components/ui/card";
import type { BackendQuestionDto, Exam } from "@/app/_services/exam-service";

// ─── Types ────────────────────────────────────────────────────────────────────

type ExamFormProps = {
  mode: "create" | "edit";
  exam?: Exam;
};

type ExamFormState = {
  positionTitle: string;
  durationMinutes: string;
  windowStartTime: string;
  windowEndTime: string;
};

type Question = {
  id: number;
  text: string;
  topic?: string;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toDateTimeLocalValue(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const offsetMs = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
}

function mapBackendQuestionToQuestion(question: BackendQuestionDto): Question {
  return {
    id: question.id,
    text: question.questionText,
    topic: question.topicName || undefined,
  };
}

type QuestionPickerProps = {
  initialQuestions: Question[];
  onChange: (questions: Question[]) => void;
};

function QuestionPicker({ initialQuestions, onChange }: QuestionPickerProps) {
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>(initialQuestions);
  const [availableQuestions, setAvailableQuestions] = useState<Question[]>([]);
  const [selectedQuestionId, setSelectedQuestionId] = useState("");
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

useEffect(() => {
    let isMounted = true;

    async function loadQuestions() {
      setIsLoadingQuestions(true);
      setLoadError(null);

      try {
        const response = await fetch("/api/questions", { cache: "no-store" });
        const payload = (await response.json().catch(() => null)) as BackendQuestionDto[] | { error?: string } | null;

        if (!response.ok) {
          const message = !Array.isArray(payload) && payload?.error
            ? payload.error
            : "Failed to load questions";
          throw new Error(message);
        }

        if (isMounted && Array.isArray(payload)) {
          setAvailableQuestions(payload.map(mapBackendQuestionToQuestion));
        }
      } catch (error) {
        if (isMounted) {
          setLoadError(error instanceof Error ? error.message : "Failed to load questions");
        }
      } finally {
        if (isMounted) {
          setIsLoadingQuestions(false);
        }
      }
    }

    loadQuestions();

    return () => {
      isMounted = false;
    };
  }, []);

  const selectableQuestions = availableQuestions.filter(
    (question) => !selectedQuestions.some((selected) => selected.id === question.id),
  );

  function handleAddQuestion(questionId: string) {
    setSelectedQuestionId(questionId);

    if (!questionId) {
      return;
    }

    const question = availableQuestions.find((item) => item.id === Number(questionId));
    if (!question) {
      return;
    }

    const updatedQuestions = [...selectedQuestions, question];
    setSelectedQuestions(updatedQuestions);
    onChange(updatedQuestions);
    setSelectedQuestionId("");
  }

  function removeQuestion(id: number) {
    const updatedQuestions = selectedQuestions.filter((question) => question.id !== id);
    setSelectedQuestions(updatedQuestions);
    onChange(updatedQuestions);
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <select
          className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-blue-500"
          value={selectedQuestionId}
          onChange={(event) => handleAddQuestion(event.target.value)}
          disabled={isLoadingQuestions || selectableQuestions.length === 0}
        >
          <option value="">
            {isLoadingQuestions
              ? "Loading questions..."
              : selectableQuestions.length === 0
                ? "No more questions available"
                : "Select a question"}
          </option>
          {selectableQuestions.map((question) => (
            <option key={question.id} value={question.id}>
              #{question.id} {question.text}
            </option>
          ))}
        </select>

        {loadError && (
          <p className="text-sm text-red-600">{loadError}</p>
        )}
      </div>

      {selectedQuestions.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {selectedQuestions.map((q) => (
            <span
              key={q.id}
              className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm text-blue-800"
            >
              {q.topic && (
                <span className="rounded-full bg-blue-200 px-1.5 py-0.5 text-xs text-blue-900">
                  {q.topic}
                </span>
              )}
              <span className="max-w-[220px] truncate">{q.text}</span>
              <button
                type="button"
                onClick={() => removeQuestion(q.id)}
                className="ml-0.5 flex h-4 w-4 items-center justify-center rounded-full text-blue-600 hover:bg-blue-200 hover:text-blue-900"
                aria-label={`Remove question: ${q.text}`}
              >
                x
              </button>
            </span>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-400">No questions added yet.</p>
      )}

      <p className="text-xs text-slate-500">
        Choose questions from the dropdown to attach them to this exam.{" "}
        {selectedQuestions.length > 0 && (
          <span className="font-medium text-slate-700">
            {selectedQuestions.length} question{selectedQuestions.length !== 1 ? "s" : ""} selected.
          </span>
        )}
      </p>
    </div>
  );
}

// ─── Main Form ────────────────────────────────────────────────────────────────

export default function ExamForm({ mode, exam }: ExamFormProps) {
  const router = useRouter();
  const initialQuestionIds = useMemo(() => exam?.questionIds ?? [], [exam?.questionIds]);
  const initialQuestions = useMemo(
    () => (exam?.questions ?? []).map(mapBackendQuestionToQuestion),
    [exam?.questions],
  );

  const [formState, setFormState] = useState<ExamFormState>({
    positionTitle: exam?.title ?? "",
    durationMinutes: exam?.durationMinutes?.toString() ?? "",
    windowStartTime: toDateTimeLocalValue(exam?.windowStartTime),
    windowEndTime: toDateTimeLocalValue(exam?.windowEndTime),
  });

  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>(initialQuestions);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const selectedIds = selectedQuestions.map((q) => q.id);
    const uniqueIds = Array.from(new Set(selectedIds));

    const basePayload = {
      positionTitle: formState.positionTitle.trim(),
      durationMinutes: formState.durationMinutes ? Number(formState.durationMinutes) : null,
      windowStartTime: formState.windowStartTime || null,
      windowEndTime: formState.windowEndTime || null,
    };

    const payload =
      mode === "create"
        ? { ...basePayload, questionIds: uniqueIds }
        : {
            ...basePayload,
            addedQuestionIds: uniqueIds.filter((id) => !initialQuestionIds.includes(id)),
            removedQuestionIds: initialQuestionIds.filter((id) => !uniqueIds.includes(id)),
          };

    const url = mode === "create" ? "/api/exams" : `/api/exams/${exam?.id}`;
    const method = mode === "create" ? "POST" : "PATCH";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const responsePayload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(responsePayload?.error ?? `Failed to ${mode} exam`);
      }

      const savedExam = (await response.json()) as { id: number };
      router.push(`/exams/${savedExam.id}`);
      router.refresh();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : `Failed to ${mode} exam`);
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
              onChange={(e) => setFormState((c) => ({ ...c, positionTitle: e.target.value }))}
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
              onChange={(e) => setFormState((c) => ({ ...c, durationMinutes: e.target.value }))}
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
                onChange={(e) => setFormState((c) => ({ ...c, windowStartTime: e.target.value }))}
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
                onChange={(e) => setFormState((c) => ({ ...c, windowEndTime: e.target.value }))}
              />
            </div>
          </div>

          {/* ── Question picker ── */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Questions
            </label>
            <QuestionPicker
              initialQuestions={initialQuestions}
              onChange={setSelectedQuestions}
            />
          </div>

          {errorMessage && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {errorMessage}
            </div>
          )}

          <div className="flex gap-3">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? mode === "create" ? "Creating…" : "Saving…"
                : mode === "create" ? "+ Create Exam" : "Save Changes"}
            </Button>
            <Button
              as="link"
              href={mode === "create" ? "/exams" : `/exams/${exam?.id}`}
              variant="secondary"
            >
              Cancel
            </Button>
          </div>

        </form>
      </CardContent>
    </Card>
  );
}
