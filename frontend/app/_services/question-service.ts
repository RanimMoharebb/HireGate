import type { BackendQuestionDto } from "@/app/_services/exam-service";

type BackendQuestionsResponse = {
  data: BackendQuestionDto[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
};

const DEFAULT_BACKEND_URL = "http://localhost:5116";

function getBackendBaseUrl() {
  return process.env.BACKEND_API_URL ?? DEFAULT_BACKEND_URL;
}

async function fetchQuestionApi<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${getBackendBaseUrl()}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Question API request failed with status ${response.status}`);
  }

  return (await response.json()) as T;
}

export async function getQuestions(): Promise<BackendQuestionDto[]> {
  const response = await fetchQuestionApi<BackendQuestionsResponse>("/api/admin/questions?page=1&pageSize=100");
  return response.data;
}
