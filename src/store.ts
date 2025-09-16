import { atom } from 'nanostores';
import { persistentAtom } from '@nanostores/persistent';
import type { CampusName, BuildingLayerType } from '@/types/map';
import { THEME_STORAGE_KEY } from '@/lib/consts';

export const buildingLayer = atom<BuildingLayerType>('osm');
export const selectedId = atom<string | number>('');
export const selectedCampus = persistentAtom<CampusName>('campus', 'sinchon');
export const selectedIdsForEnergyUse = atom<Array<string | number>>([]);

export const theme = persistentAtom<'light' | 'dark'>(
  THEME_STORAGE_KEY,
  'light',
);
