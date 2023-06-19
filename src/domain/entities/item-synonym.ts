import { Entity, ManyToOne, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { Language } from './language';
import { BaseEntity } from './base-entity';
import { ItemVersion } from './item-version';
import { Ulid } from 'id128';
import { TaxonomyGroup } from './taxonomy-group';

@Entity()
@Unique({ properties: ['taxonomyGroup', 'language', 'synonym'] })
export class ItemSynonym extends BaseEntity {
  @PrimaryKey({ type: 'uuid' })
  id = Ulid.generate().toRaw();

  @ManyToOne()
  taxonomyGroup!: TaxonomyGroup;

  @ManyToOne()
  language!: Language;

  @ManyToOne()
  itemVersion!: ItemVersion;

  @Property()
  synonym!: string;

  constructor(itemVersion: ItemVersion, language: Language, synonym: string) {
    super();
    this.itemVersion = itemVersion;
    this.taxonomyGroup = itemVersion.item.taxonomy.group;
    this.language = language;
    this.synonym = synonym;
  }

  businessKey(): string[] {
    return [...this.taxonomyGroup.businessKey(), ...this.language.businessKey(), this.synonym];
  }
}
