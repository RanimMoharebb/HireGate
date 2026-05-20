// =============================================================================
// CANDIDATE SERVICE
// Merged from candidate-service.ts + candidate-exam-service.ts
// =============================================================================

const BASE_URL = "http://localhost:5116";
const CANDIDATES_URL = `${BASE_URL}/candidates`;

// -----------------------------------
// AUTH HEADERS (browser-safe)
// -----------------------------------
const authHeaders = (): HeadersInit => {
  if (typeof window === "undefined") return {};
  const token = window.localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// -----------------------------------
// SAFE FETCH WRAPPER (no-auth, used by candidate-facing exam pages)
// -----------------------------------
async function safeFetch(url: string, options?: RequestInit) {
  const res = await fetch(url, options);
  const text = await res.text();

  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    throw new Error((data && data.message) || data || "Request failed");
  }

  return data;
}

// =============================================================================
// TYPES
// =============================================================================

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
/*
export type CandidatesPaginatedResponse = {
  data: Candidate[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
};
*/

export type CandidatesPaginatedResponse = {
  data: {
    items: Candidate[];
    totalCount: number;
  };
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
};

// -----------------------------------
// GET (paginated)
// -----------------------------------
//Loads one page. Omit `pageSize` to use the API default (10). */
/*
export async function getCandidatesPage(
  page: number,
  search?: string,
  status?: string,
  pageSize?: number,
): Promise<CandidatesPaginatedResponse> {
  const params = new URLSearchParams({ page: String(Math.max(1, page)) });
  if (pageSize !== undefined) params.set("pageSize", String(pageSize));

  const trimmed = search?.trim();
  if (trimmed) params.set("search", trimmed);

  const trimmedStatus = status?.trim();
  if (trimmedStatus && trimmedStatus !== "All") params.set("status", trimmedStatus);

  const res = await fetch(`${CANDIDATES_URL}?${params}`, { headers: authHeaders() });
  const text = await res.text();

  if (!res.ok) throw new Error(text || "Failed to fetch candidates");

  const parsed: unknown = JSON.parse(text);

  // Paginated response shape
  if (
    parsed !== null &&
    typeof parsed === "object" &&
    "data" in parsed &&
    Array.isArray((parsed as { data: unknown }).data)
  ) {
    const body = parsed as CandidatesPaginatedResponse;
    return {
      data: {
        items: body.data.items,
        totalCount: body.data.totalCount,
      },
      page: body.page,
      pageSize: body.pageSize,
      totalCount: body.totalCount,
      totalPages: body.totalPages,
    };
  }

  // Plain array fallback
  if (Array.isArray(parsed)) {
    return {
      data: {
        items: parsed as Candidate[],
        totalCount: parsed.length,
      },
      page: 1,
      pageSize: pageSize ?? 10,
      totalCount: parsed.length,
      totalPages: 1,
    };
  }

  return {
    data: {
      items: [],
      totalCount: 0,
    },
    page: 1,
    pageSize: pageSize ?? 10,
    totalCount: 0,
    totalPages: 1,
  };
}
*/
export async function getCandidatesPage(
  page: number,
  search?: string,
  status?: string,
  pageSize?: number
): Promise<CandidatesPaginatedResponse> {
  const params = new URLSearchParams({
    page: String(Math.max(1, page)),
  });

  if (pageSize !== undefined) {
    params.set("pageSize", String(pageSize));
  }

  const trimmed = search?.trim();
  if (trimmed) params.set("search", trimmed);

  const trimmedStatus = status?.trim();
  if (trimmedStatus && trimmedStatus !== "All") {
    params.set("status", trimmedStatus);
  }

  const res = await fetch(`${BASE_URL}?${params}`, {
    headers: authHeaders(),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error || data?.message || "Failed to fetch candidates");
  }

  const items = data?.data?.items ?? [];
  const totalCount = data?.data?.totalCount ?? 0;

  return {
    data: {
      items,
      totalCount,
    },
    page: page,
    pageSize: pageSize ?? 10,
    totalCount,
    totalPages: Math.ceil(totalCount / (pageSize ?? 10)),
  };
}

/** Loads every candidate (one API page at a time, default page size). For bulk UIs e.g. email picker. */
export async function getAllCandidates(): Promise<Candidate[]> {
  let page = 1;
  const all: Candidate[] = [];

  for (;;) {
    const batch = await getCandidatesPage(page);
    all.push(...batch.data.items);
    if (page >= batch.totalPages || batch.data.items.length === 0) {
      break;
    }
    page += 1;
  }

  return all;
}

/** Alias for getAllCandidates — keeps existing call sites working. */
export async function getCandidates(): Promise<Candidate[]> {
  return getAllCandidates();
}

export async function getCandidateById(id: number): Promise<Candidate> {
  const res = await fetch(`${CANDIDATES_URL}/${id}`, { headers: authHeaders() });
  const text = await res.text();
  if (!res.ok) throw new Error(text || "Candidate not found");
  return JSON.parse(text);
}

export async function createCandidate(email: string) {
  const res = await fetch(`${BASE_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify({ email: email.trim() }),
  });

  const data = await res.json();

  console.log("CREATE RESPONSE:", data);

  if (!res.ok) {
    throw new Error(data.error || data.message || "Failed to create candidate");
  }

  return data.data;
}


// -----------------------------------
// DELETE
// -----------------------------------
export async function deleteCandidate(id: number) {
  const res = await fetch(`${CANDIDATES_URL}/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  const text = await res.text();
  if (!res.ok) throw new Error(text || "Delete failed");
  return text ? JSON.parse(text) : { message: "Deleted" };
}

// =============================================================================
// EXAM REVIEW (admin — requires auth)
// =============================================================================

export async function getCandidateExamReview(id: number): Promise<CandidateExamReview> {
  const res = await fetch(`${CANDIDATES_URL}/${id}/exam-review`, {
    headers: authHeaders(),
    cache: "no-store",
  });

  const text = await res.text();
  if (!res.ok) throw new Error(text || "Failed to load exam review");

  const raw = JSON.parse(text) as {
    candidateId?: number;
    candidateName?: string;
    examTitle?: string;
    finalScore?: number | null;
    questions?: Array<{
      questionId?: number;
      questionText?: string;
      selectedChoiceId?: number | null;
      choices?: Array<{
        id?: number;
        text?: string;
        isCorrect?: boolean;
        choiceId?: number;
        choiceText?: string;
        isSelectedByCandidate?: boolean;
      }>;
    }>;
  };

  return {
    candidateId: raw.candidateId ?? id,
    candidateName: raw.candidateName ?? "",
    examTitle: raw.examTitle ?? "Exam review",
    finalScore: raw.finalScore ?? null,
    questions: (raw.questions ?? []).map((question) => ({
      questionId: question.questionId ?? 0,
      questionText: question.questionText ?? "",
      choices: (question.choices ?? []).map((choice) => {
        const choiceId = choice.choiceId ?? choice.id ?? 0;
        return {
          choiceId,
          choiceText: choice.choiceText ?? choice.text ?? "",
          isCorrect: Boolean(choice.isCorrect),
          isSelectedByCandidate:
            choice.isSelectedByCandidate ??
            choiceId === (question.selectedChoiceId ?? null),
        };
      }),
    })),
  };
}

// =============================================================================
// CANDIDATE-FACING EXAM FLOW (no auth — token-based)
// =============================================================================

/** Completes a candidate's profile using their invite token. */
export async function completeCandidateProfile(token: string, body: any) {
  try {
    const res = await fetch(`${BASE_URL}/candidates/complete-profile/${token}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const text = await res.text();
    return { ok: res.ok, status: res.status, raw: text };
  } catch (err) {
    return { ok: false, status: 0, raw: "NETWORK ERROR (backend not reachable or blocked)" };
  }
}

/** Fetches the exam page data for a candidate using their invite token. */
export async function getExamPageData(token: string) {
  return safeFetch(`${BASE_URL}/candidates/exam-page/${token}`, { method: "GET" });
}

/** Starts the exam for a candidate using their invite token. */
export async function startExam(token: string) {
  return safeFetch(`${BASE_URL}/candidates/start-exam/${token}`, { method: "POST" });
}
