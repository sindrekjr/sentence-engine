# Sentence Engine
[![npm version](https://badge.fury.io/js/sentence-engine.svg)](https://badge.fury.io/js/sentence-engine)
[![master](https://github.com/sindrekjr/sentence-engine/workflows/master/badge.svg?branch=master)](https://github.com/sindrekjr/sentence-engine/actions)
[![develop](https://github.com/sindrekjr/sentence-engine/workflows/develop/badge.svg?branch=develop)](https://github.com/sindrekjr/sentence-engine/actions)
-
An easy-to-use sentence generator running on [Node.js](https://nodejs.org/). It takes a template and vocabulary freely defined by the user. 

## Features
* Unbound vocabulary; define use case-specific categories or adhere to conventional keywords
* Object-oriented
* Lightweight

## Usage
```
const Sentence = require('sentence-engine');

const defaultSentence = Sentence(); // instantiates Sentence object
console.log(defaultSentence.get()); // outputs "hello, world"
```
Calling Sentence() creates an object of the Sentence class which stores a template, vocabulary, and a set of options. In the case above we pass no arguments and the object is simply given some [default values](./src/defaults) and resolves to "hello, world". See [Sentence.js](./src/sentence/Sentence.js) for the class implementation.

By passing a template and/or vocabulary, the engine becomes much more powerful. See examples below.

```
const template = 'This is {a-adjective} template.'
const vocabulary = {
  adjective: ['awesome', 'bad', 'great', 'repulsive']
};
console.log(Sentence(template, vocabulary).get()); // <-- might output "This is an awesome template"
```
In the above example, we pass a single template. We can also pass several templates for the engine to choose between.
```
const templates = [
  'This is {a-adjective} template.',
  'This template is {adjective}.'
];
console.log(Sentence(templates, vocabulary).get());
```

Note that you may call `Sentence.generate()` to randomly recreate the sentence with the parameters given when initially instantiating the Sentence object. This way it's possible to easily maintain several sentences that are randomly generated and regenerated with different rules for each of them. 

## Development
Early stages and likely to see fundamental changes. 

### Contributing
Sure!

### Background
The package is inspired by the TV show Better Off Ted's episode S2E8 "The Impertence of Communicationizing", and started off as a proof-of-concept for the insult formula introduced in the episode. 
