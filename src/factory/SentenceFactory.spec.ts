import defaults from './defaults';
import { SentenceFactory} from './SentenceFactory';

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
   * SENTENCE
   */
  describe('sentence generation', () => {
    it('should return default text when supplied no data', () => {
      const defaultOutput = Factory.createSentence().get();
      expect(defaultOutput).toBeDefined();
      expect(defaultOutput.length).toBeGreaterThan(0);
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
   * GET
   */
  describe('public get methods', () => {
    /**
     * TEMPLATES
     */
    describe('getTemplates', () => {
      it('should return default templates by default', () => expect(Factory.defaultTemplates).toEqual(defaults.templates));
    });

    /**
     * VOCABULARY
     */
    describe('getVocab', () => {
      it('should return default vocab by default', () => expect(Factory.defaultVocabulary).toEqual(defaults.vocabulary));
    });
  });

  /**
   * SET
   */
  describe('public set methods', () => {
    /**
     * TEMPLATES
     */
    describe('setTemplates', () => {
      it('should correctly set the given template', () => {
        Factory.defaultTemplates = templates;
        expect(Factory.defaultTemplates).toEqual(templates);
      });
    });

    /**
     * VOCABULARY
     */
    describe('setVocab', () => {
      it('should correctly set the given vocabulary', () => {
        Factory.defaultVocabulary = vocabulary;
        expect(Factory.defaultVocabulary).toEqual(vocabulary);
      });
    });

    /**
     * OPTIONS
     */
    describe('setOptions', () => {
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
  describe('public add methods', () => {
    /**
     * TEMPLATES
     */
    describe('addDefaultTemplates', () => {
      it('should add the given singular template', () => {
        Factory.addDefaultTemplates(templates[0]);
        expect(Factory.defaultTemplates).toContain(templates[0]);
      });

      it('should add all the given templates', () => {
        Factory.addDefaultTemplates(...templates);
        const result = Factory.defaultTemplates;
        expect(result).toContain(templates[0]);
        expect(result.length).toEqual(3);
      });
    });

    /**
     * VOCABULARY
     */
    describe('addDefaultVocabulary', () => {
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
