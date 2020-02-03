'use strict'

const Sentence = require('../../src')

const template = '{start} {middle} {end}'
const components = require('./components.json')

let nonsense = Sentence(template, components)
console.log(nonsense.get())
