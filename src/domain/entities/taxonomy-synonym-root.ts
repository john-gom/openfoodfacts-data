import { Entity, ManyToOne, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { Taxonomy } from './taxonomy';
import { Language } from './language';
import { Ulid } from 'id128';
import { BaseEntity } from './base-entity';

@Entity()
@Unique({ properties: ['taxonomy', 'language', 'rootWord'] })
export class TaxonomySynonymRoot extends BaseEntity {
  @PrimaryKey({ type: 'uuid' })
  id = Ulid.generate().toRaw();

  @ManyToOne()
  taxonomy!: Taxonomy;

  @ManyToOne()
  language!: Language;

  @Property()
  rootWord!: string;

  constructor(taxonomy: Taxonomy, language: Language, rootWord: string) {
    super();
    this.taxonomy = taxonomy;
    this.language = language;
    this.rootWord = rootWord;
  }


  businessKey(): string[] {
    return [...this.taxonomy.businessKey(), ...this.language.businessKey(), this.rootWord];
  }
}
