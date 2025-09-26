import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import type { ui } from '@/i18n/ui';
import { useTranslations } from '@/i18n/utils';
import { cn, getLongestLineLengthForMaxLines } from '@/lib/utils';
import type { CollectionEntry } from 'astro:content';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Text } from 'recharts';

type MonthlyEnergyUse = Omit<
  CollectionEntry<'monthlyEnergyUse'>['data'][number],
  'month'
> & { name: string };

type EnergyChartProps = {
  lang: keyof typeof ui;
  chartData: MonthlyEnergyUse[];
  hasLegend?: boolean;
  className?: string;
};

const stackOrder: (keyof MonthlyEnergyUse)[] = [
  'equipment',
  'lighting',
  'dhw',
  'heating',
  'cooling',
];

const YearlyEnergyChart = ({
  lang,
  chartData,
  className,
}: EnergyChartProps) => {
  const t = useTranslations(lang);
  const BAR_SIZE_PER_BUILDING = 55;
  const MIN_BAR_SIZE = 85;
  const SIZE_PER_CHAR = lang === 'ko' ? 10 : 7.5;

  const chartHeight = Math.max(
    MIN_BAR_SIZE,
    chartData.length * BAR_SIZE_PER_BUILDING,
  );
  const buildingNames = chartData.map((data) => data.name);
  const maxNameLength = Math.max(...buildingNames.map((name) => name.length));
  const numLines = maxNameLength > 35 ? 3 : maxNameLength > 20 ? 2 : 1;
  const lineLengths = buildingNames.map((name) => {
    return lang === 'ko'
      ? name.length
      : getLongestLineLengthForMaxLines(name, numLines);
  });
  const yAxisWidth = Math.max(...lineLengths) * SIZE_PER_CHAR;

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

  return (
    <ChartContainer
      config={chartConfig}
      className={cn('aspect-auto max-w-full transition-all', className)}
      style={{ height: `${chartHeight}px` }}
    >
      <BarChart
        accessibilityLayer
        data={chartData}
        layout="vertical"
        margin={{
          left: 8,
        }}
      >
        <CartesianGrid vertical={false} />
        <ChartTooltip
          content={
            <ChartTooltipContent
              hideLabel
              className={cn(lang === 'ko' ? 'w-32' : 'w-42')}
            />
          }
        />
        <XAxis
          dataKey="yearlyEnergyUse"
          tickLine={true}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value}
          type="number"
        />
        <YAxis
          tick={({ x, y, payload }) => (
            <Text
              x={x}
              y={y}
              width={yAxisWidth}
              textAnchor="end"
              verticalAnchor="middle"
              style={{ wordBreak: 'break-word' }}
              breakAll={lang === 'ko'}
            >
              {payload.value}
            </Text>
          )}
          tickLine={false}
          tickMargin={6}
          axisLine={false}
          width={yAxisWidth}
          tickFormatter={(value) => value}
          dataKey="name"
          type="category"
        />
        {stackOrder.map((type) => (
          <Bar dataKey={type} stackId="a" fill={`var(--color-${type})`} />
        ))}
      </BarChart>
    </ChartContainer>
  );
};

export default YearlyEnergyChart;
