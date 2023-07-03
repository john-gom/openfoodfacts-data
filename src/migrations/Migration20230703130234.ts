import { Migration } from '@mikro-orm/migrations';

export class Migration20230703130234 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "off"."product_nutrient" ("product_id" uuid not null, "state" varchar(255) not null, "per" varchar(255) not null, "nutrient" text not null, "quantity" double precision not null, "entered_per" text null, "entered_name" text null, "tag_taxonomy_group_id" text null, "tag_id" text null, constraint "product_nutrient_pkey" primary key ("product_id", "state", "per", "nutrient"));');

    this.addSql('alter table "off"."product_nutrient" add constraint "product_nutrient_product_id_foreign" foreign key ("product_id") references "off"."product" ("id") on update cascade;');
    this.addSql('alter table "off"."product_nutrient" add constraint "product_nutrient_tag_taxonomy_group_id_tag_id_foreign" foreign key ("tag_taxonomy_group_id", "tag_id") references "off"."tag" ("taxonomy_group_id", "id") on update cascade on delete set null;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "off"."product_nutrient" cascade;');
  }

}
