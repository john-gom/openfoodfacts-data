import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Ulid } from 'id128';
import { Item } from './item';

@Entity()
export class ItemVersion {
  @PrimaryKey({ type: 'uuid' })
  id = Ulid.generate().toRaw();

  @ManyToOne()
  item!: Item;

  @Property({ type: 'timestamp' })
  createdOn = new Date();

  @Property({ type: 'timestamp', nullable: true })
  validFron: Date;

  @Property({ type: 'timestamp', nullable: true })
  validTo: Date

  constructor(item: Item) {
    this.item = item;
  }
}
