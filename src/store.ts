import { atom } from 'nanostores';
import type { CampusName, BuildingLayerType } from '@/types/map';

export const buildingLayer = atom<BuildingLayerType>('osm');
export const selectedId = atom<string | number>('');
export const selectedCampus = atom<CampusName>('sinchon');
