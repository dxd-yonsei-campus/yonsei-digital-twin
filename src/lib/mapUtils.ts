import type { BuildingIdType } from '@/types/map';

const COLLEGE_OF_MEDICINE_IDS: Array<BuildingIdType> = [1178739301, 1178739302];
const LIBERTAS_HALL_A_IDS: Array<BuildingIdType> = [1096854782, 478878023];

const BUILDING_GROUPS = [COLLEGE_OF_MEDICINE_IDS, LIBERTAS_HALL_A_IDS];

const BUILDING_LOOKUP = new Map<BuildingIdType, Array<BuildingIdType>>();

BUILDING_GROUPS.forEach((group) => {
  group.forEach((buildingId) => {
    BUILDING_LOOKUP.set(buildingId, group);
  });
});

export const findGroupForId = (buildingId: BuildingIdType) => {
  const ids = BUILDING_LOOKUP.get(buildingId);

  if (!ids) {
    return null;
  }

  return ids;
};
