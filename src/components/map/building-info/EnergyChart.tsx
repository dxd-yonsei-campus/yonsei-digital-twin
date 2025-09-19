import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import type { ui } from '@/i18n/ui';
import { useTranslations } from '@/i18n/utils';
import { cn } from '@/lib/utils';
import type { CollectionEntry } from 'astro:content';
import { Bar, BarChart, CartesianGrid, Label, XAxis, YAxis } from 'recharts';

type MonthlyEnergyUse = CollectionEntry<'monthlyEnergyUse'>['data'];

type EnergyChartProps = {
  energyUseType?: 'eu' | 'eui';
  lang: keyof typeof ui;
  chartData?: MonthlyEnergyUse;
  totalFloorArea?: number;
  hasLegend?: boolean;
  className?: string;
};

const stackOrder: (keyof MonthlyEnergyUse[number])[] = [
  'equipment',
  'lighting',
  'dhw',
  'heating',
  'cooling',
];

const EnergyChart = ({
  energyUseType = 'eu',
  lang,
  chartData,
  totalFloorArea,
  hasLegend,
  className,
}: EnergyChartProps) => {
  const t = useTranslations(lang);

  if (!chartData) {
    return null;
  }

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
    <ChartContainer
      config={chartConfig}
      className={cn('aspect-auto h-[300px] max-w-full', className)}
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
        {hasLegend && (
          <ChartLegend
            content={
              <ChartLegendContent className="mx-auto w-84 max-w-full flex-wrap pt-6" />
            }
          />
        )}
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
  );
};

export default EnergyChart;
