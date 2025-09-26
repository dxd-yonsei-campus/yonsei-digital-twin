import type { ui } from '@/i18n/ui';
import { useTranslations } from '@/i18n/utils';

export const getChartConfig = (lang: keyof typeof ui) => {
  const t = useTranslations(lang);

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
  };

  return chartConfig;
};
