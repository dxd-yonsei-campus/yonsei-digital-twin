import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import type { ui } from '@/i18n/ui';
import { cn, getLongestLineLengthForMaxLines } from '@/lib/utils';
import type { CollectionEntry } from 'astro:content';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Text } from 'recharts';
import { getChartConfig } from './energyUtils';

type MonthlyEnergyUse = Omit<
  CollectionEntry<'monthlyEnergyUse'>['data'][number],
  'month'
> & { name: string };

type EnergyChartProps = {
  lang: keyof typeof ui;
  chartData: MonthlyEnergyUse[];
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
  const BAR_SIZE_PER_BUILDING = 55;
  const MIN_BAR_SIZE = 85;
  const SIZE_PER_CHAR = lang === 'ko' ? 10 : 7.5;
  const ROUND_OFF_VALUE = 50;

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
  const chartConfig = getChartConfig(lang) satisfies ChartConfig;

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
          tickLine={true}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value}
          type="number"
          domain={[
            0,
            (dataMax: number) =>
              Math.ceil(dataMax / ROUND_OFF_VALUE) * ROUND_OFF_VALUE,
          ]}
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
