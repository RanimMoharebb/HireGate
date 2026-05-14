// Backend response Shape (DTO - Data Transfer Object)
export type BackendQuestionDto = {
  id: number;
  topicId: number | null;
  topicName: string;
  questionText: string;
  questionImage: string | null;
  choices: Array<{
    id: number;
    choiceText: string;
    isCorrect: boolean;
  }>;
};

export type BackendExamDto = {
  id: number;
  positionTitle: string;
  durationMinutes: number | null;
  windowStartTime: string | null;
  windowEndTime: string | null;
  questions: BackendQuestionDto[] | null;
};

// UI Shape for Exam data
export type Exam = {
  id: number;
  title: string;
  description: string;
  duration: string;
  durationMinutes?: number;
  questionCount: number;
  windowStartTime?: string;
  windowEndTime?: string;
  questionIds: number[];
  questions: BackendQuestionDto[];
};

export type CreateExamPayload = {
  positionTitle: string;
  durationMinutes?: number | null;
  windowStartTime?: string | null;
  windowEndTime?: string | null;
  questionIds?: number[];
};

export type UpdateExamPayload = {
  positionTitle?: string;
  durationMinutes?: number | null;
  windowStartTime?: string | null;
  windowEndTime?: string | null;
  addedQuestionIds?: number[];
  removedQuestionIds?: number[];
};

export class ExamApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ExamApiError";
    this.status = status;
  }
}

const DEFAULT_BACKEND_URL = "http://localhost:5116";

function getBackendBaseUrl() {
  return process.env.BACKEND_API_URL ?? DEFAULT_BACKEND_URL;
}

function buildExamDescription(exam: BackendExamDto) {
  return `Assessment for ${exam.positionTitle} candidates.`;
}

// Mapping function to convert BackendExamDto to Exam for UI consumption
export function mapBackendExamToExam(exam: BackendExamDto): Exam {
  const questions = exam.questions ?? [];

  return {
    id: exam.id,
    title: exam.positionTitle,
    description: buildExamDescription(exam),
    duration: exam.durationMinutes ? `${exam.durationMinutes} minutes` : "No duration set",
    durationMinutes: exam.durationMinutes ?? undefined,
    questionCount: questions.length,
    windowStartTime: exam.windowStartTime ?? undefined,
    windowEndTime: exam.windowEndTime ?? undefined,
    questionIds: questions.map((question) => question.id),
    questions,
  };
}

async function fetchExamApi<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${getBackendBaseUrl()}${path}`,
   {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as
      | { error?: string; message?: string }
      | Array<{ error?: string; field?: string }>
      | null;

    const message = Array.isArray(payload)
      ? payload.map((item) => item.error).filter(Boolean).join(", ")
      : payload?.error ?? payload?.message ?? `Exam API request failed with status ${response.status}`;

    throw new ExamApiError(message, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export async function getExams(): Promise<Exam[]> {
  const exams = await fetchExamApi<BackendExamDto[]>("/api/exam/");
  return exams.map(mapBackendExamToExam);
}

export async function getExamTitles(): Promise<Pick<Exam, 'id' | 'title'>[]> {
  const exams = await fetchExamApi<BackendExamDto[]>("/api/exam/");
  return exams.map(exam => ({ id: exam.id, title: exam.positionTitle }));
}

export async function getExamById(examId: number): Promise<Exam> {
  const exam = await fetchExamApi<BackendExamDto>(`/api/exam/${examId}`);
  return mapBackendExamToExam(exam);
}

export async function createExam(payload: CreateExamPayload): Promise<Exam> {
  const exam = await fetchExamApi<BackendExamDto>("/api/exam/", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return mapBackendExamToExam(exam);
}

export async function updateExam(examId: number, payload: UpdateExamPayload): Promise<Exam> {
  const exam = await fetchExamApi<BackendExamDto>(`/api/exam/${examId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

  return mapBackendExamToExam(exam);
}

export async function deleteExam(examId: number): Promise<void> {
  await fetchExamApi<void>(`/api/exam/${examId}`, {
    method: "DELETE",
  });
}

export async function getExamQuestions(examId: number): Promise<BackendQuestionDto[]> {
  return fetchExamApi<BackendQuestionDto[]>(`/api/exam/${examId}/questions`);
}

export async function addQuestionToExam(examId: number, questionId: number): Promise<void> {
  await fetchExamApi(`/api/exam/${examId}/questions/${questionId}`, {
    method: "POST",
  });
}

export async function removeQuestionFromExam(examId: number, questionId: number): Promise<void> {
  await fetchExamApi(`/api/exam/${examId}/questions/${questionId}`, {
    method: "DELETE",
  });
}
