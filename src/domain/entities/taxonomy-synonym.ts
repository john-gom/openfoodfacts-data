import { Entity, ManyToOne, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { Language } from './language';
import { TaxonomySynonymRoot } from './taxonomy-synonym-root';
import { Ulid } from 'id128';
import { TaxonomyGroup } from './taxonomy-group';
import { TaxonomyEntity } from './taxonomy-entity';

@Entity()
@Unique({ properties: ['taxonomyGroup', 'language', 'synonym'] })
export class TaxonomySynonym extends TaxonomyEntity {
  @PrimaryKey({ type: 'uuid' })
  id = Ulid.generate().toRaw();

  @ManyToOne()
  taxonomyGroup!: TaxonomyGroup;

  @ManyToOne()
  language!: Language;

  @Property()
  synonym!: string;

  @ManyToOne()
  rootWord!: TaxonomySynonymRoot;

  constructor(taxonomyGroup: TaxonomyGroup, language: Language, rootWord: TaxonomySynonymRoot, synonym: string, originalLine?: number, originalPosition?: number) {
    super(originalLine, originalPosition);
    this.taxonomyGroup = taxonomyGroup;
    this.language = language;
    this.rootWord = rootWord;
    this.synonym = this.normalizeId(synonym);
  }

  businessKey(): string[] {
    return [...this.taxonomyGroup.businessKey(), ...this.language.businessKey(), this.synonym];
  }
}
