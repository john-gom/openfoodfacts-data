import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Product } from "./product";
import { Item } from "./item";

@Entity()
export class ProductDataQualityTag {
  @ManyToOne({ primary: true })
  product: Product;

  @PrimaryKey()
  sequence: number;

  @Property()
  tag: string;

  @ManyToOne()
  item?: Item;
}