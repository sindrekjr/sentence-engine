import defaults from '../defaults';

export class Validator {
  options = defaults.options;
  templates = defaults.templates;
  vocabulary = defaults.vocabulary;

  public validateOptions(options: {}, alt: {} = this.options): {} {
    return validateOptions(options, alt);
  }

  public validateTemplates(templates: string[], alt: string[] = this.templates): string[] {
    return validateTemplates(templates, alt);
  }

  public validateVocabulary(vocabulary: { [fieldName: string]: string[] }, alt: { [fieldName: string]: string[] } = this.vocabulary): { [fieldName: string]: string[] } {
    return validateVocabulary(vocabulary, alt);
  }
}

export const validateOptions = (options: {}, alt: {}): {} => {
  return { ...defaults.options, ...alt, ...options };
}

export const validateTemplates = (templates: string[], alt: string[]): string[] => {
  return templates || alt || defaults.templates;
}

export const validateVocabulary = (vocabulary: { [fieldName: string]: string[] }, alt: { [fieldName: string]: string[] }): { [fieldName: string]: string[] } => {
  return vocabulary || alt || defaults.vocabulary;
}
