export const languages = {
  en: 'English',
  ko: '한국어',
};

export const defaultLang = 'en';

export const ui = {
  en: {
    'site.title': 'Yonsei Digital Twin',
    'site.description':
      "Discover Yonsei University's campuses and access detailed building information through the Yonsei Digital Twin.",
    'site.map': 'Map',
    'home.description': 'A digital twin of the Yonsei University Campus.',
    'search.placeholder': 'Search for buildings...',
    sinchon: 'Sinchon',
    sinchon_long: 'Sinchon Campus',
    songdo: 'Songdo',
    songdo_long: 'Songdo Campus',
    mirae: 'MIRAE',
    mirae_long: 'MIRAE Campus',
    language: 'Language',
    'building.floor_level': 'Floor Level',
    'building.approval_date': 'Approval Date',
    'building.construction_type': 'Construction Type',
    'building.total_floor_area': 'Total Floor Area',
    'building.total_building_area': 'Total Building Area',
    osm: 'OSM',
    'rhino-simple': 'Rhino (Simple)',
    'rhino-detailed': 'Rhino (Detailed)',
    models: 'Models',
    'notify.no_model': 'No building model selected.',
  },
  ko: {
    'site.title': '연세 디지털 트윈',
    'site.description':
      '연세대학교 캠퍼스를 둘러보고 연세 디지털 트윈을 통해 자세한 건물 정보를 확인해 보세요',
    'site.map': '지도',
    'home.description': '연세대학교 캠퍼스의 디지털 트윈',
    'search.placeholder': '건물 검색',
    sinchon: '신촌',
    sinchon_long: '신촌캠퍼스',
    songdo: '송도',
    songdo_long: '송도캠퍼스',
    mirae: '미래',
    mirae_long: '미래캠퍼스',
    language: '언어',
    'building.floor_level': '바닥 수준',
    'building.approval_date': '사용승인일',
    'building.construction_type': '주구조명',
    'building.total_floor_area': '연면적',
    'building.total_building_area': '건축면적',
    osm: 'OSM',
    'rhino-simple': 'Rhino (단순한)',
    'rhino-detailed': 'Rhino (상세한)',
    models: '건물 모델들',
    'notify.no_model': '선택된 건물 모델이 없습니다.',
  },
} as const;
