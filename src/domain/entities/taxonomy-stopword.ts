import { Entity, ManyToOne, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { Language } from './language';
import { Ulid } from 'id128';
import { BaseEntity } from './base-entity';
import { TaxonomyGroup } from './taxonomy-group';

@Entity()
@Unique({ properties: ['taxonomyGroup', 'language', 'stopWord'] })
export class TaxonomyStopword extends BaseEntity {
  @PrimaryKey({ type: 'uuid' })
  id = Ulid.generate().toRaw();

  @ManyToOne()
  taxonomyGroup!: TaxonomyGroup;

  @ManyToOne()
  language!: Language;

  @Property()
  stopWord!: string;

  constructor(taxonomyGroup: TaxonomyGroup, language: Language, stopWord: string) {
    super();
    this.taxonomyGroup = taxonomyGroup;
    this.language = language;
    this.stopWord = stopWord;
  }

  businessKey(): string[] {
    return [...this.taxonomyGroup.businessKey(), ...this.language.businessKey(), this.stopWord];
  }
}
