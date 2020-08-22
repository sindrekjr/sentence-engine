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
  #totalTemplatesWeight: number = 0;
  #vocabulary: Vocabulary = {};
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
    return this.#templates.map(template => template.template);
  }

  public get weightedTemplates(): WeightedTemplate[] {
    return this.#templates;
  }

  public set templates(templates: Template[]) {
    const { allowDuplicates } = this.options;
    this.#totalTemplatesWeight = 0;
    this.#templates = templates.map(toResolveWithWeight => {
      const defaultWeight = 1;
      if (typeof toResolveWithWeight === 'object') {
        const { template, weight } = toResolveWithWeight;
        this.#totalTemplatesWeight += weight || defaultWeight;
        return {
          template: template,
          weight: weight || defaultWeight,
        };
      } else {
        this.#totalTemplatesWeight++;
        return {
          template: toResolveWithWeight,
          weight: defaultWeight,
        };
      }
    });

    if (!allowDuplicates) {
      this.#templates = this.#templates.filter((toInspect, i) => {
        if (this.templates.slice(0, i).includes(toInspect.template)) {
          this.#totalTemplatesWeight -= toInspect.weight;
          return false;
        }
        return true;
      });
    }
  }

  public get vocabulary(): Vocabulary {
    return this.#vocabulary;
  }

  public set vocabulary(vocab: Vocabulary) {
    this.#vocabulary = vocab;
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
      sentence = this.pickRandomTemplate();
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

  private pickRandomTemplate(): string {
    let math = Math.floor((Math.random() * this.#totalTemplatesWeight) + 1);
    const { template } = this.#templates.find(template => {
      math -= template.weight;
      return math <= 0;
    }) as WeightedTemplate;
    return typeof template === 'string' ? template : template();
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
    const chosenWord = shouldCapitalize ? capitalize(alternatives.any()) : alternatives.any();

    const { placeholderNotation, preservePlaceholderNotation } = this.options as Options;
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
  private resolveAlternatives(placeholder: string): string[] {
    const keys = this.findKeys(placeholder);
    return keys.flatMap(key => {
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

      return articleAndPluralize(a_an, plural, this.resolveVocabularyEntries(this.vocabulary[key]));
    });
  }

  private resolveVocabularyEntries(entries: StringResolvable[]): string[] {
    return entries.map(entry => typeof entry === 'string' ? entry : entry());
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
      const theOnlyTemplate = this.pickRandomTemplate();
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

const articleAndPluralize = (a_an: boolean, plural: boolean, words: string[]): string[] => {
  return words.map(w => `${a_an ? isVowel(w[0]) ? 'an ' : 'a ' : ''}${w}${plural ? 's' : ''}`);
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
