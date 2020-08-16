import { SentenceFactory } from './factory';
import { Sentence } from './sentence';

/**
 * Create default instance of SentenceFactory for basic usage
 */
const {
  createSentence,
  configure,
  addDefaultOptions,
  addDefaultTemplates,
  addDefaultVocabulary,
  restoreDefaults,
} = new SentenceFactory();

/**
 * Exports a facade that includes the methods available in the instantiated factory,
 * as well as the classes Sentence and SentenceFactory.
 *
 * The function createSentence should cover most use cases
 */
export {
  createSentence,
  configure,
  addDefaultOptions,
  addDefaultTemplates,
  addDefaultVocabulary,
  restoreDefaults,
  Sentence,
  SentenceFactory,
};
