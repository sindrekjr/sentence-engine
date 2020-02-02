'use strict'

module.exports = class Sentence {
    constructor(template, vocab, options) {
        Object.defineProperties(this, {
            template: {
                get() {
                    return template
                },
                set(newTemplate) {
                    template = newTemplate
                }
            },
            vocab: {
                get() {
                    return vocab
                },
                set(newVocab) {
                    vocab = newVocab || getStandardVocabulary()
                }
            }
        })

        this.generate()
    }

    generate() {
        let sentence = this.template
        let matches = sentence.match(/([{](\s*(\w)*,?\s*)*[}])/gi)

        for(let match of matches) {
            let split = match.replace(/{|}|\s/g, '').split(',')
            
            let alternatives = []
            while(split.length) alternatives = alternatives.concat(this.vocab[split.pop()].any())

            sentence = sentence.replace(match, alternatives.any())
        }

        Object.defineProperty(this, 'sentence', {
            value: sentence
        })
    }

    get() {
        return this.sentence
    }
}

Array.prototype.any = function() {
    return this[Math.floor(Math.random() * this.length)]
}
