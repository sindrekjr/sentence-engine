import SentenceFactory from './factory';
import Sentence from './sentence';

const { 
  createSentence, 
  configure,
  addDefaultOptions,
  addDefaultTemplates,
  addDefaultVocabulary,
  restoreDefaults,
} = new SentenceFactory();
export default createSentence;
export {
  Sentence,
  SentenceFactory,
  configure,
  addDefaultOptions,
  addDefaultTemplates,
  addDefaultVocabulary,
  restoreDefaults,
};
