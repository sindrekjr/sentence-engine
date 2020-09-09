export interface Configuration {
  options?: Options;
  templates?: Template[];
  vocabulary?: Vocabulary;
}

export interface DefinitelyOptions {
capitalize: boolean;
  forceNewSentence: boolean;
  placeholderNotation: PlaceholderNotation;
  preservePlaceholderNotation: boolean;
}

export interface Options {
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
