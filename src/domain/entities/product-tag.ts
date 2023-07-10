import { Entity, Index, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Product } from "./product";
import { Tag } from "./tag";

@Entity()
@Index({ properties: ['tagType', 'value', 'product'] })
export class ProductTag {
  @ManyToOne({ primary: true })
  product: Product;

  @PrimaryKey()
  tagType: string;

  @PrimaryKey()
  sequence: number;

  @Property()
  value: string;

  @ManyToOne()
  tag?: Tag;
}