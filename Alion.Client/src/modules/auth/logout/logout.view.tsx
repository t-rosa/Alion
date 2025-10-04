import { Loader } from "@/components/loader";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { $api } from "@/lib/api/client";
import { useNavigate } from "@tanstack/react-router";
import { LogOutIcon } from "lucide-react";

export function LogoutView() {
  const navigate = useNavigate();

  const { mutate, status } = $api.useMutation("post", "/api/auth/logout", {
    meta: {
      successMessage: "Déconnecté",
      errorMessage: "Il y a eu une érreur.",
      invalidatesQuery: ["get", "manage/info"],
    },
    async onSuccess() {
      await navigate({ to: "/" });
    },
  });

  function handleClick() {
    mutate({});
  }

  if (status === "pending") {
    return (
      <DropdownMenuItem disabled>
        <Loader />
        Déconnexion
      </DropdownMenuItem>
    );
  }

  return (
    <DropdownMenuItem onClick={handleClick}>
      <LogOutIcon />
      Déconnexion
    </DropdownMenuItem>
  );
}
