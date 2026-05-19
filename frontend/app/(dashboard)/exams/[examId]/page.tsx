import Header from "@/app/_components/layout/header";
import { Card, CardContent } from "@/app/_components/ui/card";
import DeleteExamButton from "@/app/_components/exams/delete-exam-button";
import ExamQuestionsManager from "@/app/_components/exams/exam-questions-manager";
import { getExamById } from "@/app/_services/exam-service";
import { formatExamWindowTime } from "@/app/_lib/utils";
import { notFound } from "next/navigation";
import ExamDetailsActions from "@/app/_components/exams/exam-details-actions";

type ExamDetailsPageProps = {
  params: Promise<{
    examId: string;
  }>;
};



export default async function ExamDetailsPage({ params }: ExamDetailsPageProps) {
  const { examId } = await params;
  const numericExamId = Number(examId);

  if (Number.isNaN(numericExamId)) {
    notFound();
  }

  const exam = await getExamById(numericExamId);

  return (
    <section className="space-y-6">
      <Header
        title={exam.title}
        description={exam.description}
        action={
          <ExamDetailsActions examId={numericExamId} />
        }
      />

      <Card>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Duration</p>
            <p className="mt-1 text-sm text-slate-900">{exam.duration}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Question count</p>
            <p className="mt-1 text-sm text-slate-900">{exam.questionCount}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Window start</p>
            <p className="mt-1 text-sm text-slate-900">{formatExamWindowTime(exam.windowStartTime)}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Window end</p>
            <p className="mt-1 text-sm text-slate-900">{formatExamWindowTime(exam.windowEndTime)}</p>
          </div>
        </CardContent>
      </Card>

      <ExamQuestionsManager initialQuestions={exam.questions} />
    </section>
  );
}
