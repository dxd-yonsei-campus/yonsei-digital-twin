import { selectedId } from "@/store";
import { useStore } from "@nanostores/react";
import sinchonBuildings from "@/data/buildings/sinchon.json";
import songdoBuildings from "@/data/buildings/songdo.json";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import type { BuildingProps } from "@/content.config";

const buildingCampusMap = new Map<string, string>();
sinchonBuildings.forEach((building) =>
  buildingCampusMap.set(String(building.id), "Sinchon"),
);
songdoBuildings.forEach((building) =>
  buildingCampusMap.set(String(building.id), "Songdo"),
);

const allBuildings = sinchonBuildings.concat(songdoBuildings);

const BuildingInformation = () => {
  const $selectedId = useStore(selectedId);
  const [displayBuilding, setDisplayBuilding] = useState<BuildingProps | null>(
    null,
  );
  const [campus, setCampus] = useState("");

  useEffect(() => {
    if ($selectedId) {
      const buildingData = allBuildings.filter(
        (building) => building.id === $selectedId,
      );
      if (buildingData.length >= 1) {
        const building = buildingData[0];
        setDisplayBuilding(building as BuildingProps);
        setCampus(buildingCampusMap.get(String(building.id)) || "");
      } else {
        setDisplayBuilding(null);
      }
    }
  }, [$selectedId]);

  if (!displayBuilding) {
    return null;
  }

  return (
    <Dialog modal={false} open={!!$selectedId}>
      <DialogContent
        className="top-12 left-4 translate-y-0 translate-x-0 w-full sm:w-108 p-7"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={() => selectedId.set("")}
        onCloseClick={() => selectedId.set("")}
      >
        <DialogHeader>
          <Badge variant="outline">{campus} Campus</Badge>
          <DialogTitle className="flex items-center gap-2">
            {displayBuilding?.name_en}
          </DialogTitle>
          <div className="text-sm text-muted-foreground">
            {displayBuilding.name}
          </div>
          <DialogDescription className="sr-only">
            Information about {displayBuilding.name_en}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default BuildingInformation;
