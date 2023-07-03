import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Tag } from './tag';
import { TaxonomyEntity } from './taxonomy-entity';

@Entity()
export class TagProperty extends TaxonomyEntity {
  @ManyToOne({ primary: true })
  tag!: Tag;

  @PrimaryKey()
  propertyId!: string;

  @Property()
  value?: string;

  constructor(tag: Tag, propertyId: string, value: string, originalLine?: number) {
    super(originalLine);
    this.tag = tag;
    this.propertyId = propertyId;
    this.value = value;
  }

  businessKey(): string[] {
    return [...this.tag.businessKey(), this.propertyId];
  }
}
