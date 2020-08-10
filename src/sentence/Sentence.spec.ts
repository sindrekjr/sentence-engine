import Sentence from './Sentence';
import defaults from '../defaults';

describe('Sentence.js', () => {
  const template: Template = 'Let\'s {verb} this, and hope for the {adjective}.';
  const templates: Templates = [template];
  const vocab: Vocabulary = {
    adjective: ['best', 'worst', 'hilarious'],
    verb: ['try', 'do']
  };

  const helloWorldTemplate: Template = '{greeting}, {noun}.';
  const helloWorldVocab: Vocabulary = {
    greeting: [ 'hello' ],
    noun: [ 'world' ]
  };

  describe('get()', () => {
    it('should return same text when called twice', () => {
      const sentence = new Sentence({
        options: defaults.options,
        templates: template,
        vocabulary: vocab,
      });
      expect(sentence.get()).toBe(sentence.get());
    });
  });

  describe('generate()', () => {
    it('should not ever throw errors', () => {
      const sentence = new Sentence({
        options: defaults.options,
        templates: template,
        vocabulary: vocab,
      });
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
        const sentence = new Sentence({
          options: {
            ...defaults.options,
            allowDuplicates: true
          },
          templates: templates,
          vocabulary: vocab,
        });
        const initialLength = sentence.templates.length;
        sentence.addTemplates(templates);
        expect(sentence.templates.length).toBe(initialLength + templates.length);
      });

      it('should not store duplicates if false', () => {
        const sentence = new Sentence({
          options: {
            ...defaults.options,
            allowDuplicates: false
          },
          templates: templates,
          vocabulary: vocab,
        });
        const initialLength = sentence.templates.length;
        sentence.addTemplates(templates);
        expect(sentence.templates.length).toBe(initialLength);
      });
    });

    /**
     * CAPITALIZE
     */
    describe('capitalize', () => {
      const capitalizeTemplate: Template = '{greeting}, {noun}. {smalltalk}';
      const firstVocab: Vocabulary = {
        greeting: ['hello'],
        noun: ['world'],
        smalltalk: ['fine weather, I reckon.']
      };
      const secondVocab: Vocabulary = {
        greeting: ['\'sup'],
        noun: ['man'],
        smalltalk: ['is everything alright?']
      };

      it('should correctly capitalize the sentence if true', () => {
        const sentence = new Sentence({
          options: {
            ...defaults.options,
            capitalize: true
          },
          templates: capitalizeTemplate,
          vocabulary: firstVocab,
        });
        expect(sentence.get()).toEqual('Hello, world. Fine weather, I reckon.');

        sentence.setVocab(secondVocab);
        expect(sentence.generate().get()).toEqual('\'Sup, man. Is everything alright?');
      });

      it('should not capitalize the sentence if false', () => {
        const sentence = new Sentence({
          options: {
            ...defaults.options,
            capitalize: false
          },
          templates: capitalizeTemplate,
          vocabulary: firstVocab,
        });
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
        const sentence = new Sentence({
          options: {
            ...defaults.options,
            forceNewSentence: true
          },
          templates: template,
          vocabulary: vocab,
        });
        expect(sentence.generate().get()).not.toBe(sentence.generate().get());
      });

      it('should result in same sentence even if true when there is only one possible outcome', () => {
        const sentence = new Sentence({
          options: {
            ...defaults.options,
            forceNewSentence: true
          },
          templates: helloWorldTemplate,
          vocabulary: helloWorldVocab,
        });
        expect(sentence.generate().get()).toEqual(sentence.generate().get());
      });
    });

    /**
     * PLACEHOLDER NOTATION
     */
    describe('placeholderNotation', () => {
      it('should default to curly brackets', () => {
        const sentence = new Sentence({
          options: defaults.options,
          templates: helloWorldTemplate,
          vocabulary: helloWorldVocab,
        });
        expect(sentence.get()).toEqual('hello, world.');
      });
    });

    /**
     * PRESERVE PLACEHOLDER NOTATION
     */
    describe('preservePlaceholderNotation', () => {
      it('should preserve placeholder notation if true', () => {
        const sentence = new Sentence({
          templates: '{test}',
          vocabulary: { test: ['Yup, just a test.']},
          options: {
            ...defaults.options,
            preservePlaceholderNotation: true
          }
        });
        expect(sentence.get()).toBe('{Yup, just a test.}');
      });
    });
  });
});
