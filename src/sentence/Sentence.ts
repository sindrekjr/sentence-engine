const defaultOptions: Options = {
  allowDuplicates: true,
  capitalize: true,
  forceNewSentence: false,
  placeholderNotation: {
    start: '{',
    end: '}'
  },
  preservePlaceholderNotation: false,
};

export class Sentence {
  #templates: WeightedTemplate[] = [];
  #vocabulary: WeightedVocabulary = {};
  #options: Options = defaultOptions;

  public value: string = '';

  constructor(
    templates: Template[] | Template,
    vocabulary: Vocabulary,
    options?: MaybeOptions,
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
    this.templates = templates.concat(this.templates);
  }

  public addVocab(vocab: Vocabulary): void {
    this.vocabulary = Object.assign(this.vocabulary, vocab);
  }

  public restoreDefaultOptions(): void {
    this.options = defaultOptions;
  }

  public get options(): MaybeOptions {
    return this.#options;
  }

  public set options(options: MaybeOptions) {
    const { placeholderNotation } = options;
    if (placeholderNotation && typeof placeholderNotation == 'string') {
      options.placeholderNotation = this.parsePlaceholderNotation(placeholderNotation);
    }
    this.#options = {
      ...this.options,
      ...options,
    } as Options;
  }

  public get templates(): Template[] {
    return this.#templates.map(template => template.entry);
  }

  public get weightedTemplates(): WeightedTemplate[] {
    return this.#templates;
  }

  public set templates(templates: Template[]) {
    const { allowDuplicates } = this.options;
    this.#templates = templates.map(toResolveWithWeight => {
      const defaultWeight = 1;
      if (typeof toResolveWithWeight === 'object') {
        const { entry, weight } = toResolveWithWeight;
        return {
          entry: entry,
          weight: weight || defaultWeight,
        };
      } else {
        return {
          entry: toResolveWithWeight,
          weight: defaultWeight,
        };
      }
    });

    if (!allowDuplicates) {
      this.#templates = this.#templates.filter((toInspect, i) => {
        return !this.templates.slice(0, i).includes(toInspect.entry);
      });
    }
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
      const values: [] = vocab[key] as [];
      weightedVocabulary[key] = values.map<WeightedEntry>(vocabEntry => {
        return typeof vocabEntry === 'object'
          ? vocabEntry
          : {
            entry: vocabEntry,
            weight: 1,
          };
      });
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
    const { placeholderNotation } = this.options as Options;
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

    const { placeholderNotation, preservePlaceholderNotation } = this.options as Options;
    if (preservePlaceholderNotation) {
      const { start, end } = placeholderNotation;
      return `${start}${chosenWord}${end}`;
    } else {
      return chosenWord;
    }
  }

  private pickRandomEntryByWeight(entries: WeightedEntry[]): string {
    const totalWeight = entries.reduce((acc, entry) => entry ? acc + entry.weight : acc, 0);
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
    const { placeholderNotation } = this.options as Options;
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

const articleAndPluralize = (a_an: boolean, plural: boolean, w: string): string => {
  return `${a_an ? isVowel(w[0]) ? 'an ' : 'a ' : ''}${w}${plural ? 's' : ''}`;
};

const capitalize = (str: string): string => str.replace(/^[']*(\w)/, c => c.toUpperCase());

const isVowel = (c: string): boolean => ['a', 'e', 'i', 'o', 'u'].includes(c);

Array.prototype.any = function() {
  return this[Math.floor(Math.random() * this.length)];
};

Array.prototype.unique = function() {
  const a = this.concat();
  for (let i = 0; i < a.length; ++i) {
    for (let j = i + 1; j < a.length; ++j) {
      if (a[i] === a[j]) a.splice(j--, 1);
    }
  }
  return a;
};
