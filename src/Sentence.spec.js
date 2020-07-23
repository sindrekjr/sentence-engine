const Sentence = require('./index.js')

/**
 * Constants
 */


describe('Sentence', () => {
  const Template = 'This is just {a-adjective} template.'
  const Vocabulary = {
    adjective: ['big', 'long', 'short', 'tall', 'hopeless', 'helpful'],
    verb: ['change', 'surf', 'climb', 'defenestrate', 'optimize']
  }

  describe('get()', () => {
    it('should return same text when called twice', () => {
      const sentence = Sentence(Template, Vocabulary)
      expect(sentence.get()).toBe(sentence.get())
    })
  })

  describe('sentence generation', () => {
    it('should return default text when supplied no data', () => {
      expect(Sentence().get()).toBe('hello, world.')
    })

    it('should be able to handle numeric template masks', () => {
      const template = 'This is a really {1} sentence that I don\'t think should ever {2}.'
      const vocab = {
        1: ['big', 'bad', 'wolf'],
        2: ['change', 'climb']
      }
      expect(() => Sentence(template, vocab).get()).not.toThrow()
    })
  })

  describe('errors', () => {
    const ArbitraryNumber = 55
    const ArbitraryString = "Yes."

    it('should throw TypeError when given invalid template', () => {
      expect(() => Sentence({})).toThrow(TypeError)
      expect(() => Sentence(ArbitraryNumber)).toThrow(TypeError)
    })

    it('should throw TypeError when given invalid vocabulary', () => {
      expect(() => Sentence(Template, [])).toThrow(TypeError)
      expect(() => Sentence(Template, ArbitraryString)).toThrow(TypeError)
      expect(() => Sentence(Template, ArbitraryNumber)).toThrow(TypeError)
    })

    it('should throw TypeError when given invalid options', () => {
      expect(() => Sentence(Template, Vocabulary, [])).toThrow(TypeError)
      expect(() => Sentence(Template, Vocabulary, ArbitraryString)).toThrow(TypeError)
      expect(() => Sentence(Template, Vocabulary, ArbitraryNumber)).toThrow(TypeError)
    })
  })
})
