import { Entity, ManyToOne, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { Taxonomy } from './taxonomy';
import { Language } from './language';
import { Ulid } from 'id128';
import { BaseEntity } from './base-entity';
import { TaxonomyGroup } from './taxonomy-group';

@Entity()
@Unique({ properties: ['taxonomyGroup', 'language', 'rootWord'] })
export class TaxonomySynonymRoot extends BaseEntity {
  @PrimaryKey({ type: 'uuid' })
  id = Ulid.generate().toRaw();

  @ManyToOne()
  taxonomyGroup!: TaxonomyGroup;

  @ManyToOne()
  language!: Language;

  @Property()
  rootWord!: string;

  constructor(taxonomyGroup: TaxonomyGroup, language: Language, rootWord: string) {
    super();
    this.taxonomyGroup = taxonomyGroup;
    this.language = language;
    this.rootWord = rootWord;
  }


  businessKey(): string[] {
    return [...this.taxonomyGroup.businessKey(), ...this.language.businessKey(), this.rootWord];
  }
}
