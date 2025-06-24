export type BuildingLayerType = '' | 'osm' | 'rhino-simple';

export const campuses = <const>[
  'sinchon',
  'songdo',
  // 'mirae', // Enable this when Mirae campus is ready
];
export type CampusName = (typeof campuses)[number];
