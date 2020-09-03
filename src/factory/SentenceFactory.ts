/* eslint-disable no-unused-vars */
import {
  Template,
  Vocabulary,
  MaybeOptions,
  Configuration
} from '../../types';
/* eslint-enable no-unused-vars */

import defaults from './defaults';
import { Sentence } from '../sentence';

export class SentenceFactory {
  public defaultTemplates: Template[] | Template = defaults.templates;
  public defaultVocabulary: Vocabulary = defaults.vocabulary;
  public defaultOptions?: MaybeOptions;

  public createSentence(
    templates?: Template[] | Template,
    vocabulary?: Vocabulary,
    options?: MaybeOptions,
  ): Sentence {
    return new Sentence(
      templates || this.defaultTemplates,
      vocabulary || this.defaultVocabulary,
      { ...this.defaultOptions, ...options },
    );
  }

  public configure(config: Configuration): SentenceFactory {
    const { options, templates, vocabulary } = config;
    if (options) this.defaultOptions = { ...this.defaultOptions, ...options };
    if (templates) this.defaultTemplates = templates;
    if (vocabulary) this.defaultVocabulary = vocabulary;
    return this;
  }

  public addDefaultOptions(options: MaybeOptions): SentenceFactory {
    this.defaultOptions = {
      ...this.defaultOptions,
      ...options,
    };
    return this;
  }

  public addDefaultTemplates(...templates: Template[]): SentenceFactory {
    this.defaultTemplates = templates.concat(this.defaultTemplates);
    return this;
  }

  public addDefaultVocabulary(vocab: Vocabulary): SentenceFactory {
    for (const key in vocab) {
      vocab[key] = (vocab[key] as []).concat(this.defaultVocabulary[key] as []);
    }
    this.defaultVocabulary = Object.assign(this.defaultVocabulary, vocab);
    return this;
  }

  public restoreDefaults(): SentenceFactory {
    this.defaultOptions = {};
    this.defaultTemplates = defaults.templates;
    this.defaultVocabulary = defaults.vocabulary;
    return this;
  }
}
