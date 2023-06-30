import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { BaseEntity } from './base-entity';
import { ItemVersion } from './item-version';

@Entity()
export class ItemProperty extends BaseEntity {
  @ManyToOne({ primary: true })
  itemVersion!: ItemVersion;

  @PrimaryKey({ length: 500 })
  propertyId!: string;

  @Property({ length: 8000 })
  value?: string;

  constructor(itemVersion: ItemVersion, propertyId: string, value: string) {
    super();
    this.itemVersion = itemVersion;
    this.propertyId = propertyId;
    this.value = value;
  }

  businessKey(): string[] {
    return [...this.itemVersion.businessKey(), this.propertyId];
  }
}
