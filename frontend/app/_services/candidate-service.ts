const BASE_URL = "http://localhost:5116/candidates";

const authHeaders = (): HeadersInit => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// -----------------------------------
// TYPES
// -----------------------------------
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

export type CandidatesPaginatedResponse = {
  data: Candidate[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
};

// -----------------------------------
// GET (paginated)
// -----------------------------------
/** Loads one page. Omit `pageSize` to use the API default (10). */
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
  if (trimmed) {
    params.set("search", trimmed);
  }
  const trimmedStatus = status?.trim();
  if (trimmedStatus && trimmedStatus !== "All") {
    params.set("status", trimmedStatus);
  }

  const res = await fetch(`${BASE_URL}?${params}`, {
    headers: authHeaders(),
  });

  const text = await res.text();

  if (!res.ok) {
    throw new Error(text || "Failed to fetch candidates");
  }

  const parsed: unknown = JSON.parse(text);

  if (
    parsed !== null &&
    typeof parsed === "object" &&
    "data" in parsed &&
    Array.isArray((parsed as { data: unknown }).data)
  ) {
    const body = parsed as CandidatesPaginatedResponse;
    return {
      data: body.data,
      page: body.page,
      pageSize: body.pageSize,
      totalCount: body.totalCount,
      totalPages: body.totalPages,
    };
  }

  if (Array.isArray(parsed)) {
    return {
      data: parsed as Candidate[],
      page: 1,
      pageSize: pageSize ?? 10,
      totalCount: parsed.length,
      totalPages: 1,
    };
  }

  return {
    data: [],
    page: 1,
    pageSize: pageSize ?? 10,
    totalCount: 0,
    totalPages: 1,
  };
}

/** Loads every candidate (one API page at a time, default page size). For bulk UIs e.g. email picker. */
export async function getAllCandidates(): Promise<Candidate[]> {
  let page = 1;
  const all: Candidate[] = [];

  for (;;) {
    const batch = await getCandidatesPage(page);
    all.push(...batch.data);
    if (page >= batch.totalPages || batch.data.length === 0) {
      break;
    }
    page += 1;
  }

  return all;
}

// -----------------------------------
// GET BY ID
// -----------------------------------
export async function getCandidateById(id: number): Promise<Candidate> {
  const res = await fetch(`${BASE_URL}/${id}`);

  const text = await res.text();

  if (!res.ok) {
    throw new Error(text || "Candidate not found");
  }

  return JSON.parse(text);
}

// -----------------------------------
// CREATE
// -----------------------------------
export async function createCandidate(email: string) {
  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost:5116/candidates", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ email }),
  });

  const text = await res.text();

  if (!res.ok) {
    throw new Error(text || "Failed to create candidate");
  }

  return text ? JSON.parse(text) : { message: "Success" };
}

// -----------------------------------
// DELETE
// -----------------------------------
export async function deleteCandidate(id: number) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const text = await res.text();

  if (!res.ok) {
    throw new Error(text || "Delete failed");
  }

  return text ? JSON.parse(text) : { message: "Deleted" };
}
