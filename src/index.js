'use strict'

const Sentence = require('./Sentence.js')
const _ = require('lodash')

/**
 * Constants that keep the initial settings
 */
const {
    templates: InitialTemplates,
    vocabulary: InitialVocabulary,
    options: InitialOptions,
} = require('./defaults.json')

/**
 * Variables to store standard settings for the sentence engine
 * The standard settings can be changed by the user
 */
let standardTemplates = [...InitialTemplates]
let standardVocabulary = _.cloneDeep(InitialVocabulary)
let standardOptions = _.cloneDeep(InitialOptions)

/**
 * The function exported as the interface for the package
 */
function SentenceInterface(template, vocabulary, options) {
    if(vocabulary && typeof(vocabulary) != 'object') {
        throw new TypeError('Argument "vocabulary" was expected to be an object.')
    }
    if(options && typeof(options) != 'object') {
        if(typeof(options) != 'object') {
            throw new TypeError('Argument "options" was expected to be an object.')
        } else {
            options = Object.assign(_.cloneDeep(standardOptions), options)
        }
    }

    return new Sentence(
        template || standardTemplates,
        vocabulary || standardVocabulary,
        options || standardOptions
    )
}

SentenceInterface.setStandardTemplates = (templates) => standardTemplates = Array.isArray(templates) ? templates : _.cloneDeep(InitialTemplates)
SentenceInterface.setStandardVocab = (vocab) => standardVocabulary = vocab || _.cloneDeep(InitialVocabulary)
SentenceInterface.setStandardOptions = (options) => standardOptions = options ? Object.assign(standardOptions, options) : _.cloneDeep(InitialOptions)

// Export the interface
module.exports = SentenceInterface
