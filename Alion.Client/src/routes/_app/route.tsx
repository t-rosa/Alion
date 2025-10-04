import { $api, $client } from "@/lib/api/client";
import { AppView } from "@/modules/app/app.view";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_app")({
  async beforeLoad({ location }) {
    const userQuery = await $client.GET("/api/users/me");
    if (!userQuery.response.ok) {
      redirect({
        to: "/login",
        throw: true,
      });
    }

    // Vérifier le statut du joueur (tribu, villages)
    const playerQuery = await $client.GET("/api/users/player");

    // Si l'utilisateur n'a pas de tribu et n'est pas déjà sur la page de sélection
    if (!playerQuery.data?.tribeId && location.pathname !== "/tribe-selection") {
      redirect({
        to: "/tribe-selection",
        throw: true,
      });
    }

    // Si l'utilisateur a une tribu et est sur la page de sélection, rediriger vers les villages
    if (playerQuery.data?.tribeId && location.pathname === "/tribe-selection") {
      redirect({
        to: "/villages",
        throw: true,
      });
    }
  },
  loader({ context }) {
    return context.queryClient.ensureQueryData($api.queryOptions("get", "/api/users/me"));
  },
  component: AppView,
});
