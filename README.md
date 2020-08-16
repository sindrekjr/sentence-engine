# Sentence Engine

[![npm version](https://badge.fury.io/js/sentence-engine.svg)](https://badge.fury.io/js/sentence-engine)
[![build](https://github.com/sindrekjr/sentence-engine/workflows/Build/badge.svg?branch=master)](https://github.com/sindrekjr/sentence-engine/actions)

An easy-to-use sentence generator running on [Node.js](https://nodejs.org/). It takes a template and vocabulary freely defined by the user.

## Features
#### TypeScript
Written in [TypeScript](https://www.typescriptlang.org/); compiles to ES2019 Javascript.

#### Full User Control
Focused on versatility, where templates and vocabulary should be fully customizable by the user.

#### Lightweight and object-oriented
Easy to use with `createSentence`, while underlying classes Sentence and SentenceFactory allow for more customizability. 

## Usage
### Template
A template is simply defined as string. When templates are asked for, a single template or an array of templates can be given.

### Vocabulary
A vocabulary is defined as an object where keys should be string and values should be arrays of strings, like so:
```js
const vocabulary = {
  noun: ['table', 'car', 'house'],
  animal: ['bear', 'cat', 'comodo dragon'],
  smalltalk: ['well well well', 'how about that weather?'],
};
```
Notice that vocabularies may be used very widely, whether formally within terms of adjectives, nouns, etc, or for made-up categories or longer phrases.

### `createSentence(templates, vocabulary, options) => Sentence`
```js
const { createSentence } = require('sentence-engine');

const someTemplate = '{example} template.';
const someVocabulary = {
  example: ['example', 'default', 'useless'],
};

const anInstanceOfTheSentenceClass = createSentence(someTemplate, someVocabulary, { capitalize: true }); 
//    ^ Sentence { value: 'Useless template.' }
const { value } = anInstanceOftheSentenceClass;
//      ^ string
```
`createSentence` can be considered the default entry point, and yields a Sentence object when given a template and a vocabulary. You can either store the full Sentence object for later use, or immediately deconstruct for the generated value. 

### `configure(config)`
```js
const { createSentence, configure } = require('sentence-engine');

configure({
  options: someOptions,
  templates: someTemplates,
  vocabulary: someVocabulary,
});
const { value } = createSentence(); // will use the above configuration by default
const { value } = createSentence(someOtherTemplate); // will use someOtherTemplate
```
`configure` may be used to define default values for your templates, vocabulary, and options. If these are defined, they will automatically be provided to any sentence you call for through the default `createSentence` entry point, unless you provide new arguments to that method.

### Sentence
```js
const { Sentence } = require('sentence-engine');

const helloWorldSentence = new Sentence(
  '{greeting}, {noun}',
  { greeting: ['hello'], noun: ['world'] },
);
```
The Sentence class may be utilized if wanting to control sentence generation at the lowest possible level. See the class implementation [here](./src/sentence/Sentence.ts).

### SentenceFactory
```js
const { SentenceFactory } = require('sentence-engine');

const mySentenceFactory = new SentenceFactory();
```
The SentenceFactory class contains all of the functions summaried above as exposed entry functions. The sole purpose of instantiating further factories locally would be to run more than one of them within the same module. For most use cases this is probably not necessary at all. See the class implementation [here](./src/factory/SentenceFactory.ts).

### Options
#### `allowDuplicates: boolean`
```js
createSentence(template, vocabulary, { allowDuplicates: true });
```
If true, duplicate templates and words/phrases in a vocabulary can be stored, thereby increasing the chances of it being chosen randomly. In the future the sentence-engine will support weighted templates and vocabularies, possibly making this option redundant or merely a shorthand.
#### `capitalize: boolean`
```js
createSentence(template, vocabulary, { capitalize: true });
```
If true, generated words will be capitalized when they appear at the start of a string or after a full-stop.
#### `forceNewSentence: boolean`
```js
createSentence(template, vocabulary, { forceNewSentence: true });
```
If true and a new unique sentence is possible, then sentence generation will repeat until one is found.
#### `placeholderNotation: string` || `placeholderNotation: { start: string, end: string }`
```js
createSentence(template, vocabulary, { placeholderNotation: '{ }' });
createSentence(template, vocabulary, { placeholderNotation: { start: '{', end: '}' } });
```
May be set to change the notation used to detect placeholders to be changed by the templating engine. Note that notation start and end may be defined by space separation or explicit field references (except when manipulating the options object directly on the Sentence class).
#### `preservePlaceholderNotation: boolean`
```js
createSentence(template, vocabulary, { preservePlaceholderNotation: true });
```
If true, then sentence generation will retain the placeholder notation around generated words/phrases.

## Contributing
Sure! Feel free to submit PRs or issues.

## Background
The package is inspired by the TV show Better Off Ted's episode S2E8 "The Impertence of Communicationizing", and started off as a proof-of-concept for the insult formula introduced in the episode.
