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

  generate() {
    const template = this.templates.any();
    const matches = this.findMasks(template);

    let sentence = template;
    for(let match of matches) {
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

  findMasks(template) {
    return template.match(/([{]+(\s*([a-z-0-9])*,?\s*)*[}]+)/gi);
  }

  resolveWord(mask) {
    let alternatives = [];
    let keys = mask.replace(/{|}|\s/g, '').split(',');

    for(let key of keys) {
      alternatives = alternatives.concat(this.findAlternatives(key));
    }

    let word = alternatives.any();

    return word;
  }

  findAlternatives(key) {
    let a_an = false;
    if(key.substr(0, 2) == 'a-') {
      a_an = true;
      key = key.slice(2);
    }

    let plural = false;
    if(key.slice(-2) === '-s') {
      let trimmed = key.substr(0, key.length - 2);
      if(Object.keys(this.vocab).includes(trimmed)) {
        plural = true;
        key = trimmed;
      }
    }

    return this.vocab[key]
      ? this.articleAndPluralize(a_an, plural, this.vocab[key])
      : [];
  }

  articleAndPluralize(a_an, plural, words) {
    return words.map(w => `${a_an ? isVowel(w[0]) ? 'an ' : 'a ' : ''}${w}${plural ? 's' : ''}`);
  }

  isForceDifferencePossible() {
    if(this.templates.length > 1) {
      return true;
    } else {
      const theOnlyTemplate = this.templates[0];
      if(theOnlyTemplate) {
        for(let mask of this.findMasks(theOnlyTemplate)) {
          let keys = mask.replace(/{|}|\s/g, '').split(',');
          let alternatives = [];
          for(let key of keys) {
            alternatives = alternatives.concat(this.findAlternatives(key));
          }
          if(alternatives.length > 1) return true;
        }
      }
    }
    return false; 
  }

  get() {
    return this.sentence;
  }

  /**
     * Adders
     */
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
};

function isVowel(c) {
  c = c.toLowerCase();
  return ['a', 'e', 'i', 'o', 'u'].includes(c);
}

Array.prototype.any = function() {
  return this[Math.floor(Math.random() * this.length)];
};
