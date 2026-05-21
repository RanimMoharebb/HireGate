import type { useRouter } from "next/navigation";

type Router = ReturnType<typeof useRouter>;

export function handleExamError(err: any, router: Router) {
  const message = err?.message?.toLowerCase?.() || "";

  const isInvalidState =
    message.includes("invalid token") ||
    message.includes("already submitted") ||
    message.includes("expired") ||
    message.includes("not found") ||
    message.includes("candidate not found") ||   // ✅ ADD THIS
    message.includes("token missing") ||         // ✅ ADD THIS
    message.includes("unauthorized") ||          // ✅ ADD THIS
    message.includes("forbidden")               // ✅ ADD THIS
    message.includes("exam window ended") ||   // ✅ ADD
    message.includes("exam closed");          // ✅ ADD

  if (isInvalidState) {
    router.replace("/candidates/thank-you");
    return true;
  }

  return false;
}