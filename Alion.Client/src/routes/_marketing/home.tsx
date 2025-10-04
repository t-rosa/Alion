import { HomeView } from "@/modules/marketing/home/home.view";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_marketing/home")({
  component: HomeView,
});
