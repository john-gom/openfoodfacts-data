import { Entity, ManyToOne, PrimaryKey } from "@mikro-orm/core";
import { Product } from "./product";
import { Item } from "./item";

@Entity()
export class ProductDataQualityTag {
  @ManyToOne({ primary: true })
  product: Product;

  @PrimaryKey()
  tag: string;

  @ManyToOne()
  item?: Item;
}