import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { Language } from './language';
import { BaseEntity } from './base-entity';
import { TextContent } from './text-content';

@Entity()
export class TextTranslation extends BaseEntity {
  @ManyToOne({ primary: true })
  textContent!: TextContent;

  @ManyToOne({ primary: true })
  language!: Language;

  @Property()
  translatedText!: string;

  constructor(textContent: TextContent, language: Language, translatedText: string) {
    super();
    this.textContent = textContent;
    this.language = language;
    this.translatedText = translatedText;
  }

  businessKey(): string[] {
    return [...this.textContent.businessKey(), ...this.language.businessKey()];
  }
  friendlyKey(): string {
    return `${this.textContent.asSubject()}: ${this.language.businessKey()}`;
  }
}
