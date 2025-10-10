import type { MonthlyEnergyUseCollectionProps } from '@/content.config';
import { getBuildingWithId } from '@/lib/mapApi';
import { hoveredId } from '@/store';
import { useStore } from '@nanostores/react';

type YearlyEnergyTooltipProps = {
  monthlyEnergyUseCollection: MonthlyEnergyUseCollectionProps;
};

const YearlyEnergyTooltip = ({
  monthlyEnergyUseCollection,
}: YearlyEnergyTooltipProps) => {
  const $hoveredId = useStore(hoveredId);

  if (!$hoveredId) {
    return null;
  }

  const building = getBuildingWithId($hoveredId);
  const totalFloorArea = building?.total_floor_area;

  if (!totalFloorArea) {
    return null;
  }

  const monthlyEnergyUseId = String(building?.monthly_energy_use);
  const monthlyEnergyUse = monthlyEnergyUseCollection.find(
    (data) => String(data.id) === String(monthlyEnergyUseId),
  )?.data;

  let yearlyEnergyUse = 0;

  monthlyEnergyUse?.forEach((data) => {
    yearlyEnergyUse += Object.values(data).reduce(
      (sum, value) => sum + value,
      0,
    );
  });
  yearlyEnergyUse = yearlyEnergyUse / totalFloorArea;

  return (
    <div className="absolute top-4 left-4 h-40 w-40 bg-black">
      {yearlyEnergyUse.toFixed(2)} kWh/m<sup>2</sup>
    </div>
  );
};

export default YearlyEnergyTooltip;
