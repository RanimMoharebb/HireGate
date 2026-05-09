/*
"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { startExam } from "@/app/_services/candidate-exam-service";

export default function StartExamPage() {
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

  // ----------------------------
  // SHUFFLE FUNCTION
  // ----------------------------
  const shuffleArray = (array: any[]) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  // ----------------------------
  // FORMAT TIME
  // ----------------------------
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  // ----------------------------
  // SELECT ANSWER
  // ----------------------------
  const handleSelect = (questionId: number, choiceId: number) => {
    if (submitted) return;

    setAnswers((prev) => {
      const updated = {
        ...prev,
        [questionId]: choiceId,
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  // ----------------------------
  // SUBMIT EXAM
  // ----------------------------
  const handleSubmit = async () => {
    if (submitted || submitting) return;

    try {
      setSubmitting(true);

      const payload = {
        answers: Object.entries(answers).map(([questionId, choiceId]) => ({
          questionId: Number(questionId),
          choiceId: Number(choiceId),
        })),
      };

      const res = await fetch(
        `http://localhost:5116/candidates/submit/${token}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const text = await res.text();

      if (!res.ok) {
        throw new Error(text || "Submit failed");
      }

      setSubmitted(true);
      localStorage.removeItem(STORAGE_KEY);

      alert("Exam submitted successfully!");

      router.push("/thank-you");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ----------------------------
  // FETCH EXAM
  // ----------------------------
  useEffect(() => {
    const fetchExam = async () => {
      try {
        const data = await startExam(token);

        // RANDOMIZE QUESTIONS + CHOICES
        const shuffledExam = {
          ...data,
          questions: shuffleArray(
            data.questions.map((q: any) => ({
              ...q,
              choices: shuffleArray(q.choices),
            }))
          ),
        };

        setExam(shuffledExam);

        const startedAt = new Date(data.startedAt).getTime();
        const durationMs = data.durationMinutes * 60 * 1000;
        const endTime = startedAt + durationMs;

        const updateTimer = () => {
          const now = new Date().getTime();
          const diff = endTime - now;

          setTimeLeft(diff > 0 ? diff : 0);

          if (diff <= 0) {
            setTimeLeft(0);
            handleSubmit();
          }
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);

        return () => clearInterval(interval);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExam();
  }, [token]);

  // ----------------------------
  // LOADING
  // ----------------------------
  if (loading) return <div className="p-10 text-center">Loading exam...</div>;

  // ----------------------------
  // ERROR
  // ----------------------------
  if (error)
    return <div className="p-10 text-center text-red-500">{error}</div>;

  // ----------------------------
  // UI
  // ----------------------------
  return (
    <div className="min-h-screen bg-slate-100 p-8">

      <div className="max-w-4xl mx-auto bg-white rounded-2xl p-8 shadow">
// header
        {}
        <div className="flex justify-between items-center mb-8">

          <div>
            <h1 className="text-3xl font-bold">
              {exam.positionTitle}
            </h1>

            <p className="text-slate-500 mt-1">
              Duration: {exam.durationMinutes} minutes
            </p>
          </div>
// timer
          {}
          <div className="text-red-600 font-bold text-lg">
            {formatTime(timeLeft)}
          </div>

        </div>
// questions
        {}
        {exam.questions.map((question: any, index: number) => (
          <div
            key={question.id}
            className="mb-10 border rounded-xl p-6"
          >

            <h2 className="font-semibold text-lg mb-4">
              Q{index + 1}. {question.questionText}
            </h2>

            <div className="space-y-3">

              {question.choices.map((choice: any) => (
                <button
                  key={choice.id}
                  onClick={() => handleSelect(question.id, choice.id)}
                  disabled={submitted}
                  className={`w-full border rounded-lg p-3 text-left transition ${
                    answers[question.id] === choice.id
                      ? "bg-blue-500 text-white border-blue-500"
                      : "hover:bg-slate-50"
                  }`}
                >
                  {choice.text}
                </button>
              ))}

            </div>

          </div>
        ))}
// submit button
        {}
        <button
          onClick={handleSubmit}
          disabled={submitting || submitted}
          className={`w-full py-4 rounded-xl font-semibold text-white transition ${
            submitted
              ? "bg-gray-500"
              : submitting
              ? "bg-gray-400"
              : "bg-green-600 hover:bg-green-700"
          }`}
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
*/

"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { startExam } from "@/app/_services/candidate-exam-service";
import { validateExamSubmission } from "@/app/_validations/exam-validation";

export default function StartExamPage() {
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

  // ---------------- PROGRESS ----------------
  const answeredCount = Object.keys(answers).length;
  const totalQuestions = exam?.questions?.length || 0;

  const progressPercent =
    totalQuestions > 0
      ? (answeredCount / totalQuestions) * 100
      : 0;

  // ---------------- TIMER FORMAT ----------------
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);

    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // ---------------- ANSWER ----------------
  const handleSelect = (questionId: number, choiceId: number) => {
    if (submitted) return;

    setAnswers((prev) => {
      const updated = { ...prev, [questionId]: choiceId };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  // ---------------- SUBMIT ----------------
  const handleSubmit = async () => {
    if (submitted || submitting) return;

    setWarning("");

    const validation = validateExamSubmission(
      answers,
      exam.questions.length
    );

    if (!validation.isValid) {
      setWarning(validation.errors[0]);
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        answers: Object.entries(answers).map(([qId, cId]) => ({
          questionId: Number(qId),
          choiceId: Number(cId),
        })),
      };

      const res = await fetch(
        `http://localhost:5116/candidates/submit/${token}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const text = await res.text();

      if (!res.ok) throw new Error(text || "Submit failed");

      setSubmitted(true);
      localStorage.removeItem(STORAGE_KEY);

      router.push("/thank-you");
    } catch (err: any) {
      setWarning(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ---------------- FETCH EXAM ----------------
  useEffect(() => {
    const fetchExam = async () => {
      try {
        const data = await startExam(token);
        setExam(data);

        const startedAt = new Date(data.startedAt).getTime();
        const durationMs = data.durationMinutes * 60 * 1000;
        const endTime = startedAt + durationMs;

        const interval = setInterval(() => {
          const now = Date.now();
          const diff = endTime - now;

          setTimeLeft(diff > 0 ? diff : 0);

          if (diff <= 0 && !submitted) {
            handleSubmit();
          }
        }, 1000);

        return () => clearInterval(interval);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExam();
  }, [token]);

  // ---------------- UI ----------------
  if (loading) return <div className="p-10 text-center">Loading exam...</div>;
  if (error)
    return <div className="p-10 text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-slate-100 p-8">

      <div className="max-w-4xl mx-auto bg-white rounded-2xl p-8 shadow">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold">{exam.positionTitle}</h1>
            <p className="text-slate-500">
              Duration: {exam.durationMinutes} minutes
            </p>
          </div>

          <div className="text-red-600 font-bold text-lg">
            {formatTime(timeLeft)}
          </div>
        </div>

        {/* PROGRESS BAR */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-slate-600 mb-1">
            <span>
              Answered: {answeredCount} / {totalQuestions}
            </span>
            <span>{Math.round(progressPercent)}%</span>
          </div>

          <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* WARNING */}
        {warning && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {warning}
          </div>
        )}

        {/* QUESTIONS */}
        {exam.questions.map((q: any, index: number) => (
          <div key={q.id} className="mb-8 border rounded-xl p-6">

            <h2 className="font-semibold mb-4">
              Q{index + 1}. {q.questionText}
            </h2>

            <div className="space-y-3">
              {q.choices.map((c: any) => (
                <button
                  key={c.id}
                  onClick={() => handleSelect(q.id, c.id)}
                  disabled={submitted}
                  className={`w-full border rounded-lg p-3 text-left ${
                    answers[q.id] === c.id
                      ? "bg-blue-500 text-white"
                      : "hover:bg-slate-50"
                  }`}
                >
                  {c.text}
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* SUBMIT */}
        <button
          onClick={handleSubmit}
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