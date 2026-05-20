"use client";

import { Check, ImageIcon, X } from "lucide-react";
import { Question } from "@/app/_lib/question-bank.types";
import { useDisableBodyScroll, restoreBodyScroll } from "@/app/_hooks/useDisableBodyScroll";

interface QuestionDetailsModalProps {
  question: Question | null;
  onClose: () => void;
  loading?: boolean;
  onRestore?: () => void;
}

const choiceLetter = (index: number) => String.fromCharCode(65 + index);

export function QuestionDetailsModal({
  question,
  onClose,
  loading = false,
  onRestore,
}: QuestionDetailsModalProps) {
  useDisableBodyScroll(question !== null);

  if (!question) {
    return null;
  }


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 backdrop-blur-sm sm:p-4" onClick={() => { restoreBodyScroll(); onClose(); }}>
      <div className="flex max-h-[min(90vh,880px)] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-gray-100 bg-gradient-to-b from-slate-50 to-white px-5 py-4 sm:px-6">
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-800">
                {question.topicName}
              </span>
              {question.deletedAt && (
                <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">
                  Deleted
                </span>
              )}
            </div>
            <h2 className="text-lg font-bold leading-snug text-gray-900 sm:text-xl">
              {question.questionText}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => { restoreBodyScroll(); onClose(); }}
            className="shrink-0 rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
            aria-label="Close question details"
          >
            <X size={22} strokeWidth={2} />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          {question.questionImage && (
            <figure className="mb-6 overflow-hidden rounded-xl border border-gray-200 bg-slate-50">
              <img
                src={question.questionImage}
                alt=""
                className="max-h-72 w-full object-contain"
              />
              <figcaption className="flex items-center gap-1.5 border-t border-gray-100 px-3 py-2 text-xs text-gray-500">
                <ImageIcon size={14} className="shrink-0" aria-hidden />
                Question image
              </figcaption>
            </figure>
          )}

          <section>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Answer options
            </h3>
            <ul className="space-y-2.5">
              {question.choices.map((choice, index) => {
                const letter = choiceLetter(index);
                const isCorrect = choice.isCorrect;

                return (
                  <li key={`${letter}-${index}`}>
                    <div
                      className={[
                        "flex gap-3 rounded-xl border px-3 py-3 sm:px-4",
                        isCorrect
                          ? "border-emerald-200 bg-emerald-50/90 shadow-sm"
                          : "border-gray-200 bg-white",
                      ].join(" ")}
                    >
                      <span
                        className={[
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold",
                          isCorrect
                            ? "bg-emerald-600 text-white"
                            : "bg-slate-100 text-slate-600",
                        ].join(" ")}
                      >
                        {letter}
                      </span>
                      <div className="min-w-0 flex-1 pt-0.5">
                        <p
                          className={
                            isCorrect ? "font-medium text-emerald-900" : "text-gray-800"
                          }
                        >
                          {choice.choiceText}
                        </p>
                      </div>
                      {isCorrect && (
                        <span className="flex shrink-0 items-center gap-1 self-start rounded-full bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white">
                          <Check size={12} strokeWidth={3} aria-hidden />
                          Correct
                        </span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>

        <footer className="shrink-0 border-t border-gray-100 bg-slate-50/80 px-5 py-4 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm">
              <p className="text-gray-500">Question ID</p>
              <p className="font-mono font-medium text-gray-900">{question.id}</p>
              {question.deletedAt && (
                <p className="mt-1 text-xs text-gray-500">
                  Deleted {new Date(question.deletedAt).toLocaleString()}
                </p>
              )}
            </div>
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              {question.deletedAt && onRestore && (
                <button
                  type="button"
                  onClick={onRestore}
                  disabled={loading}
                  className="rounded-lg border border-emerald-600 px-5 py-2.5 text-sm font-medium text-emerald-800 transition-colors hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Restore
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
