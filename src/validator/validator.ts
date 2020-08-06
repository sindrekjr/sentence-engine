import defaults from '../defaults';

export class Validator {
  options = defaults.options;
  templates = defaults.templates;
  vocabulary = defaults.vocabulary;

  public validateOptions(options: Options, alt: Options = this.options): Options {
    return validateOptions(options, alt);
  }

  public validateTemplates(templates: string[], alt: string[] = this.templates): string[] {
    return validateTemplates(templates, alt);
  }

  public validateVocabulary(vocabulary: Vocabulary, alt: Vocabulary = this.vocabulary): Vocabulary {
    return validateVocabulary(vocabulary, alt);
  }
}

export const validateOptions = (options: Options, alt?: Options): Options => {
  return { ...defaults.options, ...alt, ...options };
}

export const validateTemplates = (templates: string[], alt?: string[]): string[] => {
  return templates || alt || defaults.templates;
}

export const validateVocabulary = (vocabulary: Vocabulary, alt?: Vocabulary): Vocabulary => {
  return vocabulary || alt || defaults.vocabulary;
}
