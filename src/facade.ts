import defaults from './validator/defaults';
import Sentence from './sentence';
import { Validator } from './validator';

const validator = new Validator();

export default function facade(templates?: Templates | Template, vocabulary?: Vocabulary, options?: MaybeOptions) {
  return new Sentence(  
    templates || defaults.templates,
    vocabulary || defaults.vocabulary,
    options || defaults.options,
  );
}

Object.assign(facade, {
  getTemplates() {
    return validator.templates;
  },
  getVocab() {
    return validator.vocabulary;
  },
  getOptions() {
    return validator.options;
  },

  setTemplates(...templates: Templates) {
    templates = templates.flat();
    validator.templates = templates.length ? templates : [...defaults.templates];
  },
  setVocab(vocab: Vocabulary) {
    validator.vocabulary = vocab || defaults.vocabulary;
  },
  setOptions(options: MaybeOptions) {
    validator.options = options ? Object.assign(this.getOptions(), options) : defaults.options;
  },

  addTemplates(...templates: Templates) {
    this.setTemplates(...this.getTemplates().concat(templates.flat()));
  },
  addVocab(vocab: Vocabulary) {
    this.setVocab(Object.assign(this.getVocab(), (vocab)));
  },

  restoreDefaults() {
    this.setTemplates(...defaults.templates);
    this.setVocab(defaults.vocabulary);
    this.setOptions(defaults.options);
  }
});
