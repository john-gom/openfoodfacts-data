import { Collection, Entity, ManyToOne, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { Product } from "./product";
import { Tag } from "./tag";

@Entity()
export class ProductIngredient {
  @ManyToOne({ primary: true })
  product: Product;

  @PrimaryKey()
  sequence: number;

  @ManyToOne({ index: true })
  parent?: ProductIngredient;

  @Property()
  ingredientText?: string;

  @Property()
  id?: string;

  @Property({ type: 'double' })
  percentMin?: number;

  @Property({ type: 'double' })
  percentMax?: number;

  @Property({ type: 'double' })
  percentEstimate?: number;

  @ManyToOne()
  ingredient?: Tag;

  @OneToMany(() => ProductIngredient, e => e.parent)
  ingredients = new Collection<ProductIngredient>(this);
}