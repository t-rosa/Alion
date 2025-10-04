import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import type { components } from "@/lib/api/schema";
import { CheckCircle2 } from "lucide-react";

type Tribe = components["schemas"]["GetTribeResponse"];

interface TribeSelectionUIProps {
  tribes: Tribe[];
  selectedTribeId: number | null;
  isPending: boolean;
  onSelectTribe: (tribeId: number) => void;
}

export function TribeSelectionUI({
  tribes,
  selectedTribeId,
  isPending,
  onSelectTribe,
}: TribeSelectionUIProps) {
  return (
    <div className="container mx-auto py-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-4xl font-bold">Choisissez votre peuple</h1>
          <p className="text-muted-foreground text-lg">
            Chaque peuple possède des caractéristiques uniques qui influenceront votre stratégie.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {tribes.map((tribe) => (
            <Card
              key={tribe.id}
              className={`relative cursor-pointer transition-all hover:shadow-lg ${
                selectedTribeId === tribe.id ? "ring-primary ring-2" : ""
              }`}
              onClick={() => !isPending && onSelectTribe(tribe.id)}
            >
              {selectedTribeId === tribe.id && isPending && (
                <div className="bg-background/80 absolute inset-0 flex items-center justify-center rounded-lg backdrop-blur-sm">
                  <Spinner className="size-8" />
                </div>
              )}

              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl" style={{ color: tribe.colorHex ?? undefined }}>
                    {tribe.name}
                  </CardTitle>
                  {selectedTribeId === tribe.id && !isPending && (
                    <CheckCircle2 className="text-primary h-6 w-6" />
                  )}
                </div>
                <CardDescription>{tribe.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-semibold">Bonus de production :</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {tribe.woodBonus > 0 && (
                      <div className="flex items-center gap-1">
                        <span>🪵</span>
                        <span>Bois: +{tribe.woodBonus}%</span>
                      </div>
                    )}
                    {tribe.clayBonus > 0 && (
                      <div className="flex items-center gap-1">
                        <span>🧱</span>
                        <span>Argile: +{tribe.clayBonus}%</span>
                      </div>
                    )}
                    {tribe.ironBonus > 0 && (
                      <div className="flex items-center gap-1">
                        <span>⚙️</span>
                        <span>Fer: +{tribe.ironBonus}%</span>
                      </div>
                    )}
                    {tribe.cropBonus > 0 && (
                      <div className="flex items-center gap-1">
                        <span>🌾</span>
                        <span>Céréales: +{tribe.cropBonus}%</span>
                      </div>
                    )}
                  </div>
                </div>

                <Button
                  className="w-full"
                  disabled={isPending}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTribe(tribe.id);
                  }}
                >
                  {isPending && selectedTribeId === tribe.id ?
                    <>
                      <Spinner className="mr-2 size-4" />
                      Sélection...
                    </>
                  : "Choisir ce peuple"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
