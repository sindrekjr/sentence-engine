'use strict'

const Sentence = require('../../src')
const {
    templates,
    vocabulary
} = require('./data.json')

module.exports = class Insult extends Sentence {
    constructor() {
        super(templates, vocabulary)
    }
}
