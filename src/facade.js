'use strict';

const defaults = require('./defaults');
const Sentence = require('./sentence');

function facade(template, vocabulary, options) {
  return new Sentence(
    validateTemplates(template),
    validateVocabulary(vocabulary),
    validateOptions(options)
  );
}

const validateTemplates = (templates) => {
  if(templates) {
    if(Object.prototype.toString.call(templates) === '[object String]') {
      return [templates];
    } else if(Object.prototype.toString.call(templates[0]) === '[object String]') {
      return templates;
    } else {
      throw new TypeError('Argument "template" was expected to be a string or array containing a string.');
    }
  }
  return defaults.template;
};

const validateVocabulary = (vocabulary) => {
  if(vocabulary) {
    if(Object.prototype.toString.call(vocabulary) === '[object Object]') {
      return vocabulary;
    } else {
      throw new TypeError('Argument "vocabulary" was expected to be an object.');
    }
  }
  return defaults.vocabulary;
};

const validateOptions = (options) => {
  if(options) {
    if(Object.prototype.toString.call(options) === '[object Object]') {
      return options;
    } else {
      throw new TypeError('Argument "options" was expected to be an object.');
    }
  }
  return defaults.options;
};

module.exports = facade;
