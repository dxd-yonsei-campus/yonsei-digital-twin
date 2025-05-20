import { selectedId } from "@/store";
import { useStore } from "@nanostores/react";
import sinchonBuildings from "@/data/buildings/sinchon.json";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";

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
    <div className="rounded z-10 absolute top-12 left-0 px-4 w-108 max-w-full md:px-8">
      <div className="bg-background/80 backdrop-blur-sm border p-3 shadow-xs">
        <div className="flex justify-between gap-1">
          <div>
            <h2 className="font-bold text-lg/6">{selectedBuilding.name_en}</h2>
            <div className="text-sm text-muted-foreground">
              {selectedBuilding.name}
            </div>
          </div>
          <Button
            onClick={() => selectedId.set("")}
            className="relative left-1.5 bottom-1.5 text-muted-foreground"
            variant="ghost"
            size="icon"
          >
            <XIcon />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BuildingInformation;
