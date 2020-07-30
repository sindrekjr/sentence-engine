'use strict';

const { validateOptions, validateTemplates, validateVocabulary } = require('../validator');

module.exports = class Sentence {
  constructor(templates, vocab, options) {
    this.setOptions(options);
    this.setTemplates(templates);
    this.setVocab(vocab);
    this.generate();
    this.initialized = true;
  }

  /**
   * Returns the generated sentence, most uses will only ever require this method
   */
  get() {
    return this.sentence;
  }

  /**
   * May be called repeatedly to randomly regenerate the sentence
   */
  generate() {
    const template = this.templates.any();
    const matches = this.findPlaceholders(template);

    let sentence = template;
    for (const match of matches) {
      const replacement = this.resolveWord(match, this.shouldCapitalize(sentence, match));
      sentence = sentence.replace(match, replacement);
    }

    const { forceNewSentence } = this.options;
    if (forceNewSentence
      && this.sentence === sentence
      && this.isforceNewSentencePossible()
    ) {
      this.generate();
    } else {
      Object.defineProperty(this, 'sentence', {
        value: sentence,
        configurable: true,
      });
    }

    return this;
  }

  /**
   * Returns placeholders in the given template string
   * @param {string} template
   * 'This is {a-adjective} example.' => ['{a-adjective}']
   */
  findPlaceholders(template) {
    const { start, end } = this.options.placeholderNotation;
    const regex = new RegExp(`([${start}]+(\\s*([a-z-0-9])*,?\\s*)*[${end}]+)`, 'gi');
    return template.match(regex);
  }

  /**
   * Returns a random word from a pool of alternatives depending on the given placeholder
   * @param {string} placeholder
   */
  resolveWord(placeholder, shouldCapitalize = false) {
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
  resolveAlternatives(placeholder) {
    const keys = this.findKeys(placeholder);
    return keys.map(key => {
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

      if (this.isValidKey(key)) return articleAndPluralize(a_an, plural, this.vocab[key]);
    }).flat();
  }

  /**
   * Returns keys found in the given placeholder
   * @param {string} placeholder
   * '{a-adjective, a-curse, verb}' => ['a-adjective', 'a-curse', 'verb']
   */
  findKeys(placeholder) {
    const { start, end } = this.options.placeholderNotation;
    return placeholder.replace(new RegExp(`${start}|${end}|\\s`, 'g'), '').split(',');
  }

  get templates() {
    return this.templates;
  }

  get vocabulary() {
    return this.vocab;
  }

  get options() {
    return {
      allowDuplicates: this.allowDuplicates,
      capitalize: this.capitalize,
      forceNewSentence: this.forceNewSentence,
      placeholderNotation: this.placeholderNotation,
      preservePlaceholderNotation: this.preservePlaceholderNotation,
    };
  }

  addTemplates(...templates) {
    this.setTemplates(this.templates.concat(templates.flat()));
  }

  addVocab(vocab) {
    this.setVocab(Object.assign(this.vocab, vocab));
  }

  setOptions(options) {
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

  setTemplates(templates) {
    const { allowDuplicates } = this.options;
    Object.defineProperty(this, 'templates', {
      value: allowDuplicates ? validateTemplates(templates) : validateTemplates(templates).unique(),
      writable: true,
    });
  }

  setVocab(vocabulary) {
    Object.defineProperty(this, 'vocab', {
      value: validateVocabulary(vocabulary),
      writable: true,
    });
  }

  parsePlaceholderNotation(notation) {
    if (notation.start && notation.end) {
      return notation;
    } else {
      const splitBySpace = notation.split(' ');
      return {
        start: splitBySpace[0],
        end: splitBySpace[1],
      };
    }
  }

  shouldCapitalize(sentence, placeholder) {
    const { capitalize } = this.options;
    if (capitalize) {
      const index = sentence.indexOf(placeholder);
      const findPunctuationRegex = /[.!?:]+[\s]*$/;
      return index === 0 || findPunctuationRegex.test(sentence.substr(0, index));
    }
    return false;
  }

  isValidKey(key) {
    return key in this.vocab;
  }

  isforceNewSentencePossible() {
    if (this.templates.length > 1) {
      return true;
    } else {
      const theOnlyTemplate = this.templates[0];
      if (theOnlyTemplate) {
        for (const placeholder of this.findPlaceholders(theOnlyTemplate)) {
          const alternatives = this.resolveAlternatives(placeholder);
          if (alternatives.length > 1) return true;
        }
      }
    }
    return false;
  }
};

const articleAndPluralize = (a_an, plural, words) => {
  return words.map(w => `${a_an ? isVowel(w[0]) ? 'an ' : 'a ' : ''}${w}${plural ? 's' : ''}`);
};

const capitalize = (str) => str.replace(/^[']*(\w)/, c => c.toUpperCase());

const isVowel = c => {
  c = c.toLowerCase();
  return ['a', 'e', 'i', 'o', 'u'].includes(c);
};

Array.prototype.any = function() {
  return this[Math.floor(Math.random() * this.length)];
};

Array.prototype.unique = function () {
  const a = this.concat();
  for (let i = 0; i < a.length; ++i) {
    for (let j = i + 1; j < a.length; ++j) {
      if (a[i] === a[j]) a.splice(j--, 1);
    }
  }

  return a;
};

