"use client";

import {
  Award,
  CalendarClock,
  CalendarCheck,
  Phone,
  X,
} from "lucide-react";

import { Candidate } from "@/app/_services/candidate-service";

type Props = {
  candidate: Candidate | null;
  onClose: () => void;
};

function getStatusLabel(candidate: Candidate): "Pending" | "In Progress" | "Submitted" {
  if (candidate.submittedAt) return "Submitted";
  if (candidate.startedAt) return "In Progress";
  return "Pending";
}

function statusBadgeClass(status: ReturnType<typeof getStatusLabel>) {
  if (status === "Submitted") {
    return "bg-emerald-50 text-emerald-800 ring-emerald-200";
  }
  if (status === "In Progress") {
    return "bg-amber-50 text-amber-900 ring-amber-200";
  }
  return "bg-slate-100 text-slate-700 ring-slate-200";
}

function formatDateTime(iso: string | null) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

export function CandidateDetailsModal({ candidate, onClose }: Props) {
  if (!candidate) {
    return null;
  }

  const displayName =
    [candidate.firstName, candidate.lastName].filter(Boolean).join(" ").trim() || "—";
  const status = getStatusLabel(candidate);
  const hasName = displayName !== "—";
  const titleText = hasName ? displayName : candidate.email;
  const subtitleEmail = hasName ? candidate.email : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 backdrop-blur-sm sm:p-4">
      <div
        className="flex max-h-[min(90vh,640px)] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="candidate-details-title"
      >
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-gray-100 bg-gradient-to-b from-slate-50 to-white px-5 py-4 sm:px-6">
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={[
                  "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ring-1 ring-inset",
                  statusBadgeClass(status),
                ].join(" ")}
              >
                {status}
              </span>
            </div>
            <h2
              id="candidate-details-title"
              className="text-lg font-bold leading-snug text-gray-900 sm:text-xl"
            >
              {titleText}
            </h2>
            {subtitleEmail ? (
              <p className="truncate text-sm text-gray-500">{subtitleEmail}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
            aria-label="Close"
          >
            <X size={22} strokeWidth={2} />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          <dl className="grid gap-4 sm:grid-cols-1">
            <div className="flex gap-3 rounded-xl border border-gray-100 bg-gray-50/80 px-4 py-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-gray-600 shadow-sm ring-1 ring-gray-100">
                <Phone size={18} strokeWidth={2} aria-hidden />
              </div>
              <div className="min-w-0 flex-1">
                <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">Phone</dt>
                <dd className="mt-0.5 text-sm font-medium text-gray-900">
                  {candidate.phoneNumber || "—"}
                </dd>
              </div>
            </div>

            <div className="flex gap-3 rounded-xl border border-gray-100 bg-gray-50/80 px-4 py-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-gray-600 shadow-sm ring-1 ring-gray-100">
                <Award size={18} strokeWidth={2} aria-hidden />
              </div>
              <div className="min-w-0 flex-1">
                <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">Final score</dt>
                <dd className="mt-0.5 text-sm font-medium text-gray-900">
                  {candidate.finalScore != null ? String(candidate.finalScore) : "—"}
                </dd>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex gap-3 rounded-xl border border-gray-100 bg-gray-50/80 px-4 py-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-gray-600 shadow-sm ring-1 ring-gray-100">
                  <CalendarClock size={18} strokeWidth={2} aria-hidden />
                </div>
                <div className="min-w-0 flex-1">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">Started</dt>
                  <dd className="mt-0.5 text-sm font-medium text-gray-900">
                    {formatDateTime(candidate.startedAt)}
                  </dd>
                </div>
              </div>

              <div className="flex gap-3 rounded-xl border border-gray-100 bg-gray-50/80 px-4 py-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-gray-600 shadow-sm ring-1 ring-gray-100">
                  <CalendarCheck size={18} strokeWidth={2} aria-hidden />
                </div>
                <div className="min-w-0 flex-1">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">Submitted</dt>
                  <dd className="mt-0.5 text-sm font-medium text-gray-900">
                    {formatDateTime(candidate.submittedAt)}
                  </dd>
                </div>
              </div>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
