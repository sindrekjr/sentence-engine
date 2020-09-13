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
} from '../../types';
/* eslint-enable no-unused-vars */

import defaults from '../defaults';
import {
  articleAndPluralize,
  capitalize,
} from './utils/format';

import {
  findKeysInPlaceholder,
  findPlaceholdersByNotation,
  parsePlaceholderNotation,
} from './utils/placeholder';

import {
  mapToWeightedEntryArray,
  pickRandomEntryByWeight,
} from './utils/array';

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
      options.placeholderNotation = parsePlaceholderNotation(placeholderNotation);
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
      sentence = pickRandomEntryByWeight(this.weightedTemplates);
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

  /**
   * Returns placeholders in the given template string
   * @param {string} template
   * 'This is {a-adjective} example.' => ['{a-adjective}']
   */
  private findPlaceholders(template: string): RegExpMatchArray | null {
    const { placeholderNotation } = this.options as DefinitelyOptions;
    return findPlaceholdersByNotation(template, placeholderNotation);
  }

  /**
   * Returns a random word from a pool of alternatives depending on the given placeholder
   * @param {string} placeholder
   */
  private resolveWord(placeholder: string, shouldCapitalize: boolean = false): string {
    const alternatives = this.resolveAlternatives(placeholder);
    const chosenWord = shouldCapitalize ? capitalize(pickRandomEntryByWeight(alternatives)) : pickRandomEntryByWeight(alternatives);

    const { placeholderNotation, preservePlaceholderNotation } = this.options as DefinitelyOptions;
    if (preservePlaceholderNotation) {
      const { start, end } = placeholderNotation;
      return `${start}${chosenWord}${end}`;
    } else {
      return chosenWord;
    }
  }

  /**
   * Returns an array of alternatives depending on the given placeholder
   * @param {string} placeholder
   */
  private resolveAlternatives(placeholder: string): WeightedEntry[] {
    const { placeholderNotation } = this.options as DefinitelyOptions;
    const keys = findKeysInPlaceholder(placeholder, placeholderNotation);
    return keys.flatMap<WeightedEntry>(key => {
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

      if (!this.isValidKey(key)) return [];
      return this.weightedVocabulary[key].map(vocabEntry => {
        const { entry, weight } = vocabEntry;
        const resolvedEntry = typeof entry === 'string' ? entry : entry();
        return {
          entry: articleAndPluralize(a_an, plural, resolvedEntry),
          weight: weight,
        };
      });
    });
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
      const theOnlyTemplate = pickRandomEntryByWeight(this.weightedTemplates);
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
