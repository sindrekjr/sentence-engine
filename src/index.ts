import { SentenceFactory } from './factory';
import { Sentence } from './sentence';

const Facade = new SentenceFactory();

export const createSentence = (
  templates?: Template[] | Template,
  vocabulary?: Vocabulary,
  options?: MaybeOptions,
) => Facade.createSentence(templates, vocabulary, options);
export const configure = (config: Configuration) => {
  Facade.configure(config);
};
export const addDefaultOptions = (options: MaybeOptions) => {
  Facade.addDefaultOptions(options);
};
export const addDefaultTemplates = (...templates: Template[]) => {
  Facade.addDefaultTemplates(...templates);
};
export const addDefaultVocabulary = (vocab: Vocabulary) => {
  Facade.addDefaultVocabulary(vocab);
};
export const restoreDefaults = () => {
  Facade.restoreDefaults();
};

export { Sentence, SentenceFactory };
