import { atom } from "nanostores";

export const buildingLayer = atom<"" | "osm">("osm");
