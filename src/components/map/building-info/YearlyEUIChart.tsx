import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import type { ui } from '@/i18n/ui';
import { useTranslations } from '@/i18n/utils';
import { cn } from '@/lib/utils';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

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

  if (!chartData) {
    return null;
  }

  const chartConfig = {
    yearlyEnergyUse: {
      label: t('yearly_energy_use_intensity'),
      color: '#7EA3CC',
    },
  } satisfies ChartConfig;

  return (
    <ChartContainer
      config={chartConfig}
      className={cn('aspect-auto h-[260px] max-w-full', className)}
    >
      <BarChart accessibilityLayer data={chartData} layout="vertical">
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
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          width={128}
          tickFormatter={(value) => value}
          dataKey="name"
          type="category"
        />
        <Bar dataKey="yearlyEnergyUse" fill="var(--color-yearlyEnergyUse)" />
      </BarChart>
    </ChartContainer>
  );
};

export default YearlyEUIChart;
