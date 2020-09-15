// eslint-disable-next-line no-unused-vars
import { Template, Vocabulary, Options, Configuration, StringResolvable, WeightedEntry } from '../types';
import { Sentence, SentenceFactory } from './sentence';
import defaults from './defaults';

const Facade = new SentenceFactory(defaults.templates, defaults.vocabulary, {});

export const createSentence = (
  templates?: Template[] | Template,
  vocabulary?: Vocabulary,
  options?: Options,
): Sentence => Facade.createSentence(templates, vocabulary, options);

export const configure = (config: Configuration): void => {
  Facade.configure(config);
};

export const addDefaultOptions = (options: Options): void => {
  Facade.addDefaultOptions(options);
};

export const addDefaultTemplates = (...templates: Template[]): void => {
  Facade.addDefaultTemplates(...templates);
};

export const addDefaultVocabulary = (vocab: Vocabulary): void => {
  Facade.addDefaultVocabulary(vocab);
};

export { Sentence, SentenceFactory, StringResolvable, WeightedEntry, Template, Vocabulary, Options, Configuration };
