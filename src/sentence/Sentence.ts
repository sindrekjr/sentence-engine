/* eslint-disable no-unused-vars */
import {
  DefinitelyOptions,
  WeightedTemplate,
  WeightedVocabulary,
  Template,
  Vocabulary,
  Options,
  Configuration,
  WeightedEntry,
  StringResolvable,
  PlaceholderNotation
} from '../../types';
/* eslint-enable no-unused-vars */

import defaults from '../defaults';

export class Sentence {
  #templates: WeightedTemplate[] = [];
  #vocabulary: WeightedVocabulary = {};
  #options: DefinitelyOptions = defaults.options;

  public value: string = '';

  constructor(
    templates: Template[] | Template,
    vocabulary: Vocabulary,
    options?: Options,
  ) {
    this.configure({
      options: options,
      templates: [templates].flat(),
      vocabulary: vocabulary
    });
    this.generate();
  }

  public configure(config: Configuration) {
    const { options, templates, vocabulary } = config;
    if (options) this.options = options;
    if (templates) this.templates = templates;
    if (vocabulary) this.vocabulary = vocabulary;
  }

  public addTemplates(...templates: Template[]): void {
    this.templates = templates.concat(this.weightedTemplates);
  }

  public addVocabulary(vocab: Vocabulary): void {
    for (const key in vocab) {
      vocab[key] = (vocab[key] as []).concat(this.weightedVocabulary[key] as []);
    }
    this.vocabulary = Object.assign(this.weightedVocabulary, vocab);
  }

  public restoreDefaultOptions(): void {
    this.options = defaults.options;
  }

  public get options(): Options {
    return this.#options;
  }

  public set options(options: Options) {
    const { placeholderNotation } = options;
    if (placeholderNotation && typeof placeholderNotation == 'string') {
      options.placeholderNotation = this.parsePlaceholderNotation(placeholderNotation);
    }
    this.#options = {
      ...this.options,
      ...options,
    } as DefinitelyOptions;
  }

  public get templates(): Template[] {
    return this.#templates.map(template => template.entry);
  }

  public get weightedTemplates(): WeightedTemplate[] {
    return this.#templates;
  }

  public set templates(templates: Template[]) {
    this.#templates = mapToWeightedEntryArray(templates as []);
  }

  public get vocabulary(): Vocabulary {
    const vocab: Vocabulary = {};
    for (const key in this.#vocabulary) {
      const values: WeightedEntry[] = this.#vocabulary[key];
      vocab[key] = values.map<StringResolvable>(vocabEntry => vocabEntry.entry);
    }
    return vocab;
  }

  public get weightedVocabulary(): WeightedVocabulary {
    return this.#vocabulary;
  }

  public set vocabulary(vocab: Vocabulary) {
    const weightedVocabulary: WeightedVocabulary = {};
    for (const key in vocab) {
      weightedVocabulary[key] = mapToWeightedEntryArray(vocab[key] as []);
    }
    this.#vocabulary = weightedVocabulary;
  }

  /**
   * Returns the generated sentence, most uses will only ever require this method
   */
  public get(): string {
    return this.value;
  }

  /**
   * May be called repeatedly to randomly regenerate the sentence
   */
  public generate(): Sentence {
    const { forceNewSentence } = this.options;
    const shouldForceNewSentence = forceNewSentence && this.isForceNewSentencePossible();

    let sentence;
    do {
      sentence = this.pickRandomEntryByWeight(this.weightedTemplates);
      const matches = this.findPlaceholders(sentence);
      if (matches) {
        for (const match of matches) {
          const replacement = this.resolveWord(match, this.shouldCapitalize(sentence, match));
          sentence = sentence.replace(match, replacement);
        }
      }
    } while (sentence === this.value && shouldForceNewSentence);

    this.value = sentence;
    return this;
  }

  private parsePlaceholderNotation(notation: string): PlaceholderNotation {
    if (typeof notation === 'string') {
      const splitBySpace = notation.split(' ');
      return {
        start: splitBySpace[0],
        end: splitBySpace[1],
      };
    }
    return notation;
  }

  /**
   * Returns placeholders in the given template string
   * @param {string} template
   * 'This is {a-adjective} example.' => ['{a-adjective}']
   */
  private findPlaceholders(template: StringResolvable): RegExpMatchArray | null {
    const { placeholderNotation } = this.options as DefinitelyOptions;
    const { start, end } = placeholderNotation;
    const regex = new RegExp(`([${start}]+(\\s*([a-z-0-9])*,?\\s*)*[${end}]+)`, 'gi');
    return (typeof template === 'string') ? template.match(regex) : template().match(regex);
  }

  /**
   * Returns a random word from a pool of alternatives depending on the given placeholder
   * @param {string} placeholder
   */
  private resolveWord(placeholder: string, shouldCapitalize: boolean = false): string {
    const alternatives = this.resolveAlternatives(placeholder);
    const chosenWord = shouldCapitalize ? capitalize(this.pickRandomEntryByWeight(alternatives)) : this.pickRandomEntryByWeight(alternatives);

    const { placeholderNotation, preservePlaceholderNotation } = this.options as DefinitelyOptions;
    if (preservePlaceholderNotation) {
      const { start, end } = placeholderNotation;
      return `${start}${chosenWord}${end}`;
    } else {
      return chosenWord;
    }
  }

  private pickRandomEntryByWeight(entries: WeightedEntry[]): string {
    const totalWeight = getTotalWeightOfEntries(entries);
    let math = Math.floor((Math.random() * totalWeight) + 1);
    const { entry } = entries.find(entry => {
      math -= entry.weight;
      return math <= 0;
    }) as WeightedEntry;
    return typeof entry === 'string' ? entry : entry();
  }

  /**
   * Returns an array of alternatives depending on the given placeholder
   * @param {string} placeholder
   */
  private resolveAlternatives(placeholder: string): WeightedEntry[] {
    const keys = this.findKeys(placeholder);
    return keys.flatMap<WeightedEntry>(key => {
      if (!this.isValidKey(key)) return [];

      let a_an = false;
      if (key.substr(0, 2) == 'a-') {
        a_an = true;
        key = key.slice(2);
      }

      let plural = false;
      if (key.slice(-2) === '-s') {
        const trimmed = key.substr(0, key.length - 2);
        if (Object.keys(this.vocabulary).includes(trimmed)) {
          plural = true;
          key = trimmed;
        }
      }

      return this.resolveVocabularyEntries(this.weightedVocabulary[key]).map(vocabEntry => {
        const { entry, weight } = vocabEntry;
        return {
          entry: articleAndPluralize(a_an, plural, entry as string),
          weight: weight,
        };
      });
    });
  }

  private resolveVocabularyEntries(entries: WeightedEntry[]): WeightedEntry[] {
    return entries.map(weightedEntry => typeof weightedEntry.entry === 'string' ? weightedEntry : {
      entry: weightedEntry.entry(),
      weight: weightedEntry.weight,
    });
  }

  /**
   * Returns keys found in the given placeholder
   * @param {string} placeholder
   * '{a-adjective, a-curse, verb}' => ['a-adjective', 'a-curse', 'verb']
   */
  private findKeys(placeholder: string): string[] {
    const { placeholderNotation } = this.options as DefinitelyOptions;
    const { start, end } = placeholderNotation;
    return placeholder.replace(new RegExp(`${start}|${end}|\\s`, 'g'), '').split(',');
  }

  private shouldCapitalize(sentence: string, placeholder: string): boolean {
    const { capitalize } = this.options;
    if (capitalize) {
      const index = sentence.indexOf(placeholder);
      const findPunctuationRegex = /[.!?:]+[\s]*$/;
      return index === 0 || findPunctuationRegex.test(sentence.substr(0, index));
    }
    return false;
  }

  private isValidKey(key: string | number): boolean {
    return key in this.vocabulary;
  }

  private isForceNewSentencePossible(): boolean {
    if (this.templates.length > 1) {
      return true;
    } else {
      const theOnlyTemplate = this.pickRandomEntryByWeight(this.weightedTemplates);
      if (theOnlyTemplate) {
        return this.findPlaceholders(theOnlyTemplate)?.some(placeholder => {
          const alternatives = this.resolveAlternatives(placeholder);
          if (alternatives.length > 1) return true;
        }) || false;
      }
    }
    return false;
  }
}

export const articleAndPluralize = (a_an: boolean, plural: boolean, w: string): string => {
  return `${a_an ? isVowel(w[0]) ? 'an ' : 'a ' : ''}${w}${plural ? 's' : ''}`;
};

export const capitalize = (str: string): string => str.replace(/^[']*(\w)/, c => c.toUpperCase());

export const isVowel = (c: string): boolean => ['a', 'e', 'i', 'o', 'u'].includes(c);

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
