import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Ulid } from 'id128';
import { Item } from './item';
import { BaseEntity } from './base-entity';

@Entity()
export class ItemVersion extends BaseEntity {
  @PrimaryKey({ type: 'uuid' })
  id = Ulid.generate().toRaw();

  @ManyToOne()
  item!: Item;

  @Property({ type: 'timestamp' })
  createdOn = new Date();

  @Property({ type: 'timestamp' })
  validFron?: Date;

  @Property({ type: 'timestamp' })
  validTo?: Date

  constructor(item: Item) {
    super();
    this.item = item;
  }

  businessKey(): string[] {
    return this.item.businessKey();
  }
}
