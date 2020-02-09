const Sentence = require('./index.js')

/**
 * Constants
 */
const Template = 'This is just {a-adjective} template.'
const Vocabulary = {
    adjective: ['big', 'long', 'short', 'tall', 'hopeless', 'helpful'],
    verb: ['change', 'surf', 'climb', 'defenestrate', 'optimize']
}

test('toBeSameSentenceOnTwoGetCalls', () => {
    let sentence = Sentence(Template, Vocabulary)
    expect(sentence.get()).toBe(sentence.get())
})

/*test('throwsTypeErrorWhenPassingInvalidVocab', () => {
    expect(Sentence(Template, [])).toThrow('TypeError')
})

test('throwsTypeErrorWhenPassingInvalidOptions', () => {
    expect(Sentence(Template, Vocabulary, [])).toThrow('TypeError')
})*/
