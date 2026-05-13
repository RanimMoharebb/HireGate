import { Loader, Shield, Trash2, UserCog } from "lucide-react";
import Badge from "@/app/_components/ui/badge";
import { AdminUser, UserRole } from "@/app/_lib/admin.types";

interface AdminsTableProps {
  admins: AdminUser[];
  loading: boolean;
  roleOptions: UserRole[];
  rowRoleSelections: Record<number, UserRole>;
  busyAdminId: number | null;
  onRowRoleSelectionChange: (adminId: number, role: UserRole) => void;
  onApplyRoleChange: (admin: AdminUser) => void;
  onDeleteAdmin: (admin: AdminUser) => void;
}

export function AdminsTable({
  admins,
  loading,
  roleOptions,
  rowRoleSelections,
  busyAdminId,
  onRowRoleSelectionChange,
  onApplyRoleChange,
  onDeleteAdmin,
}: AdminsTableProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Email
              </th>
              <th className="px-3 sm:px-6 py-3 sm:py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                First Name
              </th>
              <th className="px-3 sm:px-6 py-3 sm:py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Last Name
              </th>
              <th className="px-3 sm:px-6 py-3 sm:py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Role
              </th>
              <th className="px-3 sm:px-6 py-3 sm:py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-3 sm:px-6 py-6 sm:py-8 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Loader size={20} className="animate-spin" />
                    Loading admins...
                  </div>
                </td>
              </tr>
            ) : admins.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-3 sm:px-6 py-6 sm:py-8 text-center text-gray-500">
                  No admins found
                </td>
              </tr>
            ) : (
              admins.map((admin) => {
                const selectedRole = rowRoleSelections[admin.id] ?? admin.role;
                const isBusy = busyAdminId === admin.id;

                return (
                  <tr key={admin.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm font-medium text-gray-900">
                      {admin.email}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm text-gray-700 text-center">
                      {admin.firstName ?? "-"}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm text-gray-700 text-center">
                      {admin.lastName ?? "-"}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-center">
                      <Badge variant={admin.role === "CEO" ? "info" : "neutral"}>{admin.role}</Badge>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <div className="flex gap-1 sm:gap-2 justify-center items-center flex-wrap">
                        <select
                          className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-900 outline-none transition focus:border-transparent focus:ring-2 focus:ring-blue-500"
                          value={selectedRole}
                          onChange={(event) =>
                            onRowRoleSelectionChange(admin.id, event.target.value as UserRole)
                          }
                          disabled={isBusy}
                        >
                          {roleOptions.map((item) => (
                            <option key={item} value={item}>
                              {item}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => onApplyRoleChange(admin)}
                          disabled={isBusy || selectedRole === admin.role}
                          className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:text-gray-400 cursor-pointer"
                          title="Change role"
                        >
                          <UserCog size={14} className="sm:w-4 sm:h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteAdmin(admin)}
                          disabled={isBusy}
                          className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:text-gray-400 cursor-pointer"
                          title="Delete admin"
                        >
                          <Trash2 size={14} className="sm:w-4 sm:h-4" />
                        </button>
                        <span className="inline-flex items-center text-xs text-gray-500 ml-1">
                          <Shield size={12} className="mr-1" />
                          {selectedRole !== admin.role ? "Unsaved role" : "Synced"}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
