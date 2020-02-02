'use strict'

module.exports = class Sentence {
    constructor(template, vocab, options) {
        Object.defineProperties(this, {
            template: {
                value: Array.isArray(template) ? template.any() : template
            },
            vocab: {
                value: vocab
            }
        })

        this.setOptions(options)
        this.generate()
    }

    generate() {
        let sentence = this.template
        let matches = sentence.match(/([{]+(\s*([a-z-])*,?\s*)*[}]+)/gi)

        for(let match of matches) {
            sentence = sentence.replace(match, this.resolveWord(match))
        }

        Object.defineProperty(this, 'sentence', {
            value: sentence
        })
    }

    resolveWord(mask) {
        let a,
            p,
            alternatives = [],
            split = mask.replace(/{|}|\s/g, '').split(',')

        for(let key of split) {
            if(key.substr(0, 2) == 'a-') {
                a = true
                key = key.slice(2)
            }
            if(key.slice(-2) === '-s') {
                let trimmed = key.substr(0, key.length - 2)
                if(Object.keys(this.vocab).includes(trimmed)) {
                    p = true
                    key = trimmed
                }
            }
            alternatives = alternatives.concat(this.vocab[key])
        }

        let word = alternatives.any()
        if(a) word = `${isVowel(word[0]) ? 'an' : 'a'} ${word}`
        if(p) word += 's'

        return word
    }

    setOptions(options) {
        let {
            allowDuplicates,
            capitalize,
            preserveCurlyBrackets
        } = options

        Object.defineProperties(this, {
            allowDuplicates: {
                value: allowDuplicates
            },
            capitalize: {
                value: capitalize
            },
            preserveCurlyBrackets: {
                value: preserveCurlyBrackets
            }
        })
    }

    get() {
        return this.sentence
    }
}

function isVowel(c) {
    c = c.toLowerCase()
    return ['a', 'e', 'i', 'o', 'u'].includes(c)
}

Array.prototype.any = function() {
    return this[Math.floor(Math.random() * this.length)]
}
