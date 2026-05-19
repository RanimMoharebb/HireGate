"use client";

import { useState } from "react";

import { useCandidates } from "@/app/_hooks/use-candidates";

import { AlertMessage } from "@/app/_components/candidates/alert-message";
import { CandidateHeader } from "@/app/_components/candidates/candidate-header";
import { CreateCandidateCard } from "@/app/_components/candidates/create-candidate-card";
import { CandidateSearch } from "@/app/_components/candidates/candidate-search";
import { CandidateFilter } from "@/app/_components/candidates/candidate-filter";
import { CandidateTable } from "@/app/_components/candidates/candidate-table";
import { PaginationControls } from "@/app/_components/pagination-controls";
import { CandidateDetailsModal } from "@/app/_components/candidates/candidate-details-modal";
import { DeleteCandidateModal } from "@/app/_components/candidates/delete-candidate-modal";
import { SendEmailModal } from "@/app/_components/candidates/send-email-modal";
import { getCandidateExamReview } from "@/app/_services/candidate-service";

import ExamReviewModal from "@/app/_components/candidates/exam-review-modal";

export default function CandidatesPage() {
  const {
    loading,
    selected,
    setSelected,

    search,
    setSearch,

    statusFilter,
    setStatusFilter,

    currentPage,
    setCurrentPage,
    totalPages,

    candidates,

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

    getStatus,
  } = useCandidates();

  const [bulkEmailOpen, setBulkEmailOpen] = useState(false);

  // =========================
  // EXAM REVIEW STATE
  // =========================
  const [examReview, setExamReview] = useState<any>(null);
  const [reviewLoading, setReviewLoading] = useState(false);

  // =========================
  // FETCH EXAM REVIEW
  // =========================

const handleShowExam = async (candidateId: number) => {
  try {
    setReviewLoading(true);
    const data = await getCandidateExamReview(candidateId);
    setExamReview(data);
  } catch (err: any) {
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
        onBulkEmail={() => setBulkEmailOpen(true)}
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
    onChange={(value) => {
      setSearch(value);
      setCurrentPage(1);
    }}
  />

  <CandidateFilter
    value={statusFilter}
    onChange={(value) => {
      setStatusFilter(value);
      setCurrentPage(1);
    }}
  />
</div>

      {/* TABLE */}
      <CandidateTable
        candidates={candidates}
        loading={loading}
        getStatus={getStatus}
        onView={setSelected}
        onDelete={setDeleteCandidate}
        onSendEmail={setSendEmailCandidate}
        onShowExam={handleShowExam}
      />

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        loading={loading}
        onPrev={() => setCurrentPage(Math.max(1, currentPage - 1))}
        onNext={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
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

      <SendEmailModal variant="bulk" open={bulkEmailOpen} onClose={() => setBulkEmailOpen(false)} />

      <SendEmailModal
        variant="single"
        candidate={sendEmailCandidate}
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