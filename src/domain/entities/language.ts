import { Entity, PrimaryKey } from '@mikro-orm/core';
import { BaseEntity } from './base-entity';

@Entity()
export class Language extends BaseEntity {
  @PrimaryKey()
  id!: string;

  constructor(id: string) {
    super();
    this.id = id;
  }

  businessKey(): string[] {
    return [this.id];
  }
}
