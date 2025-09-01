import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import type { CollectionEntry } from 'astro:content';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

type MonthlyEnergyUse = CollectionEntry<'monthlyEnergyUse'>['data'];

type EnergyChartProps = {
  chartData: MonthlyEnergyUse;
};

const EnergyChart = ({ chartData }: EnergyChartProps) => {
  const chartConfig = {
    heating: {
      label: 'Heating',
      color: '#e76f51',
    },
    cooling: {
      label: 'Cooling',
      color: '#8ecae6',
    },
    lighting: {
      label: 'Lighting',
      color: '#ffdd57',
    },
    equipment: {
      label: 'Equipment',
      color: '#adb5bd',
    },
    dhw: {
      label: 'Domestic Hot Water',
      color: '#ff9b29',
    },
    windowRadiation: {
      label: 'Window Radiation',
      color: '#219ebc',
    },
  } satisfies ChartConfig;

  return (
    <ChartContainer
      config={chartConfig}
      className="aspect-auto h-[300px] max-w-full"
    >
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <ChartTooltip
          content={<ChartTooltipContent className="w-12" hideLabel />}
        />
        <ChartLegend content={<ChartLegendContent className="flex-row" />} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value}
        />
        <YAxis
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.toString()}
        />
        {[
          'equipment',
          'lighting',
          'dhw',
          'heating',
          'windowRadiation',
          'cooling',
        ].map((type, index, arr) => {
          const isTop = index === arr.length - 1;
          const barRadius: [number, number, number, number] = isTop
            ? [4, 4, 0, 0]
            : [0, 0, 0, 0];

          return (
            <Bar
              dataKey={type}
              stackId="a"
              fill={`var(--color-${type})`}
              radius={barRadius}
            />
          );
        })}
      </BarChart>
    </ChartContainer>
  );
};

export default EnergyChart;
