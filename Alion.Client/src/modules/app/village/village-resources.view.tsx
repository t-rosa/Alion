import { Spinner } from "@/components/ui/spinner";
import { $api } from "@/lib/api/client";
import type { components } from "@/lib/api/schema";
import { useEffect, useState } from "react";
import { VillageResourcesUI } from "./village-resources.ui";

type Village = components["schemas"]["GetVillageResponse"];

interface VillageResourcesProps {
  villageId: string;
}

export function VillageResourcesView({ villageId }: VillageResourcesProps) {
  const [currentResources, setCurrentResources] = useState<Village | null>(null);

  // Charger les données complètes du village une seule fois
  const { data: village, isLoading: isLoadingVillage } = $api.useSuspenseQuery(
    "get",
    "/api/villages/{id}",
    {
      params: { path: { id: villageId } },
    },
  );

  // Polling des ressources toutes les 5 secondes avec l'endpoint léger
  const { data: resources } = $api.useQuery("get", "/api/villages/{id}/resources", {
    params: { path: { id: villageId } },
    refetchInterval: 5000, // Poll toutes les 5 secondes
  });

  // Initialiser les ressources courantes avec les données du village
  useEffect(() => {
    if (!village) return;
    setCurrentResources(village);
  }, [village]);

  // Interpoler les ressources entre les polls du serveur pour une animation fluide
  useEffect(() => {
    if (!resources || !currentResources) return;

    // Calculer l'incrément par seconde pour chaque ressource
    const pollIntervalSeconds = 5;
    const woodIncrement = (resources.wood - currentResources.wood) / pollIntervalSeconds;
    const clayIncrement = (resources.clay - currentResources.clay) / pollIntervalSeconds;
    const ironIncrement = (resources.iron - currentResources.iron) / pollIntervalSeconds;
    const cropIncrement = (resources.crop - currentResources.crop) / pollIntervalSeconds;

    let frame = 0;
    const maxFrames = pollIntervalSeconds * 10; // 10 frames par seconde

    const interval = setInterval(() => {
      frame++;
      if (frame >= maxFrames) {
        clearInterval(interval);
        return;
      }

      setCurrentResources((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          wood: Math.min(Math.round(prev.wood + woodIncrement / 10), prev.warehouseCapacity),
          clay: Math.min(Math.round(prev.clay + clayIncrement / 10), prev.warehouseCapacity),
          iron: Math.min(Math.round(prev.iron + ironIncrement / 10), prev.warehouseCapacity),
          crop: Math.min(Math.round(prev.crop + cropIncrement / 10), prev.granaryCapacity),
        };
      });
    }, 100); // Mise à jour toutes les 100ms pour une animation fluide

    return () => clearInterval(interval);
  }, [resources, currentResources]);

  if (isLoadingVillage || !currentResources) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner className="size-8" />
      </div>
    );
  }

  return <VillageResourcesUI village={currentResources} />;
}
