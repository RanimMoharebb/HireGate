import type { ExamFormState } from "@/app/_lib/exams/exam-form.types";

export function validateExamForm(formState: ExamFormState): Record<string, string> {
  const errors: Record<string, string> = {};

  if (formState.positionTitle.trim().length === 0) {
    errors.positionTitle = "Position title is required.";
  }

  if (formState.durationMinutes.trim().length === 0) {
    errors.durationMinutes = "Duration is required.";
  }

  if (formState.windowStartTime.trim().length === 0) {
    errors.windowStartTime = "Window start time is required.";
  }

  if (formState.windowEndTime.trim().length === 0) {
    errors.windowEndTime = "Window end time is required.";
  }

  if (formState.windowStartTime && formState.windowEndTime) {
    const start = new Date(formState.windowStartTime);
    const end = new Date(formState.windowEndTime);

    if (start >= end) {
      errors.windowEndTime = "Window end time must be after start time.";
    }
  }

  return errors;
}
