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

const BuildingInformation = () => {
  const $selectedId = useStore(selectedId);
  const buildingData = sinchonBuildings.filter(
    (building) => building.id === $selectedId,
  );
  const selectedBuilding = buildingData.length >= 1 ? buildingData[0] : null;

  if (!selectedBuilding) {
    return null;
  }

  return (
    <Dialog modal={false} open={!!selectedBuilding}>
      <DialogContent
        className="top-12 left-4 translate-y-0 translate-x-0 w-full sm:w-108"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={() => selectedId.set("")}
        onCloseClick={() => selectedId.set("")}
      >
        <DialogHeader>
          <DialogTitle>{selectedBuilding.name_en}</DialogTitle>
          <div className="text-sm text-muted-foreground">
            {selectedBuilding.name}
          </div>
          <DialogDescription className="sr-only">
            Information about {selectedBuilding.name_en}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default BuildingInformation;
