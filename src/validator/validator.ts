import defaults from '../defaults';

export class Validator {
  options = defaults.options;
  templates = defaults.templates;
  vocabulary = defaults.vocabulary;

  public validateOptions(options: Options, alt: Options = this.options): Options {
    return validateOptions(options, alt);
  }

  public validateTemplates(templates: string[] | string, alt: string[] | string = this.templates): string[] {
    return validateTemplates(templates, alt);
  }

  public validateVocabulary(vocabulary: Vocabulary, alt: Vocabulary = this.vocabulary): Vocabulary {
    return validateVocabulary(vocabulary, alt);
  }
}

export const validateOptions = (options: Options, alt?: Options): Options => {
  return { ...defaults.options, ...alt, ...options };
}

export const validateTemplates = (templates: string[] | string, alt?: string[] | string): string[] => {
  return [templates || alt || defaults.templates].flat();
}

export const validateVocabulary = (vocabulary: Vocabulary, alt?: Vocabulary): Vocabulary => {
  return vocabulary || alt || defaults.vocabulary;
}
