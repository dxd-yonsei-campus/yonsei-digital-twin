import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { buildingLayer } from '@/store';
import { buildingLayers, type BuildingLayerType } from '@/types/map';
import { useStore } from '@nanostores/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronUp } from 'lucide-react';
import type { ui } from '@/i18n/ui';
import { useTranslations } from '@/i18n/utils';

type BuildingLayerToggleProps = {
  lang: keyof typeof ui;
};

const BuildingLayerToggle = ({ lang }: BuildingLayerToggleProps) => {
  const t = useTranslations(lang);
  const $buildingLayer = useStore(buildingLayer);
  return (
    <>
      <ToggleGroup<BuildingLayerType>
        variant="outline"
        value={$buildingLayer}
        onValueChange={(val) => buildingLayer.set(val)}
        type="single"
        className="hidden lg:flex"
      >
        {buildingLayers.map((layer) => {
          return (
            <ToggleGroupItem<BuildingLayerType>
              className="w-36"
              value={layer}
              key={layer}
            >
              {t(layer)}
            </ToggleGroupItem>
          );
        })}
      </ToggleGroup>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex lg:hidden" asChild>
          <Button variant="outline">
            {t('models')}
            <ChevronUp className="hidden xs:block" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="block w-38 lg:hidden">
          <DropdownMenuRadioGroup
            value={$buildingLayer}
            onValueChange={(val) => {
              if (val === $buildingLayer) {
                buildingLayer.set('');
              } else {
                buildingLayer.set(val as BuildingLayerType);
              }
            }}
          >
            {buildingLayers.map((layer) => {
              return (
                <DropdownMenuRadioItem
                  value={layer}
                  key={layer}
                  onSelect={(e) => {
                    e.preventDefault();
                  }}
                >
                  {t(layer)}
                </DropdownMenuRadioItem>
              );
            })}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default BuildingLayerToggle;
