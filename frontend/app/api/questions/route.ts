import { NextResponse } from "next/server";
import { getQuestions } from "@/app/_services/question-service";

export async function GET(): Promise<NextResponse> {
  try {
    const questions = await getQuestions();
    return NextResponse.json(questions);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load questions" },
      { status: 500 },
    );
  }
}
