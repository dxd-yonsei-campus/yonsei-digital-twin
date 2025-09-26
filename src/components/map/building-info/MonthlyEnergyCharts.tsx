import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import type { ui } from '@/i18n/ui';
import { getBuildingWithId } from '@/lib/mapApi';
import { selectedIdsForEnergyUse } from '@/store';
import { useStore } from '@nanostores/react';
import { ChevronRight, XIcon } from 'lucide-react';
import MonthlyEnergyChart from '@/components/map/building-info/MonthlyEnergyChart';
import type { CollectionEntry } from 'astro:content';

type MonthlyEnergyUseEntry = CollectionEntry<'monthlyEnergyUse'>;

type MonthlyEnergyUseInformationProps = {
  lang: keyof typeof ui;
  id: string | number;
  energyUseType: 'eu' | 'eui';
  monthlyEnergyUseCollection: MonthlyEnergyUseEntry[];
};

const MonthlyEnergyCharts = ({
  lang,
  id,
  monthlyEnergyUseCollection,
  energyUseType,
}: MonthlyEnergyUseInformationProps) => {
  const $selectedIdsForEnergyUse = useStore(selectedIdsForEnergyUse);
  const buildingData = getBuildingWithId(id);
  const totalFloorArea = buildingData?.total_floor_area;
  const monthlyEnergyUseId = String(buildingData?.monthly_energy_use);
  const monthlyEnergyUse = monthlyEnergyUseCollection.find(
    (data) => String(data.id) === String(monthlyEnergyUseId),
  )?.data;
  const nameToDisplay =
    lang === 'ko' ? buildingData?.name : buildingData?.name_en;
  const handleRemoveId = () =>
    selectedIdsForEnergyUse.set(
      $selectedIdsForEnergyUse.filter((selectedId) => selectedId !== id),
    );
  const hasErrorMessage = energyUseType === 'eui' && !totalFloorArea;

  return (
    <Collapsible key={id} className="group">
      <div className="mb-2.5 flex w-full items-center justify-between">
        <CollapsibleTrigger asChild>
          <button className="w-full text-sm font-medium text-foreground/85 hover:text-foreground">
            <div className="flex items-center gap-1.5">
              <ChevronRight className="size-3.5 transition-transform duration-200 group-data-[state=open]:rotate-90" />
              <div className="text-left">
                {nameToDisplay}
                {hasErrorMessage && '*'}
              </div>
            </div>
          </button>
        </CollapsibleTrigger>
        <button
          className="text-muted-foreground hover:text-foreground"
          onClick={handleRemoveId}
        >
          <XIcon className="size-4" />
        </button>
      </div>
      <CollapsibleContent>
        <MonthlyEnergyChart
          lang={lang}
          chartData={monthlyEnergyUse}
          totalFloorArea={totalFloorArea}
          energyUseType={energyUseType}
          className="h-[200px]"
        />
      </CollapsibleContent>
    </Collapsible>
  );
};

export default MonthlyEnergyCharts;
