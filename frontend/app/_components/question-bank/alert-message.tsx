interface AlertMessageProps {
  type: "success" | "error";
  message: string | null;
  visible?: boolean;
  onClose: () => void;
}

export function AlertMessage({
  type,
  message,
  visible = true,
  onClose,
}: AlertMessageProps) {
  if (!message) {
    return null;
  }

  const isSuccess = type === "success";
  const containerStyles = isSuccess
    ? "bg-emerald-50 border-emerald-200 text-emerald-700"
    : "bg-red-50 border-red-200 text-red-700";
  const closeStyles = isSuccess
    ? "text-emerald-700 hover:text-emerald-900"
    : "text-red-700 hover:text-red-900";

  return (
    <div
      className={`p-4 border rounded-lg transition-all duration-300 ease-out ${containerStyles} ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
      }`}
    >
      {message}
      <button onClick={onClose} className={`float-right ${closeStyles}`}>
        ×
      </button>
    </div>
  );
}
