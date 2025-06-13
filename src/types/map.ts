export type BuildingLayerType = '' | 'osm';

export const campuses = <const>[
  'sinchon',
  'songdo',
  // 'mirae', // Enable this when Mirae campus is ready
];
export type CampusName = (typeof campuses)[number];
