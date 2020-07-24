'use strict';

const defaults = require('../defaults');
const { merge } = require('lodash');

module.exports = class Sentence {
  constructor(
    templates = defaults.templates,
    vocab = defaults.vocabulary,
    options = defaults.options
  ) {
    Object.defineProperties(this, {
      templates: {
        value: Array.isArray(templates) ? templates : [templates]
      },
      vocab: {
        value: vocab
      }
    });

    this.setOptions(options);
    this.generate();
  }

  /**
   * get()
   * 
   * Returns the generated sentence, most uses will only ever require this method
   */
  get() {
    return this.sentence;
  }

  /**
   * generate() 
   * 
   * May be called repeatedly to randomly regenerate the sentence
   */
  generate() {
    const template = this.templates.any();
    const matches = this.findMasks(template);

    let sentence = template;
    for(const match of matches) {
      sentence = sentence.replace(match, this.resolveWord(match));
    }

    if(this.forceDifference
      && this.sentence === sentence
      && this.isForceDifferencePossible()
    ) {
      this.generate();
    } else {
      Object.defineProperty(this, 'sentence', {
        value: sentence,
        configurable: true,
      });
    }
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
      if(key.substr(0, 2) == 'a-') {
        a_an = true;
        key = key.slice(2);
      }

      let plural = false;
      if(key.slice(-2) === '-s') {
        const trimmed = key.substr(0, key.length - 2);
        if(Object.keys(this.vocab).includes(trimmed)) {
          plural = true;
          key = trimmed;
        }
      }

      if(this.isValidKey(key)) return articleAndPluralize(a_an, plural, this.vocab[key]);
    }).flat();    
  }

  addTemplates(...templates) {
    this.templates = this.templates.concat(templates.flat());
  }
  addVocab(vocab) {
    merge(this.vocab, vocab);
  }

  setOptions(options) {
    const mergeWithDefaults = { ...defaults.options, ...options };
    const {
      allowDuplicates,
      capitalize,
      forceDifference,
      preserveCurlyBrackets
    } = mergeWithDefaults;

    Object.defineProperties(this, {
      allowDuplicates: {
        value: allowDuplicates
      },
      capitalize: {
        value: capitalize
      },
      forceDifference: {
        value: forceDifference
      },
      preserveCurlyBrackets: {
        value: preserveCurlyBrackets
      }
    });
  }

  isValidKey(key) {
    return key in this.vocab;
  }

  isForceDifferencePossible() {
    if(this.templates.length > 1) {
      return true;
    } else {
      const theOnlyTemplate = this.templates[0];
      if(theOnlyTemplate) {
        for(const mask of this.findMasks(theOnlyTemplate)) {
          const alternatives = this.resolveAlternatives(this.findKeys(mask));
          if(alternatives.length > 1) return true;
        }
      }
    }
    return false; 
  }
};



const articleAndPluralize = (a_an, plural, words) => {
  return words.map(w => `${a_an ? isVowel(w[0]) ? 'an ' : 'a ' : ''}${w}${plural ? 's' : ''}`);
}

const isVowel = c => {
  c = c.toLowerCase();
  return ['a', 'e', 'i', 'o', 'u'].includes(c);
};

Array.prototype.any = function() {
  return this[Math.floor(Math.random() * this.length)];
};
