export type UserRole = "CEO" | "HRManager";

export type AdminUser = {
  id: number;
  firstName: string | null;
  lastName: string | null;
  email: string;
  role: UserRole;
};

export type AdminPaginationData = {
  data: AdminUser[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
};

export type CreateAdminPayload = {
  email: string;
  role: UserRole;
};
