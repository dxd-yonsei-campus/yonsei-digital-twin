import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import type { ui } from '@/i18n/ui';
import { useTranslations } from '@/i18n/utils';
import type { CollectionEntry } from 'astro:content';
import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, Label, XAxis, YAxis } from 'recharts';

type MonthlyEnergyUse = CollectionEntry<'monthlyEnergyUse'>['data'];

type EnergyChartProps = {
  lang: keyof typeof ui;
  chartData: MonthlyEnergyUse;
  totalFloorArea?: number;
};

const stackOrder: (keyof MonthlyEnergyUse[number])[] = [
  'equipment',
  'lighting',
  'dhw',
  'heating',
  'cooling',
];

const EnergyChart = ({ lang, chartData, totalFloorArea }: EnergyChartProps) => {
  const t = useTranslations(lang);
  const [energyUseType, setEnergyUseType] = useState<'eu' | 'eui'>('eu');

  const chartConfig = {
    heating: {
      label: t('energy_use.heating'),
      color: '#e76f51',
    },
    cooling: {
      label: t('energy_use.cooling'),
      color: '#8ecae6',
    },
    lighting: {
      label: t('energy_use.lighting'),
      color: '#ffdd57',
    },
    equipment: {
      label: t('energy_use.equipment'),
      color: '#adb5bd',
    },
    dhw: {
      label: t('energy_use.domestic_hot_water'),
      color: '#ff9b29',
    },
  } satisfies ChartConfig;

  const transformedChartData = chartData.map((monthData) => {
    if (totalFloorArea && energyUseType === 'eui') {
      return {
        month: monthData.month,
        heating: monthData.heating / totalFloorArea,
        cooling: monthData.cooling / totalFloorArea,
        lighting: monthData.lighting / totalFloorArea,
        equipment: monthData.equipment / totalFloorArea,
        dhw: monthData.dhw / totalFloorArea,
        windowRadiation: monthData.windowRadiation,
      };
    }

    return monthData;
  });

  return (
    <>
      {totalFloorArea && (
        <ToggleGroup
          className="w-full"
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
      )}
      <ChartContainer
        config={chartConfig}
        className="aspect-auto h-[300px] max-w-full"
      >
        <BarChart accessibilityLayer data={transformedChartData}>
          <CartesianGrid vertical={false} />
          <ChartTooltip
            content={
              <ChartTooltipContent
                className={
                  lang === 'ko' && energyUseType === 'eui' ? 'w-32' : 'w-50'
                }
                hideLabel
              />
            }
          />
          <ChartLegend
            content={
              <ChartLegendContent className="mx-auto w-84 max-w-full flex-wrap pt-6" />
            }
          />
          <XAxis
            dataKey="month"
            tickLine={true}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value}
          />
          <YAxis
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            width={energyUseType === 'eu' ? 75 : 60}
            tickFormatter={(value) => {
              if (energyUseType === 'eu') {
                return (value / 1000).toString() + 'k';
              }
              return value;
            }}
          >
            <Label
              angle={-90}
              value={
                energyUseType === 'eu'
                  ? `${t('energy_use')} (kWh)`
                  : `${t('energy_use_intensity')} (kWh/m²)`
              }
              position="insideLeft"
              style={{ textAnchor: 'middle' }}
            />
          </YAxis>
          {stackOrder.map((type) => (
            <Bar dataKey={type} stackId="a" fill={`var(--color-${type})`} />
          ))}
        </BarChart>
      </ChartContainer>
    </>
  );
};

export default EnergyChart;
