const BASE_URL = "http://localhost:5116";

// --------------------
// Send email to ONE candidate
// --------------------
export async function sendExamEmail(candidateId: number, examId: number) {
  const token = localStorage.getItem("token");

  const res = await fetch(
    `http://localhost:5116/candidates/${candidateId}/send-exam-email`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ examId }),
    }
  );

  const result = await res.json();

  if (!res.ok || result.success === false) {
    throw new Error(result.error || "Failed to send email");
  }

  return result;
}

// --------------------
// Send BULK emails
// --------------------

export async function sendBulkExamEmail(data: {
  examId: number;
  candidateIds: number[];
}) {
  const token = localStorage.getItem("token");

  const res = await fetch(
    "http://localhost:5116/candidates/send-bulk-exam-email",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  );

  const result = await res.json();

  if (!res.ok || result.success === false) {
    throw new Error(result.error || "Bulk email failed");
  }

  return result;
}
