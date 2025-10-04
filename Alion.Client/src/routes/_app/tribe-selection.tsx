import { $api } from "@/lib/api/client";
import { TribeSelectionView } from "@/modules/app/tribe-selection/tribe-selection.view";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/tribe-selection")({
  loader({ context }) {
    return context.queryClient.ensureQueryData($api.queryOptions("get", "/api/tribes"));
  },
  component: TribeSelectionView,
});
