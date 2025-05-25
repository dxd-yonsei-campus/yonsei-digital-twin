import { selectedId } from '@/store';
import { useStore } from '@nanostores/react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useEffect, useState } from 'react';
import type { BuildingProps } from '@/content.config';
import { getAllBuildings, getCampusForBuildingId } from '@/lib/mapApi';
import { campusNameToDisplayableName } from '@/lib/mapUtils';
import { Badge } from '../ui/badge';

const allBuildings = getAllBuildings();

const BuildingInformation = () => {
  const $selectedId = useStore(selectedId);
  const [displayBuilding, setDisplayBuilding] = useState<BuildingProps | null>(
    null,
  );

  useEffect(() => {
    if ($selectedId) {
      const buildingData = allBuildings.filter(
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

  const campusName = getCampusForBuildingId(displayBuilding.id);

  return (
    <Dialog modal={false} open={!!$selectedId}>
      <DialogContent
        className="top-12 left-4 w-full translate-x-0 translate-y-0 p-7 sm:w-108"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={() => selectedId.set('')}
        onCloseClick={() => selectedId.set('')}
      >
        <DialogHeader className="text-left">
          {campusName && (
            <Badge variant="outline">
              {campusNameToDisplayableName[campusName]} Campus
            </Badge>
          )}
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
