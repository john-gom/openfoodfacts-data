import { Entity, ManyToOne, PrimaryKey } from '@mikro-orm/core';
import { Tag } from './tag';
import { Language } from './language';
import { TaxonomyEntity } from './taxonomy-entity';

@Entity()
export class TagParent extends TaxonomyEntity {
  @ManyToOne({ primary: true })
  tag!: Tag;

  @PrimaryKey()
  parentValue!: string;

  @ManyToOne({ index: true })
  parent?: Tag;

  constructor(tag: Tag, language: Language, parentValue: string, originalLine?: number) {
    super(originalLine);
    this.tag = tag;
    this.parentValue = `${language.businessKey()}:${this.normalizeId(parentValue)}`;
  }

  businessKey(): string[] {
    return [...this.tag.businessKey(), this.parentValue];
  }
}
