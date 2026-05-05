export const permissions = {
  owner: ["manage_users", "view_dashboard"],
  hr: ["manage_exams", "manage_questions", "view_candidates"],
} as const;

export type Role = keyof typeof permissions;
export type Permission = (typeof permissions)[Role][number];
