import { Property } from "@mikro-orm/core";
import { BaseEntity } from "./base-entity";

export abstract class TaxonomyEntity extends BaseEntity {
  @Property()
  originalLine?: number;

  @Property()
  originalPosition?: number;

  constructor(originalLine?: number, originalPosition?: number) {
    super();
    this.originalLine = originalLine;
    this.originalPosition = originalPosition;
  }
}