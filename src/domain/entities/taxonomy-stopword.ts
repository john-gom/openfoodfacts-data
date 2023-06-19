import { Entity, ManyToOne, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { Taxonomy } from './taxonomy';
import { Language } from './language';
import { Ulid } from 'id128';
import { BaseEntity } from './base-entity';

@Entity()
@Unique({ properties: ['taxonomy', 'language', 'stopWord'] })
export class TaxonomyStopword extends BaseEntity {
  @PrimaryKey({ type: 'uuid' })
  id = Ulid.generate().toRaw();

  @ManyToOne()
  taxonomy!: Taxonomy;

  @ManyToOne()
  language!: Language;

  @Property()
  stopWord!: string;

  constructor(taxonomy: Taxonomy, language: Language, stopWord: string) {
    super();
    this.taxonomy = taxonomy;
    this.language = language;
    this.stopWord = stopWord;
  }

  businessKey(): string[] {
    return [...this.taxonomy.businessKey(), ...this.language.businessKey(), this.stopWord];
  }
}
