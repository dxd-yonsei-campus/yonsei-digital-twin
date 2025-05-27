function romanToNumber(roman: string): number {
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
}

// Extracts the first Roman numeral from a string and converts it to a number.
// Used to allow searching for buildings with Roman numeral names (e.g., "II", "III").
export function extractRomanNumeralValue(str: string): number | null {
  const pattern = /\b(I|II|III|IV|V|VI|VII|VIII|IX|X)(?!\.|[a-zA-Z])/i;
  const matches = str.match(pattern);

  if (!matches || matches.length === 0) {
    return null;
  }

  const firstRomanNumeral = matches[0].toUpperCase();

  return romanToNumber(firstRomanNumeral);
}
