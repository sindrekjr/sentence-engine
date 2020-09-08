export const templates = [
  '{greeting}, {noun}. I am the {default} Sentence{self}.'
];

export const vocabulary = {
  greeting: [ 'hello', 'greetings' ],
  noun: [ 'world', 'user' ],
  default: [ 'default', 'example' ],
  self: [ 'Factory', 'Engine', 'r' ]
};

export default { templates, vocabulary };
