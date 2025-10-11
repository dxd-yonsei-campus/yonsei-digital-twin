import type { BuildingIdType } from '@/types/map';

const COLLEGE_OF_MEDICINE_IDS: Array<BuildingIdType> = [1178739301, 1178739302];
const LIBERTAS_HALL_A_IDS: Array<BuildingIdType> = [1096854782, 478878023];
const COLLEGE_OF_MUSIC_IDS: Array<BuildingIdType> = [429077789, 429077790];

const BUILDING_GROUPS = [
  COLLEGE_OF_MEDICINE_IDS,
  LIBERTAS_HALL_A_IDS,
  COLLEGE_OF_MUSIC_IDS,
];

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

export const DUPLICATES_TO_REMOVE = BUILDING_GROUPS.map((ids) =>
  ids.slice(1),
).flat();

export function containsIdOrGroup(
  idList: Array<string | number>,
  newId: string | number,
): boolean {
  const targetGroup = BUILDING_LOOKUP.get(newId) || [newId];
  const idSet = new Set(idList);
  return targetGroup.some((id) => idSet.has(id));
}
