import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { components } from "@/lib/api/schema";
import { Link } from "@tanstack/react-router";
import { MapPin, Users } from "lucide-react";

type Village = components["schemas"]["GetVillageResponse"];

interface VillagesListUIProps {
  villages: Village[];
}

export function VillagesListUI({ villages }: VillagesListUIProps) {
  if (villages.length === 0) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Aucun village</CardTitle>
            <CardDescription>Vous n'avez pas encore de village.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-6 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mes Villages</h1>
          <p className="text-muted-foreground">Gérez vos villages et vos ressources</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {villages.map((village) => (
          <Card key={village.id} className="transition-shadow hover:shadow-lg">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle>{village.name}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <MapPin className="h-3 w-3" />({village.coordinateX}, {village.coordinateY})
                  </CardDescription>
                </div>
                {village.isCapital && (
                  <span className="text-2xl" title="Capitale">
                    👑
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-1">
                  <span>🪵</span>
                  <span>{Math.floor(village.wood)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>🧱</span>
                  <span>{Math.floor(village.clay)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>⚙️</span>
                  <span>{Math.floor(village.iron)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>🌾</span>
                  <span>{Math.floor(village.crop)}</span>
                </div>
              </div>

              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <Users className="h-4 w-4" />
                <span>
                  {village.population}/{village.populationLimit}
                </span>
              </div>

              <Link to="/villages/$villageId" params={{ villageId: village.id }}>
                <Button className="w-full">Voir le village</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
