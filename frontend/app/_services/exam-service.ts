const BASE_URL = "http://localhost:5116/api/exam";

export type ExamSummary = {
  id: number;
  positionTitle: string;
};

export type ExamsPaginatedResponse = {
  data: ExamSummary[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
};

function parseExamPage(payload: unknown): ExamsPaginatedResponse {
  if (
    payload !== null &&
    typeof payload === "object" &&
    "data" in payload &&
    Array.isArray((payload as { data: unknown }).data)
  ) {
    const body = payload as ExamsPaginatedResponse;
    return {
      data: body.data,
      page: body.page,
      pageSize: body.pageSize,
      totalCount: body.totalCount,
      totalPages: body.totalPages,
    };
  }

  return {
    data: [],
    page: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 1,
  };
}

/** One page of exams. Omit `pageSize` to use the API default (10). */
export async function getExamsPage(
  page: number,
  search?: string,
  pageSize?: number
): Promise<ExamsPaginatedResponse> {
  const params = new URLSearchParams({
    page: String(Math.max(1, page)),
  });
  if (pageSize !== undefined) {
    params.set("pageSize", String(pageSize));
  }
  const trimmed = search?.trim();
  if (trimmed) {
    params.set("search", trimmed);
  }

  const res = await fetch(`${BASE_URL}/?${params}`);

  if (!res.ok) {
    throw new Error("Failed to fetch exams");
  }

  const payload: unknown = await res.json();
  return parseExamPage(payload);
}

/** All exams (paged API, 100 per request). Prefer `getExamsPage` when you need search/pagination in UI. */
export async function getExams(): Promise<ExamSummary[]> {
  const batchSize = 100;
  let page = 1;
  const all: ExamSummary[] = [];

  for (;;) {
    const batch = await getExamsPage(page, undefined, batchSize);
    all.push(...batch.data);
    if (page >= batch.totalPages || batch.data.length === 0) {
      break;
    }
    page += 1;
  }

  return all;
}
