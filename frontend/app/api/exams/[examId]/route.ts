import { NextRequest, NextResponse } from "next/server";
import { deleteExam, getExamById, updateExam } from "@/app/_services/exam-service";

type RouteContext = {
  params: Promise<{
    examId: string;
  }>;
};

export async function GET(_: NextRequest, context: RouteContext): Promise<NextResponse> {
  try {
    const { examId } = await context.params;
    const exam = await getExamById(Number(examId));
    return NextResponse.json(exam);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load exam" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest, context: RouteContext): Promise<NextResponse> {
  try {
    const { examId } = await context.params;
    const payload = await request.json();
    const exam = await updateExam(Number(examId), payload);
    return NextResponse.json(exam);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update exam" },
      { status: 500 },
    );
  }
}

export async function DELETE(_: NextRequest, context: RouteContext): Promise<NextResponse> {
  try {
    const { examId } = await context.params;
    await deleteExam(Number(examId));
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete exam" },
      { status: 500 },
    );
  }
}
