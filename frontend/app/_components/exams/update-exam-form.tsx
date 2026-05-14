"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader, Search } from "lucide-react";
import Input from "@/app/_components/ui/input";
import { Button } from "@/app/_components/ui/button";
import { Card, CardContent } from "@/app/_components/ui/card";
import { questionBankService } from "@/app/_services/question-bank-service";
import { updateExam } from "@/app/_services/exam-service";
import type { Question as BankQuestion, Topic } from "@/app/_lib/question-bank.types";
import type { Exam } from "@/app/_services/exam-service";

// ─── Types ────────────────────────────────────────────────────────────────────

type ExamFormProps = {
  exam: Exam;
};

type ExamFormState = {
  positionTitle: string;
  durationMinutes: string;
  windowStartTime: string;
  windowEndTime: string;
};

const PAGE_SIZE = 10;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toDateTimeLocalValue(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const offsetMs = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
}

type QuestionPickerProps = {
  initialSelectedQuestionIds: number[];
  onChange: (questionIds: number[]) => void;
};

function QuestionPicker({ initialSelectedQuestionIds, onChange }: QuestionPickerProps) {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [topicsError, setTopicsError] = useState<string | null>(null);
  const [isLoadingTopics, setIsLoadingTopics] = useState(false);
  const [selectedTopicId, setSelectedTopicId] = useState<string>("all");
  const [questions, setQuestions] = useState<BankQuestion[]>([]);
  const [questionsError, setQuestionsError] = useState<string | null>(null);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<number[]>(initialSelectedQuestionIds);

  useEffect(() => {
    async function loadTopics() {
      setIsLoadingTopics(true);
      setTopicsError(null);

      try {
        const data = await questionBankService.getTopics();
        setTopics(data ?? []);
      } catch (error) {
        setTopicsError(error instanceof Error ? error.message : "Unable to load topics.");
      } finally {
        setIsLoadingTopics(false);
      }
    }

    loadTopics();
  }, []);

  useEffect(() => {
    async function loadQuestions() {
      setIsLoadingQuestions(true);
      setQuestionsError(null);

      try {
        const response = await questionBankService.getQuestions(
          currentPage,
          PAGE_SIZE,
          selectedTopicId || "all",
          searchTerm,
        );
        setQuestions(response.data ?? []);
        setTotalPages(response.totalPages ?? 1);
      } catch (error) {
        setQuestionsError(
          error instanceof Error ? error.message : "Unable to load questions for this topic.",
        );
        setQuestions([]);
        setTotalPages(1);
      } finally {
        setIsLoadingQuestions(false);
      }
    }

    loadQuestions();
  }, [currentPage, searchTerm, selectedTopicId]);

  function handleToggleQuestion(questionId: number) {
    const next = selectedQuestionIds.includes(questionId)
      ? selectedQuestionIds.filter((id) => id !== questionId)
      : [...selectedQuestionIds, questionId];

    setSelectedQuestionIds(next);
    onChange(next);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-4">
        <div>
          <p className="text-sm font-semibold text-slate-900">Topics</p>
          <p className="text-xs text-slate-500">Select a topic to show available questions.</p>
        </div>

        {isLoadingTopics ? (
          <div className="flex items-center gap-2 text-slate-500">
            <Loader className="animate-spin" size={16} /> Loading topics...
          </div>
        ) : topicsError ? (
          <p className="text-sm text-red-600">{topicsError}</p>
        ) : topics.length === 0 ? (
          <p className="text-sm text-slate-600">No topics are available.</p>
        ) : (
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => {
                setSelectedTopicId("all");
                setCurrentPage(1);
                setSearchTerm("");
              }}
              className={`w-full rounded-2xl border px-4 py-3 text-left text-sm transition ${
                selectedTopicId === "all"
                  ? "border-blue-500 bg-blue-50 text-slate-900"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-100"
              }`}
            >
              All Questions
            </button>
            {topics.map((topic) => (
              <button
                key={topic.id}
                type="button"
                onClick={() => {
                  setSelectedTopicId(topic.id.toString());
                  setCurrentPage(1);
                  setSearchTerm("");
                }}
                className={`w-full rounded-2xl border px-4 py-3 text-left text-sm transition ${
                  selectedTopicId === topic.id.toString()
                    ? "border-blue-500 bg-blue-50 text-slate-900"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-100"
                }`}
              >
                {topic.topicName}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-4 max-h-[68vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-900">Questions</p>
            <p className="text-xs text-slate-500">
              Select a topic or use all questions, then search and paginate through results.
            </p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            {selectedQuestionIds.length} selected
          </span>
        </div>

        <div className="relative flex-shrink-0">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => {
              setSearchTerm(event.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search questions..."
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="overflow-y-auto flex-1 min-h-0">
          {isLoadingQuestions ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
              <div className="inline-flex items-center gap-2">
                <Loader className="animate-spin" size={16} /> Loading questions...
              </div>
            </div>
          ) : questionsError ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-6 text-sm text-red-700">
              {questionsError}
            </div>
          ) : questions.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
              No questions found for this topic.
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {questions.map((question) => (
                  <label
                    key={question.id}
                    className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-slate-300"
                  >
                    <input
                      type="checkbox"
                      checked={selectedQuestionIds.includes(question.id)}
                      onChange={() => handleToggleQuestion(question.id)}
                      className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        #{question.id} {question.questionText}
                      </p>
                      {question.topicName ? (
                        <p className="mt-1 text-xs text-slate-500">Topic: {question.topicName}</p>
                      ) : null}
                    </div>
                  </label>
                ))}
              </div>

              {totalPages > 1 ? (
                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-sm text-slate-500">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1 || isLoadingQuestions}
                    >
                      Previous
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages || isLoadingQuestions}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Form ────────────────────────────────────────────────────────────────

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

    const basePayload = {
      positionTitle: formState.positionTitle.trim(),
      durationMinutes: formState.durationMinutes ? Number(formState.durationMinutes) : null,
      windowStartTime: formState.windowStartTime || null,
      windowEndTime: formState.windowEndTime || null,
    };

    const payload = {
      ...basePayload,
      addedQuestionIds: uniqueIds.filter((id) => !initialQuestionIds.includes(id)),
      removedQuestionIds: initialQuestionIds.filter((id) => !uniqueIds.includes(id)),
    };

    try {
      const savedExam = await updateExam(exam.id, payload);
      router.push(`/exams/${savedExam.id}`);
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
              key={`update-${exam.id}`}
              initialSelectedQuestionIds={initialQuestionIds}
              onChange={setSelectedQuestionIds}
            />
          </div>

          {errorMessage && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {errorMessage}
            </div>
          )}

          <div className="flex gap-3">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving…" : "Save Changes"}
            </Button>
            <Button
              as="link"
              href={`/exams/${exam.id}`}
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
