import { Entity, ManyToOne, PrimaryKey } from '@mikro-orm/core';
import { BaseEntity } from './base-entity';
import { ItemVersion } from './item-version';
import { Item } from './item';

@Entity()
export class ItemParent extends BaseEntity {
  @ManyToOne({ primary: true })
  itemVersion!: ItemVersion;

  @PrimaryKey({ length: 500 })
  parentItemId!: string;

  @ManyToOne({ nullable: true })
  parent: Item;

  constructor(itemVersion: ItemVersion, parentItemId: string) {
    super();
    this.itemVersion = itemVersion;
    this.parentItemId = parentItemId;
  }

  businessKey(): string[] {
    return [...this.itemVersion.businessKey(), this.parentItemId];
  }
}
