import type { BuildingProps } from '@/content.config';
import type { CampusName } from '@/types/map';
import { getBuildingsForCampus } from './mapApi';
import uFuzzySearch from '@leeoniya/ufuzzy';

const romanToNumber = (roman: string): number => {
  const romanMap: Record<string, number> = {
    I: 1,
    V: 5,
    X: 10,
    L: 50,
    C: 100,
    D: 500,
    M: 1000,
  };

  let result = 0;
  let prevValue = 0;

  for (let i = roman.length - 1; i >= 0; i--) {
    const currentValue = romanMap[roman[i]];

    if (currentValue < prevValue) {
      result -= currentValue;
    } else {
      result += currentValue;
    }

    prevValue = currentValue;
  }

  return result;
};

// Extracts the first Roman numeral from a string and converts it to a number.
// Used to allow searching for buildings with Roman numeral names (e.g., "II", "III").
const extractRomanNumeralValue = (str: string): number | null => {
  const pattern = /\b(I|II|III|IV|V|VI|VII|VIII|IX|X)(?!\.|[a-zA-Z])/i;
  const matches = str.match(pattern);

  if (!matches || matches.length === 0) {
    return null;
  }

  const firstRomanNumeral = matches[0].toUpperCase();

  return romanToNumber(firstRomanNumeral);
};

const buildSearchableName = (building: BuildingProps): string => {
  let searchName = `${building.name} ${building.name_en}`;

  const numberValue = extractRomanNumeralValue(building.name_en);

  if (numberValue) {
    searchName += ` ${numberValue}`;
  }

  return searchName;
};

const searchOptions = {
  unicode: true,
  interSplit: "[^\\p{L}\\d']+",
  intraSplit: '\\p{Ll}\\p{Lu}',
  intraBound: '\\p{L}\\d|\\d\\p{L}|\\p{Ll}\\p{Lu}',
  intraChars: "[\\p{L}\\d']",
  intraContr: "'\\p{L}{1,2}\\b",
};
const searcher = new uFuzzySearch(searchOptions);

// Preload building data for search
const campusToBuilding: Record<CampusName, BuildingProps[]> = {
  sinchon: getBuildingsForCampus('sinchon'),
  songdo: getBuildingsForCampus('songdo'),
  mirae: getBuildingsForCampus('mirae'),
};

// Preload building names for search
const campusToSearchableNames: Record<CampusName, string[]> = {
  sinchon: campusToBuilding.sinchon.map(buildSearchableName),
  songdo: campusToBuilding.songdo.map(buildSearchableName),
  mirae: campusToBuilding.mirae.map(buildSearchableName),
};

export const filterBuildingsForCampus = (campus: CampusName, query: string) => {
  const buildings = campusToBuilding[campus] || [];
  const names = campusToSearchableNames[campus] || [];
  const ids = searcher.filter(names, query);
  return ids ? ids.map((i) => buildings[i]) : buildings;
};
