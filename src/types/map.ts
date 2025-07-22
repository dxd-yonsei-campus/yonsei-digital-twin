export const buildingLayers = <const>['osm', 'rhino-simple', 'rhino-detailed'];

export type BuildingLayerType = '' | (typeof buildingLayers)[number];

export const campuses = <const>[
  'sinchon',
  'songdo',
  // 'mirae', // Enable this when Mirae campus is ready
];
export type CampusName = (typeof campuses)[number];
