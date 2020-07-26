'use strict';

const defaults = require('./defaults');
const Sentence = require('./sentence');
const { Validator } = require('./validator');
const { cloneDeep } = require('lodash');

function facade(template, vocabulary, options) {
  return new Sentence(
    Validator.validateTemplates(template),
    Validator.validateVocabulary(vocabulary),
    Validator.validateOptions(options)
  );
}

Object.assign(facade, {
  getTemplates() {
    return Validator.templates;
  },
  getVocab() {
    return Validator.vocabulary;
  },
  getOptions() {
    return Validator.options;
  },

  setTemplates(...templates) {
    templates = templates.flat();
    Validator.templates = templates.length ? templates : [...defaults.templates];
  },
  setVocab(vocab) {
    Validator.vocabulary = vocab || cloneDeep(defaults.vocabulary);
  },
  setOptions(options) {
    Validator.options = options ? Object.assign(this.getOptions(), options) : cloneDeep(defaults.options);
  },

  addTemplates(...templates) {
    this.setTemplates(this.getTemplates().concat(templates.flat()));
  },
  addVocab(vocab) {
    this.setVocab(Object.assign(this.getVocab(), (vocab)));
  },

  restoreDefaults() {
    this.setTemplates(defaults.templates);
    this.setVocab(defaults.vocabulary);
    this.setOptions(defaults.options);
  }
});

module.exports = facade;
