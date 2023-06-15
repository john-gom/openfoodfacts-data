import { Entity, PrimaryKey } from '@mikro-orm/core';

@Entity()
export class Taxonomy {
  @PrimaryKey()
  taxonomyName: string;
}
