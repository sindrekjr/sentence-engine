const Sentence = require('./facade.js');

describe('facade.js', () => {


  describe('sentence generation', () => {
    it('should return default text when supplied no data', () => {
      expect(Sentence().get()).toBe('hello, world.');
    });

    it('should be able to handle numeric template masks', () => {
      const template = 'This is a really {1} sentence that I don\'t think should ever {2}.';
      const vocab = {
        1: ['big', 'bad', 'wolf'],
        2: ['change', 'climb']
      };
      expect(() => Sentence(template, vocab).get()).not.toThrow();
    });
  });

  describe('validation', () => {
    const arbitraryNum = 55;
    const arbitraryStr = 'Yes.';
    const template = 'This is just {a-adjective} template.';
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
});