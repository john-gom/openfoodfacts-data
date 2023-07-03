import { Migration } from '@mikro-orm/migrations';

export class Migration20230703141229 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "off"."product" add column "nutrition_as_sold_per" text null, add column "nutrition_prepared_per" text null, add column "serving_size" text null, add column "serving_quantity" double precision null;');

    this.addSql('alter table "off"."product_ingredient" rename column "text" to "ingredient_text";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "off"."product" drop column "nutrition_as_sold_per";');
    this.addSql('alter table "off"."product" drop column "nutrition_prepared_per";');
    this.addSql('alter table "off"."product" drop column "serving_size";');
    this.addSql('alter table "off"."product" drop column "serving_quantity";');

    this.addSql('alter table "off"."product_ingredient" rename column "ingredient_text" to "text";');
  }

}
