import defaults from '../defaults';
import { SentenceFactory } from './SentenceFactory';

describe('SentenceFactory.js', () => {
  const Factory = new SentenceFactory(defaults.templates, defaults.vocabulary);
  const templates = [
    '{a-animal} crossed the {object}.',
    'The {animal} crossed the {object}.'
  ];
  const vocabulary = {
    animal: ['duck', 'fox', 'bear', 'comodo dragon'],
    object: ['road', 'chessboard', 'window', 'tic-tac-toe']
  };

  beforeEach(() => {
    Factory.defaultTemplates = defaults.templates;
    Factory.defaultVocabulary = defaults.vocabulary;
  });

  /**
   * CREATE SENTENCE
   */
  describe('createSentence()', () => {
    it('should create sentence with defaults if no params are provided', () => {
      const { templates, vocabulary } = Factory.createSentence();
      expect(templates).toEqual(defaults.templates);
      expect(vocabulary).toEqual(defaults.vocabulary);
    });

    it('should be able to handle numeric template placeholders', () => {
      const template = 'This is a really {1} sentence that I don\'t think should ever {2}.';
      const vocab = {
        1: ['big', 'bad', 'wolf'],
        2: ['change', 'climb']
      };
      expect(() => {
        const { value } = Factory.createSentence(template, vocab);
        expect(value).toEqual(expect.stringMatching(/(big|bad|wolf)/));
        expect(value).toEqual(expect.stringMatching(/(change|climb)/));
      }).not.toThrow();
    });
  });

  /**
   * CONFIGURE
   */
  describe('configure()', () => {
    it('should correctly configure all provided values', () => {
      const testTemplate = ['test'];
      const testVocab = { test: ['test'] };

      Factory.configure({
        options: { capitalize: false },
        templates: testTemplate,
        vocabulary: testVocab,
      });

      expect(Factory.defaultOptions).toEqual({ capitalize: false });
      expect(Factory.defaultTemplates).toBe(testTemplate);
      expect(Factory.defaultVocabulary).toBe(testVocab);
    });

    it('should not change options if none were provided', () => {
      const { defaultOptions: prevOptions } = Factory;
      const { defaultOptions: newOptions } = Factory.configure({ options: undefined });
      expect(newOptions).toEqual(prevOptions);
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
        const newOptions = { capitalize: !Factory.defaultOptions?.capitalize };
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
        const { defaultTemplates } = Factory.addDefaultTemplates(templates[0]);
        expect(defaultTemplates).toContain(templates[0]);
      });

      it('should add all the given templates', () => {
        const { defaultTemplates: result } = Factory.addDefaultTemplates(...templates);
        expect(result).toContain(templates[0]);
        expect((result as string[]).length).toEqual(3);
      });
    });

    /**
     * VOCABULARY
     */
    describe('addDefaultVocabulary()', () => {
      it('should add the given vocab', () => {
        const { defaultVocabulary: resultingVocab } = Factory.addDefaultVocabulary(vocabulary);
        Object.keys(vocabulary).forEach(key => expect(Object.keys(resultingVocab)).toContain(key));
        Object.values(vocabulary).flat().forEach(val => expect(Object.values(resultingVocab).flat()).toContain(val));
      });
    });
  });
});
