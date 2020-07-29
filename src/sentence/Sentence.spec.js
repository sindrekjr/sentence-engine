const Sentence = require('./Sentence.js');

describe('Sentence.js', () => {
  const template = 'Let\'s {verb} this, and hope for the {adjective}.';
  const templates = [template];
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
     * ALLOW DUPLICATES
     */
    describe('allowDuplicates', () => {
      it('should store duplicates if true', () => {
        const sentence = new Sentence(templates, vocab, { allowDuplicates: true });
        const initialLength = sentence.templates.length;
        sentence.addTemplates(templates);
        expect(sentence.templates.length).toBe(initialLength + templates.length);
      });

      it('should not store duplicates if false', () => {
        const sentence = new Sentence(templates, vocab, { allowDuplicates: false });
        const initialLength = sentence.templates.length;
        sentence.addTemplates(templates);
        expect(sentence.templates.length).toBe(initialLength);
      });
    });

    /**
     * CAPITALIZE
     */
    describe('capitalize', () => {
      const capitalizeTemplate = '{greeting}, {noun}. {smalltalk}';
      const firstVocab = {
        greeting: ['hello'],
        noun: ['world'],
        smalltalk: ['fine weather, I reckon.']
      };
      const secondVocab = {
        greeting: ['\'sup'],
        noun: ['man'],
        smalltalk: ['is everything alright?']
      };

      it('should correctly capitalize the sentence if true', () => {
        const sentence = new Sentence(capitalizeTemplate, firstVocab, { capitalize: true });
        expect(sentence.get()).toEqual('Hello, world. Fine weather, I reckon.');

        sentence.setVocab(secondVocab);
        expect(sentence.generate().get()).toEqual('\'Sup, man. Is everything alright?');
      });

      it('should not capitalize the sentence if false', () => {
        const sentence = new Sentence(capitalizeTemplate, firstVocab, { capitalize: false });
        expect(sentence.get()).toEqual('hello, world. fine weather, I reckon.');

        sentence.setVocab(secondVocab);
        expect(sentence.generate().get()).toEqual('\'sup, man. is everything alright?');
      });
    });

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

    /**
     * PRESERVE CURLY BRACKETS
     */
    describe('preserveCurlyBrackets', () => {
      it('should preserve curly brackets if true', () => {
        const sentence = new Sentence(
          '{test}',
          { test: ['Yup, just a test.']},
          { preserveCurlyBrackets: true }
        );
        expect(sentence.get()).toBe('{Yup, just a test.}');
      });
    });
  });
});
