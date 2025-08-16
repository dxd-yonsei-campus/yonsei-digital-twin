import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import type { BuildingProps } from '@/content.config';
import type { ui } from '@/i18n/ui';
import { useTranslations } from '@/i18n/utils';
import { useEffect, useState } from 'react';

const imageAssets = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/**/*.{jpeg,jpg,png,gif}',
);

const ConstructionInformation = ({
  lang,
  building,
}: {
  lang: keyof typeof ui;
  building: BuildingProps;
}) => {
  const [resolvedImages, setResolvedImages] = useState<ImageMetadata[]>([]);

  // Resolve images when displayBuilding changes
  useEffect(() => {
    async function resolveImages() {
      if (building && building.images) {
        const imports = await Promise.all(
          building.images.map(async (imgPath) => {
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
  }, [building]);

  const t = useTranslations(lang);

  // If approval_date is a year only (e.g., "2023"), we want to display it as such.
  const hasApprovalYearOnly = /^\d{4}$/.test(
    building.approval_date?.toString() || '',
  );
  const approvalDate = new Date(building.approval_date || '');

  // building.images are used instead of resolvedImages
  // to reserve space for the carousel.
  const hasImages = (building.images?.length || 0) > 0;

  return (
    <>
      {hasImages && (
        <Carousel className="aspect-video w-full overflow-hidden [&>.carousel-actions]:opacity-35 hover:[&>.carousel-actions]:opacity-100">
          <CarouselContent key={`images-${building.id}`}>
            {resolvedImages.map(({ src }, idx) => (
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

export default ConstructionInformation;
