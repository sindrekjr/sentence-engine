import defaults from './factory/defaults';
import { createSentence } from '.';

describe('sentence-engine', () => {
  /**
   * createSentence
   */
  describe('createSentence()', () => {
    it('should create sentence with defaults if no params are provided', () => {
      const DefaultSentence: Sentence = createSentence();
      expect(DefaultSentence.templates).toEqual(defaults.templates);
      expect(DefaultSentence.vocabulary).toEqual(defaults.vocabulary);
    });
  });
});
