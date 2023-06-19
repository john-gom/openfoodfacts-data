import { Entity, ManyToOne, PrimaryKey } from '@mikro-orm/core';
import { BaseEntity } from './base-entity';
import { TaxonomyGroup } from './taxonomy-group';

@Entity()
export class Taxonomy extends BaseEntity {
  @PrimaryKey()
  id!: string;

  @ManyToOne()
  group!: TaxonomyGroup;

  constructor(id: string, group: TaxonomyGroup) {
    super();
    this.id = id;
    this.group = group;
  }

  businessKey(): string[] {
    return [this.id];
  }
}
