'use strict'

const Sentence = require('./Sentence.js')

/**
 * Constants that keep the initial settings
 */
const InitialTemplates = [
    '{greeting}, {noun}.'
]
const InitialVocabulary = {
    greeting: ['hello'],
    noun: ['world']
}
const InitialOptions = {
    allowDuplicates: true
}

/**
 * Variables to store standard settings for the sentence engine
 * The standard settings can be changed by the user
 */
let standardTemplates = InitialTemplates
let standardVocabulary = InitialVocabulary
let standardOptions = InitialOptions

/**
 * The function exported as the interface for the package
 */
function SentenceInterface(template, vocabulary, options) {
    return new Sentence(
        template || standardTemplates,
        vocabulary || standardVocabulary,
        options || standardOptions
    )
}

SentenceInterface.setStandardTemplates = (templates) => standardTemplates = templates
SentenceInterface.setStandardVocab = (vocab) => standardVocabulary = vocab
SentenceInterface.setStandardOptions = (options) => standardOptions = options

// Export the interface
module.exports = SentenceInterface
