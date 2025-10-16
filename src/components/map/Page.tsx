import { AppSidebar } from '@/components/app-sidebar';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import MapboxMap from './MapboxMap';
import BuildingInformation from './BuildingInformation';
import RhinoSimpleLegend from './RhinoSimpleLegend';
import type { ui } from '@/i18n/ui';
import type { MonthlyEnergyUseCollectionProps } from '@/content.config';
import EnergyUseInformation from './EnergyUseInformation';
import YearlyEnergyTooltip from './energy-info/YearlyEnergyTooltip';
import { Separator } from '../ui/separator';
import ThemePicker from '../ThemePicker';
import BuildingLayersToggle from './BuildingLayersToggle';
import ResetViewGroup from './ResetViewGroup';
import SearchBar from './SearchBar';
import { ELEMENT_IDS } from '@/lib/consts';
import { useTranslations } from '@/i18n/utils';
import yonseiLogoDark from '@/assets/public/yonsei-logo-dark.png';
import yonseiLogoDarkKo from '@/assets/public/yonsei-logo-dark-ko.png';
import yonseiLogoLight from '@/assets/public/yonsei-logo-light.png';
import yonseiLogoLightKo from '@/assets/public/yonsei-logo-light-ko.png';

type PageProps = {
  lang: keyof typeof ui;
  monthlyEnergyUseCollection: MonthlyEnergyUseCollectionProps;
};

const Page = ({ lang, monthlyEnergyUseCollection }: PageProps) => {
  const t = useTranslations(lang);

  return (
    <SidebarProvider>
      <SidebarInset className="relative">
        <SidebarTrigger className="absolute right-4 bottom-24 z-50 -ml-1 bg-background" />
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
          className="absolute bottom-0 w-full border-t main-bg px-4 py-2"
        >
          <div className="mb-2 flex items-center justify-between gap-3">
            <div className="shrink-0">
              <slot />
              <img
                className="hidden h-8 w-auto dark:block"
                src={lang === 'en' ? yonseiLogoDark.src : yonseiLogoDarkKo.src}
                alt="Yonsei University"
              />
              <img
                className="block h-8 w-auto dark:hidden"
                src={
                  lang === 'en' ? yonseiLogoLight.src : yonseiLogoLightKo.src
                }
                alt="Yonsei University"
              />
            </div>
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
            <Separator orientation="vertical" className="h-3!" />
            <ThemePicker className="size-4 bg-transparent hover:bg-transparent! [&>svg]:size-4" />
          </div>
        </div>
        <slot />
      </SidebarInset>
      <AppSidebar id="sidebar" side="right" />
    </SidebarProvider>
  );
};

export default Page;
