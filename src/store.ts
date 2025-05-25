import { atom } from 'nanostores';
import { persistentAtom } from '@nanostores/persistent';
import type { CampusName, BuildingLayerType } from '@/types/map';

export const buildingLayer = atom<BuildingLayerType>('osm');
export const selectedId = atom<string | number>('');
export const selectedCampus = persistentAtom<CampusName>('campus', 'sinchon', {
  encode: JSON.stringify,
  decode: JSON.parse,
});
