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
import { DeleteConfirmationModal } from "@/app/_components/question-bank/delete-confirmation-modal";
import { SendEmailModal } from "@/app/_components/candidates/send-email-modal";

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

    setExamReview(data.data);
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

      {/*we are NOT controlling whether it should render or not
      So React always keeps it in the tree with changing props (selected changes every click).*/}
      {/* MODALS */}
      {selected && ( //stop rendering modals with null props}}
      <CandidateDetailsModal
        candidate={selected}
        onClose={() => setSelected(null)}
      />
      )}   

      {deleteCandidate && (

      <DeleteConfirmationModal
        isOpen={deleteCandidate !== null}
        loading={loading}
        title="Delete Candidate"
        description="This action cannot be undone."
        itemLabel={deleteCandidate?.email}
        confirmLabel="Delete"
        onCancel={() => setDeleteCandidate(null)}
        onConfirm={confirmDelete}
      />
      )}

      <SendEmailModal variant="bulk" open={bulkEmailOpen} onClose={() => setBulkEmailOpen(false)} />

      <SendEmailModal
        variant="single"
        candidate={sendEmailCandidate}
        loading={emailLoading}
        onClose={() => setSendEmailCandidate(null)}
        onSubmit={handleSendEmail}
      />

      {/* EXAM REVIEW MODAL */}
      {examReview && (
      <ExamReviewModal
        data={examReview}
        loading={reviewLoading}
        onClose={() => setExamReview(null)}
      />
      
            )}
    </div>
  );
}