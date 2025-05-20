import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { buildingLayer } from "@/store";
import type { BuildingLayerType } from "@/store";
import { useStore } from "@nanostores/react";

const BuildingLayerToggle = () => {
  const $buildingLayer = useStore(buildingLayer);
  return (
    <ToggleGroup
      variant="outline"
      value={$buildingLayer}
      onValueChange={(val: BuildingLayerType) => buildingLayer.set(val)}
      type="single"
    >
      <ToggleGroupItem value="osm">OSM</ToggleGroupItem>
    </ToggleGroup>
  );
};

export default BuildingLayerToggle;
