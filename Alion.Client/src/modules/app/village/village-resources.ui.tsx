import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import type { components } from "@/lib/api/schema";
import { MapPin, Users } from "lucide-react";

type Village = components["schemas"]["GetVillageResponse"];

interface VillageResourcesUIProps {
  village: Village;
}

export function VillageResourcesUI({ village }: VillageResourcesUIProps) {
  return (
    <div className="container mx-auto space-y-6 py-8">
      {/* En-tête du village */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-3xl">{village.name}</CardTitle>
              <CardDescription className="flex items-center gap-4 text-base">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />({village.coordinateX}, {village.coordinateY})
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {village.population}/{village.populationLimit}
                </span>
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline">{village.tribeName}</Badge>
              {village.isCapital && <Badge>Capitale</Badge>}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Ressources */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <ResourceCard
          icon="🪵"
          name="Bois"
          current={Math.floor(village.wood)}
          max={village.warehouseCapacity}
          production={village.woodProduction}
          color="bg-amber-500"
        />
        <ResourceCard
          icon="🧱"
          name="Argile"
          current={Math.floor(village.clay)}
          max={village.warehouseCapacity}
          production={village.clayProduction}
          color="bg-orange-500"
        />
        <ResourceCard
          icon="⚙️"
          name="Fer"
          current={Math.floor(village.iron)}
          max={village.warehouseCapacity}
          production={village.ironProduction}
          color="bg-slate-500"
        />
        <ResourceCard
          icon="🌾"
          name="Céréales"
          current={Math.floor(village.crop)}
          max={village.granaryCapacity}
          production={village.cropProduction}
          color="bg-yellow-500"
        />
      </div>

      {/* Placeholder pour les bâtiments */}
      <Card>
        <CardHeader>
          <CardTitle>Bâtiments</CardTitle>
          <CardDescription>Les bâtiments de votre village apparaîtront ici</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground py-12 text-center">
            <p>🏗️ Fonctionnalité à venir : système de construction</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface ResourceCardProps {
  icon: string;
  name: string;
  current: number;
  max: number;
  production: number;
  color: string;
}

function ResourceCard({ icon, name, current, max, production, color }: ResourceCardProps) {
  const percentage = (current / max) * 100;
  const isFull = current >= max;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <span className="text-2xl">{icon}</span>
          <Badge variant={isFull ? "destructive" : "secondary"}>
            {isFull ? "Plein" : `${percentage.toFixed(0)}%`}
          </Badge>
        </div>
        <CardTitle className="text-lg">{name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1">
          <div className="flex items-baseline justify-between text-sm">
            <span className="font-medium">{current.toLocaleString()}</span>
            <span className="text-muted-foreground">/ {max.toLocaleString()}</span>
          </div>
          <Progress value={percentage} className={`h-2 ${color}`} />
        </div>
        <Separator />
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Production</span>
          <span className="font-medium text-green-600">+{production}/h</span>
        </div>
      </CardContent>
    </Card>
  );
}
