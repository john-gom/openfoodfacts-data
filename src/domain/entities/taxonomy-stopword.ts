import { Entity, ManyToOne, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { Language } from './language';
import { Ulid } from 'id128';
import { TaxonomyGroup } from './taxonomy-group';
import { TaxonomyEntity } from './taxonomy-entity';

@Entity()
@Unique({ properties: ['taxonomyGroup', 'language', 'stopWord'] })
export class TaxonomyStopword extends TaxonomyEntity {
  @PrimaryKey({ type: 'uuid' })
  id = Ulid.generate().toRaw();

  @ManyToOne()
  taxonomyGroup!: TaxonomyGroup;

  @ManyToOne()
  language!: Language;

  // TODO: Aren't stopwords just synonyms with a synonym root of nothing?
  @Property()
  stopWord!: string;

  constructor(taxonomyGroup: TaxonomyGroup, language: Language, stopWord: string, originalLine?: number, originalPosition?: number) {
    super(originalLine, originalPosition);
    this.taxonomyGroup = taxonomyGroup;
    this.language = language;
    this.stopWord = this.normalizeId(stopWord);
  }

  businessKey(): string[] {
    return [...this.taxonomyGroup.businessKey(), ...this.language.businessKey(), this.stopWord];
  }
}
