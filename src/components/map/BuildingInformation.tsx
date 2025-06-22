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

const allBuildings = getAllBuildings();

type BuildingInformationProps = {
  lang: keyof typeof ui;
};

const BuildingInformation = ({ lang }: BuildingInformationProps) => {
  const $selectedId = useStore(selectedId);
  const [displayBuilding, setDisplayBuilding] = useState<BuildingProps | null>(
    null,
  );
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

  if (!displayBuilding) {
    return null;
  }

  const campusName = getCampusForBuildingId(displayBuilding.id);

  // If approval_date is a year only (e.g., "2023"), we want to display it as such.
  const hasApprovalYearOnly = /^\d{4}$/.test(
    displayBuilding.approval_date?.toString() || '',
  );
  const approvalDate = new Date(displayBuilding.approval_date || '');

  return (
    <Dialog modal={false} open={!!$selectedId}>
      <DialogContent
        className="top-12 left-4 w-full translate-x-0 translate-y-0 p-7 sm:w-108"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={() => selectedId.set('')}
        onCloseClick={() => selectedId.set('')}
      >
        <DialogHeader className="mb-1 text-left">
          {campusName && (
            <Badge variant="outline">{t(`${campusName}_long`)}</Badge>
          )}
          <DialogTitle>
            {lang === 'en' ? displayBuilding.name_en : displayBuilding.name}
          </DialogTitle>
          <div className="-mt-1 text-sm text-muted-foreground">
            {lang === 'en' ? displayBuilding.name : displayBuilding.name_en}
          </div>
          <DialogDescription className="sr-only">
            Information about {displayBuilding.name_en}
            {lang === 'en' ? (
              <>Information about {displayBuilding.name_en}</>
            ) : (
              <>에 대한 정보 {displayBuilding.name}</>
            )}
          </DialogDescription>
        </DialogHeader>
        {displayBuilding.approval_date && (
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
        {displayBuilding.floor_level && (
          <div>
            <h2 className="text-sm font-semibold">
              {t('building.floor_level')}
            </h2>
            <div>{displayBuilding.floor_level}</div>
          </div>
        )}
        {displayBuilding.construction_type &&
          displayBuilding.construction_type_en && (
            <div>
              <h2 className="text-sm font-semibold">
                {t('building.construction_type')}
              </h2>
              <div className="align-middle">
                {lang === 'en'
                  ? displayBuilding.construction_type_en
                  : displayBuilding.construction_type}{' '}
                <span className="text-sm text-muted-foreground">
                  (
                  {lang === 'ko'
                    ? displayBuilding.construction_type_en
                    : displayBuilding.construction_type}
                  )
                </span>
              </div>
            </div>
          )}
        {displayBuilding.total_floor_area && (
          <div>
            <h2 className="text-sm font-semibold">
              {t('building.total_floor_area')}
            </h2>
            <div>
              {displayBuilding.total_floor_area} m<sup>2</sup>
            </div>
          </div>
        )}
        {displayBuilding.total_building_area && (
          <div>
            <h2 className="text-sm font-semibold">
              {t('building.total_building_area')}
            </h2>
            <div>
              {displayBuilding.total_building_area} m<sup>2</sup>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BuildingInformation;
