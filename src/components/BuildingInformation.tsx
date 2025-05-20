import { selectedId } from "@/store";
import { useStore } from "@nanostores/react";
import sinchonBuildings from "src/data/buildings/sinchon.json";

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
    <div className="bg-background rounded z-10 absolute top-12 left-8 border p-3 min-w-84 shadow-xs">
      <h2 className="font-bold text-lg">{selectedBuilding.name_en}</h2>
      <div className="text-sm text-muted-foreground">
        {selectedBuilding.name}
      </div>
    </div>
  );
};

export default BuildingInformation;
