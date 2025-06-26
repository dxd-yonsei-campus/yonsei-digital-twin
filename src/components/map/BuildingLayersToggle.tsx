import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { buildingLayer } from '@/store';
import type { BuildingLayerType } from '@/types/map';
import { useStore } from '@nanostores/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '../ui/button';
import { ChevronUp } from 'lucide-react';

const BuildingLayerToggle = () => {
  const $buildingLayer = useStore(buildingLayer);
  return (
    <>
      <ToggleGroup<BuildingLayerType>
        variant="outline"
        value={$buildingLayer}
        onValueChange={(val) => buildingLayer.set(val)}
        type="single"
        className="hidden lg:flex"
      >
        <ToggleGroupItem<BuildingLayerType> className="w-32" value="osm">
          OSM
        </ToggleGroupItem>
        <ToggleGroupItem<BuildingLayerType> value="rhino-simple">
          Rhino Simple
        </ToggleGroupItem>
      </ToggleGroup>
      <div className="block lg:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Models
              <ChevronUp className="hidden xs:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-38">
            <DropdownMenuRadioGroup
              value={$buildingLayer}
              onValueChange={(val) => {
                if (val === $buildingLayer) {
                  buildingLayer.set('');
                } else {
                  buildingLayer.set(val as BuildingLayerType);
                }
              }}
            >
              <DropdownMenuRadioItem value="osm">OSM</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="rhino-simple">
                Rhino Simple
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
};

export default BuildingLayerToggle;
