# Changelog

## [0.4.1](../../tree/v0.4.1) - 30.07.2020
* :tada: **New** option `allowDuplicates` now functions as expected
* :tada: **New** option `capitalize` now functions as expected
* :tada: **New** option `placeholderNotation`
* :boom: **Changed** option `preserveCurlyBrackets` to `preservePlaceholderNotation`
* :bug: **Fix** `setOptions` so that it no longer resets unspecified options to previous defaults

## [0.4.0](../../tree/v0.4.0) - 26.07.2020
#### Features
* :tada: **New** option `forceNewSentence`, which will force `Sentence.generate()` to avoid duplicate of previous sentence when possible
* :tada: **New** method `restoreDefaults()` available at entry point
#### Development
* :nut_and_bolt: **Add** jest for testing
* :nut_and_bolt: **Add** eslint for linting
* :nut_and_bolt: **Add** .npmignore
* :nut_and_bolt: **Add** Github Workflows for CI/CD
* :nut_and_bolt: **Change** validation to module `validator`
* :nut_and_bolt: **Change** defaults to module `defaults`
* :nut_and_bolt: **Various** other changes and improvements to readability and encapsulation
