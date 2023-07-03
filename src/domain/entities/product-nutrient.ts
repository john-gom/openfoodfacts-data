import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Product } from "./product";
import { Tag } from "./tag";

@Entity()
export class ProductNutrient {
  @ManyToOne({ primary: true })
  product: Product;

  @PrimaryKey()
  nutrient: string;

  @Property()
  enteredName?: string;

  @Property()
  enteredUnit?: string;

  @Property()
  modifierAsSold?: string;

  @Property()
  modifierPrepared?: string;

  @Property({ type: 'double' })
  enteredQuantityAsSold?: number;

  @Property({ type: 'double' })
  enteredQuantityPrepared?: number;

  @Property({ type: 'double' })
  normalisedQuantityAsSold?: number;

  @Property({ type: 'double' })
  normalisedQuantityPrepared?: number;

  @Property({ type: 'double' })
  quantityPer100gAsSold?: number;

  @Property({ type: 'double' })
  quantityPer100gPrepared?: number;

  @Property({ type: 'double' })
  quantityPerServingAsSold?: number;

  @Property({ type: 'double' })
  quantityPerServingPrepared?: number;

  @ManyToOne()
  tag?: Tag;

  constructor(product: Product, nutrient: string, tag?: Tag) {
    this.product = product;
    this.nutrient = nutrient;
    this.tag = tag;
  }
}
