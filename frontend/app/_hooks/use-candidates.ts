"use client";

import { useEffect, useMemo, useState } from "react";

import { useRouter } from "next/navigation";

import {
  Candidate,
  createCandidate,
  deleteCandidate,
  getCandidates,
} from "@/app/_services/candidate-service";

import {
  sendExamEmail,
} from "@/app/_services/email-service";

import {
  validateCandidateEmail,
  validateSearch,
} from "@/app/_validations/candidate-validation";

export function useCandidates() {
  const router = useRouter();

  const [candidates, setCandidates] = useState<
    Candidate[]
  >([]);

  const [selected, setSelected] =
    useState<Candidate | null>(null);

  const [deleteCandidateState, setDeleteCandidate] =
    useState<Candidate | null>(null);

  const [
    sendEmailCandidate,
    setSendEmailCandidate,
  ] = useState<Candidate | null>(null);

  const [loading, setLoading] =
    useState(true);

  // CREATE
  const [email, setEmail] = useState("");

  const [createMessage, setCreateMessage] =
    useState("");

  // FILTER
  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  // EMAIL
  const [emailLoading, setEmailLoading] =
    useState(false);

  const [emailMessage, setEmailMessage] =
    useState("");

  // FETCH
  const fetchData = async () => {
    try {
      setLoading(true);

      const data = await getCandidates();

      setCandidates(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // CREATE
  const handleCreate = async () => {
    setCreateMessage("");

    const validationError =
      validateCandidateEmail(email);

    if (validationError) {
      setCreateMessage(validationError);

      return;
    }

    try {
      const result =
        await createCandidate(email);

      setCreateMessage(result.message);

      setEmail("");

      fetchData();
    } catch (err: any) {
      setCreateMessage(err.message);
    }
  };

  // DELETE
  const confirmDelete = async () => {
    if (!deleteCandidateState) return;

    try {
      await deleteCandidate(
        deleteCandidateState.id
      );

      setCandidates((prev) =>
        prev.filter(
          (c) =>
            c.id !== deleteCandidateState.id
        )
      );

      setDeleteCandidate(null);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  // STATUS
  const getStatus = (
    candidate: Candidate
  ) => {
    if (candidate.submittedAt)
      return "Submitted";

    if (candidate.startedAt)
      return "In Progress";

    return "Pending";
  };

 const filteredCandidates = useMemo(() => {
  const validationError = validateSearch(search);

  if (validationError) return [];

  return candidates.filter((candidate) => {
    const fullName =
      `${candidate.firstName || ""} ${candidate.lastName || ""}`.toLowerCase();

    const matchesSearch =
      fullName.includes(search.toLowerCase()) ||
      candidate.email.toLowerCase().includes(search.toLowerCase());

    const candidateStatus = getStatus(candidate);

    const matchesStatus =
      statusFilter === "All" ||
      candidateStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });
}, [candidates, search, statusFilter]);
  // SEND EMAIL
  const handleSendEmail = async (
    candidateId: number,
    examId: number
  ) => {
    try {
      setEmailLoading(true);

      setEmailMessage("");

      const res = await sendExamEmail(
        candidateId,
        examId
      );

      setEmailMessage(res);

      setSendEmailCandidate(null);
    } catch (err: any) {
      setEmailMessage(err.message);
    } finally {
      setEmailLoading(false);
    }
  };

  // BULK EMAIL
  const handleBulkEmail = () => {
    router.push("/admin/emails");
  };

  return {
    candidates,
    selected,
    setSelected,

    deleteCandidate:
      deleteCandidateState,

    setDeleteCandidate,

    sendEmailCandidate,
    setSendEmailCandidate,

    loading,

    email,
    setEmail,

    createMessage,
    setCreateMessage,

    search,
    setSearch,

    statusFilter,
    setStatusFilter,

    emailLoading,
    emailMessage,

    filteredCandidates,

    handleCreate,
    confirmDelete,

    handleSendEmail,

    handleBulkEmail,

    getStatus,
  };
}