"use client";

import { Loader } from "lucide-react";

type Choice = {
  choiceId: number;
  choiceText: string;
  isCorrect: boolean;
  isSelectedByCandidate: boolean;
};

type Question = {
  questionId: number;
  questionText: string;
  choices: Choice[];
};

type ExamReview = {
  candidateId: number;
  candidateName: string;
  examTitle: string;
  finalScore: number | null;
  questions: Question[];
};

interface Props {
  data: ExamReview | null;
  loading: boolean;
  onClose: () => void;
}

export default function ExamReviewModal({ data, loading, onClose }: Props) {
  if (!data) return null;

  const getChoiceClass = (choice: Choice) => {
    if (choice.isCorrect && choice.isSelectedByCandidate) {
      // Candidate picked the right answer
      return "bg-green-100 border border-green-400 text-green-800";
    }
    if (choice.isCorrect && !choice.isSelectedByCandidate) {
      // Right answer but candidate didn't pick it
      return "bg-green-100 border border-green-400 text-green-800";
    }
    if (!choice.isCorrect && choice.isSelectedByCandidate) {
      // Candidate picked the wrong answer
      return "bg-red-100 border border-red-400 text-red-800";
    }
    // Not selected, not correct
    return "bg-white border border-slate-200 text-slate-700";
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl max-h-[85vh] overflow-hidden flex flex-col border border-slate-300">

        {/* HEADER */}
        <div className="p-6 border-b border-slate-300 flex justify-between items-center bg-slate-50">
          <div>
            <h2 className="text-2xl font-semibold text-slate-800">Exam Review</h2>
            <div className="text-sm text-slate-500 space-y-1">
              <div>Candidate Name: {data.candidateName}</div>
              <div>Exam: {data.examTitle}</div>
              <div>Score: {data.finalScore ?? "—"}</div>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-500 text-xl hover:text-slate-700">
            ×
          </button>
        </div>

        {/* BODY */}
        <div className="p-4 overflow-y-auto space-y-6">
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader className="animate-spin text-slate-500" />
            </div>
          ) : (
            <div className="space-y-6">
              {data.questions.map((q) => {
                const selectedChoice = q.choices.find((c) => c.isSelectedByCandidate);
                const answeredCorrectly = selectedChoice?.isCorrect ?? false;
                const noAnswer = !selectedChoice;

                return (
                  <div
                    key={q.questionId}
                    className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-sm"
                  >
                    {/* QUESTION */}
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                      <div className="min-w-0 flex-1 text-lg font-semibold text-slate-900">
                        {q.questionText}
                      </div>
                      {noAnswer && (
                        <span className="shrink-0 text-xs font-medium text-amber-700">
                          No answer
                        </span>
                      )}
                    </div>

                    {/* CHOICES */}
                    <div className="space-y-2">
                      {q.choices.map((c) => (
                        <div
                          key={c.choiceId}
                          className={`rounded-lg px-3 py-2 text-sm flex justify-between items-center ${getChoiceClass(c)}`}
                        >
                          <span>{c.choiceText}</span>

                          {c.isSelectedByCandidate && (
                            <span
                              className={`text-xs font-semibold ${
                                answeredCorrectly ? "text-green-600" : "text-red-600"
                              }`}
                            >
                              {answeredCorrectly ? "Correct ✔" : "Incorrect ✖"}
                            </span>
                          )}

                          {!c.isSelectedByCandidate && c.isCorrect && (
                            <span className="text-xs font-semibold text-green-600">
                              Correct answer
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
