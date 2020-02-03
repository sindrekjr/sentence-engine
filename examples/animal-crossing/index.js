
const Sentence = require('../../src')

Sentence.setStandardTemplates([
	'{a-animal} crossed the {object}.', 
	'The {animal} crossed the {object}.'
])
Sentence.setStandardVocab({
	animal: ['duck', 'fox', 'bear', 'comodo dragon'],
	object: ['road', 'chessboard', 'window', 'tic-tac-toe']
})

// Create an instance of Sentence and log it out
let sentenceInstance = Sentence()
console.log('sentenceInstance (after initialization):', sentenceInstance.get())

// Revert standards to initial states
Sentence.setStandardTemplates()
Sentence.setStandardVocab()

// Verify that instance of sentence is the same
console.log('sentenceInstance (after reverting package standards):', sentenceInstance.get())

// Verify that new instance of sentence is based on initial states
console.log('new sentence:', Sentence().get())
