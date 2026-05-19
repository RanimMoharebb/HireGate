"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import { Card, CardContent } from "@/app/_components/ui/card";
import type { BackendQuestionDto } from "@/app/_lib/exams/exam.types";

type ExamQuestionsManagerProps = {
  initialQuestions: BackendQuestionDto[];
};

export default function ExamQuestionsManager({
  initialQuestions,
}: ExamQuestionsManagerProps) {
  const [openQuestionIds, setOpenQuestionIds] = useState<number[]>([]);

  function toggleChoices(questionId: number) {
    setOpenQuestionIds((current) =>
      current.includes(questionId)
        ? current.filter((id) => id !== questionId)
        : [...current, questionId],
    );
  }

  return (
    <Card>
      <CardContent className="space-y-5">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Exam Questions</h2>
          <p className="mt-1 text-sm text-slate-600">
            Review the questions attached to this exam and open any question to inspect its choices.
          </p>
        </div>

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
                    variant="secondary"
                    onClick={() => toggleChoices(question.id)}
                    aria-label={
                      openQuestionIds.includes(question.id)
                        ? `Hide choices for question ${question.id}`
                        : `View choices for question ${question.id}`
                    }
                  >
                    {openQuestionIds.includes(question.id) ? <EyeOff size={16} /> : <Eye size={16} />}
                    {openQuestionIds.includes(question.id) ? "Hide Choices" : "View Choices"}
                  </Button>
                </div>

                {openQuestionIds.includes(question.id) ? (
                  <div className="mt-4 space-y-2 rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Choices
                    </p>
                    {question.choices.length === 0 ? (
                      <p className="text-sm text-slate-500">No choices available for this question.</p>
                    ) : (
                      <div className="space-y-2">
                        {question.choices.map((choice) => (
                          <div
                            key={choice.id}
                            className={`rounded-lg border px-3 py-2 text-sm ${choice.isCorrect
                              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                              : "border-slate-200 bg-white text-slate-700"
                              }`}
                          >
                            {choice.choiceText}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
