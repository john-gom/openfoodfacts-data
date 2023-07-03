import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { BaseEntity } from './base-entity';
import { TagVersion } from './tag-version';

@Entity()
export class TagProperty extends BaseEntity {
  @ManyToOne({ primary: true })
  tagVersion!: TagVersion;

  @PrimaryKey()
  propertyId!: string;

  @Property()
  value?: string;

  constructor(tagVersion: TagVersion, propertyId: string, value: string) {
    super();
    this.tagVersion = tagVersion;
    this.propertyId = propertyId;
    this.value = value;
  }

  businessKey(): string[] {
    return [...this.tagVersion.businessKey(), this.propertyId];
  }
}
