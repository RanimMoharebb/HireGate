import Header from "@/app/_components/layout/header";
import {Button} from "@/app/_components/ui/button";
import ExamCard from "@/app/_components/exams/exam-card";
import { getExams } from "@/app/_services/exam-service";
import type { Exam } from "@/app/_services/exam-service";

export default async function ExamsPage() {
  let exams: Exam[] = [];
  let errorMessage: string | null = null;

  try {
    exams = await getExams();
  } catch {
    errorMessage = "Unable to load exams right now. Make sure the backend API is running.";
  }

  return( 
    <section>
        <Header
        title= "Exams Management"
        description="Create and Manage Exams for your candidates"
        action={
        <Button as="link" href="/exams/create" size="lg" className="!text-white">
          + Create Exam
        </Button>
        }
        />
        {errorMessage ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {errorMessage}
          </div>
        ) : null}
        {!errorMessage && exams.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
            No exams found yet.
          </div>
        ) : null}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {exams.map((exam) => (
          <ExamCard key={exam.id} exam={exam} />
        ))}
      </div>
        
    </section>
      
    );
}
