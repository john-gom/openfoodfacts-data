import { Entity, ManyToOne, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { Language } from './language';
import { Ulid } from 'id128';
import { TaxonomyGroup } from './taxonomy-group';
import { TaxonomyEntity } from './taxonomy-entity';
import { Taxonomy } from './taxonomy';

@Entity()
export class TaxonomyComment extends TaxonomyEntity {
  @ManyToOne({ primary: true })
  taxonomy: Taxonomy;

  @PrimaryKey()
  originalLine: number;

  @Property()
  value?: string;

  constructor(taxonomy: Taxonomy, value: string, originalLine: number) {
    super(originalLine);
    this.taxonomy = taxonomy;
    this.value = value;
  }

  businessKey(): string[] {
    return [...this.taxonomy.businessKey(), this.originalLine.toString()];
  }
}
