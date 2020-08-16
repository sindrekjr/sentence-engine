declare interface Sentence {
  options: Options;
  templates: Template[];
  vocabulary: Vocabulary;
  sentence: string;
}

declare interface SentenceFactory {
  defaultOptions: MaybeOptions;
  defaultTemplates: Template | Template[];
  defaultVocabulary: Vocabulary;
}

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
}

declare interface MaybeOptions {
  allowDuplicates?: boolean;
  capitalize?: boolean;
  forceNewSentence?: boolean;
  placeholderNotation?: {
    start: string;
    end: string;
  } | string;
  preservePlaceholderNotation?: boolean;
}

declare type Template = string;

declare type WeightedTemplate = {
  template: Template;
  weight?: number;
};

declare type Vocabulary = {
  [fieldName: string]: string[];
};

declare type WeightedVocabulary = {
  [fieldName: string]: {
    entry: string;
    weight?: number;
  }[]
};

declare interface Array<T> {
  any(): T;
  unique(): T[];
}
