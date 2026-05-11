import { NextRequest, NextResponse } from "next/server";
import { getExamQuestions } from "@/app/_services/exam-service";

type RouteContext = {
  params: Promise<{
    examId: string;
  }>;
};

export async function GET(_: NextRequest, context: RouteContext): Promise<NextResponse> {
  try {
    const { examId } = await context.params;
    const questions = await getExamQuestions(Number(examId));
    return NextResponse.json(questions);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load exam questions" },
      { status: 500 },
    );
  }
}
