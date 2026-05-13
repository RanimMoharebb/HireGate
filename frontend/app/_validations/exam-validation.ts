// app/_validation/exam-validation.ts

export function validateExamSubmission(
  answers: Record<number, number>,
  totalQuestions: number
) {
  const errors: string[] = [];

  if (Object.keys(answers).length === 0) {
    errors.push("You must answer at least one question.");
  }

  if (Object.keys(answers).length < totalQuestions) {
    errors.push("Some questions are not answered yet.");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}