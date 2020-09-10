// eslint-disable-next-line no-unused-vars
import { Template, Vocabulary, Options, Configuration, StringResolvable, WeightedEntry } from '../types';
import { Sentence, SentenceFactory } from './sentence';
import defaults from './defaults';

const Facade = new SentenceFactory(defaults.templates, defaults.vocabulary, {});

export const createSentence = (
  templates?: Template[] | Template,
  vocabulary?: Vocabulary,
  options?: Options,
) => Facade.createSentence(templates, vocabulary, options);

export const configure = (config: Configuration) => {
  Facade.configure(config);
};

export const addDefaultOptions = (options: Options) => {
  Facade.addDefaultOptions(options);
};

export const addDefaultTemplates = (...templates: Template[]) => {
  Facade.addDefaultTemplates(...templates);
};

export const addDefaultVocabulary = (vocab: Vocabulary) => {
  Facade.addDefaultVocabulary(vocab);
};

export { Sentence, SentenceFactory, StringResolvable, WeightedEntry, Template, Vocabulary, Options, Configuration };
