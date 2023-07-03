import { Collection, Entity, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { ProductTag } from "./product-tag";
import { ProductIngredient } from "./product-ingredient";
import { Ulid } from "id128";

@Entity()
export class Product {
  @PrimaryKey({ type: 'uuid' })
  id = Ulid.generate().toRaw();

  @Property({ type: 'jsonb' })
  data?: any;

  @Property()
  name?: string;

  @Property({ index: true })
  code?: string;

  @Property()
  ingredientsText?: string;

  @Property()
  NutritionAsSoldPer?: string;

  @Property()
  NutritionPreparedPer?: string;

  @Property()
  ServingSize?: string;

  @Property({ type: 'double' })
  ServingQuantity?: number;

  @OneToMany(() => ProductTag, e => e.product)
  dataQualityTags = new Collection<ProductTag>(this);

  @OneToMany(() => ProductIngredient, e => e.product)
  ingredients = new Collection<ProductIngredient>(this);
}
