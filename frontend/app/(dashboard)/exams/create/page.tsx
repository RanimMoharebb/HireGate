import Header from "@/app/_components/layout/header";
import ExamForm from "@/app/_components/exams/exam-form";

export default function CreateExamPage() {
  return (
    <section className="space-y-6">
      <Header
        title="Create Exam"
        description="Set the exam details and attach any existing question IDs."
      />
      <ExamForm mode="create" />
    </section>
  );
}
