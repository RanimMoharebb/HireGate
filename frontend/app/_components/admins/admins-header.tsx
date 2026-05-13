import { Plus } from "lucide-react";

interface AdminsHeaderProps {
  onAddAdmin: () => void;
}

export function AdminsHeader({ onAddAdmin }: AdminsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Management</h2>
        <p className="text-gray-600 mt-1">Create admins and manage roles</p>
      </div>
      
      <button
        onClick={onAddAdmin}
        className="flex items-center justify-center gap-2 px-4 py-2 sm:px-6 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400 w-full sm:w-auto cursor-pointer"
      >
        <Plus size={20} />
        Add Admin
      </button>

    </div>
  );
}
