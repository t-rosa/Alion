import { $api } from "@/lib/api/client";

export type UserRole = "Admin" | "Member" | "User";
export type UserRoleLabel = "Administrateur" | "Membre" | "Utilisateur";

export const ROLE_LABELS: Record<UserRole, UserRoleLabel> = {
  Admin: "Administrateur",
  Member: "Membre",
  User: "Utilisateur",
};

export function useUser() {
  const { data: user } = $api.useSuspenseQuery("get", "/api/users/me");

  function hasRole(role: UserRole) {
    return user.roles.includes(role) ?? false;
  }

  const roleLabel = ROLE_LABELS[user.roles[0] as UserRole];

  return { user, roleLabel, hasRole };
}
