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

export interface PlaceholderNotation {
  start: string;
  end: string;
}

export interface Vocabulary {
  [fieldName: string]: Array<StringResolvable | WeightedEntry>;
}

export interface WeightedVocabulary {
  [fieldName: string]: WeightedEntry[];
}

export interface WeightedEntry {
  entry: StringResolvable;
  weight: number;
}

export type Template = StringResolvable | WeightedEntry;

export type WeightedTemplate = WeightedEntry;

export type StringResolvable = {
  (): string
} | string;
