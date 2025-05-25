import type { BuildingProps } from '@/content.config';
import sinchonBuildings from '@/data/buildings/sinchon.json';
import songdoBuildings from '@/data/buildings/songdo.json';
import { selectedCampus } from '@/store';
import type { CampusName } from '@/types/map';
import type { EasingOptions } from 'mapbox-gl';

const SINCHON_CENTER: [number, number] = [126.9384, 37.5647];
const SONGDO_CENTER: [number, number] = [126.6706, 37.38145];

export const getAllBuildings = (): BuildingProps[] => {
  const allBuildings = sinchonBuildings.concat(songdoBuildings);
  return allBuildings as BuildingProps[];
};

export const getAllBuildingIds = (): Array<string | number> => {
  const allBuildings = getAllBuildings();
  return allBuildings.map((building) => building.id);
};

export const getBuildingIdsForCampus = (
  campus: CampusName,
): Array<string | number> => {
  return getBuildingsForCampus(campus).map((building) => building.id);
};

export const getBuildingsForCampus = (campus: CampusName): BuildingProps[] => {
  switch (campus) {
    case 'sinchon':
      return sinchonBuildings as BuildingProps[];
    case 'songdo':
      return songdoBuildings as BuildingProps[];
    default:
      return [];
  }
};

export const getCampusForBuildingId = (
  buildingId: string | number,
): CampusName | null => {
  const sinchonIds = getBuildingIdsForCampus('sinchon');

  if (sinchonIds.includes(buildingId)) {
    return 'sinchon';
  }

  const songdoIds = getBuildingIdsForCampus('songdo');

  if (songdoIds.includes(buildingId)) {
    return 'songdo';
  }

  return null;
};

export const getBuildingWithId = (
  id: string | number,
): BuildingProps | null => {
  const allBuildings = getAllBuildings();
  const buildingData = allBuildings.filter((building) => building.id === id);
  return buildingData.length >= 1 ? buildingData[0] : null;
};

export const flyToLocation = (longitude: number, latitude: number) => {
  window.map.flyTo({
    center: [longitude, latitude],
    zoom: 17,
    pitch: 45,
    bearing: 0,
    duration: 2000,
  });
};

export const getCameraForCampus = (campus: CampusName): EasingOptions => {
  switch (campus) {
    case 'sinchon':
      return {
        center: SINCHON_CENTER,
        zoom: 15.5,
        pitch: 45,
        bearing: -17.6,
      };
    case 'songdo':
      return {
        center: SONGDO_CENTER,
        zoom: 16.2,
        pitch: 45,
        bearing: -17.6,
      };
    default:
      return {};
  }
};

export const flyToCampus = (campus: CampusName) => {
  const cameraSettings = getCameraForCampus(campus);
  window.map.flyTo(cameraSettings);
};

export const updateSelectedCampus = (longitude: number, latitude: number) => {
  const CAMPUS_RADIUS = 0.01;

  const sinchonDistance = Math.sqrt(
    Math.pow(longitude - SINCHON_CENTER[0], 2) +
      Math.pow(latitude - SINCHON_CENTER[1], 2),
  );

  const songdoDistance = Math.sqrt(
    Math.pow(longitude - SONGDO_CENTER[0], 2) +
      Math.pow(latitude - SONGDO_CENTER[1], 2),
  );

  if (sinchonDistance < CAMPUS_RADIUS) {
    selectedCampus.set('sinchon');
  }

  if (songdoDistance < CAMPUS_RADIUS) {
    selectedCampus.set('songdo');
  }
};
