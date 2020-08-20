import defaults from './defaults';
import { SentenceFactory } from './SentenceFactory';

describe('SentenceFactory.js', () => {
  const Factory = new SentenceFactory();
  const templates = [
    '{a-animal} crossed the {object}.',
    'The {animal} crossed the {object}.'
  ];
  const vocabulary = {
    animal: ['duck', 'fox', 'bear', 'comodo dragon'],
    object: ['road', 'chessboard', 'window', 'tic-tac-toe']
  };

  beforeEach(() => {
    Factory.restoreDefaults();
  });

  /**
   * CREATE SENTENCE
   */
  describe('createSentence()', () => {
    it('should create sentence with defaults if no params are provided', () => {
      const DefaultSentence: Sentence = Factory.createSentence();
      expect(DefaultSentence.templates).toEqual(defaults.templates);
      expect(DefaultSentence.vocabulary).toEqual(defaults.vocabulary);
    });

    it('should be able to handle numeric template placeholders', () => {
      const template = 'This is a really {1} sentence that I don\'t think should ever {2}.';
      const vocab = {
        1: ['big', 'bad', 'wolf'],
        2: ['change', 'climb']
      };
      expect(() => Factory.createSentence(template, vocab).get()).not.toThrow();
    });
  });

  /**
   * CONFIGURE
   */
  describe('configure()', () => {
    it('should correctly configure all provided values', () => {
      const testTemplate = 'test';
      const testVocab = { test: ['test'] };

      Factory.configure({
        options: { allowDuplicates: false },
        templates: testTemplate,
        vocabulary: testVocab,
      });

      expect(Factory.defaultOptions).toEqual({ allowDuplicates: false });
      expect(Factory.defaultTemplates).toBe(testTemplate);
      expect(Factory.defaultVocabulary).toBe(testVocab);
    });

    it('should not change options if none were provided', () => {
      const prevOptions = Factory.defaultOptions;

      Factory.configure({
        options: undefined,
      });

      expect(Factory.defaultOptions).toEqual(prevOptions);
    });
  });

  /**
   * GET
   */
  describe('get', () => {
    /**
     * TEMPLATES
     */
    describe('templates', () => {
      it('should return default templates by default', () => expect(Factory.defaultTemplates).toEqual(defaults.templates));
    });

    /**
     * VOCABULARY
     */
    describe('vocab', () => {
      it('should return default vocab by default', () => expect(Factory.defaultVocabulary).toEqual(defaults.vocabulary));
    });
  });

  /**
   * SET
   */
  describe('set', () => {
    /**
     * TEMPLATES
     */
    describe('templates', () => {
      it('should correctly set the given template', () => {
        Factory.defaultTemplates = templates;
        expect(Factory.defaultTemplates).toEqual(templates);
      });
    });

    /**
     * VOCABULARY
     */
    describe('vocabulary', () => {
      it('should correctly set the given vocabulary', () => {
        Factory.defaultVocabulary = vocabulary;
        expect(Factory.defaultVocabulary).toEqual(vocabulary);
      });
    });

    /**
     * OPTIONS
     */
    describe('options', () => {
      it('should correctly set the given options', () => {
        const newOptions = {
          capitalize: !Factory.defaultOptions?.capitalize,
        };
        Factory.defaultOptions = newOptions;
        expect(Factory.defaultOptions).toEqual(newOptions);
      });
    });
  });

  /**
   * ADD
   */
  describe('add', () => {
    /**
     * TEMPLATES
     */
    describe('addDefaultTemplates()', () => {
      it('should add the given singular template', () => {
        Factory.addDefaultTemplates(templates[0]);
        expect(Factory.defaultTemplates).toContain(templates[0]);
      });

      it('should add all the given templates', () => {
        Factory.addDefaultTemplates(...templates);
        const result: string[] = Factory.defaultTemplates as string[];
        expect(result).toContain(templates[0]);
        expect(result.length).toEqual(3);
      });
    });

    /**
     * VOCABULARY
     */
    describe('addDefaultVocabulary()', () => {
      it('should add the given vocab', () => {
        Factory.addDefaultVocabulary(vocabulary);
        const expectedKeys: string[] = Object.keys(vocabulary);
        const expectedValues: string[] = Object.values(vocabulary).flat();
        const resultingVocab: Vocabulary = Factory.defaultVocabulary;

        expectedKeys.forEach(key => {
          expect(Object.keys(resultingVocab)).toContain(key);
        });
        expectedValues.forEach(val => {
          expect(Object.values(resultingVocab).flat()).toContain(val);
        });
      });
    });
  });
});
