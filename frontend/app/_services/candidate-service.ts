export type Candidate = {
  id: number;
  examId: number | null;
  firstName: string | null;
  lastName: string | null;
  email: string;
  phoneNumber: string | null;
  token: string | null;
  startedAt: string | null;
  submittedAt: string | null;
  finalScore: number | null;
};

export type CandidateExamReviewChoice = {
  choiceId: number;
  choiceText: string;
  isCorrect: boolean;
  isSelectedByCandidate: boolean;
};

export type CandidateExamReviewQuestion = {
  questionId: number;
  questionText: string;
  choices: CandidateExamReviewChoice[];
};

export type CandidateExamReview = {
  candidateId: number;
  candidateName: string;
  candidateEmail: string;
  examId: number | null;
  examTitle: string;
  finalScore: number | null;
  submittedAt: string | null;
  questions: CandidateExamReviewQuestion[];
};

export class CandidateApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "CandidateApiError";
    this.status = status;
  }
}

const DEFAULT_BACKEND_URL = "http://localhost:5116";

function getBackendBaseUrl() {
  return process.env.BACKEND_API_URL ?? DEFAULT_BACKEND_URL;
}

async function fetchCandidateApi<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${getBackendBaseUrl()}${path}`, {
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
      | string[]
      | null;

    const message = Array.isArray(payload)
      ? payload.join(", ")
      : payload?.error ?? payload?.message ?? `Candidate API request failed with status ${response.status}`;

    throw new CandidateApiError(message, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export async function getCandidates(): Promise<Candidate[]> {
  return fetchCandidateApi<Candidate[]>("/candidates/");
}

export async function getCandidateExamReview(candidateId: number): Promise<CandidateExamReview> {
  return fetchCandidateApi<CandidateExamReview>(`/candidates/${candidateId}/exam-review`);
}
