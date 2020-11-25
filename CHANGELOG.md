# Changelog

## [0.8.0](../../tree/v0.8.0)
> 25.11.2020
### Breaking :boom:
* **Changed** return type of `Sentence.generate` to string

## [0.7.0](../../tree/v0.7.0)
> 21.11.2020
### Breaking :boom:
* **Changed** various types and interfaces
* **Removed** method `restoreDefaults` from `SentenceFactory`
### Features :tada:
* **Added** needlessly complex esm build process
* **Added** automatic type declarations to compile
* **Added** following types to exports:
  * `Template` `Vocabulary` `Options` `Configuration` `StringResolvable` `WeightedEntry`
### Bugfixes :bug:
* **Fixed** various issues/bugs with special characters in placeholder notation

## [0.6.1](../../tree/v0.6.1)
### Bugfix :bug:
* **Fix** error where adding `a-` or `-s` to a placeholder would break during runtime

## [0.6.0](../../tree/v0.6.0) - Weighted Types
> 24.08.2020
### Breaking :boom:
* **Changed** method `addVocab` to `addVocabulary` in class `Sentence`
* **Removed** method `setOptions` in class `Sentence`
* **Removed** option `allowDuplicates`
### Features :tada:
* **Added** type `WeightedTemplate`
* **Added** type `WeightedVocabulary`
* **Added** type `WeightedEntry`
* **Added** setter `options` in `Sentence`
* **Added** getter `weightedTemplates` in `Sentence`
* **Added** getter `weightedVocabulary` in `Sentence`
* **Changed** resolution of duplicates so that they simply increases the given entry's weight
### Bugfixes :bug:
* **Fix** `addVocabulary` so that it appends instead of overwriting

## [0.5.2](../../tree/v0.5.2) - StringResolvable
> 18.08.2020
### Features :tada: 
* **Added** type `StringResolvable`
* **Change** type `Template` to accept StringResolvable
* **Change** type `Vocabulary` to accept StringResolvable

## [0.5.1](../../tree/v0.5.1)
> 17.08.2020
* :bug: **Fix** issue where option `forceNewSentence` would have no effect

## [0.5.0](../../tree/v0.5.0) - TypeScript
> 16.08.2020
### Breaking :boom:
* **Refactored** entire project to TypeScript
* **Removed** default export, should now defer to importing `createSentence` for the default behaviour
* **Removed** or **changed** all other exports
### Features :tada:
* **Added** class `Sentence` to exports
* **Added** class `SentenceFactory` to exports

## [0.4.2](../../tree/v0.4.2) - 11.08.2020
### Documentation
* :nut_and_bolt: **Change** package keywords
* :nut_and_bolt: **Change** package description
* :nut_and_bolt: **Change** README

## [0.4.1](../../tree/v0.4.1) - 30.07.2020
* :tada: **New** option `allowDuplicates` now functions as expected
* :tada: **New** option `capitalize` now functions as expected
* :tada: **New** option `placeholderNotation`
* :boom: **Changed** option `preserveCurlyBrackets` to `preservePlaceholderNotation`
* :bug: **Fix** `setOptions` so that it no longer resets unspecified options to previous defaults

## [0.4.0](../../tree/v0.4.0) - 26.07.2020
### Features
* :tada: **New** option `forceNewSentence`, which will force `Sentence.generate()` to avoid duplicate of previous sentence when possible
* :tada: **New** method `restoreDefaults()` available at entry point
### Development
* :nut_and_bolt: **Add** jest for testing
* :nut_and_bolt: **Add** eslint for linting
* :nut_and_bolt: **Add** .npmignore
* :nut_and_bolt: **Add** Github Workflows for CI/CD
* :nut_and_bolt: **Change** validation to module `validator`
* :nut_and_bolt: **Change** defaults to module `defaults`
* :nut_and_bolt: **Various** other changes and improvements to readability and encapsulation
