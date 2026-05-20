"use client";

import { FormEvent, useEffect, useState } from "react";
import { AdminUser, UserRole } from "@/app/_lib/admin.types";
import { adminService } from "@/app/_services/admin-service";

const ROLE_OPTIONS: UserRole[] = ["CEO", "HRManager"];
const PAGE_SIZE = 10;

export const useAdmins = () => {
  //const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("HRManager");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSuccessVisible, setIsSuccessVisible] = useState(false);
  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const [rowRoleSelections, setRowRoleSelections] = useState<Record<number, UserRole>>({});
  const [busyAdminId, setBusyAdminId] = useState<number | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createModalError, setCreateModalError] = useState<string | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<AdminUser | null>(null);

  useEffect(() => {
    if (!success) {
      setIsSuccessVisible(false);
      return;
    }

    setIsSuccessVisible(true);
    const hideTimer = window.setTimeout(() => setIsSuccessVisible(false), 2000);
    const removeTimer = window.setTimeout(() => setSuccess(null), 3000);

    return () => {
      window.clearTimeout(hideTimer);
      window.clearTimeout(removeTimer);
    };
  }, [success]);

  useEffect(() => {
    if (!error) {
      setIsErrorVisible(false);
      return;
    }

    setIsErrorVisible(true);
    const hideTimer = window.setTimeout(() => setIsErrorVisible(false), 3600);
    const removeTimer = window.setTimeout(() => setError(null), 4000);

    return () => {
      window.clearTimeout(hideTimer);
      window.clearTimeout(removeTimer);
    };
  }, [error]);

  const loadAdmins = async (page: number, search: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getAdmins(page, PAGE_SIZE, search);
      setAdmins(data.items);
      setTotalCount(data.totalCount);
      setTotalPages(data.totalPages);
      setRowRoleSelections(
        data.items.reduce<Record<number, UserRole>>((acc, item) => {
          acc[item.id] = item.role;
          return acc;
        }, {})
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load admins");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAdmins(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const handleCreateAdmin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) {
      setCreateModalError("Email is required");
      return;
    }

    try {
      setSubmitting(true);
      setCreateModalError(null);
      setSuccess(null);
      await adminService.createAdmin({ email: email.trim(), role });
      setEmail("");
      setRole("HRManager");
      setCreateModalError(null);
      setIsCreateModalOpen(false);
      setCurrentPage(1);
      await loadAdmins(1, searchTerm);
      setSuccess("Admin created successfully.");
    } catch (err) {
      setCreateModalError(err instanceof Error ? err.message : "Failed to create admin");
    } finally {
      setSubmitting(false);
    }
  };

  const closeCreateModal = () => {
    setCreateModalError(null);
    setIsCreateModalOpen(false);
  };

  const handleCreateEmailChange = (value: string) => {
    setCreateModalError(null);
    setEmail(value);
  };

  const handleCreateRoleChange = (value: UserRole) => {
    setCreateModalError(null);
    setRole(value);
  };

  const handleRoleChange = async (admin: AdminUser) => {
    const selectedRole = rowRoleSelections[admin.id] ?? admin.role;
    if (selectedRole === admin.role) {
      return;
    }

    try {
      setBusyAdminId(admin.id);
      setError(null);
      setSuccess(null);
      await adminService.updateAdminRole(admin.id, selectedRole);
      await loadAdmins(currentPage, searchTerm);
      setSuccess(`Updated role for ${admin.email}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update role");
    } finally {
      setBusyAdminId(null);
    }
  };

  const openDeleteAdminModal = (admin: AdminUser) => {
    setDeleteCandidate(admin);
  };

  const closeDeleteAdminModal = () => {
    setDeleteCandidate(null);
  };

  const confirmDeleteAdmin = async () => {
    if (!deleteCandidate) {
      return;
    }

    try {
      setBusyAdminId(deleteCandidate.id);
      setError(null);
      setSuccess(null);
      await adminService.deleteAdmin(deleteCandidate.id);
      await loadAdmins(currentPage, searchTerm);
      setSuccess(`Deleted ${deleteCandidate.email}.`);
      setDeleteCandidate(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete admin");
    } finally {
      setBusyAdminId(null);
    }
  };

  const changeSearchTerm = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const changeRowRoleSelection = (adminId: number, value: UserRole) => {
    setRowRoleSelections((prev) => ({
      ...prev,
      [adminId]: value,
    }));
  };

  return {
    roleOptions: ROLE_OPTIONS,
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
    setEmail,
    setRole,
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
  };
};
