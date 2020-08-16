# Sentence Engine
[![npm version](https://badge.fury.io/js/sentence-engine.svg)](https://badge.fury.io/js/sentence-engine)
[![build](https://github.com/sindrekjr/sentence-engine/workflows/build/badge.svg?branch=master)](https://github.com/sindrekjr/sentence-engine/actions)
-
An easy-to-use sentence generator running on [Node.js](https://nodejs.org/). It takes a template and vocabulary freely defined by the user. 

## Features
#### TypeScript
Written in [TypeScript](https://www.typescriptlang.org/); compiles to ES2019 Javascript

#### Full User Control
The project follows an ideal where templates and vocabulary should be fully customizable by the user. Vocabularies have no predefined keys and template placeholders are configurable. 

#### Lightweight and object-oriented
Usage may be done easily through a set of simple entry methods, which utilize underlying classes Sentence and SentenceFactory. However, these classes are also exposed in case they are better interacted with directly, or extended into local class implementations.

## Usage
#### `createSentence(templates, vocabulary, options) => Sentence`
```
const { createSentence } = require('sentence-engine');
const anInstanceOfTheSentenceClass = createSentence(someTemplate, someVocabulary);
const { value } = sentence;
```
`createSentence` can be considered the default method of the project. It will return a Sentence object which you may choose to store for later usage, or immediately deconstruct for the generated sentence.

#### `configure(config)`
```
const { createSentence, configure } = require('sentence-engine');
const configuration = {
  options: someOptions,
  templates: someTemplates,
  vocabulary: someVocabulary,
};
configure(configuration);
const { value } = createSentence(); // will use the above configuration by default
const { value } = createSentence(someOtherTemplate); // will use someOtherTemplate
```
`configure` may be used to define default values for your templates, vocabulary, and options. If these are defined, they will automatically be provided to any sentence you call for through the default `createSentence` entry point, unless you provide new arguments to that method.

#### `addDefaultOptions(options)` `addDefaultTemplates(...templates)` `addDefaultVocabulary(vocabulary)`
These methods may be used to extend the configurations you've already set with additional templates and vocabularies. Note that "adding" more options is essentially the same as passing them through the `configure` method. 

  

### Templates, Vocabulary
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

### Options
There are also a set of options that may be used to configure how the sentence generation behaves. 

#### Allow Duplicates
```
Sentence(template, vocabulary, { allowDuplicates: true }); 
```
Allow duplicate templates and vocabulary words/phrases to be stored, thereby increasing the chances of it being chosen randomly. In the future the sentence-engine will support weight templates and vocabularies. 
#### Capitalize
```
Sentence(template, vocabulary, { capitalize: true }); 
```
Will capitalize inserted words if they appear at the start of a string, or after a full-stop. 
#### Force New Sentence
```
Sentence(template, vocabulary, { forceNewSentence: true });
```
Will force `Sentence.generate()` to refresh the stored sentence until it is different from the previous sentence, if possible. 
#### Placeholder Notation
```
Sentence(template, vocabulary, { placeholderNotation: '{ }' });
```
May be set to change the notation used to detect placeholders to be changed by the templating engine. Start `{` and end `}` are separated by a single space. 
#### Preserve Placeholder Notation
```
Sentence(template, vocabulary, { preservePlaceholderNotation: true });
```
If set to true, the output generated by `Sentence.generate()` will now keep the chosen placeholders around generated words/phrases. 

Note that you may call `Sentence.generate()` to randomly recreate the sentence with the parameters given when initially instantiating the Sentence object. This way it's possible to easily maintain several sentences that are randomly generated and regenerated with different rules for each of them. 

### Defaults
Defaults for templates, vocabulary, and options are found [here](src/defaults). 

## Development
Early stages and likely to see fundamental changes. 

### Contributing
Sure!

### Background
The package is inspired by the TV show Better Off Ted's episode S2E8 "The Impertence of Communicationizing", and started off as a proof-of-concept for the insult formula introduced in the episode. 
