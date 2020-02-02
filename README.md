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
let sentence = new Sentence('This is {a-adjective} template.', vocabulary)

// In this case the output could be "This is an awesome template."
console.log(sentence.get())
```
