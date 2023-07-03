import { Entity, ManyToOne, PrimaryKey } from '@mikro-orm/core';
import { BaseEntity } from './base-entity';
import { Tag } from './tag';
import { Language } from './language';

@Entity()
export class TagParent extends BaseEntity {
  @ManyToOne({ primary: true })
  tag!: Tag;

  @PrimaryKey()
  parentValue!: string;

  @ManyToOne({ index: true })
  parent?: Tag;

  constructor(tag: Tag, language: Language, parentValue: string) {
    super();
    this.tag = tag;
    this.parentValue = `${language.businessKey()}:${this.normalizeId(parentValue)}`;
  }

  businessKey(): string[] {
    return [...this.tag.businessKey(), this.parentValue];
  }
}
