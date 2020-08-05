declare type Vocabulary = {
  [fieldName: string]: string[];
}

declare type Options = {
  allowDuplicates: boolean;
  capitalize: boolean;
  forceNewSentence: boolean;
  placeholderNotation: {
    start: string;
    end: string;
  };
  preservePlaceholderNotation: boolean;
}

declare interface Array<T> {
  any(): T;
  unique(): T[];
}

Array.prototype.any = function() {
  return this[Math.floor(Math.random() * this.length)];
};

Array.prototype.unique = function() {
  const a = this.concat();
  for (let i = 0; i < a.length; ++i) {
    for (let j = i + 1; j < a.length; ++j) {
      if (a[i] === a[j]) a.splice(j--, 1);
    }
  }

  return a;
};
