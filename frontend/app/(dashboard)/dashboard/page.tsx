import CandidateResultsBoard from "@/app/_components/dashboard/candidate-results-board";
import { getCandidates } from "@/app/_services/candidate-service";
import { getExamTitles } from "@/app/_services/exam-service";
import { Card, CardContent } from "@/app/_components/ui/card";

export default async function DashboardPage() {
  let candidates = null;
  let examTitles = null;
  let errorMessage: string | null = null;

  try {
    [candidates, examTitles] = await Promise.all([getCandidates(), getExamTitles()]);
  } catch (error) {
    candidates = null;
    examTitles = null;
    errorMessage = error instanceof Error
      ? error.message
      : "Unable to load dashboard results right now. Make sure the backend API is running.";
  }

  if (!candidates || !examTitles) {
    return (
      <section>
        <Card>
          <CardContent>
            <p className="text-sm text-red-700">
              {errorMessage ?? "Unable to load dashboard results right now. Make sure the backend API is running."}
            </p>
          </CardContent>
        </Card>
      </section>
    );
  }

  return <CandidateResultsBoard candidates={candidates} examTitles={examTitles} />;
}
