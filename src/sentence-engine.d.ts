declare interface Configuration {
  options?: MaybeOptions;
  templates?: Templates;
  vocabulary?: Vocabulary;
}

declare interface Options {
  allowDuplicates: boolean;
  capitalize: boolean;
  forceNewSentence: boolean;
  placeholderNotation: {
    start: string;
    end: string;
  };
  preservePlaceholderNotation: boolean;
};

declare interface MaybeOptions {
  allowDuplicates?: boolean;
  capitalize?: boolean;
  forceNewSentence?: boolean;
  placeholderNotation?: {
    start: string;
    end: string;
  } | string;
  preservePlaceholderNotation?: boolean;
};

declare type Template = string;

declare type Templates = Template[];

declare type WeightedTemplates = {
  [fieldName: number]: Template
};

declare type Vocabulary = {
  [fieldName: string]: string[];
};

declare type WeightedVocabulary = {
  [fieldName: string]: {
    [fieldName: number]: string
  }
};

declare interface Array<T> {
  any(): T;
  unique(): T[];
}
