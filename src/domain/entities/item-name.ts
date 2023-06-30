import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Language } from './language';
import { BaseEntity } from './base-entity';
import { Item } from './item';

@Entity()
export class ItemName extends BaseEntity {
  @ManyToOne({ primary: true })
  item!: Item;

  @ManyToOne({ primary: true })
  language!: Language;

  @Property()
  name!: string;

  constructor(item: Item, language: Language, name: string) {
    super();
    this.item = item;
    this.language = language;
    this.name = name;
  }

  businessKey(): string[] {
    return [...this.item.businessKey(), ...this.language.businessKey()];
  }
}
