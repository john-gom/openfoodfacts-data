import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { Language } from './language';
import { BaseEntity } from './base-entity';
import { Tag } from './tag';

@Entity()
export class TagDescription extends BaseEntity {
  @ManyToOne({ primary: true })
  tag!: Tag;

  @ManyToOne({ primary: true })
  language!: Language;

  @Property()
  description!: string;

  constructor(tag: Tag, language: Language, description: string) {
    super();
    this.tag = tag;
    this.language = language;
    this.description = description;
  }

  businessKey(): string[] {
    return [...this.tag.businessKey(), ...this.language.businessKey()];
  }
}
