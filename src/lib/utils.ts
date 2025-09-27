import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getLongestLineLengthForMaxLines(
  phrase: string,
  maxLines: number,
) {
  const words = phrase.split(' ');

  function canFit(lineLength: number) {
    let linesUsed = 1;
    let currentLineLength = 0;

    for (const word of words) {
      if (word.length > lineLength) {
        return false;
      }

      if (currentLineLength === 0) {
        currentLineLength = word.length;
      } else if (currentLineLength + 1 + word.length <= lineLength) {
        currentLineLength += 1 + word.length;
      } else {
        linesUsed++;
        currentLineLength = word.length;
      }

      if (linesUsed > maxLines) {
        return false;
      }
    }

    return true;
  }

  let low = Math.max(...words.map((w) => w.length));
  let high = phrase.length;
  let best = high;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);

    if (canFit(mid)) {
      best = mid;
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }

  return best;
}
