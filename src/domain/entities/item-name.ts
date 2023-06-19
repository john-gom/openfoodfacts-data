import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Language } from './language';
import { BaseEntity } from './base-entity';
import { ItemVersion } from './item-version';

@Entity()
export class ItemName extends BaseEntity {
  @ManyToOne({ primary: true })
  itemVersion!: ItemVersion;

  @ManyToOne({ primary: true })
  language!: Language;

  @Property()
  name!: string;

  constructor(itemVersion: ItemVersion, language: Language, name: string) {
    super();
    this.itemVersion = itemVersion;
    this.language = language;
    this.name = name;
  }

  businessKey(): string[] {
    return [...this.itemVersion.businessKey(), ...this.language.businessKey()];
  }
}
