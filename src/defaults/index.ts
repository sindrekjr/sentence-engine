// eslint-disable-next-line no-unused-vars
import { Template, Vocabulary, DefinitelyOptions } from '../../types';

export const templates: Template[] = [
  '{greeting}, {noun}. I am the {default} Sentence{self}.'
];

export const vocabulary: Vocabulary = {
  greeting: [ 'hello', 'greetings' ],
  noun: [ 'world', 'user' ],
  default: [ 'default', 'example' ],
  self: [ 'Factory', 'Engine', 'r' ]
};

export const options: DefinitelyOptions = {
  capitalize: true,
  forceNewSentence: false,
  placeholderNotation: {
    start: '{',
    end: '}'
  },
  preservePlaceholderNotation: false,
};

export default { templates, vocabulary, options };
