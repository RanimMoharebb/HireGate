"use client";

import { useEffect, useState } from "react";

import { useCandidates } from "@/app/_hooks/use-candidates";

import { AlertMessage } from "@/app/_components/candidates/alert-message";
import { CandidateHeader } from "@/app/_components/candidates/candidate-header";
import { CreateCandidateCard } from "@/app/_components/candidates/create-candidate-card";
import { CandidateSearch } from "@/app/_components/candidates/candidate-search";
import { CandidateFilter } from "@/app/_components/candidates/candidate-filter";
import { CandidateTable } from "@/app/_components/candidates/candidate-table";
import { CandidateDetailsModal } from "@/app/_components/candidates/candidate-details-modal";
import { DeleteCandidateModal } from "@/app/_components/candidates/delete-candidate-modal";
import { SendEmailModal } from "@/app/_components/candidates/send-email-modal";

import ExamReviewModal from "@/app/_components/candidates/exam-review-modal";

type Exam = {
  id: number;
  positionTitle: string;
};

export default function CandidatesPage() {
  const {
    candidates,
    loading,
    selected,
    setSelected,

    search,
    setSearch,

    statusFilter,
    setStatusFilter,

    filteredCandidates,

    createMessage,
    setCreateMessage,

    email,
    setEmail,

    handleCreate,

    deleteCandidate,
    setDeleteCandidate,
    confirmDelete,

    sendEmailCandidate,
    setSendEmailCandidate,
    handleSendEmail,

    emailLoading,
    emailMessage,

    handleBulkEmail,

    getStatus,
  } = useCandidates();

  // =========================
  // EXAMS STATE (NEW)
  // =========================
  const [exams, setExams] = useState<Exam[]>([]);

  // =========================
  // EXAM REVIEW STATE
  // =========================
  const [examReview, setExamReview] = useState<any>(null);
  const [reviewLoading, setReviewLoading] = useState(false);

  // =========================
  // FETCH DATA (ADD EXAMS HERE)
  // =========================
  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await fetch("http://localhost:5116/api/exam/");

        if (!res.ok) throw new Error("Failed to fetch exams");

        const data = await res.json();

        setExams(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Exams fetch error:", err);
      }
    };

    fetchExams();
  }, []);

  // =========================
  // FETCH EXAM REVIEW
  // =========================

const handleShowExam = async (candidateId: number) => {
  try {
    setReviewLoading(true);

    const token = localStorage.getItem("token"); // IMPORTANT

    const res = await fetch(
      `http://localhost:5116/candidates/${candidateId}/exam-review`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const text = await res.text();
    console.log("EXAM REVIEW RESPONSE:", text);

    if (!res.ok) {
      throw new Error(text || "Failed to load exam review");
    }

    const data = JSON.parse(text);

    setExamReview(data);
  } catch (err: any) {
    console.error("Exam review error:", err.message);
    alert(err.message);
  } finally {
    setReviewLoading(false);
  }
};


  return (
    <div className="space-y-6">

      {/* ALERTS */}
      <AlertMessage
        type="success"
        message={createMessage}
        onClose={() => setCreateMessage("")}
      />

      <AlertMessage
        type="success"
        message={emailMessage}
      />

      {/* HEADER */}
      <CandidateHeader
        loading={loading}
        onBulkEmail={handleBulkEmail}
      />

      {/* CREATE */}
      <CreateCandidateCard
        email={email}
        setEmail={setEmail}
        onCreate={handleCreate}
      />

{/* SEARCH + FILTER */}
<div className="flex w-full items-center gap-3">
  <CandidateSearch
    value={search}
    onChange={setSearch}
  />

  <CandidateFilter
    value={statusFilter}
    onChange={setStatusFilter}
  />
</div>

      {/* TABLE */}
      <CandidateTable
        candidates={filteredCandidates}
        loading={loading}
        getStatus={getStatus}
        onView={setSelected}
        onDelete={setDeleteCandidate}
        onSendEmail={setSendEmailCandidate}
        onShowExam={handleShowExam}
      />

      {/* MODALS */}
      <CandidateDetailsModal
        candidate={selected}
        onClose={() => setSelected(null)}
      />

      <DeleteCandidateModal
        candidate={deleteCandidate}
        loading={loading}
        onCancel={() => setDeleteCandidate(null)}
        onConfirm={confirmDelete}
      />

      {/* SEND EMAIL MODAL */}
      <SendEmailModal
        candidate={sendEmailCandidate}
        exams={exams}
        loading={emailLoading}
        onClose={() => setSendEmailCandidate(null)}
        onSubmit={handleSendEmail}
      />

      {/* EXAM REVIEW MODAL */}
      <ExamReviewModal
        data={examReview}
        loading={reviewLoading}
        onClose={() => setExamReview(null)}
      />

    </div>
  );
}