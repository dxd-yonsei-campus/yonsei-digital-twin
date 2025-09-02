import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import type { CollectionEntry } from 'astro:content';
import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, Label, XAxis, YAxis } from 'recharts';

type MonthlyEnergyUse = CollectionEntry<'monthlyEnergyUse'>['data'];

type EnergyChartProps = {
  chartData: MonthlyEnergyUse;
  totalFloorArea: number;
};

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

const stackOrder: (keyof MonthlyEnergyUse[number])[] = [
  'equipment',
  'lighting',
  'dhw',
  'heating',
  'windowRadiation',
  'cooling',
];

const EnergyChart = ({ chartData, totalFloorArea }: EnergyChartProps) => {
  const [energyUseType, setEnergyUseType] = useState<'eu' | 'eui'>('eu');

  const transformedChartData = chartData.map((monthData) => {
    if (energyUseType === 'eui') {
      return {
        month: monthData.month,
        heating: monthData.heating / totalFloorArea,
        cooling: monthData.cooling / totalFloorArea,
        lighting: monthData.lighting / totalFloorArea,
        equipment: monthData.equipment / totalFloorArea,
        dhw: monthData.dhw / totalFloorArea,
        windowRadiation: monthData.windowRadiation / totalFloorArea,
      };
    }

    return monthData;
  });

  return (
    <>
      <ToggleGroup
        className="w-full"
        variant="outline"
        type={'single'}
        onValueChange={(val) => setEnergyUseType(val)}
        value={energyUseType}
      >
        <ToggleGroupItem className="h-7.5 text-xs!" value="eu">
          Energy Use
        </ToggleGroupItem>
        <ToggleGroupItem className="h-7.5 text-xs!" value="eui">
          Energy Use Intensity
        </ToggleGroupItem>
      </ToggleGroup>
      <ChartContainer
        config={chartConfig}
        className="aspect-auto h-[300px] max-w-full"
      >
        <BarChart accessibilityLayer data={transformedChartData}>
          <CartesianGrid vertical={false} />
          <ChartTooltip
            content={<ChartTooltipContent className="w-50" hideLabel />}
          />
          <ChartLegend
            content={<ChartLegendContent className="flex-wrap pt-6" />}
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
            tickFormatter={(value) => {
              if (energyUseType === 'eu') {
                return (value / 1000).toString() + 'k';
              }
              return value;
            }}
          >
            <Label
              angle={-90}
              value={energyUseType === 'eu' ? 'EU (kWh)' : 'EUI (kWh/m²)'}
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
