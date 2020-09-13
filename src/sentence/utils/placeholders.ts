// eslint-disable-next-line no-unused-vars
import { PlaceholderNotation } from '../../../types';

export const parsePlaceholderNotation = (notation: string): PlaceholderNotation => {
  if (typeof notation === 'string') {
    const splitBySpace = notation.split(' ');
    return {
      start: splitBySpace[0],
      end: splitBySpace[1],
    };
  }
  return notation;
};

export const escapeSpecialCharacters = (string: string): string => string.replace(/([\[\]])/g, '\\$1');