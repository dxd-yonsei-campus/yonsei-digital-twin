import type { BuildingProps } from "@/content.config";
import sinchonBuildings from "@/data/buildings/sinchon.json";
import songdoBuildings from "@/data/buildings/songdo.json";
import type { CampusName } from "@/types/map";

export const getAllBuildings = (): BuildingProps[] => {
  const allBuildings = sinchonBuildings.concat(songdoBuildings);
  return allBuildings as BuildingProps[];
};

export const getAllBuildingIds = (): Array<string | number> => {
  const allBuildings = getAllBuildings();
  return allBuildings.map((building) => building.id);
};

export const getBuildingsForCampus = (campus: CampusName): BuildingProps[] => {
  switch (campus) {
    case "sinchon":
      return sinchonBuildings as BuildingProps[];
    case "songdo":
      return songdoBuildings as BuildingProps[];
    default:
      return [];
  }
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
