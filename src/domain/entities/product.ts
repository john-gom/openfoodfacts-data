import { Collection, Entity, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { ProductDataQualityTag } from "./product-data-quality-tag";

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

  @OneToMany(() => ProductDataQualityTag, productDataQuality => productDataQuality.product)
  dataQualityTags = new Collection<ProductDataQualityTag>(this);
}