import { Collection, Entity, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { ProductDataQualityTag } from "./product-data-quality-tag";
import { ProductIngredient } from "./product-ingredient";

@Entity()
export class Product {
  @PrimaryKey()
  id: string;

  @Property({ type: 'jsonb' })
  data: any;

  @Property()
  name?: string;

  @Property()
  code?: string;

  @OneToMany(() => ProductDataQualityTag, e => e.product)
  dataQualityTags = new Collection<ProductDataQualityTag>(this);

  @OneToMany(() => ProductIngredient, e => e.product)
  ingredients = new Collection<ProductIngredient>(this);
}