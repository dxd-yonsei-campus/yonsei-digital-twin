import { buildingLayer, selectedIdsForEnergyUse } from '@/store';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { useStore } from '@nanostores/react';
import { cn } from '@/lib/utils';
import type { ui } from '@/i18n/ui';
import type { CollectionEntry } from 'astro:content';
import EnergyChart from './building-info/EnergyChart';
import { getAllBuildings } from '@/lib/mapApi';
import { Badge } from '../ui/badge';
import { XIcon } from 'lucide-react';

type MonthlyEnergyUseEntry = CollectionEntry<'monthlyEnergyUse'>;

type EnergyUseInformationProps = {
  lang: keyof typeof ui;
  monthlyEnergyUseCollection: MonthlyEnergyUseEntry[];
};

const allBuildings = getAllBuildings();

const EnergyUseInformation = ({
  lang,
  monthlyEnergyUseCollection,
}: EnergyUseInformationProps) => {
  const $buildingLayer = useStore(buildingLayer);
  const $selectedIdsForEnergyUse = useStore(selectedIdsForEnergyUse);

  const getMonthlyEnergyUseId = (buildingId: string | number) => {
    return String(
      allBuildings.find(
        (building) => String(building.id) === String(buildingId),
      )?.monthly_energy_use,
    );
  };

  const getEnergyDataForBuilding = (id: string | number) => {
    return monthlyEnergyUseCollection.find(
      (data) => String(data.id) === String(id),
    )?.data;
  };

  const handleRemoveId = (id: string | number) => {
    selectedIdsForEnergyUse.set(
      $selectedIdsForEnergyUse.filter((selectedId) => selectedId !== id),
    );
  };

  return (
    <Dialog modal={false} open={$buildingLayer === 'rhino-simple'}>
      <DialogContent
        className={cn(
          'top-12 left-4 w-full translate-x-0 translate-y-0 p-6 sm:w-108',
        )}
        onPointerDownOutside={(e) => e.preventDefault()}
        // onEscapeKeyDown={() => selectedId.set('')}
        // onCloseClick={() => selectedId.set('')}
      >
        <DialogHeader className="text-left">
          <DialogTitle>Energy Use</DialogTitle>
          <DialogDescription className="sr-only">
            Energy use information.
          </DialogDescription>
        </DialogHeader>
        <div>
          Click or search for any buildings to compare energy use information.
        </div>
        <div className="flex flex-wrap gap-1">
          {$selectedIdsForEnergyUse.map((id) => {
            return (
              <Badge variant="outline" key={id}>
                {id}
                <button
                  onClick={() => handleRemoveId(id)}
                  className="ml-0.5 text-muted-foreground hover:text-foreground"
                >
                  <XIcon className="size-3.5" />
                </button>
              </Badge>
            );
          })}
        </div>
        {$selectedIdsForEnergyUse.length > 0 && (
          <div className="max-h-[52vh] overflow-auto">
            {$selectedIdsForEnergyUse.map((id) => {
              const monthlyEnergyUseId = getMonthlyEnergyUseId(id);
              const monthlyEnergyUse =
                getEnergyDataForBuilding(monthlyEnergyUseId);

              if (!monthlyEnergyUse) {
                return null;
              }

              return (
                <EnergyChart
                  key={id}
                  lang={lang}
                  chartData={monthlyEnergyUse}
                />
              );
            })}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EnergyUseInformation;
