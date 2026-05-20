"use client";
import { Clock } from "lucide-react";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { startExam, submitExam } from "@/app/_services/candidate-exam-service";
export default function StartExamPage() {
  const shuffleArray = <T,>(array: T[]): T[] => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [exam, setExam] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [timeLeft, setTimeLeft] = useState<number>(0);

  const STORAGE_KEY = `exam_answers_${token}`;

  const [answers, setAnswers] = useState<Record<number, number>>(() => {
    if (typeof window === "undefined") return {};
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [warning, setWarning] = useState("");

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = exam?.questions?.length || 0;

  const progressPercent =
    totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);

    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleSelect = (questionId: number, choiceId: number) => {
    if (submitted) return;

    setAnswers((prev) => {
      const updated = { ...prev, [questionId]: choiceId };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  // ⭐ UPDATED BEST PRACTICE FIX
  const handleSubmit = async (isAuto = false) => {
    if (submitted || submitting) return;
    setWarning("");
    try {
      setSubmitting(true);

      const payload = {
        answers: Object.entries(answers).map(([qId, cId]) => ({
          questionId: Number(qId),
          choiceId: Number(cId),
        })),
      };

      await submitExam(token, payload);

      setSubmitted(true);
      localStorage.removeItem(STORAGE_KEY);

      router.push("/candidates/thank-you");
    } catch (err: any) {
      setWarning(err.message ?? "Submit failed");
    } finally {
      setSubmitting(false);
    }
  };

  // ---------------- FETCH EXAM ----------------
  /*
  useEffect(() => {
    const fetchExam = async () => {
      try {
        const data = await startExam(token);
        //const data = res.data;

        const shuffledQuestions = shuffleArray(data.questions).map((q: any) => ({
          ...q,
          choices: shuffleArray(q.choices),
        }));

        setExam({
          ...data,
          questions: shuffledQuestions,
        });
      } catch (err: any) {
        const message = err.message?.toLowerCase();

        if (
          message.includes("invalid token") ||
          message.includes("already submitted") ||
          message.includes("not found")
        ) {
          router.replace("/candidates/thank-you");
          return;
        }

        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExam();
  }, [token]);
*/
useEffect(() => {
  const fetchExam = async () => {
    try {
      const data = await startExam(token);

      if (!data) throw new Error("No exam data received");

      const shuffledQuestions = shuffleArray(data.questions || []).map(
        (q: any) => ({
          ...q,
          choices: shuffleArray(q.choices || []),
        })
      );

      setExam({
        ...data,
        questions: shuffledQuestions,
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchExam();
}, [token]);

  // ---------------- TIMER + AUTO SUBMIT ----------------
  useEffect(() => {
    if (!exam) return;

    const startedAt = new Date(exam.startedAt).getTime();
    const durationMs = exam.durationMinutes * 60 * 1000;
    const endTime = startedAt + durationMs;

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = endTime - now;

      setTimeLeft(diff > 0 ? diff : 0);

      if (diff <= 0) {
        clearInterval(interval);
        handleSubmit(true); 
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [exam]);

  // ---------------- GUARDS ----------------
  if (loading)
    return <div className="p-10 text-center">Loading exam...</div>;

  if (error || !exam)
    return <div className="p-10 text-center text-red-500">{error}</div>;

  // ---------------- UI ----------------
  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl p-8 shadow">

        <div className="flex justify-center mb-6">
          <img src="/images/logo.png" alt="logo" className="h-10 w-auto" />
        </div>

        <div className="flex justify-between items-center mb-4">
          <div>
            {/*<h1 className="text-3xl font-bold">{exam.positionTitle}</h1>*/}
            <h1 className="text-3xl font-bold">
              {typeof exam?.positionTitle === "string"
                ? exam.positionTitle
                : "Exam"}
            </h1>
            <div className="text-slate-600 text-base space-y-1">
              <p>Duration: {exam.durationMinutes} minutes</p>
              <p>{exam.questions?.length || 0} Questions</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-red-600 font-bold text-lg">
            <Clock size={18} />
            {formatTime(timeLeft)}
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-sm text-slate-600 mb-1">
            <span>
              Answered: {answeredCount} / {totalQuestions}
            </span>
            <span>{Math.round(progressPercent)}%</span>
          </div>

          <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {warning && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {warning}
          </div>
        )}

        {Array.isArray(exam?.questions) &&
        exam.questions.map((q: any, index: number) => (
          <div key={q.id} className="mb-8 border border-slate-300 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">
              Q{index + 1}. {typeof q.questionText === "string" ? q.questionText : ""}
            </h2>

            <div className="space-y-3">
              {Array.isArray(q.choices) &&
              q.choices.map((c: any) => (
                <button
                  key={c.id}
                  onClick={() => handleSelect(q.id, c.id)}
                  disabled={submitted}
                  className={`w-full border rounded-lg p-3 text-left transition ${
                    answers[q.id] === c.id
                      ? "bg-slate-100 border-slate-300 text-black"
                      : "bg-white hover:bg-slate-50 border border-slate-200"
                  }`}
                >
                  {typeof c.text === "string" ? c.text : ""}
                </button>
              ))}
            </div>
          </div>
        ))}

        <button
          onClick={() => handleSubmit(false)}
          disabled={submitting || submitted}
          className="w-full bg-green-600 text-white py-4 rounded-xl font-semibold"
        >
          {submitted
            ? "Submitted"
            : submitting
            ? "Submitting..."
            : "Submit Exam"}
        </button>
      </div>
    </div>
  );
}