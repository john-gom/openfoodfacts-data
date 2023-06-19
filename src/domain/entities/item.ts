import { Entity, ManyToOne, OneToOne, PrimaryKey, Rel } from '@mikro-orm/core';
import { Taxonomy } from './taxonomy';
import { BaseEntity } from './base-entity';
import { ItemVersion } from './item-version';

@Entity()
export class Item extends BaseEntity {
  @ManyToOne({ primary: true })
  taxonomy!: Taxonomy;

  @PrimaryKey()
  id!: string;

  @OneToOne(() => ItemVersion)
  currentVersion: ItemVersion;

  constructor(taxonomy: Taxonomy, id: string) {
    super();
    this.taxonomy = taxonomy;
    this.id = id;
  }

  businessKey(): string[] {
    return [...this.taxonomy.businessKey(), this.id];
  }
}
