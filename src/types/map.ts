export type BuildingLayerType = '' | 'osm';

export const campuses = <const>['sinchon', 'songdo', 'mirae'];
export type CampusName = (typeof campuses)[number];
