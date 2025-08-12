import { selectedId } from '@/store';
import { useStore } from '@nanostores/react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useEffect, useState } from 'react';
import type { BuildingProps } from '@/content.config';
import { getAllBuildings, getCampusForBuildingId } from '@/lib/mapApi';
import { Badge } from '@/components/ui/badge';
import type { ui } from '@/i18n/ui';
import { useTranslations } from '@/i18n/utils';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { ChevronDown } from 'lucide-react';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
const imageAssets = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/**/*.{jpeg,jpg,png,gif}',
);

const allBuildings = getAllBuildings();

type BuildingInformationProps = {
  lang: keyof typeof ui;
};

const BuildingInformation = ({ lang }: BuildingInformationProps) => {
  const $selectedId = useStore(selectedId);
  const [displayBuilding, setDisplayBuilding] = useState<BuildingProps | null>(
    null,
  );
  const [resolvedImages, setResolvedImages] = useState<ImageMetadata[]>([]);
  const [showDetails, setShowDetails] = useState(true);
  const t = useTranslations(lang);

  useEffect(() => {
    if ($selectedId) {
      const buildingData = allBuildings.filter(
        (building) => building.id === $selectedId,
      );
      if (buildingData.length >= 1) {
        const building = buildingData[0];
        setDisplayBuilding(building);
      } else {
        setDisplayBuilding(null);
      }
    }
  }, [$selectedId]);

  // Resolve images when displayBuilding changes
  useEffect(() => {
    async function resolveImages() {
      if (displayBuilding && displayBuilding.images) {
        const imports = await Promise.all(
          displayBuilding.images.map(async (imgPath) => {
            const importer = imageAssets[imgPath];
            const mod = await importer();
            return mod.default;
          }),
        );
        setResolvedImages(imports);
      } else {
        setResolvedImages([]);
      }
    }
    resolveImages();
  }, [displayBuilding]);

  if (!displayBuilding) {
    return null;
  }

  const campusName = getCampusForBuildingId(displayBuilding.id);

  return (
    <Dialog modal={false} open={!!$selectedId}>
      <DialogContent
        className={cn(
          'top-12 left-4 w-full translate-x-0 translate-y-0 p-6 sm:w-108',
          !showDetails && 'w-92 sm:w-92',
        )}
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={() => selectedId.set('')}
        onCloseClick={() => selectedId.set('')}
      >
        <Collapsible open={showDetails} onOpenChange={setShowDetails}>
          <DialogHeader className="text-left">
            {campusName && (
              <Badge variant="outline">{t(`${campusName}_long`)}</Badge>
            )}
            <DialogTitle>
              {lang === 'en' ? displayBuilding.name_en : displayBuilding.name}
            </DialogTitle>
            <CollapsibleContent>
              <div className="-mt-1 text-sm text-muted-foreground">
                {lang === 'en' ? displayBuilding.name : displayBuilding.name_en}
              </div>
            </CollapsibleContent>
            <DialogDescription className="sr-only">
              Information about {displayBuilding.name_en}
              {lang === 'en' ? (
                <>Information about {displayBuilding.name_en}</>
              ) : (
                <>에 대한 정보 {displayBuilding.name}</>
              )}
            </DialogDescription>
          </DialogHeader>
          <CollapsibleContent className="max-h-[52vh] space-y-4 overflow-scroll [&>:first-child]:pt-5">
            <ConstructionInformation
              lang={lang}
              building={displayBuilding}
              images={resolvedImages}
            />
          </CollapsibleContent>
          <CollapsibleTrigger asChild>
            <button className="absolute top-4 right-11 rounded-xs opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-hidden [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4.5">
              <ChevronDown
                className={cn(
                  'transition-transform duration-300 ease-in-out',
                  showDetails ? '-rotate-180' : 'rotate-0',
                )}
              />
              <span className="sr-only">Toggle</span>
            </button>
          </CollapsibleTrigger>
        </Collapsible>
      </DialogContent>
    </Dialog>
  );
};

export default BuildingInformation;

const ConstructionInformation = ({
  lang,
  images,
  building,
}: {
  lang: keyof typeof ui;
  images: ImageMetadata[];
  building: BuildingProps;
}) => {
  const t = useTranslations(lang);

  // If approval_date is a year only (e.g., "2023"), we want to display it as such.
  const hasApprovalYearOnly = /^\d{4}$/.test(
    building.approval_date?.toString() || '',
  );
  const approvalDate = new Date(building.approval_date || '');

  return (
    <>
      {images.length > 0 && (
        <Carousel className="aspect-video w-full overflow-hidden rounded-xs [&>.carousel-actions]:opacity-35 hover:[&>.carousel-actions]:opacity-100">
          <CarouselContent key={`images-${building.id}`}>
            {images.map(({ src }, idx) => (
              <CarouselItem key={src + idx}>
                <img
                  className="aspect-video object-contain"
                  src={src}
                  alt={building.name + ' image ' + (idx + 1)}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="carousel-actions transition-opacity duration-200">
            <CarouselPrevious
              variant="secondary"
              className="top-[unset] bottom-1.5 left-1.5 size-7 translate-y-0"
            />
            <CarouselNext
              variant="secondary"
              className="top-[unset] bottom-1.5 left-9.5 size-7 translate-y-0"
            />
          </div>
        </Carousel>
      )}
      {building.approval_date && (
        <div>
          <h2 className="text-sm font-semibold">
            {t('building.approval_date')}
          </h2>
          <div>
            {hasApprovalYearOnly
              ? approvalDate.getFullYear()
              : approvalDate.toLocaleDateString()}
          </div>
        </div>
      )}
      {building.floor_level && (
        <div>
          <h2 className="text-sm font-semibold">{t('building.floor_level')}</h2>
          <div>{building.floor_level}</div>
        </div>
      )}
      {building.construction_type && building.construction_type_en && (
        <div>
          <h2 className="text-sm font-semibold">
            {t('building.construction_type')}
          </h2>
          <div className="align-middle">
            {lang === 'en'
              ? building.construction_type_en
              : building.construction_type}{' '}
            <span className="text-sm text-muted-foreground">
              (
              {lang === 'ko'
                ? building.construction_type_en
                : building.construction_type}
              )
            </span>
          </div>
        </div>
      )}
      {building.total_floor_area && (
        <div>
          <h2 className="text-sm font-semibold">
            {t('building.total_floor_area')}
          </h2>
          <div>
            {building.total_floor_area} m<sup>2</sup>
          </div>
        </div>
      )}
      {building.total_building_area && (
        <div>
          <h2 className="text-sm font-semibold">
            {t('building.total_building_area')}
          </h2>
          <div>
            {building.total_building_area} m<sup>2</sup>
          </div>
        </div>
      )}
    </>
  );
};
