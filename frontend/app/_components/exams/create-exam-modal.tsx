"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader, Plus, Search, X } from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import { questionBankService } from "@/app/_services/question-bank-service";
import { createExam } from "@/app/_services/exam-service";
import type { Question as BankQuestion, Topic } from "@/app/_lib/question-bank.types";

type CreateExamModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
};

type ExamFormState = {
  positionTitle: string;
  durationMinutes: string;
  windowStartTime: string;
  windowEndTime: string;
};

const PAGE_SIZE = 10;

function formatDateTimePreview(value: string) {
  if (!value) {
    return "No date selected yet.";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Invalid date selected.";
  }

  return date.toLocaleString();
}

function CreateExamModal({ isOpen, onClose, onOpen }: CreateExamModalProps) {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [formState, setFormState] = useState<ExamFormState>({
    positionTitle: "",
    durationMinutes: "",
    windowStartTime: "",
    windowEndTime: "",
  });
  
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
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<{[key : string]: string}>({});
  const [hasTriedStepOne, setHasTriedStepOne] = useState(false);

  const updateFormField = (field: keyof ExamFormState, value: string) => {
    setFormState((current) => ({ ...current, [field]: value }));

    if (!hasTriedStepOne) {
      return;
    }

    setFormErrors((current) => {
      if (!current[field]) {
        return current;
      }

      const next = { ...current };
      delete next[field];
      return next;
    });
  };
  // Only loads topics — no state resets here
  useEffect(() => {
    if (!isOpen) return;

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
  }, [isOpen]);

  // Loads questions whenever topic, page, search, or open state changes
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
  }, [isOpen, selectedTopicId, currentPage, searchTerm]);

  
  const handleToggleQuestion = (questionId: number) => {
    setErrorMessage(null);
    setSelectedQuestionIds((current) =>
      current.includes(questionId)
        ? current.filter((id) => id !== questionId)
        : [...current, questionId],
    );
  };

  const validateStepOne = (): boolean => {
    setHasTriedStepOne(true);

    const errors: {[key : string]: string} = {};

    if (formState.positionTitle.trim().length === 0) {
      errors.positionTitle = " Position Title is required.";
    }
    if (formState.durationMinutes.trim().length === 0) {
      errors.durationMinutes = "Duration is required.";
    }
    if (formState.windowStartTime.trim().length === 0) {
      errors.windowStartTime = "Window start time is required.";
    }
    if (formState.windowEndTime.trim().length === 0) {
      errors.windowEndTime = "Window end time is required.";
    }

    if (formState.windowStartTime && formState.windowEndTime) {
      const start = new Date(formState.windowStartTime);
      const end = new Date(formState.windowEndTime);
      if (start >= end) {
        errors.windowEndTime = "Window end time must be after start time.";
      }

    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateExam = async () => {
    if (selectedQuestionIds.length === 0) {
      setErrorMessage("Please select at least one question before creating the exam.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const payload = {
        positionTitle: formState.positionTitle.trim(),
        durationMinutes: formState.durationMinutes ? Number(formState.durationMinutes) : null,
        windowStartTime: formState.windowStartTime || null,
        windowEndTime: formState.windowEndTime || null,
        questionIds: selectedQuestionIds,
      };

      const savedExam = await createExam(payload);
      onClose();
      router.push(`/exams/${savedExam.id}`);
      router.refresh();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to create exam.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
      <div className="relative z-10 mx-auto w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-3xl bg-white shadow-2xl flex flex-col">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-6 flex-shrink-0">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Create exam</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">
              {step === 1 ? "Exam details" : "Pick questions by topic"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {step === 1
                ? "Enter the exam settings first, then choose questions by topic."
                : "Select a topic and pick the questions you want to attach to the exam."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200"
            aria-label="Close create exam modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-8 sm:py-8 space-y-6">
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <span className={`rounded-full px-3 py-1 ${step === 1 ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"}`}>
              Step 1
            </span>
            <span className={`rounded-full px-3 py-1 ${step === 2 ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"}`}>
              Step 2
            </span>
          </div>

          {step === 1 ? (
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="positionTitle">
                  Position title
                </label>
                <input
                  id="positionTitle"
                  type="text"
                  value={formState.positionTitle}
                  onChange={(e) => updateFormField("positionTitle", e.target.value)}
                  className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:ring-2 ${
                    hasTriedStepOne && formErrors.positionTitle
                      ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                      : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
                  }`}
                  placeholder="Frontend Developer"
                />
                {hasTriedStepOne && formErrors.positionTitle ? (
                  <p className="mt-2 text-sm text-red-600">{formErrors.positionTitle}</p>
                ) : null}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="durationMinutes">
                  Duration in minutes
                </label>
                <input
                  id="durationMinutes"
                  type="number"
                  min={1}
                  value={formState.durationMinutes}
                  onChange={(e) => updateFormField("durationMinutes", e.target.value)}
                  className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:ring-2 ${
                    hasTriedStepOne && formErrors.durationMinutes
                      ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                      : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
                  }`}
                  placeholder="60"
                />
                {hasTriedStepOne && formErrors.durationMinutes ? (
                  <p className="mt-2 text-sm text-red-600">{formErrors.durationMinutes}</p>
                ) : null}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="windowStartTime">
                    Window start
                  </label>
                  <input
                    id="windowStartTime"
                    type="datetime-local"
                    value={formState.windowStartTime}
                    onChange={(e) => updateFormField("windowStartTime", e.target.value)}
                    className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:ring-2 ${
                      hasTriedStepOne && formErrors.windowStartTime
                        ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                        : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
                    }`}
                  />
                  {hasTriedStepOne && formErrors.windowStartTime ? (
                    <p className="mt-2 text-sm text-red-600">{formErrors.windowStartTime}</p>
                  ) : (
                    <p className="mt-2 text-xs text-slate-500">
                      {formState.windowStartTime
                        ? `Selected: ${formatDateTimePreview(formState.windowStartTime)}`
                        : "The browser may highlight today, but nothing is chosen until you pick a date and time."}
                    </p>
                  )}
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="windowEndTime">
                    Window end
                  </label>
                  <input
                    id="windowEndTime"
                    type="datetime-local"
                    value={formState.windowEndTime}
                    onChange={(e) => updateFormField("windowEndTime", e.target.value)}
                    className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:ring-2 ${
                      hasTriedStepOne && formErrors.windowEndTime
                        ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                        : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
                    }`}
                  />
                  {hasTriedStepOne && formErrors.windowEndTime ? (
                    <p className="mt-2 text-sm text-red-600">{formErrors.windowEndTime}</p>
                  ) : (
                    <p className="mt-2 text-xs text-slate-500">
                      {formState.windowEndTime
                        ? `Selected: ${formatDateTimePreview(formState.windowEndTime)}`
                        : "The browser may highlight today, but nothing is chosen until you pick a date and time."}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
              <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Topics</p>
                  <p className="text-xs text-slate-500">Select a topic to show available questions.</p>
                </div>

                {isLoadingTopics ? (
                  <div className="flex items-center gap-2 text-slate-500">
                    <Loader className="animate-spin" size={16} /> Loading topics…
                  </div>
                ) : topicsError ? (
                  <p className="text-sm text-red-600">{topicsError}</p>
                ) : topics.length === 0 ? (
                  <p className="text-sm text-slate-600">No topics are available.</p>
                ) : (
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => { setSelectedTopicId("all"); setCurrentPage(1); setSearchTerm(""); }}
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
                        onClick={() => { setSelectedTopicId(topic.id.toString()); setCurrentPage(1); setSearchTerm(""); }}
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
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    placeholder="Search questions…"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div className="overflow-y-auto flex-1 min-h-0">
                  {isLoadingQuestions ? (
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
                      <div className="inline-flex items-center gap-2">
                        <Loader className="animate-spin" size={16} /> Loading questions…
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
                              <p className="text-sm font-medium text-slate-900">#{question.id} {question.questionText}</p>
                              {question.topicName && (
                                <p className="mt-1 text-xs text-slate-500">Topic: {question.topicName}</p>
                              )}
                            </div>
                          </label>
                        ))}
                      </div>

                      {totalPages > 1 && (
                        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div className="text-sm text-slate-500">
                            Page {currentPage} of {totalPages}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant="secondary"
                              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                              disabled={currentPage === 1 || isLoadingQuestions}
                            >
                              Previous
                            </Button>
                            <Button
                              type="button"
                              variant="secondary"
                              onClick={() => {setCurrentPage(Math.min(totalPages, currentPage + 1)); }}
                              disabled={currentPage === totalPages || isLoadingQuestions}
                            >
                              Next
                            </Button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </div>
          )}

          <div className="flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:justify-between sm:items-center">
            <div className="flex flex-wrap gap-2 text-sm text-slate-500">
              <span>Questions selected:</span>
              <span className="font-semibold text-slate-900">{selectedQuestionIds.length}</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {step === 2 && (
                <Button type="button" variant="secondary" onClick={() => setStep(1)}>
                  Back
                </Button>
              )}
              <Button
                type="button"
                onClick={step === 1 ? () => {
                  if (validateStepOne()) {
                    setHasTriedStepOne(false);
                    setStep(2);
                  }
                } : handleCreateExam}
                disabled={step === 2 ? isSubmitting : false}
              >
                {step === 1 ? "Next" : isSubmitting ? "Creating…" : "Create exam"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
// 

export default function CreateExamAction() {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
    <>
      <Button
        type="button"
        size="lg"
        className="!text-white w-46"
        onClick={handleOpen}
      >
        <Plus size={20} />
        Create Exam
      </Button>
      <CreateExamModal isOpen={isOpen} onClose={handleClose} onOpen={handleOpen} />
    </>
  );
}
