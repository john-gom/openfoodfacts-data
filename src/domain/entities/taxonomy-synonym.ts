import { Entity, ManyToOne, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { Taxonomy } from './taxonomy';
import { Language } from './language';
import { TaxonomySynonymRoot } from './taxonomy-synonym-root';
import { Ulid } from 'id128';
import { BaseEntity } from './base-entity';

@Entity()
@Unique({ properties: ['taxonomy', 'language', 'synonym'] })
export class TaxonomySynonym extends BaseEntity {
  @PrimaryKey({ type: 'uuid' })
  id = Ulid.generate().toRaw();

  @ManyToOne()
  taxonomy!: Taxonomy;

  @ManyToOne()
  language!: Language;

  @Property()
  synonym!: string;

  @ManyToOne()
  rootWord!: TaxonomySynonymRoot;

  constructor(taxonomy: Taxonomy, language: Language, rootWord: TaxonomySynonymRoot, synonym: string) {
    super();
    this.taxonomy = taxonomy;
    this.language = language;
    this.rootWord = rootWord;
    this.synonym = synonym;
  }

  businessKey(): string[] {
    return [...this.taxonomy.businessKey(), ...this.language.businessKey(), this.synonym];
  }
}
