"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/_components/ui/button";
import { deleteExam } from "@/app/_services/exam-service";

type DeleteExamButtonProps = {
  examId: number;
  redirectTo?: string;
  className?: string;
};

export default function DeleteExamButton({
  examId,
  redirectTo,
  className = "",
}: DeleteExamButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleDelete() {
    const confirmed = window.confirm("Delete this exam? This action cannot be undone.");
    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
    setErrorMessage(null);

    try {
      await deleteExam(examId);

      if (redirectTo) {
        router.push(redirectTo);
      }

      router.refresh();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to delete exam");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className={className}>
      <Button
        variant="danger"
        className="w-full"
        onClick={handleDelete}
        disabled={isDeleting}
      >
        {isDeleting ? "Deleting..." : "Delete"}
      </Button>
      {errorMessage ? (
        <p className="mt-2 text-xs text-red-600">{errorMessage}</p>
      ) : null}
    </div>
  );
}
