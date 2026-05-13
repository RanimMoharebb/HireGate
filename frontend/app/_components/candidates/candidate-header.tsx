"use client";

import { Button } from "@/app/_components/ui/button";

type Props = {
  loading: boolean;
  onBulkEmail: () => void;
};

export function CandidateHeader({
  loading,
  onBulkEmail,
}: Props) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">
          Candidates
        </h1>

        <p className="text-slate-500 mt-1">
          Manage candidate records and exam progress
        </p>
      </div>

      <Button
        onClick={onBulkEmail}
        disabled={loading}
      >
        Send Bulk Emails
      </Button>
    </div>
  );
}