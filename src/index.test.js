const Sentence = require('./index.js')

/**
 * Constants
 */
const Vocabulary = {
  adjective: ['big', 'long', 'short', 'tall', 'hopeless', 'helpful'],
  verb: ['change', 'surf', 'climb', 'defenestrate', 'optimize']
}

test('toBeSameSentenceOnTwoGetCalls', () => {
  let template = 'This is a really {adjective} sentence that I don\'t think should ever {verb}.'
  let sentence = Sentence(template, Vocabulary)

  expect(sentence.get()).toBe(sentence.get())
});

test('ableToHandleTemplatesWithNumbers', () => {
  let template = 'This is a really {1} sentence that I don\'t think should ever {2}.'
  let vocab = {
    1: ['big', 'bad', 'wolf'],
    2: ['change', 'climb']
  }

  expect(() => Sentence(template, vocab).get()).not.toThrow();
});
