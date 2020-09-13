// eslint-disable-next-line no-unused-vars
import { PlaceholderNotation, StringResolvable } from '../../../types';

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

export const findPlaceholdersByNotation = (template: StringResolvable, placeholderNotation: PlaceholderNotation): RegExpMatchArray | null => {
  const { start, end } = placeholderNotation;
  const regex = new RegExp(`([${escapeSpecialCharacters(start)}]+(\\s*([a-z-0-9])*,?\\s*)*[${escapeSpecialCharacters(end)}]+)`, 'gi');
  return (typeof template === 'string') ? template.match(regex) : template().match(regex);
};
