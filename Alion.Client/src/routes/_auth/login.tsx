import { LoginView } from "@/modules/auth/login/login.view";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/login")({
  component: LoginView,
});
