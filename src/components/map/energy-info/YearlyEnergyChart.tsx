import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import type { ui } from '@/i18n/ui';
import { cn, getLongestLineLengthForMaxLines } from '@/lib/utils';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Text } from 'recharts';
import { getChartConfig, stackOrder } from './energyUtils';
import type { EnergyUseProps } from '@/content.config';
import { XIcon } from 'lucide-react';
import { selectedIdsForEnergyUse } from '@/store';
import { useStore } from '@nanostores/react';

type YearlyEnergyUseProps = EnergyUseProps & { name: string };

type YearlyEnergyChartProps = {
  lang: keyof typeof ui;
  chartData: YearlyEnergyUseProps[];
  className?: string;
};

const YearlyEnergyChart = ({
  lang,
  chartData,
  className,
}: YearlyEnergyChartProps) => {
  const $selectedIds = useStore(selectedIdsForEnergyUse);
  const BAR_SIZE_PER_BUILDING = 55;
  const MIN_BAR_SIZE = 85;
  const LEGEND_SIZE = 60;
  const SIZE_PER_CHAR = lang === 'ko' ? 10 : 8;
  const ROUND_OFF_VALUE = 50;

  const removeSelectedIdAtIndex = (index: number) => {
    if (index < 0 && index >= $selectedIds.length) {
      return;
    }

    const newIds = $selectedIds.filter((_, currIndex) => index !== currIndex);
    selectedIdsForEnergyUse.set(newIds);
  };

  const chartHeight =
    Math.max(MIN_BAR_SIZE, chartData.length * BAR_SIZE_PER_BUILDING) +
    LEGEND_SIZE;
  const buildingNames = chartData.map((data) => data.name);
  const maxNameLength = Math.max(...buildingNames.map((name) => name.length));
  const numLines = maxNameLength > 35 ? 3 : 2;
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
          left: 12,
        }}
      >
        <CartesianGrid horizontal={false} />
        <ChartTooltip
          content={
            <ChartTooltipContent
              hideLabel
              className={cn(lang === 'ko' ? 'w-32' : 'w-42')}
            />
          }
        />
        <ChartLegend
          verticalAlign="top"
          content={
            <ChartLegendContent className="mx-auto mb-2 w-84 max-w-full flex-wrap gap-y-1.5 pt-1" />
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
        <YAxis
          tick={({ x, y, payload }) => {
            const ICON_SIZE = 16;
            const CLICKABLE_SIZE = ICON_SIZE + 8;
            const Y_ADJUSTMENT = -ICON_SIZE / 2;
            const CLICKABLE_ADJUSTMENT = Y_ADJUSTMENT / 2;
            const index = payload.index;
            return (
              <g
                transform={`translate(${x}, ${y + Y_ADJUSTMENT})`}
                height={ICON_SIZE}
                onClick={() => removeSelectedIdAtIndex(index)}
                className="text-muted-foreground hover:text-foreground"
              >
                <rect
                  x={CLICKABLE_ADJUSTMENT}
                  y={CLICKABLE_ADJUSTMENT}
                  width={CLICKABLE_SIZE}
                  height={CLICKABLE_SIZE}
                  fill="transparent"
                />
                <XIcon height={ICON_SIZE} width={ICON_SIZE} />
              </g>
            );
          }}
          tickFormatter={() => ''}
          tickLine={false}
          yAxisId="right"
          orientation="right"
          type="category"
          axisLine={false}
          tickMargin={2}
          width={30}
        />
        {stackOrder.map((type) => (
          <Bar dataKey={type} stackId="a" fill={`var(--color-${type})`} />
        ))}
      </BarChart>
    </ChartContainer>
  );
};

export default YearlyEnergyChart;
