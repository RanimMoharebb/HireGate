"use client";

import { AlertMessage } from "@/app/_components/question-bank/alert-message";
import { AddTopicModal } from "@/app/_components/question-bank/add-topic-modal";
import { DeleteQuestionModal } from "@/app/_components/question-bank/delete-question-modal";
import { PaginationControls } from "@/app/_components/question-bank/pagination-controls";
import { QuestionBankHeader } from "@/app/_components/question-bank/question-bank-header";
import { QuestionDetailsModal } from "@/app/_components/question-bank/question-details-modal";
import { QuestionFormModal } from "@/app/_components/question-bank/question-form-modal";
import { QuestionSearch } from "@/app/_components/question-bank/question-search";
import { QuestionsTable } from "@/app/_components/question-bank/questions-table";
import { TopicFilter } from "@/app/_components/question-bank/topic-filter";
import { useQuestionBank } from "@/app/_hooks/use-question-bank";

export default function page() {
  const {
    questions,
    topics,
    selectedTopic,
    setSelectedTopic,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    totalPages,
    loading,
    errorMessage,
    setErrorMessage,
    successMessage,
    setSuccessMessage,
    isSuccessVisible,
    formData,
    setFormData,
    formError,
    topicName,
    setTopicName,
    topicError,
    isTopicModalOpen,
    isFormModalOpen,
    isEditingMode,
    selectedQuestion,
    setSelectedQuestion,
    deleteQuestion,
    setDeleteQuestion,
    showQuestionDetails,
    openAddTopicModal,
    closeAddTopicModal,
    submitTopic,
    submitQuestion,
    openAddQuestionModal,
    openEditQuestionModal,
    closeFormModal,
    confirmDeleteQuestion,
  } = useQuestionBank();

  return (
    <div className="space-y-6">
      <AlertMessage
        type="success"
        message={successMessage}
        visible={isSuccessVisible}
        onClose={() => {
          setSuccessMessage(null);
        }}
      />
      <AlertMessage
        type="error"
        message={errorMessage}
        onClose={() => setErrorMessage(null)}
      />

      <QuestionBankHeader
        loading={loading}
        onAddTopic={openAddTopicModal}
        onAddQuestion={openAddQuestionModal}
      />

      <QuestionSearch
        value={searchTerm}
        onChange={(value) => {
          setSearchTerm(value);
          setCurrentPage(1);
        }}
      />

      <TopicFilter
        topics={topics}
        selectedTopic={selectedTopic}
        onSelect={(topicId) => {
          setSelectedTopic(topicId);
          setCurrentPage(1);
        }}
      />

      <QuestionsTable
        questions={questions}
        loading={loading}
        onView={setSelectedQuestion}
        onEdit={openEditQuestionModal}
        onDelete={setDeleteQuestion}
      />

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        loading={loading}
        onPrev={() => setCurrentPage(Math.max(1, currentPage - 1))}
        onNext={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
      />

      <QuestionDetailsModal
        question={showQuestionDetails ? selectedQuestion : null}
        onClose={() => setSelectedQuestion(null)}
      />

      <QuestionFormModal
        isOpen={isFormModalOpen}
        isEditingMode={isEditingMode}
        loading={loading}
        topics={topics}
        formData={formData}
        formError={formError}
        setFormData={setFormData}
        onClose={closeFormModal}
        onSubmit={submitQuestion}
      />

      <AddTopicModal
        isOpen={isTopicModalOpen}
        loading={loading}
        topicName={topicName}
        topicError={topicError}
        onClose={closeAddTopicModal}
        onSubmit={submitTopic}
        onTopicNameChange={setTopicName}
      />

      <DeleteQuestionModal
        question={deleteQuestion}
        loading={loading}
        onCancel={() => setDeleteQuestion(null)}
        onConfirm={confirmDeleteQuestion}
      />
    </div>
  );
}