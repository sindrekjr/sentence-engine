const Sentence = require('./Sentence.js');

describe('Sentence.js', () => {
  const template = 'Let\'s {verb} this, and hope for the {adjective}.';
  const vocab = {
    adjective: ['best', 'worst', 'hilarious'],
    verb: ['try', 'do']
  };

  describe('get()', () => {
    it('should return same text when called twice', () => {
      const sentence = new Sentence(template, vocab);
      expect(sentence.get()).toBe(sentence.get());
    });
  });

  describe('generate()', () => {
    it('should not ever throw errors', () => {
      const sentence = new Sentence(template, vocab);
      expect(() => {
        for (let i = 0; i < 100; i++) sentence.generate();
      }).not.toThrow();
    });
  });

  /**
   * OPTIONS
   */
  describe('options', () => {
    /**
     * FORCE DIFFERENCE
     */
    describe('forceNewSentence', () => {
      it('should result in a new sentence being generated if true', () => {
        const sentence = new Sentence(template, vocab, { forceNewSentence: true });
        expect(sentence.generate().get()).not.toBe(sentence.generate().get());
      });

      it('should result in same sentence even if true when there is only one possible outcome', () => {
        const template = '{greeting}, {noun}.';
        const vocab = {
          greeting: [ 'hello' ],
          noun: [ 'world' ]
        };
        const sentence = new Sentence(template, vocab, { forceNewSentence: true });
        expect(sentence.generate().get()).toEqual(sentence.generate().get());
      });
    });
  });
});
