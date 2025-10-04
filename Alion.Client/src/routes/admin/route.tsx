import { $api, $client } from "@/lib/api/client";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/admin")({
  async beforeLoad() {
    const query = await $client.GET("/api/users/me");

    if (!query.response.ok) {
      redirect({
        to: "/login",
        throw: true,
      });
    }

    if (query.data && query.data.roles[0] != "Admin") {
      redirect({
        to: "/",
        throw: true,
      });
    }
  },
  loader({ context }) {
    return context.queryClient.ensureQueryData($api.queryOptions("get", "/api/users/me"));
  },
});
