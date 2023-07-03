import { Entity, ManyToOne, PrimaryKey } from '@mikro-orm/core';
import { Taxonomy } from './taxonomy';
import { BaseEntity } from './base-entity';
import { TaxonomyGroup } from './taxonomy-group';
import { Language } from './language';
import { TextContent } from './text-content';

@Entity()
export class Tag extends BaseEntity {
  @ManyToOne({ primary: true })
  taxonomyGroup!: TaxonomyGroup;

  @PrimaryKey()
  id!: string;

  @ManyToOne()
  taxonomy!: Taxonomy;

  @ManyToOne()
  name!: TextContent;

  @ManyToOne()
  description?: TextContent;

  constructor(taxonomy: Taxonomy, language: Language, id: string, name: TextContent) {
    super();
    this.taxonomy = taxonomy;
    this.taxonomyGroup = taxonomy.group;
    this.id = `${language.businessKey()}:${this.normalizeId(id)}`;
    this.name = name;
  }

  businessKey(): string[] {
    return [...this.taxonomyGroup.businessKey(), this.id];
  }
}
