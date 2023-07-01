import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { BaseEntity } from './base-entity';
import { ItemVersion } from './item-version';

@Entity()
export class ItemProperty extends BaseEntity {
  @ManyToOne({ primary: true })
  itemVersion!: ItemVersion;

  @PrimaryKey()
  propertyId!: string;

  @Property()
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
