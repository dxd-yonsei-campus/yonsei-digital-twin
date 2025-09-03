import type { ui } from '@/i18n/ui';
import { useTranslations } from '@/i18n/utils';
import { cn } from '@/lib/utils';
import { buildingLayer } from '@/store';
import { useStore } from '@nanostores/react';

type RhinoSimpleLegendProps = {
  lang: keyof typeof ui;
};

const RhinoSimpleLegend = ({ lang }: RhinoSimpleLegendProps) => {
  const $buildingLayer = useStore(buildingLayer);
  const isRhinoSimple = $buildingLayer === 'rhino-simple';
  const t = useTranslations(lang);

  return (
    <div
      className={cn(
        'fixed right-0 bottom-21 z-20 w-full transform transition-all duration-150 ease-out xs:w-80',
        isRhinoSimple
          ? 'translate-y-0 scale-100 opacity-100'
          : 'pointer-events-none translate-y-0.5 scale-95 opacity-0',
      )}
    >
      <div className="mx-4 rounded-md main-bg px-3.5 py-2.5 shadow-sm">
        <div className="mb-1 text-xs text-muted-foreground">
          {t('energy_use_intensity_long')} (kWh/m<sup>2</sup>)
        </div>
        <div
          className="h-4 w-full rounded bg-white"
          style={{
            background:
              'linear-gradient(90deg, #2F6CF4 0%, #9DC175 33%, #FFFF54 50%, #F2AB40 70%, #EA3440 100%)',
          }}
        ></div>
        <div className="mt-0.5 flex justify-between text-xs text-muted-foreground">
          <span>120</span>
          <span>200</span>
        </div>
      </div>
    </div>
  );
};

export default RhinoSimpleLegend;
