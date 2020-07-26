'use strict';

const defaults = require('../defaults');

const Validator = {
  options: defaults.options,
  templates: defaults.templates,
  vocabulary: defaults.vocabulary,

  validateOptions: (options, alt = this.options) => validateOptions(options, alt),
  validateTemplates: (templates, alt = this.templates) => validateTemplates(templates, alt),
  validateVocabulary: (vocabulary, alt = this.vocabulary) => validateVocabulary(vocabulary, alt)
};

const validateOptions = (options, alt = defaults.options) => {
  const mergedWithDefaultOptions = { ...defaults.options, ...alt };
  if(options) {
    if(Object.prototype.toString.call(options) === '[object Object]') {
      return { ...mergedWithDefaultOptions, ...options };
    } else {
      throw new TypeError('Options is expected to be an object.');
    }
  }
  return mergedWithDefaultOptions;
};

const validateTemplates = (templates, alt = defaults.templates) => {
  if(templates) {
    if(Object.prototype.toString.call(templates) === '[object String]') {
      return [templates];
    } else if(Object.prototype.toString.call(templates[0]) === '[object String]') {
      return templates;
    } else {
      throw new TypeError('Templates are expected to be a string or array of strings.');
    }
  }
  return alt;
};

const validateVocabulary = (vocabulary, alt = defaults.vocabulary) => {
  if(vocabulary) {
    if(Object.prototype.toString.call(vocabulary) === '[object Object]') {
      return vocabulary;
    } else {
      throw new TypeError('Vocabulary is expected to be an object.');
    }
  }
  return alt;
};

module.exports = {
  Validator,
  validateOptions,
  validateTemplates,
  validateVocabulary,
};
