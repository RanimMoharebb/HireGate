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

  const text = await res.text();

  if (!res.ok) throw new Error(text || "Failed"); 

  return text;
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

  const text = await res.text();

  console.log("STATUS:", res.status);
  console.log("RESPONSE:", text);

  if (!res.ok) {
    throw new Error(text || "Bulk email failed");
  }

  return text;
}