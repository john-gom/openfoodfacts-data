import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Language } from './language';
import { Ulid } from 'id128';
import { TaxonomyEntity } from './taxonomy-entity';

@Entity()
export class TextContent extends TaxonomyEntity {
  @PrimaryKey({ type: 'uuid' })
  id = Ulid.generate().toRaw();

  @Property()
  subject: string;

  @ManyToOne()
  originalLanguage!: Language;

  @Property()
  originalText!: string;

  constructor(context: string, originalLanguage: Language, originalText: string, originalLine?: number) {
    super(originalLine);
    this.subject = context;
    this.originalLanguage = originalLanguage;
    this.originalText = originalText;
  }

  businessKey(): string[] {
    return [this.id];
  }

  asSubject(): string {
    return `${this.subject}: ${this.originalText}`;
  }
}
