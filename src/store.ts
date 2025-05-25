import { atom } from 'nanostores';
import type { BuildingLayerType } from '@/types/map';

export const buildingLayer = atom<BuildingLayerType>('osm');
export const selectedId = atom<string | number>('');
