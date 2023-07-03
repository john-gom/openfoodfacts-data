import { Migration } from '@mikro-orm/migrations';

export class Migration20230703134318 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "off"."product_nutrient" add column "modifier_as_sold" text null, add column "modifier_prepared" text null, add column "entered_quantity_as_sold" double precision null, add column "entered_quantity_prepared" double precision null, add column "normalised_quantity_as_sold" double precision null, add column "normalised_quantity_prepared" double precision null, add column "quantity_per100g_as_sold" double precision null, add column "quantity_per100g_prepared" double precision null, add column "quantity_per_serving_as_sold" double precision null, add column "quantity_per_serving_prepared" double precision null;');
    this.addSql('alter table "off"."product_nutrient" drop constraint "product_nutrient_pkey";');
    this.addSql('alter table "off"."product_nutrient" drop column "state";');
    this.addSql('alter table "off"."product_nutrient" drop column "per";');
    this.addSql('alter table "off"."product_nutrient" drop column "quantity";');
    this.addSql('alter table "off"."product_nutrient" rename column "entered_per" to "entered_unit";');
    this.addSql('alter table "off"."product_nutrient" add constraint "product_nutrient_pkey" primary key ("product_id", "nutrient");');
  }

  async down(): Promise<void> {
    this.addSql('alter table "off"."product_nutrient" add column "state" varchar(255) not null, add column "per" varchar(255) not null, add column "quantity" double precision not null, add column "entered_per" text null;');
    this.addSql('alter table "off"."product_nutrient" drop constraint "product_nutrient_pkey";');
    this.addSql('alter table "off"."product_nutrient" drop column "entered_unit";');
    this.addSql('alter table "off"."product_nutrient" drop column "modifier_as_sold";');
    this.addSql('alter table "off"."product_nutrient" drop column "modifier_prepared";');
    this.addSql('alter table "off"."product_nutrient" drop column "entered_quantity_as_sold";');
    this.addSql('alter table "off"."product_nutrient" drop column "entered_quantity_prepared";');
    this.addSql('alter table "off"."product_nutrient" drop column "normalised_quantity_as_sold";');
    this.addSql('alter table "off"."product_nutrient" drop column "normalised_quantity_prepared";');
    this.addSql('alter table "off"."product_nutrient" drop column "quantity_per100g_as_sold";');
    this.addSql('alter table "off"."product_nutrient" drop column "quantity_per100g_prepared";');
    this.addSql('alter table "off"."product_nutrient" drop column "quantity_per_serving_as_sold";');
    this.addSql('alter table "off"."product_nutrient" drop column "quantity_per_serving_prepared";');
    this.addSql('alter table "off"."product_nutrient" add constraint "product_nutrient_pkey" primary key ("product_id", "state", "per", "nutrient");');
  }

}
