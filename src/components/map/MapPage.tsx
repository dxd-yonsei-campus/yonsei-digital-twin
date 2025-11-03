import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import MapboxMap from '@/components/map/MapboxMap';
import BuildingInformation from '@/components/map/BuildingInformation';
import RhinoSimpleLegend from '@/components/map/RhinoSimpleLegend';
import type { ui } from '@/i18n/ui';
import type { MonthlyEnergyUseCollectionProps } from '@/content.config';
import EnergyUseInformation from '@/components/map/EnergyUseInformation';
import YearlyEnergyTooltip from '@/components/map/energy-info/YearlyEnergyTooltip';
import { Separator } from '@/components/ui/separator';
import ThemePicker from '@/components/ThemePicker';
import BuildingLayersToggle from '@/components/map/navbar/BuildingLayersToggle';
import ResetViewGroup from '@/components/map/navbar/ResetViewGroup';
import SearchBar from '@/components/map/navbar/SearchBar';
import { ELEMENT_IDS, FEATURES } from '@/lib/consts';
import { useTranslations } from '@/i18n/utils';
import SidebarTrigger from '@/components/map/SidebarTrigger';
import { cn } from '@/lib/utils';
import { buildingLayer } from '@/store';
import { useStore } from '@nanostores/react';
import LanguagePicker from '@/components/map/navbar/LanguagePicker';
import NavbarCredits from '@/components/map/navbar/NavbarCredits';

type MapPageProps = {
  lang: keyof typeof ui;
  monthlyEnergyUseCollection: MonthlyEnergyUseCollectionProps;
};

const MapPage = ({ lang, monthlyEnergyUseCollection }: MapPageProps) => {
  const t = useTranslations(lang);
  const $buildingLayer = useStore(buildingLayer);

  return (
    <SidebarProvider defaultOpen={false}>
      <SidebarInset className="relative">
        {FEATURES.ENABLE_CHATBOT && (
          <SidebarTrigger
            className={cn(
              'absolute right-4 bottom-22 z-50 duration-300 ease-out',
              $buildingLayer === 'rhino-simple' && '-translate-y-19',
            )}
          />
        )}
        <BuildingInformation lang={lang} />
        <RhinoSimpleLegend lang={lang} />
        <EnergyUseInformation
          lang={lang}
          monthlyEnergyUseCollection={monthlyEnergyUseCollection}
        />
        <YearlyEnergyTooltip
          lang={lang}
          monthlyEnergyUseCollection={monthlyEnergyUseCollection}
        />
        <MapboxMap lang={lang} />
        <div
          id={ELEMENT_IDS['navbar']}
          className="@container/navbar absolute bottom-0 w-full border-t main-bg px-4 py-2"
        >
          <div className="mb-2 flex items-center justify-between gap-3">
            <NavbarCredits className="shrink-0" lang={lang} />
            <SearchBar lang={lang} />
            <div className="flex items-center gap-2">
              <BuildingLayersToggle lang={lang} />
              <Separator orientation="vertical" className="h-6!" />
              <ResetViewGroup lang={lang} />
            </div>
          </div>
          <div className="mt-2.5 flex items-center justify-start gap-2 text-xs text-muted-foreground/70">
            <a
              className="transition-colors hover:text-muted-foreground"
              href={`/${lang}/`}
            >
              {t('site.title')}
            </a>
            <Separator orientation="vertical" className="h-3!" />
            <LanguagePicker lang={lang} redirectPath="map" />
            <Separator orientation="vertical" className="h-3!" />
            <ThemePicker className="size-4 bg-transparent hover:bg-transparent! [&>svg]:size-4" />
          </div>
        </div>
        <slot />
      </SidebarInset>
      {FEATURES.ENABLE_CHATBOT && <AppSidebar id="sidebar" side="right" />}
    </SidebarProvider>
  );
};

export default MapPage;
