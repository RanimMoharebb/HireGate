"use client";

import { AlertMessage } from "@/app/_components/question-bank/alert-message";
import { AddTopicModal } from "@/app/_components/question-bank/add-topic-modal";
import { DeleteConfirmationModal } from "@/app/_components/question-bank/delete-confirmation-modal";
import { PaginationControls } from "@/app/_components/pagination-controls";
import { QuestionBankHeader } from "@/app/_components/question-bank/question-bank-header";
import { QuestionDetailsModal } from "@/app/_components/question-bank/question-details-modal";
import { QuestionFormModal } from "@/app/_components/question-bank/question-form-modal";
import { QuestionSearch } from "@/app/_components/question-bank/question-search";
import { QuestionStatusFilter } from "@/app/_components/question-bank/question-status-filter";
import { QuestionsTable } from "@/app/_components/question-bank/questions-table";
import { TopicFilter } from "@/app/_components/question-bank/topic-filter";
import { useQuestionBank } from "@/app/_hooks/use-question-bank";

export default function QuestionBankPage() {
  const {
    questions,
    topics,
    selectedTopic,
    setSelectedTopic,
    deletedFilter,
    setDeletedFilter,
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
    topicToDelete,
    setTopicToDelete,
    confirmDeleteTopic,
    showQuestionDetails,
    openAddTopicModal,
    closeAddTopicModal,
    submitTopic,
    submitQuestion,
    openAddQuestionModal,
    openEditQuestionModal,
    closeFormModal,
    confirmDeleteQuestion,
    restoreQuestion,
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

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
        <div className="min-w-0 flex-1">
          <QuestionSearch
            value={searchTerm}
            onChange={(value) => {
              setSearchTerm(value);
              setCurrentPage(1);
            }}
          />
        </div>
        <div className="w-full shrink-0 sm:w-64">
          <TopicFilter
            topics={topics}
            selectedTopic={selectedTopic}
            onSelect={(topicId) => {
              setSelectedTopic(topicId);
              setCurrentPage(1);
            }}
            onRequestDeleteTopic={(topic) => setTopicToDelete(topic)}
          />
        </div>
      </div>

      <QuestionStatusFilter
        value={deletedFilter}
        onChange={(value) => {
          setDeletedFilter(value);
          setCurrentPage(1);
        }}
      />

      <QuestionsTable
        questions={questions}
        loading={loading}
        deletedFilter={deletedFilter}
        onView={setSelectedQuestion}
        onEdit={openEditQuestionModal}
        onDelete={setDeleteQuestion}
        onRestore={restoreQuestion}
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
        loading={loading}
        onRestore={
          showQuestionDetails && selectedQuestion?.deletedAt
            ? () => {
                void restoreQuestion(selectedQuestion);
              }
            : undefined
        }
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

      <DeleteConfirmationModal
        isOpen={!!deleteQuestion}
        loading={loading}
        title="Delete Question"
        description="Are you sure you want to delete this question?"
        itemLabel={deleteQuestion?.questionText}
        onCancel={() => setDeleteQuestion(null)}
        onConfirm={confirmDeleteQuestion}
      />
      <DeleteConfirmationModal
        isOpen={!!topicToDelete}
        loading={loading}
        title="Delete Topic"
        description="Are you sure you want to delete this topic? Questions that use it may be affected."
        itemLabel={topicToDelete?.topicName}
        onCancel={() => setTopicToDelete(null)}
        onConfirm={() => {
          void confirmDeleteTopic();
        }}
      />
    </div>
  );
}
