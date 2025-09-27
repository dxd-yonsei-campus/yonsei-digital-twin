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
import { getAllBuildings } from '@/lib/mapApi';
import { useState } from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useTranslations } from '@/i18n/utils';
import YearlyEnergyChart from '@/components/map/energy-info/YearlyEnergyChart';
import MonthlyEnergyCharts from '@/components/map/energy-info/MonthlyEnergyCharts';
import type { EnergyUseType } from '@/types/map';
import type { MonthlyEnergyUseCollectionProps } from '@/content.config';

type EnergyUseInformationProps = {
  lang: keyof typeof ui;
  monthlyEnergyUseCollection: MonthlyEnergyUseCollectionProps;
};

const EnergyUseInformation = ({
  lang,
  monthlyEnergyUseCollection,
}: EnergyUseInformationProps) => {
  const t = useTranslations(lang);
  const [energyUseType, setEnergyUseType] = useState<EnergyUseType>('eu');
  const $buildingLayer = useStore(buildingLayer);
  const $selectedIdsForEnergyUse = useStore(selectedIdsForEnergyUse);
  let hasErrorMessage = false;
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
      } else {
        hasErrorMessage = true;
      }

      const buildingName = lang === 'ko' ? building.name : building.name_en;
      const suffix = totalFloorArea ? '' : '*';

      return {
        name: buildingName + suffix,
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
                <h2 className="mb-1 text-sm font-semibold">
                  {t('yearly_data')}
                </h2>
                <YearlyEnergyChart
                  chartData={energyUseInformation}
                  lang={lang}
                />
                <div className="text-center text-xs text-muted-foreground">
                  {t('yearly_energy_use_intensity')} (kWh/m
                  <sup className="-z-10">2</sup>)
                </div>
              </div>
              <h2 className="mt-4 mb-2 text-sm font-semibold">
                {t('monthly_data')}
              </h2>
              <EnergyUseTypeToggle
                lang={lang}
                energyUseType={energyUseType}
                setEnergyUseType={setEnergyUseType}
              />
              <div className="mt-4 space-y-4">
                {$selectedIdsForEnergyUse.map((id) => (
                  <MonthlyEnergyCharts
                    key={id}
                    id={id}
                    lang={lang}
                    energyUseType={energyUseType}
                    monthlyEnergyUseCollection={monthlyEnergyUseCollection}
                  />
                ))}
              </div>
            </div>
            <div
              className={cn(
                'text-xs text-muted-foreground',
                hasErrorMessage ? 'block' : 'hidden',
              )}
            >
              *{t('energy_use_intensity')} {t('error_message_unavailable')}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EnergyUseInformation;

type EnergyUseTypeToggleProps = {
  lang: keyof typeof ui;
  energyUseType: EnergyUseType;
  setEnergyUseType: (type: EnergyUseType) => void;
};

const EnergyUseTypeToggle = ({
  lang,
  energyUseType,
  setEnergyUseType,
}: EnergyUseTypeToggleProps) => {
  const t = useTranslations(lang);

  return (
    <ToggleGroup
      className="w-full shrink-0"
      variant="outline"
      type="single"
      onValueChange={(val) => {
        if (val) {
          setEnergyUseType(val);
        }
      }}
      value={energyUseType}
    >
      <ToggleGroupItem className="h-7.5 text-xs!" value="eu">
        <span className="hidden xs:block">{t('energy_use_long')}</span>
        <span className="block xs:hidden">{t('energy_use')}</span>
      </ToggleGroupItem>
      <ToggleGroupItem className="h-7.5 text-xs!" value="eui">
        <span className="hidden xs:block">
          {t('energy_use_intensity_long')}
        </span>
        <span className="block xs:hidden">{t('energy_use_intensity')}</span>
      </ToggleGroupItem>
    </ToggleGroup>
  );
};
