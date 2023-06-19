import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { Language } from './language';
import { BaseEntity } from './base-entity';
import { ItemVersion } from './item-version';

@Entity()
export class ItemDescription extends BaseEntity {
  @ManyToOne({ primary: true })
  itemVersion!: ItemVersion;

  @ManyToOne({ primary: true })
  language!: Language;

  @Property({ length: 8000 })
  description!: string;

  constructor(itemVersion: ItemVersion, language: Language, description: string) {
    super();
    this.itemVersion = itemVersion;
    this.language = language;
    this.description = description;
  }

  businessKey(): string[] {
    return [...this.itemVersion.item.businessKey(), ...this.language.businessKey()];
  }
}
