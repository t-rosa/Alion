import { $api } from "@/lib/api/client";
import { VillageResourcesView } from "@/modules/app/village/village-resources.view";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/villages/$villageId")({
  loader({ context, params }) {
    return context.queryClient.ensureQueryData(
      $api.queryOptions("get", "/api/villages/{id}", {
        params: { path: { id: params.villageId } },
      }),
    );
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { villageId } = Route.useParams();
  return <VillageResourcesView villageId={villageId} />;
}
