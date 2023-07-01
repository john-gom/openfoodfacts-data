import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { Language } from './language';
import { BaseEntity } from './base-entity';
import { Item } from './item';

@Entity()
export class ItemDescription extends BaseEntity {
  @ManyToOne({ primary: true })
  item!: Item;

  @ManyToOne({ primary: true })
  language!: Language;

  @Property()
  description!: string;

  constructor(item: Item, language: Language, description: string) {
    super();
    this.item = item;
    this.language = language;
    this.description = description;
  }

  businessKey(): string[] {
    return [...this.item.businessKey(), ...this.language.businessKey()];
  }
}
