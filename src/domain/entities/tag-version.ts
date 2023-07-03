import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Ulid } from 'id128';
import { Tag } from './tag';
import { BaseEntity } from './base-entity';

@Entity()
export class TagVersion extends BaseEntity {
  @PrimaryKey({ type: 'uuid' })
  id = Ulid.generate().toRaw();

  @ManyToOne()
  tag!: Tag;

  @Property({ type: 'timestamp' })
  createdOn = new Date();

  @Property({ type: 'timestamp' })
  validFron?: Date;

  @Property({ type: 'timestamp' })
  validTo?: Date

  constructor(tag: Tag) {
    super();
    this.tag = tag;
  }

  businessKey(): string[] {
    return this.tag.businessKey();
  }
}
