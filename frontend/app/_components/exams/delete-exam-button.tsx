"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/app/_components/ui/button";
import { deleteExam } from "@/app/_services/exam-service";
import { DeleteConfirmationModal } from "../question-bank/delete-confirmation-modal";

type DeleteExamButtonProps = {
  examId: number;
  examTitle?: string;
  redirectTo?: string;
  className?: string;
  onDeleted?: () => void; 
};

export default function DeleteExamButton({
  examId,
  examTitle,
  redirectTo,
  className = "",
  onDeleted, // add this
}: DeleteExamButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function buildSuccessUrl(targetPath?: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("success", "deleted");

    const basePath = targetPath ?? pathname;
    const query = params.toString();
    return query ? `${basePath}?${query}` : basePath;
  }

  async function handleConfirm() {
    setIsDeleting(true);
    setErrorMessage(null);

    try {
      await deleteExam(examId);
      setIsModalOpen(false);

      if (redirectTo) {
        router.push(buildSuccessUrl(redirectTo));
      } else {
        onDeleted?.();
        router.replace(buildSuccessUrl(), { scroll: false });
      }
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
        onClick={() => setIsModalOpen(true)}
        disabled={isDeleting}
      >
        Delete
      </Button>

      {errorMessage ? (
        <p className="mt-2 text-xs text-red-600">{errorMessage}</p>
      ) : null}

      <DeleteConfirmationModal
        isOpen={isModalOpen}
        loading={isDeleting}
        title="Delete Exam"
        description="Are you sure you want to delete this exam? This action cannot be undone."
        itemLabel={examTitle}
        confirmLabel="Delete Exam"
        onCancel={() => setIsModalOpen(false)}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
