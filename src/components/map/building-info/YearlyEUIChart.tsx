import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import type { ui } from '@/i18n/ui';
import { useTranslations } from '@/i18n/utils';
import { cn, getLongestLineLengthForMaxLines } from '@/lib/utils';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Text } from 'recharts';

type YearlyEnergyUse = {
  name: string;
  yearlyEnergyUse: number;
};

type EnergyChartProps = {
  lang: keyof typeof ui;
  chartData?: YearlyEnergyUse[];
  className?: string;
};

const YearlyEUIChart = ({ lang, chartData, className }: EnergyChartProps) => {
  const t = useTranslations(lang);
  const BAR_SIZE_PER_BUILDING = 55;
  const MIN_BAR_SIZE = 85;
  const SIZE_PER_CHAR = lang === 'ko' ? 10 : 7.5;

  if (!chartData) {
    return null;
  }

  const chartConfig = {
    yearlyEnergyUse: {
      label: t('yearly_energy_use_intensity'),
      color: '#7EA3CC',
    },
  } satisfies ChartConfig;

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
              className={cn(lang === 'ko' ? 'w-48' : 'w-42')}
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
        <Bar
          dataKey="yearlyEnergyUse"
          fill="var(--color-yearlyEnergyUse)"
          shape={BarWithLabel}
        />
      </BarChart>
    </ChartContainer>
  );
};

export default YearlyEUIChart;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const BarWithLabel = ({ fill, payload, x, y, width, height }: any) => (
  <g>
    <rect x={x} y={y} width={width} height={height} fill={fill} />
    <text
      x={x + width - 8}
      y={y + height / 2}
      fill="rgb(7 89 133)"
      fontSize="12"
      textAnchor="end"
      dominantBaseline="middle"
    >
      {payload.yearlyEnergyUse}
    </text>
  </g>
);
