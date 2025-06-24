import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { buildingLayer } from '@/store';
import type { BuildingLayerType } from '@/types/map';
import { useStore } from '@nanostores/react';

const BuildingLayerToggle = () => {
  const $buildingLayer = useStore(buildingLayer);
  return (
    <ToggleGroup<BuildingLayerType>
      variant="outline"
      value={$buildingLayer}
      onValueChange={(val) => buildingLayer.set(val)}
      type="single"
    >
      <ToggleGroupItem<BuildingLayerType> className="w-32" value="osm">
        OSM
      </ToggleGroupItem>
      <ToggleGroupItem<BuildingLayerType> value="rhino-simple">
        Rhino Simple
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

export default BuildingLayerToggle;
