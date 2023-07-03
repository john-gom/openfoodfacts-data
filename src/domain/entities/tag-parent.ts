import { Entity, ManyToOne, PrimaryKey } from '@mikro-orm/core';
import { BaseEntity } from './base-entity';
import { TagVersion } from './tag-version';
import { Tag } from './tag';
import { Language } from './language';

@Entity()
export class TagParent extends BaseEntity {
  @ManyToOne({ primary: true })
  tagVersion!: TagVersion;

  @PrimaryKey()
  parentTagId!: string;

  @ManyToOne({ index: true })
  parent?: Tag;

  constructor(tagVersion: TagVersion, language: Language, tagItemId: string) {
    super();
    this.tagVersion = tagVersion;
    this.parentTagId = `${language.businessKey()}:${this.normalizeId(tagItemId)}`;
  }

  businessKey(): string[] {
    return [...this.tagVersion.businessKey(), this.parentTagId];
  }
}
