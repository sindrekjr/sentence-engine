// eslint-disable-next-line no-unused-vars
import { WeightedEntry } from '../../../types';

export const getTotalWeightOfEntries = (entries: WeightedEntry[]): number => entries.reduce((acc, e) => e ? acc + e.weight : acc, 0);

export const mapToWeightedEntryArray = (entries: [], defaultWeight: number = 1): WeightedEntry[] => {
  return entries.map<WeightedEntry>(element => {
    const { entry, weight } = (typeof element === 'object') ? element : {
      entry: element,
      weight: 1,
    };
    return {
      entry: entry,
      weight: weight || defaultWeight,
    };
  }).filter((weightedEntry, index, newArray) => {
    const indexOfDuplicate = newArray.slice(0, index).findIndex(el => el.entry === weightedEntry.entry);
    if (indexOfDuplicate >= 0) {
      newArray[indexOfDuplicate].weight += weightedEntry.weight;
      return false;
    }
    return true;
  });
};

export const pickRandomEntryByWeight = (entries: WeightedEntry[]): string => {
  const totalWeight = getTotalWeightOfEntries(entries);
  let math = Math.floor((Math.random() * totalWeight) + 1);
  const { entry } = entries.find(entry => {
    math -= entry.weight;
    return math <= 0;
  }) as WeightedEntry;
  return typeof entry === 'string' ? entry : entry();
};
