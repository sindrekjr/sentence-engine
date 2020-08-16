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
These methods may be used to extend the configurations you've already set with additional templates and vocabularies. Note that "adding" more options is essentially the same as passing them through the `configure` function. If you need to remove templates or vocabularies, use the `configure` function or `restoreDefaults`.

#### `restoreDefaults()`
This function will simply restore the default templates, vocabularies, and options.

### Options
#### `allowDuplicates: boolean`
```
createSentence(template, vocabulary, { allowDuplicates: true });
```
If true, duplicate templates and words/phrases in a vocabulary can be stored, thereby increasing the chances of it being chosen randomly. In the future the sentence-engine will support weighted templates and vocabularies, possibly making this option redundant or merely a shorthand.
#### `capitalize: boolean`
```
createSentence(template, vocabulary, { capitalize: true });
```
If true, generated words will be capitalized when they appear at the start of a string or after a full-stop.
#### `forceNewSentence: boolean`
```
createSentence(template, vocabulary, { forceNewSentence: true });
```
If true and a new unique sentence is possible, then sentence generation will repeat until one is found.
#### `placeholderNotation: string` || `placeholderNotation: { start: string, end: string }`
```
createSentence(template, vocabulary, { placeholderNotation: '{ }' });
createSentence(template, vocabulary, { placeholderNotation: { start: '{', end: '}' } });
```
May be set to change the notation used to detect placeholders to be changed by the templating engine. Note that notation start and end may be defined by space separation or explicit field references (except when manipulating the options object directly on the Sentence class).
#### `preservePlaceholderNotation: boolean`
```
createSentence(template, vocabulary, { preservePlaceholderNotation: true });
```
If true, then sentence generation will retain the placeholder notation around generated words/phrases.

## Development
Early stages and likely to see fundamental changes.

### Contributing
Sure!

### Background
The package is inspired by the TV show Better Off Ted's episode S2E8 "The Impertence of Communicationizing", and started off as a proof-of-concept for the insult formula introduced in the episode.
