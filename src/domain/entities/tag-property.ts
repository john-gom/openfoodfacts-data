import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { BaseEntity } from './base-entity';
import { Tag } from './tag';

@Entity()
export class TagProperty extends BaseEntity {
  @ManyToOne({ primary: true })
  tag!: Tag;

  @PrimaryKey()
  propertyId!: string;

  @Property()
  value?: string;

  constructor(tag: Tag, propertyId: string, value: string) {
    super();
    this.tag = tag;
    this.propertyId = propertyId;
    this.value = value;
  }

  businessKey(): string[] {
    return [...this.tag.businessKey(), this.propertyId];
  }
}
