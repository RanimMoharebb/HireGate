
"use client";

import { Card } from "@/app/_components/ui/card";
import Input from "@/app/_components/ui/input";
import { Button } from "@/app/_components/ui/button";

type Props = {
  email: string;
  setEmail: (value: string) => void;
  onCreate: () => void;
};

export function CreateCandidateCard({
  email,
  setEmail,
  onCreate,
}: Props) {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">
            Create Candidate
          </h2>

          <p className="text-sm text-slate-500">
            Add a new candidate by email
          </p>
        </div>

        <div className="flex gap-3">
          <Input
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            placeholder="Candidate email"
          />

          <Button onClick={onCreate}>
            Create
          </Button>
        </div>
      </div>
    </Card>
  );
}
  