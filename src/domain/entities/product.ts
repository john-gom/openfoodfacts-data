import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export class Product {
  @PrimaryKey()
  id: string;

  @Property({ type: 'jsonb' })
  data: any;

  constructor(id: string, data: any) {
    this.id = id;
    this.data = data;
  }
}