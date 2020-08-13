import defaults from './defaults';
import Sentence from '../sentence';

export default class SentenceFactory {
  public defaultTemplates: Templates | Template = defaults.templates;
  public defaultVocabulary: Vocabulary = defaults.vocabulary;
  public defaultOptions?: MaybeOptions;

  public createSentence(
    templates?: Templates | Template,
    vocabulary?: Vocabulary,
    options?: MaybeOptions
  ): Sentence {
    return new Sentence(
      templates || this.defaultTemplates,
      vocabulary || this.defaultVocabulary,
      options || this.defaultOptions,
    );
  }

  public configure(config: Configuration): void {
    const { options, templates, vocabulary } = config;
    if (options) this.defaultOptions = { ...this.defaultOptions, ...options };
    if (templates) this.defaultTemplates = templates;
    if (vocabulary) this.defaultOptions = vocabulary;
  }
  
  public addDefaultOptions(options: MaybeOptions): void {
    this.defaultOptions = {
      ...this.defaultOptions,
      ...options,
    };
  }

  public addDefaultTemplates(...templates: Templates | Templates[]): void {
    this.defaultTemplates = this.defaultTemplates.concat(...templates.flat());
  }

  public addDefaultVocabulary(vocab: Vocabulary): void {
    this.defaultVocabulary = Object.assign(this.defaultVocabulary, vocab);
  }

  public restoreDefaults(): void {
    this.defaultTemplates = defaults.templates;
    this.defaultVocabulary = defaults.vocabulary;
  }
}
