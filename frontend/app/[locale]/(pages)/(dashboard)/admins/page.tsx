"use client";

import Input from "@/app/_components/ui/input";
import { AdminsHeader } from "@/app/_components/admins/admins-header";
import { AdminsTable } from "@/app/_components/admins/admins-table";
import { CreateAdminModal } from "@/app/_components/admins/create-admin-modal";
import { DeleteConfirmationModal } from "@/app/_components/question-bank/delete-confirmation-modal";
import { AlertMessage } from "@/app/_components/question-bank/alert-message";
import { PaginationControls } from "@/app/_components/pagination-controls";
import { useAdmins } from "@/app/_hooks/use-admins";

export default function AdminsPage() {
  const {
    roleOptions,
    admins,
    searchTerm,
    currentPage,
    totalPages,
    loading,
    submitting,
    email,
    role,
    error,
    success,
    isSuccessVisible,
    isErrorVisible,
    rowRoleSelections,
    busyAdminId,
    isCreateModalOpen,
    createModalError,
    deleteCandidate,
    setError,
    setSuccess,
    setCurrentPage,
    setIsCreateModalOpen,
    closeCreateModal,
    handleCreateEmailChange,
    handleCreateRoleChange,
    handleCreateAdmin,
    handleRoleChange,
    openDeleteAdminModal,
    closeDeleteAdminModal,
    confirmDeleteAdmin,
    changeSearchTerm,
    changeRowRoleSelection,
  } = useAdmins();

  return (
    <div className="space-y-6">
      <AlertMessage
        type="success"
        message={success}
        visible={isSuccessVisible}
        onClose={() => setSuccess(null)}
      />
      <AlertMessage
        type="error"
        message={error}
        visible={isErrorVisible}
        onClose={() => setError(null)}
      />

      <AdminsHeader onAddAdmin={() => setIsCreateModalOpen(true)} />

      <CreateAdminModal
        isOpen={isCreateModalOpen}
        submitting={submitting}
        email={email}
        role={role}
        roleOptions={roleOptions}
        error={createModalError}
        onClose={closeCreateModal}
        onSubmit={handleCreateAdmin}
        onEmailChange={handleCreateEmailChange}
        onRoleChange={handleCreateRoleChange}
      />

      <div className="max-w-xl">
        <Input
          type="text"
          placeholder="Search admins..."
          value={searchTerm}
          onChange={(event) => {
            changeSearchTerm(event.target.value);
          }}
        />
      </div>

      <AdminsTable
        admins={admins}
        loading={loading}
        roleOptions={roleOptions}
        rowRoleSelections={rowRoleSelections}
        busyAdminId={busyAdminId}
        onRowRoleSelectionChange={changeRowRoleSelection}
        onApplyRoleChange={(admin) => {
          void handleRoleChange(admin);
        }}
        onDeleteAdmin={(admin) => {
          openDeleteAdminModal(admin);
        }}
      />

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        loading={loading}
        onPrev={() => setCurrentPage(Math.max(1, currentPage - 1))}
        onNext={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
      />

      <DeleteConfirmationModal
        isOpen={!!deleteCandidate}
        loading={busyAdminId === deleteCandidate?.id}
        title="Delete Admin"
        description="Are you sure you want to delete this admin? This action cannot be undone."
        itemLabel={deleteCandidate?.email}
        onCancel={closeDeleteAdminModal}
        onConfirm={() => {
          void confirmDeleteAdmin();
        }}
      />
    </div>
  );
}
