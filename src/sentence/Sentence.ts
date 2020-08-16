const defaultOptions = {
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
  #templates: Template[] = [];
  #vocabulary: Vocabulary = {};
  #options: Options = defaultOptions;

  public sentence: string = '';

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
    if (options) this.setOptions(options);
    if (templates) this.templates = templates;
    if (vocabulary) this.vocabulary = vocabulary;
  }

  public addTemplates(...templates: Template[]): void {
    this.templates = this.templates.concat(...templates.flat());
  }

  public addVocab(vocab: Vocabulary): void {
    this.vocabulary = Object.assign(this.vocabulary, vocab);
  }

  public setOptions(options: MaybeOptions): void {
    const { placeholderNotation } = options;
    if (placeholderNotation) {
      options.placeholderNotation = this.parsePlaceholderNotation(placeholderNotation);
    }
    this.#options = {
      ...this.options,
      ...options,
    } as Options;
  }

  public restoreDefaultOptions(): void {
    this.#options = defaultOptions;
  }

  public get options(): Options {
    return this.#options;
  }

  public get templates(): Template[] {
    return this.#templates;
  }

  public set templates(templates: Template[]) {
    const { allowDuplicates } = this.options;
    this.#templates = allowDuplicates ? templates : templates.unique();
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
    return this.sentence;
  }

  /**
   * May be called repeatedly to randomly regenerate the sentence
   */
  public generate(): Sentence {
    const template = this.templates.any();
    const matches = this.findPlaceholders(template);

    let sentence = template;
    if (matches) {
      for (const match of matches) {
        const replacement = this.resolveWord(match, this.shouldCapitalize(sentence, match));
        sentence = sentence.replace(match, replacement);
      }
    }

    const { forceNewSentence } = this.options;
    if (forceNewSentence
      && this.sentence === sentence
      && this.isforceNewSentencePossible()
    ) {
      return this.generate();
    } else {
      this.sentence = sentence;
      return this;
    }
  }

  private parsePlaceholderNotation(notation: string | { start: string; end: string; }): { start: string; end: string; } {
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
  private findPlaceholders(template: string): RegExpMatchArray | null {
    const { start, end } = this.options.placeholderNotation;
    const regex = new RegExp(`([${start}]+(\\s*([a-z-0-9])*,?\\s*)*[${end}]+)`, 'gi');
    return template.match(regex);
  }

  /**
   * Returns a random word from a pool of alternatives depending on the given placeholder
   * @param {string} placeholder
   */
  private resolveWord(placeholder: string, shouldCapitalize: boolean = false): string {
    const alternatives = this.resolveAlternatives(placeholder);
    const chosenWord = shouldCapitalize ? capitalize(alternatives.any()) : alternatives.any();

    const { placeholderNotation, preservePlaceholderNotation } = this.options;
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

      return articleAndPluralize(a_an, plural, this.vocabulary[key]);
    });
  }

  /**
   * Returns keys found in the given placeholder
   * @param {string} placeholder
   * '{a-adjective, a-curse, verb}' => ['a-adjective', 'a-curse', 'verb']
   */
  private findKeys(placeholder: string): string[] {
    const { start, end } = this.options.placeholderNotation;
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

  private isforceNewSentencePossible(): boolean {
    if (this.templates.length > 1) {
      return true;
    } else {
      const theOnlyTemplate = this.templates[0];
      if (theOnlyTemplate) {
        this.findPlaceholders(theOnlyTemplate)?.forEach(placeholder => {
          const alternatives = this.resolveAlternatives(placeholder);
          if (alternatives.length > 1) return true;
        });
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
