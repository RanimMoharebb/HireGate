import { Card, CardContent } from "@/app/_components/ui/card";
import { Button } from "@/app/_components/ui/button";
import type { Exam } from "@/app/_services/exam-service";
import DeleteExamButton from "@/app/_components/exams/delete-exam-button";
import { formatExamWindowTime } from "@/app/_lib/utils";

type ExamCardProps = {
  exam: Exam;
};

export default function ExamCard({ exam }: ExamCardProps) {
    const windowStartTime = formatExamWindowTime(exam.windowStartTime);
    const windowEndTime = formatExamWindowTime(exam.windowEndTime);

    return(
    <Card>
        <CardContent>
            <div className="mb-4">
                <h3 className="mb-2 text-lg font-bold text-slate-900">{exam.title}</h3>
                <p className="text-sm text-slate-600">{exam.description}</p>
            </div>
            <div className="mb-4 space-y-3 text-sm text-slate-600">
                <p>⏱️ {exam.duration }</p>
                <p>📄 {exam.questionCount} Questions</p>
                <p><strong>Start Time :</strong> {windowStartTime}</p>
                <p><strong>End Time :</strong> {windowEndTime}</p>
            </div>

            <div className="flex gap-2 border-t border-slate-200 pt-4">
                <Button as="link" href={`/exams/${exam.id}`} variant="secondary" className="flex-1">
                    View
                </Button>
                <Button as="link" href={`/exams/${exam.id}/edit`} variant="soft" className="flex-1">
                    Edit
                </Button>
                <DeleteExamButton examId={exam.id} className="flex-1" />
            </div>
        </CardContent>
    </Card>
    );
}
