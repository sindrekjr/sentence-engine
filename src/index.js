'use strict';

const defaults = require('./defaults');
const Sentence = require('./sentence');
const { cloneDeep, merge } = require('lodash');

/**
 * Variables to store standard settings for the sentence engine
 * The standard settings can be changed by the user
 */
let standardTemplates, standardVocabulary, standardOptions;

/**
 * The function exported as the interface for the package
 */
function SentenceInterface(template, vocabulary, options) {
  if(template 
    && Object.prototype.toString.call(template) !== '[object String]'
    && Object.prototype.toString.call(template[0]) !== '[object String]'
  ) {
    throw new TypeError('Argument "template" was expected to be a string or array containing a string.');
  }

  if(vocabulary && Object.prototype.toString.call(vocabulary) !== '[object Object]') {
    throw new TypeError('Argument "vocabulary" was expected to be an object.');
  }

  if(options) {
    if(Object.prototype.toString.call(options) !== '[object Object]') {
      throw new TypeError('Argument "options" was expected to be an object.');
    } else {
      options = Object.assign(cloneDeep(standardOptions), options);
    }
  }

  return new Sentence(
    template || standardTemplates,
    vocabulary || standardVocabulary,
    options || standardOptions
  );
}

/**
 * Assign a set of public utility methods to the interface
 */
Object.assign(SentenceInterface, {
  /**
     * Adders
     */
  addTemplates(...templates) {
    this.setTemplates(standardTemplates.concat(templates.flat()));
  },
  addVocab(vocab) {
    merge(standardVocabulary, vocab);
  },

  /**
     * Getters
     */
  getTemplates() {
    return standardTemplates;
  },
  getVocab() {
    return standardVocabulary;
  },
  getOptions() {
    return standardOptions;
  },

  /**
     * Setters
     */
  setTemplates(...templates) {
    templates = templates.flat();
    standardTemplates = templates.length ? templates : [...defaults.templates];
  },
  setVocab(vocab) {
    standardVocabulary = vocab || cloneDeep(defaults.vocabulary);
  },
  setOptions(options) {
    standardOptions = options ? Object.assign(standardOptions, options) : cloneDeep(defaults.options);
  }
});

// Call setters to initialize standard settings
SentenceInterface.setTemplates();
SentenceInterface.setVocab();
SentenceInterface.setOptions();

// Export the interface
module.exports = SentenceInterface;
