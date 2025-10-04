import { Spinner } from "@/components/ui/spinner";
import { $api } from "@/lib/api/client";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { TribeSelectionUI } from "./tribe-selection.ui";

export function TribeSelectionView() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedTribeId, setSelectedTribeId] = useState<number | null>(null);

  const { data: tribes, isLoading } = $api.useSuspenseQuery("get", "/api/tribes");

  const { mutate: selectTribe, isPending } = $api.useMutation("post", "/api/tribes/select", {
    onSuccess: () => {
      toast.success("Tribu sélectionnée avec succès !");
      void queryClient.invalidateQueries({ queryKey: ["get", "/api/manage/info"] });
      void navigate({ to: "/villages" });
    },
    onError: (error) => {
      const errorDetail =
        error && typeof error === "object" && "detail" in error ?
          String((error as { detail?: unknown }).detail)
        : "Une erreur est survenue";
      toast.error("Erreur lors de la sélection de la tribu", {
        description: errorDetail,
      });
    },
  });

  const handleSelectTribe = (tribeId: number) => {
    setSelectedTribeId(tribeId);
    selectTribe({
      body: { tribeId },
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner className="size-8" />
      </div>
    );
  }

  return (
    <TribeSelectionUI
      tribes={tribes ?? []}
      selectedTribeId={selectedTribeId}
      isPending={isPending}
      onSelectTribe={handleSelectTribe}
    />
  );
}
