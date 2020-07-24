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
        for(let i = 0; i < 100; i++) sentence.generate()
      }).not.toThrow();
    });

    it('should result in a new sentence being generated', () => {
      const sentence = new Sentence(template, vocab, { forceDifference: true });
      const firstResult = sentence.get(); 
      
      sentence.generate();
      const secondResult = sentence.get();
      expect(firstResult).not.toBe(secondResult);
    });
  });
});
