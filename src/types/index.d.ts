export interface Configuration {
  options?: MaybeOptions;
  templates?: Templates;
  vocabulary?: Vocabulary;
}

export interface Options {
  capitalize: boolean;
  forceNewSentence: boolean;
  placeholderNotation: {
    start: string;
    end: string;
  };
  preservePlaceholderNotation: boolean;
}

export interface MaybeOptions {
  capitalize?: boolean;
  forceNewSentence?: boolean;
  placeholderNotation?: PlaceholderNotation | string;
  preservePlaceholderNotation?: boolean;
}

export type PlaceholderNotation = {
  start: string;
  end: string;
};

export type Template = StringResolvable | WeightedTemplate;

export type WeightedTemplate = WeightedEntry;

export type Vocabulary = {
  [fieldName: string]: StringResolvable[];
} | WeightedVocabulary;

export type WeightedVocabulary = {
  [fieldName: string]: WeightedEntry[]
};

export type WeightedEntry = {
  entry: StringResolvable;
  weight: number;
};

export type StringResolvable = {
  (): string
} | string;
