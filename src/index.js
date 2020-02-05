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
let standardTemplates, standardVocabulary, standardOptions

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

/**
 * Assign a set of public utility methods to the interface
 */
Object.assign(SentenceInterface, {
    /**
     * Adders
     */
    addTemplates(...templates) {
        this.setTemplates(standardTemplates.concat(templates))
    },
    addVocab(vocab) {

    },

    /**
     * Getters
     */
    getTemplates() {
        return standardTemplates
    },
    getVocab() {
        return standardVocabulary
    },
    getOptions() {
        return standardOptions
    },

    /**
     * Setters
     */
    setTemplates(...templates) {
        templates = templates.flat()
        standardTemplates = templates.length ? templates : [...InitialTemplates]
    },
    setVocab(vocab) {
        standardVocabulary = vocab || _.cloneDeep(InitialVocabulary)
    },
    setOptions(options) {
        standardOptions = options ? Object.assign(standardOptions, options) : _.cloneDeep(InitialOptions)
    }
})

// Call setters to initialize standard settings
SentenceInterface.setTemplates()
SentenceInterface.setVocab()
SentenceInterface.setOptions()

// Export the interface
module.exports = SentenceInterface
