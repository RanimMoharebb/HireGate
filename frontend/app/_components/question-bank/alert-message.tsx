import { CheckCircle2, AlertCircle, X } from "lucide-react";

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
    ? "bg-emerald-50 border-emerald-200 text-emerald-800 shadow-emerald-100/50"
    : "bg-red-50 border-red-200 text-red-800 shadow-red-100/50";
  const closeStyles = isSuccess
    ? "text-emerald-600 hover:text-emerald-800 hover:bg-emerald-100/50"
    : "text-red-600 hover:text-red-800 hover:bg-red-100/50";

  const Icon = isSuccess ? CheckCircle2 : AlertCircle;

  return (
    <div
      className={`flex items-center justify-between gap-3 p-4 border rounded-xl shadow-lg transition-all duration-300 ease-out ${containerStyles} ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon size={20} className={isSuccess ? "text-emerald-600" : "text-red-600"} />
        <p className="text-sm font-medium">{message}</p>
      </div>
      <button 
        onClick={onClose} 
        className={`p-1 rounded-lg transition-colors ${closeStyles}`}
        aria-label="Close message"
      >
        <X size={16} />
      </button>
    </div>
  );
}
