export const articleAndPluralize = (a_an: boolean, plural: boolean, w: string): string => {
  return `${a_an ? isVowel(w[0]) ? 'an ' : 'a ' : ''}${w}${plural ? 's' : ''}`;
};

export const capitalize = (str: string): string => str.replace(/^[']*(\w)/, c => c.toUpperCase());

export const isVowel = (c: string): boolean => ['a', 'e', 'i', 'o', 'u'].includes(c);
