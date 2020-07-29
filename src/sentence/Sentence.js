'use strict';

const { validateOptions, validateTemplates, validateVocabulary } = require('../validator');

module.exports = class Sentence {
  constructor(templates, vocab, options) {
    this.setOptions(options);
    this.setTemplates(templates);
    this.setVocab(vocab);
    this.generate();
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
    const matches = this.findMasks(template);

    let sentence = template;
    for (const match of matches) {
      sentence = sentence.replace(match, this.resolveWord(match));
    }

    if (this.forceNewSentence
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
   * Returns masks/placeholders in the given template string
   * @param {string} template
   *
   * 'This is {a-adjective} example.' => ['{a-adjective}']
   */
  findMasks(template) {
    return template.match(/([{]+(\s*([a-z-0-9])*,?\s*)*[}]+)/gi);
  }

  /**
   * Returns keys found in the given mask/placeholder
   * @param {string} mask
   * '{a-adjective, a-curse, verb}' => ['a-adjective', 'a-curse', 'verb']
   */
  findKeys(mask) {
    return mask.replace(/{|}|\s/g, '').split(',');
  }

  /**
   * Returns a random word from a pool of alternatives depending on the given mask/placeholder
   * @param {string} mask
   */
  resolveWord(mask) {
    const keys = this.findKeys(mask);
    const alternatives = this.resolveAlternatives(keys);
    return alternatives.any();
  }

  /**
   * Returns an array of alternatives depending on the given mask/placeholder
   * @param {string} mask
   */
  resolveAlternatives(keys) {
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

  get templates() {
    return this.templates;
  }

  get vocabulary() {
    return this.vocab;
  }

  get options() {
    return this.options;
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
      preserveCurlyBrackets
    } = validateOptions(options);

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
      preserveCurlyBrackets: {
        value: preserveCurlyBrackets
      }
    });
  }

  setTemplates(templates) {
    Object.defineProperty(this, 'templates', {
      value: this.allowDuplicates ? validateTemplates(templates) : validateTemplates(templates).unique(),
      writable: true,
    });
  }

  setVocab(vocabulary) {
    Object.defineProperty(this, 'vocab', {
      value: validateVocabulary(vocabulary),
      writable: true,
    });
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
        for (const mask of this.findMasks(theOnlyTemplate)) {
          const alternatives = this.resolveAlternatives(this.findKeys(mask));
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

