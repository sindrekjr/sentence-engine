import defaults from './defaults';
import { createSentence, configure } from './index';

describe('sentence-engine', () => {
  /**
   * CREATE SENTENCE
   */
  describe('createSentence()', () => {
    it('should create sentence with defaults if no params are provided', () => {
      const { templates, vocabulary } = createSentence();
      expect(templates).toEqual(defaults.templates);
      expect(vocabulary).toEqual(defaults.vocabulary);
    });
  });

  /**
   * CONFIGURE
   */
  describe('configure()', () => {
    it('should be able to change options', () => {
      const testSentence = '{test}. {test}.';
      const testVocab = { test: ['test'] };

      configure({ options: { capitalize: false }});
      const { value: uncapitalized } = createSentence(testSentence, testVocab);
      expect(uncapitalized).toEqual('test. test.');

      configure({ options: { capitalize: true }});
      const { value: capitalized } = createSentence(testSentence, testVocab);
      expect(capitalized).toEqual('Test. Test.');
    });
  });
});
