const BASE_URL = "http://localhost:5116";

// ---------------------------
// SAFE FETCH WRAPPER
// ---------------------------
async function safeFetch(url: string, options?: RequestInit) {
  const res = await fetch(url, options);

  const text = await res.text(); // ALWAYS read safely first

  let data: any = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text; // fallback if not JSON
  }

  if (!res.ok) {
    throw new Error(
      (data && data.message) || data || "Request failed"
    );
  }

  return data;
}

// ---------------------------
// COMPLETE PROFILE
// ---------------------------
export async function completeCandidateProfile(token: string, body: any) {
  try {
    console.log("🚀 CALLING API");
    console.log("URL:", `http://localhost:5116/candidates/complete-profile/${token}`);
    console.log("BODY:", body);

    const res = await fetch(
      `http://localhost:5116/candidates/complete-profile/${token}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const text = await res.text();

    console.log("📡 STATUS:", res.status);
    console.log("📡 RAW RESPONSE:", text);
    console.log("📡 OK:", res.ok);

    return {
      ok: res.ok,
      status: res.status,
      raw: text,
    };
  } catch (err) {
    console.log("❌ FETCH ERROR (NO RESPONSE FROM BACKEND):", err);
    return {
      ok: false,
      status: 0,
      raw: "NETWORK ERROR (backend not reachable or blocked)",
    };
  }
}

// ---------------------------
// EXAM PAGE DATA
// ---------------------------
export async function getExamPageData(token: string) {
  return safeFetch(
    `${BASE_URL}/candidates/exam-page/${token}`,
    {
      method: "GET",
    }
  );
}

// ---------------------------
// START EXAM
// ---------------------------
export async function startExam(token: string) {
  return safeFetch(
    `${BASE_URL}/candidates/start-exam/${token}`,
    {
      method: "POST",
    }
  );
}