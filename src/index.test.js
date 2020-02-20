const Sentence = require('./index.js')

/**
 * Constants
 */
const Template = 'This is just {a-adjective} template.'
const Vocabulary = {
    adjective: ['big', 'long', 'short', 'tall', 'hopeless', 'helpful'],
    verb: ['change', 'surf', 'climb', 'defenestrate', 'optimize']
}
const ArbitraryNumber = 55
const ArbitraryString = "Yes."


/**
 * Base tests
 */
test('returnsSampleWhenSuppliedNoData', () => {
    expect(Sentence().get()).toBe('hello, world.')
})

test('returnsSameSentenceWhenCalledTwiceWithoutChange', () => {
    let sentence = Sentence(Template, Vocabulary)
    expect(sentence.get()).toBe(sentence.get())
})


/**
 * Ability tests
 */
test('ableToHandleTemplatesWithNumbers', () => {
    let template = 'This is a really {1} sentence that I don\'t think should ever {2}.'
    let vocab = {
        1: ['big', 'bad', 'wolf'],
        2: ['change', 'climb']
    }

    expect(() => Sentence(template, vocab).get()).not.toThrow()
})


/**
 * Error tests
 */
test('throwsTypeErrorWhenPassingInvalidTemplate', () => {
    expect(() => Sentence({})).toThrow(TypeError)
    expect(() => Sentence(ArbitraryNumber)).toThrow(TypeError)
})

test('throwsTypeErrorWhenPassingInvalidVocab', () => {
    expect(() => Sentence(Template, [])).toThrow(TypeError)
    expect(() => Sentence(Template, ArbitraryString)).toThrow(TypeError)
    expect(() => Sentence(Template, ArbitraryNumber)).toThrow(TypeError)
})

test('throwsTypeErrorWhenPassingInvalidOptions', () => {
    expect(() => Sentence(Template, Vocabulary, [])).toThrow(TypeError)
    expect(() => Sentence(Template, Vocabulary, ArbitraryString)).toThrow(TypeError)
    expect(() => Sentence(Template, Vocabulary, ArbitraryNumber)).toThrow(TypeError)
})
