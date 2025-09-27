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
import type { EnergyUseType } from '@/types/map';
import { Bar, BarChart, CartesianGrid, Label, XAxis, YAxis } from 'recharts';
import { getChartConfig, stackOrder } from './energyUtils';
import type { MonthlyEnergyUseProps } from '@/content.config';

type MonthlyEnergyChartProps = {
  energyUseType: EnergyUseType;
  lang: keyof typeof ui;
  chartData?: MonthlyEnergyUseProps[];
  totalFloorArea?: number;
  hasLegend?: boolean;
  className?: string;
};

const MonthlyEnergyChart = ({
  energyUseType,
  lang,
  chartData,
  totalFloorArea,
  hasLegend,
  className,
}: MonthlyEnergyChartProps) => {
  const t = useTranslations(lang);

  if (!chartData) {
    return null;
  }

  const chartConfig = getChartConfig(lang) satisfies ChartConfig;
  const isEU = !totalFloorArea || energyUseType === 'eu';

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
              className={lang === 'ko' && !isEU ? 'w-32' : 'w-50'}
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
          width={isEU ? 75 : 60}
          tickFormatter={(value) => {
            if (isEU) {
              return (value / 1000).toString() + 'k';
            }
            return value;
          }}
        >
          <Label
            angle={-90}
            value={
              isEU
                ? `${t('monthly_energy_use')} (kWh)`
                : `${t('monthly_energy_use_intensity')} (kWh/m²)`
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

export default MonthlyEnergyChart;
