const {Sentence} = require('./index.js')

/**
 * Constants
 */
const Vocabulary = {
    adjective: ['big', 'long', 'short', 'tall', 'hopeless', 'helpful'],
    verb: ['change', 'surf', 'climb', 'defenestrate', 'optimize']
}

test('toBeSameSentenceOnTwoGetCalls', () => {
    let template = 'This is a really {adjective} sentence that I don\'t think should ever {verb}.'
    let sentence = new Sentence(template, Vocabulary)

    expect(sentence.get()).toBe(sentence.get())
})
