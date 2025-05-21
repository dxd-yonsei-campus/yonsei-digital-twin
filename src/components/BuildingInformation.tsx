import { selectedId } from "@/store";
import { useStore } from "@nanostores/react";
import sinchonBuildings from "@/data/buildings/sinchon.json";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import type { BuildingProps } from "@/content.config";

const BuildingInformation = () => {
  const $selectedId = useStore(selectedId);
  const [displayBuilding, setDisplayBuilding] = useState<BuildingProps | null>(
    null,
  );

  useEffect(() => {
    if ($selectedId) {
      const buildingData = sinchonBuildings.filter(
        (building) => building.id === $selectedId,
      );
      if (buildingData.length >= 1) {
        const building = buildingData[0];
        setDisplayBuilding(building as BuildingProps);
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
        className="top-12 left-4 translate-y-0 translate-x-0 w-full sm:w-108"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={() => selectedId.set("")}
        onCloseClick={() => selectedId.set("")}
      >
        <DialogHeader className="pr-4">
          <DialogTitle>{displayBuilding?.name_en}</DialogTitle>
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
