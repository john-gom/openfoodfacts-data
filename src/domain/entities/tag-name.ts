import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Language } from './language';
import { BaseEntity } from './base-entity';
import { Tag } from './tag';

@Entity()
export class TagName extends BaseEntity {
  @ManyToOne({ primary: true })
  tag!: Tag;

  @ManyToOne({ primary: true })
  language!: Language;

  @Property()
  name!: string;

  constructor(tag: Tag, language: Language, name: string) {
    super();
    this.tag = tag;
    this.language = language;
    this.name = name;
  }

  businessKey(): string[] {
    return [...this.tag.businessKey(), ...this.language.businessKey()];
  }
}
