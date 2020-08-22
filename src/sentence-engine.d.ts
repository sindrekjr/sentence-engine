declare interface Sentence {
  options: Options;
  templates: Template[];
  vocabulary: Vocabulary;
  value: string;
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
  placeholderNotation?: PlaceholderNotation | string;
  preservePlaceholderNotation?: boolean;
}

declare type PlaceholderNotation = {
  start: string;
  end: string;
};

declare type Template = StringResolvable | WeightedTemplate;

declare type WeightedTemplate = {
  template: StringResolvable;
  weight: number;
};

declare type Vocabulary = {
  [fieldName: string]: StringResolvable[];
} | WeightedVocabulary;

declare type WeightedVocabulary = {
  [fieldName: string]: WeightedEntry[]
};

declare type WeightedEntry = {
  entry: StringResolvable;
  weight: number;
};

declare type StringResolvable = {
  (): string
} | string;

declare interface Array<T> {
  any(): T;
  unique(): T[];
}
