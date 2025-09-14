import { buildingLayer, selectedId } from '@/store';
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
import { Badge } from '@/components/ui/badge';
import type { ui } from '@/i18n/ui';
import { useTranslations } from '@/i18n/utils';
import { ChevronDown } from 'lucide-react';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import ConstructionInformation from '@/components/map/building-info/ConstructionInformation';
import EnergyChart from '@/components/map/building-info/EnergyChart';
import type { CollectionEntry } from 'astro:content';

const allBuildings = getAllBuildings();

type MonthlyEnergyUseEntry = CollectionEntry<'monthlyEnergyUse'>;

type BuildingInformationProps = {
  lang: keyof typeof ui;
  monthlyEnergyUseCollection: MonthlyEnergyUseEntry[];
};

const BuildingInformation = ({
  lang,
  monthlyEnergyUseCollection,
}: BuildingInformationProps) => {
  const $selectedId = useStore(selectedId);
  const $buildingLayer = useStore(buildingLayer);
  const [displayBuilding, setDisplayBuilding] = useState<BuildingProps | null>(
    null,
  );
  const [showDetails, setShowDetails] = useState(true);
  const t = useTranslations(lang);

  useEffect(() => {
    if ($selectedId) {
      const buildingData = allBuildings.filter(
        (building) => building.id === $selectedId,
      );
      if (buildingData.length >= 1) {
        const building = buildingData[0];
        setDisplayBuilding(building);
      } else {
        setDisplayBuilding(null);
      }
    }
  }, [$selectedId]);

  if (!displayBuilding) {
    return null;
  }

  const campusName = getCampusForBuildingId(displayBuilding.id);
  const monthlyEnergyUse = monthlyEnergyUseCollection.find(
    (data) => data.id === String(displayBuilding?.monthly_energy_use),
  )?.data;

  return (
    <Dialog modal={false} open={!!$selectedId}>
      <DialogContent
        className={cn(
          'top-12 left-4 w-full translate-x-0 translate-y-0 p-6 sm:w-108',
          !showDetails && 'w-92 sm:w-92',
        )}
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={() => selectedId.set('')}
        onCloseClick={() => selectedId.set('')}
      >
        <Collapsible open={showDetails} onOpenChange={setShowDetails}>
          <DialogHeader className="text-left">
            {campusName && (
              <Badge variant="outline">{t(`${campusName}_long`)}</Badge>
            )}
            <DialogTitle>
              {lang === 'en' ? displayBuilding.name_en : displayBuilding.name}
            </DialogTitle>
            <CollapsibleContent>
              <div className="-mt-1 text-sm text-muted-foreground">
                {lang === 'en' ? displayBuilding.name : displayBuilding.name_en}
              </div>
            </CollapsibleContent>
            <DialogDescription className="sr-only">
              Information about {displayBuilding.name_en}
              {lang === 'en' ? (
                <>Information about {displayBuilding.name_en}</>
              ) : (
                <>에 대한 정보 {displayBuilding.name}</>
              )}
            </DialogDescription>
          </DialogHeader>
          <CollapsibleContent className="max-h-[52vh] space-y-4 overflow-auto [&>:first-child]:pt-5">
            {$buildingLayer === 'rhino-simple' ? (
              monthlyEnergyUse ? (
                <EnergyChart
                  key={displayBuilding.id}
                  lang={lang}
                  chartData={monthlyEnergyUse}
                  totalFloorArea={displayBuilding?.total_floor_area}
                />
              ) : (
                <div>{t('energy_use_unavailable')}</div>
              )
            ) : (
              <ConstructionInformation
                key={displayBuilding.id}
                lang={lang}
                building={displayBuilding}
              />
            )}
          </CollapsibleContent>
          <CollapsibleTrigger asChild>
            <button className="absolute top-4 right-11 rounded-xs opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-hidden [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4.5">
              <ChevronDown
                className={cn(
                  'transition-transform duration-300 ease-in-out',
                  showDetails ? '-rotate-180' : 'rotate-0',
                )}
              />
              <span className="sr-only">Toggle</span>
            </button>
          </CollapsibleTrigger>
        </Collapsible>
      </DialogContent>
    </Dialog>
  );
};

export default BuildingInformation;
