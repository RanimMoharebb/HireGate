import Header from "@/app/_components/layout/header";
import ExamForm from "@/app/_components/exams/exam-form";
import { getExamById } from "@/app/_services/exam-service";

type EditExamPageProps = {
  params: Promise<{
    examId: string;
  }>;
};

export default async function EditExamPage({ params }: EditExamPageProps) {
  const { examId } = await params;
  const exam = await getExamById(Number(examId));

  return (
    <section className="space-y-6">
      <Header
        title={`Edit ${exam.title}`}
        description="Update exam settings and sync the attached question IDs."
      />
      <ExamForm mode="edit" exam={exam} />
    </section>
  );
}
