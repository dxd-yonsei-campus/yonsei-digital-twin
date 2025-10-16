import type { MonthlyEnergyUseCollectionProps } from '@/content.config';
import type { ui } from '@/i18n/ui';
import { useTranslations } from '@/i18n/utils';
import { ELEMENT_IDS } from '@/lib/consts';
import { getBuildingWithId } from '@/lib/mapApi';
import { hoveredId } from '@/store';
import { useStore } from '@nanostores/react';

type YearlyEnergyTooltipProps = {
  lang: keyof typeof ui;
  monthlyEnergyUseCollection: MonthlyEnergyUseCollectionProps;
};

const YearlyEnergyTooltip = ({
  lang,
  monthlyEnergyUseCollection,
}: YearlyEnergyTooltipProps) => {
  const $hoveredId = useStore(hoveredId);
  const t = useTranslations(lang);
  console.log($hoveredId);

  if (!$hoveredId) {
    return null;
  }

  const building = getBuildingWithId($hoveredId);
  const totalFloorArea = building?.total_floor_area;
  const monthlyEnergyUseId = String(building?.monthly_energy_use);
  const monthlyEnergyUse = monthlyEnergyUseCollection.find(
    (data) => String(data.id) === String(monthlyEnergyUseId),
  )?.data;

  if (!totalFloorArea || !monthlyEnergyUse) {
    return null;
  }

  let yearlyEnergyUse = 0;

  monthlyEnergyUse?.forEach((data) => {
    yearlyEnergyUse += Object.values(data).reduce(
      (sum, value) => sum + value,
      0,
    );
  });
  yearlyEnergyUse = yearlyEnergyUse / totalFloorArea;

  return (
    <div
      id={ELEMENT_IDS['yearlyEuiTooptip']}
      className="absolute z-50 max-w-46 rounded-md main-bg py-2 pr-6 pl-4 sm:max-w-64"
    >
      <div className="text-sm leading-4 text-muted-foreground">
        {lang === 'ko' ? building.name : building.name_en}{' '}
        {t('energy_use_intensity')}
      </div>
      <div>
        <span>{yearlyEnergyUse.toFixed(2)} </span>
        <span className="font-mono text-sm">
          kWh/m<sup>2</sup>
        </span>
      </div>
    </div>
  );
};

export default YearlyEnergyTooltip;
