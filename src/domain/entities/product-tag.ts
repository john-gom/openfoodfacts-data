import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Product } from "./product";
import { Tag } from "./tag";
import { Taxonomy } from "./taxonomy";

@Entity()
export class ProductTag {
  @ManyToOne({ primary: true })
  product: Product;

  @PrimaryKey()
  sequence: number;

  @ManyToOne()
  taxonomy?: Taxonomy;

  @Property()
  value: string;

  @ManyToOne()
  tag?: Tag;
}