const defaults = require('./defaults');
const Sentence = require('./facade.js');

describe('facade.js', () => {
  const templates = [
    '{a-animal} crossed the {object}.',
    'The {animal} crossed the {object}.'
  ];
  const vocabulary = {
    animal: ['duck', 'fox', 'bear', 'comodo dragon'],
    object: ['road', 'chessboard', 'window', 'tic-tac-toe']
  };

  beforeEach(() => {
    Sentence.restoreDefaults();
  });

  /**
   * SENTENCE
   */
  describe('sentence generation', () => {
    it('should return default text when supplied no data', () => {
      expect(Sentence().get()).toBe('hello, world.');
    });

    it('should be able to handle numeric template placeholders', () => {
      const template = 'This is a really {1} sentence that I don\'t think should ever {2}.';
      const vocab = {
        1: ['big', 'bad', 'wolf'],
        2: ['change', 'climb']
      };
      expect(() => Sentence(template, vocab).get()).not.toThrow();
    });
  });

  /**
   * VALIDATE
   */
  describe('validation', () => {
    const arbitraryNum = 55;
    const arbitraryStr = 'Yes.';
    const template = 'This is just {a-adjective, verb} template.';
    const vocab = {
      adjective: ['big', 'long', 'short', 'tall', 'hopeless', 'helpful'],
      verb: ['change', 'surf', 'climb', 'defenestrate', 'optimize']
    };

    it('should throw TypeError when given invalid template', () => {
      expect(() => Sentence({})).toThrow(TypeError);
      expect(() => Sentence(arbitraryNum)).toThrow(TypeError);
    });

    it('should throw TypeError when given invalid vocabulary', () => {
      expect(() => Sentence(template, [])).toThrow(TypeError);
      expect(() => Sentence(template, arbitraryStr)).toThrow(TypeError);
      expect(() => Sentence(template, arbitraryNum)).toThrow(TypeError);
    });

    it('should throw TypeError when given invalid options', () => {
      expect(() => Sentence(template, vocab, [])).toThrow(TypeError);
      expect(() => Sentence(template, vocab, arbitraryStr)).toThrow(TypeError);
      expect(() => Sentence(template, vocab, arbitraryNum)).toThrow(TypeError);
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
      it('should return default templates by default', () => expect(Sentence.getTemplates()).toEqual(defaults.templates));
    });

    /**
     * VOCABULARY
     */
    describe('getVocab', () => {
      it('should return default vocab by default', () => expect(Sentence.getVocab()).toEqual(defaults.vocabulary));
    });

    /**
     * OPTIONS
     */
    describe('getOptions', () => {
      it('should return default options by default', () => expect(Sentence.getOptions()).toEqual(defaults.options));
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
        Sentence.setTemplates(templates);
        expect(Sentence.getTemplates()).toEqual(templates);
      });
    });

    /**
     * VOCABULARY
     */
    describe('setVocab', () => {
      it('should correctly set the given vocabulary', () => {
        Sentence.setVocab(vocabulary);
        expect(Sentence.getVocab()).toEqual(vocabulary);
      });
    });

    /**
     * OPTIONS
     */
    describe('setOptions', () => {
      it('should correctly set the given options', () => {
        const newOptions = {
          ...defaults.options,
          capitalize: !defaults.options.capitalize,
        };
        Sentence.setOptions(newOptions);
        expect(Sentence.getOptions()).toEqual(newOptions);
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
    describe('addTemplates', () => {
      it('should add the given singular template', () => {
        Sentence.addTemplates(templates[0]);
        expect(Sentence.getTemplates()).toContain(templates[0]);
      });

      it('should add all the given templates', () => {
        Sentence.addTemplates(templates);
        const result = Sentence.getTemplates();
        expect(result).toContain(templates[0]);
        expect(result.length).toEqual(3);
      });
    });

    /**
     * VOCABULARY
     */
    describe('addVocab', () => {
      it('should add the given vocab', () => {
        Sentence.addVocab(vocabulary);
        const expectedKeys = Object.keys(vocabulary);
        const expectedValues = Object.values(vocabulary).flat();
        const resultingVocab = Sentence.getVocab();
        expect(Object.keys(resultingVocab)).toContain(...expectedKeys);
        expect(Object.values(resultingVocab).flat()).toContain(...expectedValues);
      });
    });
  });
});
