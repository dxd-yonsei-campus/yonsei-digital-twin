export type BuildingLayerType = '' | 'osm';

export const campuses = <const>['sinchon', 'songdo'];
export type CampusName = (typeof campuses)[number];
