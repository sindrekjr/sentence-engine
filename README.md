# sentence-engine
This is a straightforward sentence generator which takes a template and a vocabulary that may be sorted in any way desired. It runs on [Node.js](https://nodejs.org/).

The package was inspired by the formula for insults created on episode S2E8 "The Impertence of Communicationizing" of the TV show Better Off Ted, and initially just put together as an on-a-whim proof-of-concept.

### Usage
```
const Sentence = require('sentence-engine')
const vocabulary = {
  adjective: ['awesome', 'bad', 'great', 'repulsive']
}

// the Sentence constructor takes a template and vocabulary
let sentence = Sentence('This is {a-adjective} template.', vocabulary)

// In this case the output could be "This is an awesome template."
console.log(sentence.get())
```
In the above example, we pass a small vocabulary as well as a template to the Sentence API as we call it, but it's also possible to define standard settings onto the module to persist throughout multiple uses. Like so: 
```
Sentence.setStandardTemplates([
  '{a-animal} crossed the {object}.',
  'We would {feeling} to help.'
])
Sentence.setStandardVocab({
  animal: ['duck', 'fox'],
  object: ['road', 'chessboard'],
  feeling: ['love', 'hate']
})

// The following line will now create a sentence instance based on the above settings
let sentence = Sentence()
console.log(sentence.get())

// Changing the standard variables in the future will not affect the previously created sentence object. 
Sentence.setStandardTemplates()
Sentence.setStandardVocab()

// And so the following line will output the same as the previous console output
console.log(sentence.get())
```

### Development
This project is still in early stages and likely to see fundamental changes. 
