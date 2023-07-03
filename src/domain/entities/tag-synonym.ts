import { Entity, ManyToOne, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { Language } from './language';
import { Ulid } from 'id128';
import { TaxonomyGroup } from './taxonomy-group';
import { Tag } from './tag';
import { TaxonomyEntity } from './taxonomy-entity';

@Entity()
@Unique({ properties: ['taxonomyGroup', 'language', 'synonym'] })
export class TagSynonym extends TaxonomyEntity {
  @PrimaryKey({ type: 'uuid' })
  id = Ulid.generate().toRaw();

  @ManyToOne()
  taxonomyGroup!: TaxonomyGroup;

  @ManyToOne()
  language!: Language;

  @ManyToOne()
  tag!: Tag;

  @Property()
  synonym!: string;

  constructor(tag: Tag, language: Language, synonym: string, originalLine?: number, originalPosition?: number) {
    super(originalLine, originalPosition);
    this.tag = tag;
    this.taxonomyGroup = tag.taxonomy.group;
    this.language = language;
    this.synonym = this.normalizeId(synonym);
  }

  businessKey(): string[] {
    return [...this.taxonomyGroup.businessKey(), ...this.language.businessKey(), this.synonym];
  }
}
