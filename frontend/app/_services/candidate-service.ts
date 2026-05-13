const BASE_URL = "http://localhost:5116/candidates";

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

// -----------------------------------
// GET ALL
// -----------------------------------
export async function getCandidates(): Promise<Candidate[]> {
  const token = localStorage.getItem("token");

  const res = await fetch(BASE_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const text = await res.text();

  console.log("GET STATUS:", res.status);
  console.log("GET RESPONSE:", text);

  if (!res.ok) {
    throw new Error(text || "Failed to fetch candidates");
  }

  return JSON.parse(text);
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

  console.log("STATUS:", res.status);
  console.log("RESPONSE:", text);

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

  console.log("DELETE STATUS:", res.status);
  console.log("DELETE RESPONSE:", text);

  if (!res.ok) {
    throw new Error(text || "Delete failed");
  }

  return text ? JSON.parse(text) : { message: "Deleted" };
}