import { NextRequest, NextResponse } from "next/server";
import { createExam, getExams } from "@/app/_services/exam-service";

export async function GET(): Promise<NextResponse> {
  try {
    const exams = await getExams();
    return NextResponse.json(exams);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load exams" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const payload = await request.json();
    const exam = await createExam(payload);
    return NextResponse.json(exam, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create exam" },
      { status: 500 },
    );
  }
}
