import { Spinner } from "@/components/ui/spinner";
import { $api } from "@/lib/api/client";
import { VillagesListUI } from "./villages-list.ui";

export function VillagesListView() {
  const { data: villages, isLoading } = $api.useSuspenseQuery("get", "/api/villages");

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner className="size-8" />
      </div>
    );
  }

  return <VillagesListUI villages={villages ?? []} />;
}
