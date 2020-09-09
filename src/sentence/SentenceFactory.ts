/* eslint-disable no-unused-vars */
import {
  Template,
  Vocabulary,
  Options,
  Configuration
} from '../../types';
/* eslint-enable no-unused-vars */

import { Sentence } from './Sentence';

export class SentenceFactory {
  public defaultTemplates: Template[] | Template;
  public defaultVocabulary: Vocabulary;
  public defaultOptions: Options;

  public constructor(
    templates: Template[] | Template,
    vocabulary: Vocabulary,
    options: Options = {},
  ) {
    this.defaultTemplates = templates;
    this.defaultVocabulary = vocabulary;
    this.defaultOptions = options;
  }

  public createSentence(
    templates: Template[] | Template = this.defaultTemplates,
    vocabulary: Vocabulary = this.defaultVocabulary,
    options: Options = this.defaultOptions,
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

  public addDefaultOptions(options: Options): SentenceFactory {
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

  public addDefaultVocabulary(vocabulary: Vocabulary): SentenceFactory {
    for (const key in vocabulary) {
      vocabulary[key] = (vocabulary[key] as []).concat(this.defaultVocabulary[key] as []);
    }
    this.defaultVocabulary = Object.assign(this.defaultVocabulary, vocabulary);
    return this;
  }
}
