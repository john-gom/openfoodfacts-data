import { Entity, ManyToOne, OneToOne, PrimaryKey, Rel } from '@mikro-orm/core';
import { Taxonomy } from './taxonomy';
import { BaseEntity } from './base-entity';
import { TagVersion } from './tag-version';
import { TaxonomyGroup } from './taxonomy-group';
import { Language } from './language';

@Entity()
export class Tag extends BaseEntity {
  @ManyToOne({ primary: true })
  taxonomyGroup!: TaxonomyGroup;

  @PrimaryKey()
  id!: string;

  @ManyToOne()
  taxonomy!: Taxonomy;

  @OneToOne()
  currentVersion?: TagVersion;

  constructor(taxonomy: Taxonomy, language: Language, id: string) {
    super();
    this.taxonomy = taxonomy;
    this.taxonomyGroup = taxonomy.group;
    this.id = `${language.businessKey()}:${this.normalizeId(id)}`;
  }

  businessKey(): string[] {
    return [...this.taxonomyGroup.businessKey(), this.id];
  }
}