export type UserRole = "CEO" | "HRManager";

export type AdminUser = {
  id: number;
  firstName: string | null;
  lastName: string | null;
  email: string;
  role: UserRole;
};
export type AdminPaginationData = {
  //data: AdminUser[];
  items: AdminUser[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
};
export type CreateAdminPayload = {
  email: string;
  role: UserRole;
};
