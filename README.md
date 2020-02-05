# sentence-engine
A simple sentence generator running on [Node.js](https://nodejs.org/). It takes a template and vocabulary freely defined by the user. 

## Features
* Unbound vocabulary; define use case-specific categories or adhere to conventional keywords
* Object-oriented
* Lightweight

## Usage
#### Install
```
> npm i sentence-engine
```
#### Import & Use
```
// import: 
const Sentence = require('sentence-engine')

// initialize Sentence object, here with no arguments:
let sentence1 = Sentence()
console.log(sentence1) // <-- outputs "Sentence { }" (object instance)
console.log(sentence1.get()) // <-- outputs "hello, world" (generated sentence string)
```
Calling Sentence() creates an object of a Sentence class which stores a template, vocabulary, and a set of options. In the case above we pass no arguments and the object is simply given some [default values](./src/defaults.json) and resolves to "hello, world". See [Sentence.js](./src/Sentence.js) for the class implementation. 

By passing a template and/or vocabulary, the sentence engine becomes much more powerful. See examples below. 

```
let template = 'This is {a-adjective} template.'
let vocabulary = {
  adjective: ['awesome', 'bad', 'great', 'repulsive']
}
console.log(Sentence(template, vocabulary).get()) // <-- might output "This is an awesome template"
```
In the above example, we pass a single template. We can also pass several templates for the engine to choose between. 
```
let templates = [
  'This is {a-adjective} template.',
  'This template is {adjective}.'
]
console.log(Sentence(templates, vocabulary).get())
```
Some use cases may want to store an instance of Sentence for later use. Doing this allows the user to generate a new sentence with the arguments that were passed initially. 
```
let sentence = Sentence(templates, vocabulary) // Sentence constructor initializes itself with generate()
sentence.generate() // user may call generate method to recreate the sentence on the object
```

#### Examples
* [Animal crossing](./examples/animal-crossing)
* [Hello, world](./examples/hello-world)
* [Nonsense](./examples/nonsense)

## Development
Early stages and likely to see fundamental changes. 

### Contributing
Sure!

### Background
The package is inspired by the TV show Better Off Ted's episode S2E8 "The Impertence of Communicationizing", and started off as a proof-of-concept for the insult formula introduced in the episode. 
