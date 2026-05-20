"use client";

type Props = {
  type: "success" | "error";
  message: string;
  onClose?: () => void;
};

export function AlertMessage({
  type,
  message,
  onClose,
}: Props) {
  if (!message) return null;

  return (
    <div
      className={`rounded-xl px-4 py-3 flex items-center justify-between
      ${
        type === "success"
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700"
      }`}
    >
      <span>{message}</span>

      {onClose && (
        <button onClick={onClose}>
          ×
        </button>
      )}
    </div>
  );
}