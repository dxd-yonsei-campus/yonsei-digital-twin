import { buildingLayer, selectedIdsForEnergyUse } from '@/store';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useStore } from '@nanostores/react';
import { cn } from '@/lib/utils';
import type { ui } from '@/i18n/ui';
import type { CollectionEntry } from 'astro:content';
import EnergyChart from './building-info/EnergyChart';
import { getAllBuildings, getBuildingWithId } from '@/lib/mapApi';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronRight, XIcon } from 'lucide-react';
import { useState } from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useTranslations } from '@/i18n/utils';
import YearlyEnergyChart from './building-info/YearlyEnergyChart';

type MonthlyEnergyUseEntry = CollectionEntry<'monthlyEnergyUse'>;

type EnergyUseInformationProps = {
  lang: keyof typeof ui;
  monthlyEnergyUseCollection: MonthlyEnergyUseEntry[];
};

const EnergyUseInformation = ({
  lang,
  monthlyEnergyUseCollection,
}: EnergyUseInformationProps) => {
  const t = useTranslations(lang);
  const [energyUseType, setEnergyUseType] = useState<'eu' | 'eui'>('eu');
  const $buildingLayer = useStore(buildingLayer);
  const $selectedIdsForEnergyUse = useStore(selectedIdsForEnergyUse);
  const energyUseInformation = getAllBuildings()
    .filter((building) => $selectedIdsForEnergyUse.includes(building.id))
    .sort((first, second) => {
      const firstId = $selectedIdsForEnergyUse.indexOf(first.id);
      const secondId = $selectedIdsForEnergyUse.indexOf(second.id);
      return firstId - secondId;
    })
    .map((building) => {
      const totalFloorArea = building?.total_floor_area;
      const monthlyEnergyUseId = String(building?.monthly_energy_use);
      const monthlyEnergyUse = monthlyEnergyUseCollection.find(
        (data) => String(data.id) === String(monthlyEnergyUseId),
      )?.data;

      const annualEnergyUse = {
        cooling: 0,
        dhw: 0,
        equipment: 0,
        lighting: 0,
        heating: 0,
        windowRadiation: 0,
      };

      if (totalFloorArea) {
        monthlyEnergyUse?.forEach((data) => {
          for (const key in data) {
            if (key in annualEnergyUse) {
              const dictKey = key as keyof typeof annualEnergyUse;
              annualEnergyUse[dictKey] += data[dictKey] / totalFloorArea;
            }
          }
        });
      }

      const buildingName = lang === 'ko' ? building.name : building.name_en;
      const suffix = totalFloorArea ? '' : '*';

      return {
        name: buildingName + suffix,
        yearlyEnergyUse: building.yearly_energy_use || 0,
        ...annualEnergyUse,
      };
    });

  return (
    <Dialog modal={false} open={$buildingLayer === 'rhino-simple'}>
      <DialogContent
        className={cn(
          'top-12 left-4 w-full translate-x-0 translate-y-0 p-6 sm:w-108',
        )}
        onPointerDownOutside={(e) => e.preventDefault()}
        isCloseable={false}
      >
        <DialogHeader className="text-left">
          <DialogTitle>{t('energy_use_long')}</DialogTitle>
          <DialogDescription className="sr-only">
            Energy use information.
          </DialogDescription>
        </DialogHeader>
        {$selectedIdsForEnergyUse.length <= 0 && (
          <div>{t('energy_use_description')}</div>
        )}

        {$selectedIdsForEnergyUse.length >= 1 && (
          <div className="flex max-h-128 flex-col gap-4">
            <div className="flex-grow overflow-auto">
              <div>
                <h2 className="text-sm font-semibold">Yearly Data</h2>
                <YearlyEnergyChart
                  chartData={energyUseInformation}
                  lang={lang}
                />
                <div className="text-center text-xs text-muted-foreground">
                  {t('yearly_energy_use_intensity')} (kWh/m<sup>2</sup>)
                </div>
              </div>
              <div>
                <h2 className="mb-2 text-sm font-semibold">Monthly Data</h2>
                <ToggleGroup
                  className="w-full shrink-0"
                  variant="outline"
                  type={'single'}
                  onValueChange={(val) => {
                    if (val) {
                      setEnergyUseType(val);
                    }
                  }}
                  value={energyUseType}
                >
                  <ToggleGroupItem className="h-7.5 text-xs!" value="eu">
                    <span className="hidden xs:block">
                      {t('energy_use_long')}
                    </span>
                    <span className="block xs:hidden">{t('energy_use')}</span>
                  </ToggleGroupItem>
                  <ToggleGroupItem className="h-7.5 text-xs!" value="eui">
                    <span className="hidden xs:block">
                      {t('energy_use_intensity_long')}
                    </span>
                    <span className="block xs:hidden">
                      {t('energy_use_intensity')}
                    </span>
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
              <div className="mt-2">
                <div className="space-y-4">
                  {$selectedIdsForEnergyUse.map((id) => (
                    <MonthlyEnergyUseInformation
                      key={id}
                      id={id}
                      lang={lang}
                      energyUseType={energyUseType}
                      monthlyEnergyUseCollection={monthlyEnergyUseCollection}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              *{t('energy_use_intensity')} {t('error_message_unavailable')}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EnergyUseInformation;

type MonthlyEnergyUseInformationProps = {
  lang: keyof typeof ui;
  id: string | number;
  energyUseType: 'eu' | 'eui';
  monthlyEnergyUseCollection: MonthlyEnergyUseEntry[];
};

const MonthlyEnergyUseInformation = ({
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
    <Collapsible
      key={id}
      className={cn('group', hasErrorMessage && 'eui-error')}
    >
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
        <EnergyChart
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
