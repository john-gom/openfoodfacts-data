import { Collection, Entity, ManyToOne, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { Product } from "./product";
import { Item } from "./item";

@Entity()
export class ProductIngredient {
  @ManyToOne({ primary: true })
  product: Product;

  @PrimaryKey()
  sequence: number;

  @ManyToOne()
  parent?: ProductIngredient;

  @Property()
  text?: string;

  @Property()
  id?: string;

  @Property({ type: 'double' })
  percentMin?: number;

  @Property({ type: 'double' })
  percentMax?: number;

  @Property({ type: 'double' })
  percentEstimate?: number;

  @ManyToOne()
  ingredient?: Item;

  @OneToMany(() => ProductIngredient, e => e.parent)
  ingredients = new Collection<ProductIngredient>(this);
}