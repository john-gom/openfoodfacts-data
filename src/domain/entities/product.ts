import { Collection, Entity, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { ProductDataQualityTag } from "./product-data-quality-tag";
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

  @OneToMany(() => ProductDataQualityTag, e => e.product)
  dataQualityTags = new Collection<ProductDataQualityTag>(this);

  @OneToMany(() => ProductIngredient, e => e.product)
  ingredients = new Collection<ProductIngredient>(this);
}
