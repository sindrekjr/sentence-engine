import { validateOptions, validateTemplates, validateVocabulary } from '../validator';

export default class Sentence {
  initialized: boolean = false;
  
  templates!: string[];
  vocab!: Vocabulary;
  options!: Options;
  
  sentence: string = '';

  constructor(templates: string[] | string, vocab: Vocabulary, options: Options) {
    this.setOptions(options);
    this.setTemplates(templates);
    this.setVocab(vocab);
    this.generate();
    this.initialized = true;
  }  

  /**
   * Returns the generated sentence, most uses will only ever require this method
   */
  get(): string {
    return this.sentence;
  }

  /**
   * May be called repeatedly to randomly regenerate the sentence
   */
  generate(): Sentence {
    const template = this.templates.any();
    const matches = this.findPlaceholders(template);

    let sentence = template;
    if(matches) {
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

  /**
   * Returns placeholders in the given template string
   * @param {string} template
   * 'This is {a-adjective} example.' => ['{a-adjective}']
   */
  findPlaceholders(template: string): RegExpMatchArray | null {
    const { start, end } = this.options.placeholderNotation;
    const regex = new RegExp(`([${start}]+(\\s*([a-z-0-9])*,?\\s*)*[${end}]+)`, 'gi');
    return template.match(regex);
  }

  /**
   * Returns a random word from a pool of alternatives depending on the given placeholder
   * @param {string} placeholder
   */
  resolveWord(placeholder: string, shouldCapitalize: boolean = false): string {
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
  resolveAlternatives(placeholder: string): string[] {
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
        if (Object.keys(this.vocab).includes(trimmed)) {
          plural = true;
          key = trimmed;
        }
      }

      return articleAndPluralize(a_an, plural, this.vocab[key]);
    });
    }

  /**
   * Returns keys found in the given placeholder
   * @param {string} placeholder
   * '{a-adjective, a-curse, verb}' => ['a-adjective', 'a-curse', 'verb']
   */
  findKeys(placeholder: string): string[] {
    const { start, end } = this.options.placeholderNotation;
    return placeholder.replace(new RegExp(`${start}|${end}|\\s`, 'g'), '').split(',');
  }

  addTemplates(...templates: string[]): void {
    this.setTemplates(this.templates.concat(templates.flat()));
  }

  addVocab(vocab: Vocabulary): void {
    this.setVocab(Object.assign(this.vocab, vocab));
  }

  setOptions(options: Options): void {
    const {
      allowDuplicates,
      capitalize,
      forceNewSentence,
      placeholderNotation,
      preservePlaceholderNotation,
    } = this.initialized
      ? validateOptions(options, this.options)
      : validateOptions(options);

    Object.defineProperties(this, {
      allowDuplicates: {
        value: allowDuplicates
      },
      capitalize: {
        value: capitalize
      },
      forceNewSentence: {
        value: forceNewSentence
      },
      placeholderNotation: {
        value: this.parsePlaceholderNotation(placeholderNotation)
      },
      preservePlaceholderNotation: {
        value: preservePlaceholderNotation
      }
    });
  }

  setTemplates(templates: string[] | string): void {
    const { allowDuplicates } = this.options;
    Object.defineProperty(this, 'templates', {
      value: allowDuplicates ? validateTemplates(templates) : validateTemplates(templates).unique(),
      writable: true,
    });
  }

  setVocab(vocabulary: Vocabulary): void {
    Object.defineProperty(this, 'vocab', {
      value: validateVocabulary(vocabulary),
      writable: true,
    });
  }

  parsePlaceholderNotation(notation: string | { start: string; end: string; }): { start: string; end: string; } {
    if (typeof notation === 'string') {
      const splitBySpace = notation.split(' ');
      return {
        start: splitBySpace[0],
        end: splitBySpace[1],
      };
    }
    return notation;
  }

  shouldCapitalize(sentence: string, placeholder: string): boolean {
    const { capitalize } = this.options;
    if (capitalize) {
      const index = sentence.indexOf(placeholder);
      const findPunctuationRegex = /[.!?:]+[\s]*$/;
      return index === 0 || findPunctuationRegex.test(sentence.substr(0, index));
    }
    return false;
  }

  isValidKey(key: string | number): boolean {
    return key in this.vocab;
  }

  isforceNewSentencePossible(): boolean {
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
};

const articleAndPluralize = (a_an: boolean, plural: boolean, words: string[]): string[] => {
  return words.map(w => `${a_an ? isVowel(w[0]) ? 'an ' : 'a ' : ''}${w}${plural ? 's' : ''}`);
};

const capitalize = (str: string): string => str.replace(/^[']*(\w)/, c => c.toUpperCase());

const isVowel = (c: string): boolean => ['a', 'e', 'i', 'o', 'u'].includes(c);
