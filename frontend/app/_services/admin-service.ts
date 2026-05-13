import {
  AdminPaginationData,
  CreateAdminPayload,
  UserRole,
} from "@/app/_lib/admin.types";

const API_BASE_URL = "http://localhost:5116/admins";

const getAuthHeaders = (includeJson = false): HeadersInit => ({
  ...(includeJson ? { "Content-Type": "application/json" } : {}),
  Authorization: `Bearer ${localStorage.getItem("authToken")}`,
});

async function parseErrorMessage(response: Response, fallback: string): Promise<string> {
  const data = await response.json().catch(() => null);
  if (!data) {
    return fallback;
  }

  if (typeof data === "string") {
    return data;
  }

  if (Array.isArray(data)) {
    return data.join(", ");
  }

  if (typeof data === "object" && "message" in data && typeof data.message === "string") {
    return data.message;
  }

  return fallback;
}

export const adminService = {
  async getAdmins(
    page: number,
    pageSize: number,
    searchTerm: string
  ): Promise<AdminPaginationData> {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      ...(searchTerm.trim() ? { search: searchTerm.trim() } : {}),
    });

    const response = await fetch(`${API_BASE_URL}?${params}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(await parseErrorMessage(response, "Failed to load admins"));
    }

    return response.json();
  },

  async createAdmin(payload: CreateAdminPayload): Promise<void> {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: getAuthHeaders(true),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(await parseErrorMessage(response, "Failed to create admin"));
    }
  },

  async updateAdminRole(id: number, role: UserRole): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PATCH",
      headers: getAuthHeaders(true),
      body: JSON.stringify({ role }),
    });

    if (!response.ok) {
      throw new Error(await parseErrorMessage(response, "Failed to update role"));
    }
  },

  async deleteAdmin(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(await parseErrorMessage(response, "Failed to delete admin"));
    }
  },
};
