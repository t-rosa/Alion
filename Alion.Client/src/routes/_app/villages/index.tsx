import { $api } from "@/lib/api/client";
import { VillagesListView } from "@/modules/app/village/villages-list.view";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/villages/")({
  loader({ context }) {
    return context.queryClient.ensureQueryData($api.queryOptions("get", "/api/villages"));
  },
  component: VillagesListView,
});
