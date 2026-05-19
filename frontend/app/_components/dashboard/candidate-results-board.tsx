"use client";

import { Fragment, useMemo, useState } from "react";
import { Eye, EyeOff, Filter, Loader, UploadCloud } from "lucide-react";
import Header from "@/app/_components/layout/header";
import Input from "@/app/_components/ui/input";
import { Button } from "@/app/_components/ui/button";
import { Card, CardContent } from "@/app/_components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/_components/ui/table";
import { getCandidateExamReview } from "@/app/_services/candidate-service";
import type { Candidate, CandidateExamReview } from "@/app/_services/candidate-service";
import type { Exam } from "@/app/_services/exam-service";

type CandidateResultsBoardProps = {
  candidates: Candidate[];
  examTitles: Pick<Exam, 'id' | 'title'>[];
};

type CandidateStatus = "All" | "Passed" | "Failed" | "In Progress";

function formatCandidateName(candidate: Candidate) {
  const fullName = `${candidate.firstName ?? ""} ${candidate.lastName ?? ""}`.trim();
  return fullName || candidate.email;
}

function getCandidateStatus(candidate: Candidate): CandidateStatus {
  if (!candidate.submittedAt) {
    return "In Progress";
  }

  if (candidate.finalScore === null) {
    return "All";
  }

  return candidate.finalScore >= 60 ? "Passed" : "Failed";
}

function formatSubmittedAt(value: string | null) {
  if (!value) {
    return "In progress";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

function getStatusClasses(status: CandidateStatus) {
  switch (status) {
    case "Passed":
      return "bg-emerald-100 text-emerald-800";
    case "Failed":
      return "bg-rose-100 text-rose-800";
    case "In Progress":
      return "bg-amber-100 text-amber-800";
    default:
      return "bg-slate-100 text-slate-800";
  }
}

export default function CandidateResultsBoard({
  candidates,
  examTitles,
}: CandidateResultsBoardProps) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<CandidateStatus>("All");
  const [openCandidateId, setOpenCandidateId] = useState<number | null>(null);
  const [reviewByCandidateId, setReviewByCandidateId] = useState<Record<number, CandidateExamReview>>({});
  const [loadingCandidateId, setLoadingCandidateId] = useState<number | null>(null);
  const [errorByCandidateId, setErrorByCandidateId] = useState<Record<number, string>>({});

  const examTitleById = useMemo(
    () => new Map(examTitles.map((exam) => [exam.id, exam.title])),
    [examTitles],
  );

  const totalCandidates = candidates.length;
  const passedCandidates = candidates.filter((candidate) => candidate.finalScore !== null && candidate.finalScore >= 60).length;
  const failedCandidates = candidates.filter((candidate) => candidate.finalScore !== null && candidate.finalScore < 60).length;
  const inProgressCandidates = candidates.filter((candidate) => !candidate.submittedAt).length;

  const filteredCandidates = useMemo(() => {
    return candidates
      .filter((candidate) => {
        if (statusFilter !== "All" && getCandidateStatus(candidate) !== statusFilter) {
          return false;
        }

        const search = searchTerm.trim().toLowerCase();
        if (!search) {
          return true;
        }

        const candidateName = formatCandidateName(candidate).toLowerCase();
        const email = candidate.email.toLowerCase();
        const examTitle = candidate.examId ? (examTitleById.get(candidate.examId) ?? "").toLowerCase() : "";

        return [candidateName, email, examTitle].some((value) => value.includes(search));
      })
      .sort((left, right) => {
        const leftTime = left.submittedAt ? new Date(left.submittedAt).getTime() : 0;
        const rightTime = right.submittedAt ? new Date(right.submittedAt).getTime() : 0;
        return rightTime - leftTime;
      });
  }, [candidates, examTitleById, searchTerm, statusFilter]);

  async function handleToggleReview(candidateId: number) {
    if (openCandidateId === candidateId) {
      setOpenCandidateId(null);
      return;
    }

    setOpenCandidateId(candidateId);

    if (reviewByCandidateId[candidateId] || loadingCandidateId === candidateId) {
      return;
    }

    setLoadingCandidateId(candidateId);
    setErrorByCandidateId((current) => ({ ...current, [candidateId]: "" }));

    try {
      const payload = await getCandidateExamReview(candidateId);
      setReviewByCandidateId((current) => ({ ...current, [candidateId]: payload }));
    } catch (error) {
      setErrorByCandidateId((current) => ({
        ...current,
        [candidateId]: error instanceof Error ? error.message : "Failed to load candidate review.",
      }));
    } finally {
      setLoadingCandidateId(null);
    }
  }

  return (
    <section className="space-y-6">
      <Header
        title="HR Dashboard"
        description="Monitor candidate exam results and performance. Search, filter, and export candidate summaries from one place."
      />

      <div className="grid gap-4 lg:grid-cols-4">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Total candidates</p>
          <p className="mt-3 text-4xl font-semibold text-slate-900">{totalCandidates}</p>
        </div>

        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
          <p className="text-sm font-medium text-emerald-700">Passed</p>
          <p className="mt-3 text-4xl font-semibold text-emerald-900">{passedCandidates}</p>
        </div>

        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 shadow-sm">
          <p className="text-sm font-medium text-rose-700">Failed</p>
          <p className="mt-3 text-4xl font-semibold text-rose-900">{failedCandidates}</p>
        </div>

        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
          <p className="text-sm font-medium text-amber-700">In progress</p>
          <p className="mt-3 text-4xl font-semibold text-amber-900">{inProgressCandidates}</p>
        </div>
      </div>

      <Card>
        <CardContent className="space-y-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1 min-w-0">
              <Input
                type="search"
                placeholder="Search candidates..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="max-w-xl"
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                <Filter size={16} />
                {statusFilter}
              </button>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as CandidateStatus)}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Status</option>
                <option value="Passed">Passed</option>
                <option value="Failed">Failed</option>
                <option value="In Progress">In Progress</option>
              </select>
              <Button type="button" variant="primary" size="md" className="whitespace-nowrap">
                <UploadCloud size={16} />
                Export
              </Button>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>Candidate name</TableHeader>
                  <TableHeader>Exam</TableHeader>
                  <TableHeader>Score</TableHeader>
                  <TableHeader>Status</TableHeader>
                  <TableHeader>Submitted at</TableHeader>
                  <TableHeader className="text-right">Actions</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCandidates.map((candidate) => {
                  const examTitle = candidate.examId ? examTitleById.get(candidate.examId) ?? "Assigned exam" : "No exam assigned";
                  const status = getCandidateStatus(candidate);
                  const isOpen = openCandidateId === candidate.id;
                  const review = reviewByCandidateId[candidate.id];
                  const reviewError = errorByCandidateId[candidate.id];
                  const isLoadingReview = loadingCandidateId === candidate.id;

                  return (
                    <Fragment key={candidate.id}>
                      <TableRow>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
                              {formatCandidateName(candidate)
                                .split(" ")
                                .map((part) => part[0])
                                .join("")
                                .slice(0, 2)}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900">{formatCandidateName(candidate)}</p>
                              <p className="text-xs text-slate-500">{candidate.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{examTitle}</TableCell>
                        <TableCell>{candidate.finalScore ?? "—"}</TableCell>
                        <TableCell>
                          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(status)}`}>
                            {status}
                          </span>
                        </TableCell>
                        <TableCell>{formatSubmittedAt(candidate.submittedAt)}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            type="button"
                            variant="secondary"
                            size="md"
                            onClick={() => void handleToggleReview(candidate.id)}
                            disabled={isLoadingReview}
                          >
                            {isLoadingReview ? <Loader className="animate-spin" size={16} /> : isOpen ? <EyeOff size={16} /> : <Eye size={16} />}
                            {isOpen ? "Hide" : "View"}
                          </Button>
                        </TableCell>
                      </TableRow>

                      {isOpen ? (
                        <tr>
                          <td colSpan={6} className="bg-slate-50 px-6 py-4">
                            {isLoadingReview ? (
                              <div className="flex items-center gap-2 text-sm text-slate-500">
                                <Loader className="animate-spin" size={16} /> Loading exam review...
                              </div>
                            ) : reviewError ? (
                              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                                {reviewError}
                              </div>
                            ) : review ? (
                              <div className="space-y-4">
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                  <div>
                                    <p className="text-sm font-semibold text-slate-900">{review.candidateName}</p>
                                    <p className="text-xs text-slate-500">{review.examTitle}</p>
                                  </div>
                                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                                    Score: {review.finalScore ?? "N/A"}
                                  </span>
                                </div>
                                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                                  {review.questions.map((question) => (
                                    <div key={question.questionId} className="rounded-2xl border border-slate-200 bg-white p-4">
                                      <p className="text-sm font-medium text-slate-900">{question.questionText}</p>
                                      <div className="mt-3 space-y-2">
                                        {question.choices.map((choice) => {
                                          const choiceClassName = choice.isCorrect
                                            ? choice.isSelectedByCandidate
                                              ? "border-emerald-300 bg-emerald-100 text-emerald-900"
                                              : "border-emerald-200 bg-emerald-50 text-emerald-800"
                                            : choice.isSelectedByCandidate
                                              ? "border-rose-200 bg-rose-50 text-rose-700"
                                              : "border-slate-200 bg-slate-50 text-slate-700";

                                          return (
                                            <div key={choice.choiceId} className={`rounded-xl border px-3 py-2 text-sm ${choiceClassName}`}>
                                              <div className="flex items-start justify-between gap-3">
                                                <span>{choice.choiceText}</span>
                                                <div className="flex gap-2 text-[11px] font-semibold uppercase tracking-wide">
                                                  {choice.isCorrect ? (
                                                    <span className="rounded-full bg-white/80 px-2 py-0.5">Correct</span>
                                                  ) : null}
                                                  {choice.isSelectedByCandidate ? (
                                                    <span className="rounded-full bg-white/80 px-2 py-0.5">Candidate</span>
                                                  ) : null}
                                                </div>
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <p className="text-sm text-slate-500">No review details available.</p>
                            )}
                          </td>
                        </tr>
                      ) : null}
                    </Fragment>
                  );
                })}
              </TableBody>
            </Table>

            {filteredCandidates.length === 0 ? (
              <div className="border-t border-slate-200 px-6 py-10 text-center text-sm text-slate-500">
                No candidates match the current search or filter.
              </div>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
