'use strict'

const Insult = require('./Insult.js')

setInterval(() => console.log(new Insult().get()), 2000)
