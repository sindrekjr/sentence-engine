import SentenceFactory from './factory';
import Sentence from './sentence';

const { 
  create, 
  configure,
  addDefaultOptions,
  addDefaultTemplates,
  addDefaultVocabulary,
  restoreDefaults,
} = new SentenceFactory();
export default create;
export {
  Sentence,
  SentenceFactory,
  configure,
  addDefaultOptions,
  addDefaultTemplates,
  addDefaultVocabulary,
  restoreDefaults,
};
