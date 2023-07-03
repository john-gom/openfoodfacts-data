import { Entity, ManyToOne, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { Language } from './language';
import { BaseEntity } from './base-entity';
import { TagVersion } from './tag-version';
import { Ulid } from 'id128';
import { TaxonomyGroup } from './taxonomy-group';

@Entity()
@Unique({ properties: ['taxonomyGroup', 'language', 'synonym'] })
export class TagSynonym extends BaseEntity {
  @PrimaryKey({ type: 'uuid' })
  id = Ulid.generate().toRaw();

  @ManyToOne()
  taxonomyGroup!: TaxonomyGroup;

  @ManyToOne()
  language!: Language;

  @ManyToOne()
  tagVersion!: TagVersion;

  @Property()
  synonym!: string;

  constructor(tagVersion: TagVersion, language: Language, synonym: string) {
    super();
    this.tagVersion = tagVersion;
    this.taxonomyGroup = tagVersion.tag.taxonomy.group;
    this.language = language;
    this.synonym = this.normalizeId(synonym);
  }

  businessKey(): string[] {
    return [...this.taxonomyGroup.businessKey(), ...this.language.businessKey(), this.synonym];
  }
}
