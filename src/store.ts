import { atom } from 'nanostores';
import { persistentAtom } from '@nanostores/persistent';
import type {
  CampusName,
  BuildingLayerType,
  BuildingIdType,
} from '@/types/map';
import { THEME_STORAGE_KEY } from '@/lib/consts';

export const buildingLayer = atom<BuildingLayerType>('osm');
export const selectedId = atom<BuildingIdType>('');
export const hoveredId = atom<BuildingIdType>('');
export const selectedCampus = persistentAtom<CampusName>('campus', 'sinchon');
export const selectedIdsForEnergyUse = atom<BuildingIdType[]>([]);

export const theme = persistentAtom<'light' | 'dark'>(
  THEME_STORAGE_KEY,
  'light',
);
