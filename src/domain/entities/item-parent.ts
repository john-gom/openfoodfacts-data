import { Entity, ManyToOne, PrimaryKey } from '@mikro-orm/core';
import { BaseEntity } from './base-entity';
import { ItemVersion } from './item-version';
import { Item } from './item';
import { Language } from './language';

@Entity()
export class ItemParent extends BaseEntity {
  @ManyToOne({ primary: true })
  itemVersion!: ItemVersion;

  @PrimaryKey({ length: 500 })
  parentItemId!: string;

  @ManyToOne({ nullable: true, index: true })
  parent: Item;

  constructor(itemVersion: ItemVersion, language: Language, parentItemId: string) {
    super();
    this.itemVersion = itemVersion;
    this.parentItemId = `${language.businessKey()}:${this.normalizeId(parentItemId)}`;
  }

  businessKey(): string[] {
    return [...this.itemVersion.businessKey(), this.parentItemId];
  }
}
