import { NextRequest, NextResponse } from "next/server";
import { addQuestionToExam, removeQuestionFromExam } from "@/app/_services/exam-service";

type RouteContext = {
  params: Promise<{
    examId: string;
    questionId: string;
  }>;
};

export async function POST(_: NextRequest, context: RouteContext): Promise<NextResponse> {
  try {
    const { examId, questionId } = await context.params;
    await addQuestionToExam(Number(examId), Number(questionId));
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to add question to exam" },
      { status: 500 },
    );
  }
}

export async function DELETE(_: NextRequest, context: RouteContext): Promise<NextResponse> {
  try {
    const { examId, questionId } = await context.params;
    await removeQuestionFromExam(Number(examId), Number(questionId));
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to remove question from exam" },
      { status: 500 },
    );
  }
}
