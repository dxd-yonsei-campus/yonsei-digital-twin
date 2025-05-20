import { atom } from "nanostores";

export type BuildingLayerType = "" | "osm";

export const buildingLayer = atom<BuildingLayerType>("osm");
export const selectedId = atom<string | number>("");
