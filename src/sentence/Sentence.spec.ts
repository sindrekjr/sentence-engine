import { mockRandom, resetMockRandom } from 'jest-mock-random';
import { Sentence } from './Sentence';
import { getTotalWeightOfEntries } from './utils/array';

describe('Sentence.js', () => {
  const template= 'Let\'s {verb} this, and hope for the {adjective}.';
  const vocab = {
    adjective: ['best', 'worst', 'hilarious'],
    verb: ['try', 'do']
  };

  const helloWorldTemplate = '{greeting}, {noun}.';
  const helloWorldVocab = {
    greeting: [ 'Hello' ],
    noun: [ 'world' ]
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
   * TEMPLATES
   */
  describe('templates', () => {
    it('should increase in weight when duplicates are added', () => {
      const sentence = new Sentence(template, vocab);
      expect(sentence.weightedTemplates[0].weight).toBe(1);
      sentence.addTemplates(template);
      expect(sentence.weightedTemplates[0].weight).toBe(2);
      sentence.addTemplates({
        entry: template,
        weight: 5,
      });
      expect(sentence.weightedTemplates[0].weight).toBe(7);
      expect(sentence.weightedTemplates.length).toBe(1);
    });

    /**
     * WEIGHTED TEMPLATES
     */
    describe('WeightedTemplates', () => {
      const weightedTemplate = {
        entry: helloWorldTemplate,
        weight: 5,
      };
      const unevenTemplates = [
        weightedTemplate,
        { entry: 'Fail', weight: 1 },
      ];

      afterEach(() => {
        resetMockRandom();
      });

      it('should be able to resolve single weighted template', () => {
        expect(() => {
          const { value: first } = new Sentence(weightedTemplate, helloWorldVocab);
          const { value: second } = new Sentence(weightedTemplate, helloWorldVocab);
          expect(first).toEqual(second);
        }).not.toThrow();
      });

      it('should default weight to 1 if given 0', () => {
        const zeroWeightTemplate = {
          entry: helloWorldTemplate,
          weight: 0,
        };
        const { weightedTemplates } = new Sentence(zeroWeightTemplate, helloWorldVocab);
        expect(weightedTemplates[0].weight).toEqual(1);
      });

      it('should correctly resolve to the lightest entry', () => {
        mockRandom(0.90);
        const { value } = new Sentence(unevenTemplates, helloWorldVocab);
        expect(value).toEqual('Fail');
      });

      it('should correctly resolve to the heaviest entry', () => {
        mockRandom([0.1, 0.2, 0.17, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.83]);
        for (let i = 0; i < 100; i++) {
          const { value } = new Sentence(unevenTemplates, helloWorldVocab);
          expect(value).not.toEqual('Fail');
        }
      });
    });
  });

  /**
   * VOCABULARY
   */
  describe('vocabulary', () => {
    it('should increase in weight when duplicates are added', () => {
      const sentence = new Sentence(template, vocab);
      for (const key in sentence.weightedVocabulary) {
        const values = sentence.weightedVocabulary[key];
        const totalWeight = getTotalWeightOfEntries(values);
        expect(totalWeight).toBe(values.length);
      }

      sentence.addVocabulary(vocab);
      for (const key in sentence.weightedVocabulary) {
        const values = sentence.weightedVocabulary[key];
        const totalWeight = getTotalWeightOfEntries(values);
        expect(totalWeight).toBe(values.length * 2);
      }
    });

    /**
     * WEIGHTED VOCABULARY
     */
    describe('WeightedVocabulary', () => {
      const weightedVocabulary = {
        adjective: [
          { entry: 'best', weight: 5 },
          { entry: 'worst', weight: 2 },
        ],
        verb: [
          { entry: 'try', weight: 1 },
          { entry: 'do', weight: 10 },
        ]
      };

      afterEach(() => {
        resetMockRandom();
      });

      it('should be able to resolve a weighted vocabulary', () => {
        expect(() => {
          const { value } = new Sentence(template, weightedVocabulary);
          expect(value).toBeDefined();
        }).not.toThrow();
      });

      it('should correctly resolve to the lightest entry', () => {
        mockRandom([0.75, 0.05]);
        const { value } = new Sentence(template, weightedVocabulary);
        expect(value).toEqual('Let\'s try this, and hope for the worst.');
      });

      it('should correctly resolve to the heaviest entry', () => {
        mockRandom([0.1, 0.9, 0.2, 0.8, 0.3, 0.7, 0.4, 0.6, 0.5, 0.5, 0.9, 0.3]);
        for (let i = 0; i < 100; i++) {
          const { value } = new Sentence(template, weightedVocabulary);
          expect(value).toEqual('Let\'s do this, and hope for the best.');
        }
      });
    });
  });

  /**
   * OPTIONS
   */
  describe('options', () => {
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

        sentence.vocabulary = secondVocab;
        expect(sentence.generate().get()).toEqual('\'Sup, man. Is everything alright?');
      });

      it('should not capitalize the sentence if false', () => {
        const sentence = new Sentence(capitalizeTemplate, firstVocab, { capitalize: false });
        expect(sentence.get()).toEqual('hello, world. fine weather, I reckon.');

        sentence.vocabulary = secondVocab;
        expect(sentence.generate().get()).toEqual('\'sup, man. is everything alright?');
      });
    });

    /**
     * FORCE DIFFERENCE
     */
    describe('forceNewSentence', () => {
      it('should result in a new sentence being generated if true', () => {
        const sentence = new Sentence(template, vocab, { forceNewSentence: true });
        const { value: first } = sentence;
        const { value: second } = sentence.generate();
        expect(first).not.toEqual(second);
      });

      it('should result in same sentence even if true when there is only one possible outcome', () => {
        const sentence = new Sentence(helloWorldTemplate, helloWorldVocab, { forceNewSentence: true });
        const { value: first } = sentence.generate();
        const { value: second } = sentence.generate();
        expect(first).toEqual(second);
      });
    });

    /**
     * PLACEHOLDER NOTATION
     */
    describe('placeholderNotation', () => {
      it('should default to curly brackets', () => {
        const { value } = new Sentence(helloWorldTemplate, helloWorldVocab);
        expect(value).toEqual('Hello, world.');
      });

      it('should be able to use special characters', () => {
        const bracketsTemplate = '[greeting], [noun].';
        const { value } = new Sentence(bracketsTemplate, helloWorldVocab, { placeholderNotation: '[ ]' });
        expect(value).toEqual('Hello, world.');
      });
    });

    /**
     * PRESERVE PLACEHOLDER NOTATION
     */
    describe('preservePlaceholderNotation', () => {
      it('should preserve placeholder notation if true', () => {
        const { value } = new Sentence(
          '{test}',
          { test: ['Yup, just a test.']},
          {
            preservePlaceholderNotation: true
          }
        );
        expect(value).toBe('{Yup, just a test.}');
      });
    });
  });

  /**
   * RESOLVABLES
   */
  describe('resolvables', () => {
    const normalTemplate = '{test}. {forSure}.';
    const resolvedTemplate = () => '{test}. {forSure}.';
    const normalVocab = {
      test: ['tested'],
      forSure: ['tested for sure'],
    };
    const resolvableVocab = {
      test: [
        () => {
          return 'tested';
        },
      ],
      forSure: [
        () => 'tested for sure',
      ],
    };

    describe('templates', () => {
      it('should give the same result as a normal template', () => {
        const { value: normal } = new Sentence(normalTemplate, normalVocab);
        const { value: resolved } = new Sentence(resolvedTemplate, normalVocab);
        expect(normal).toEqual(resolved);
      });
    });

    describe('vocabulary', () => {
      it('should give the same results as a normal vocabulary', () => {
        const { value: normal } = new Sentence(normalTemplate, normalVocab);
        const { value: resolved } = new Sentence(normalTemplate, resolvableVocab);
        expect(normal).toEqual(resolved);
      });
    });
  });
});
