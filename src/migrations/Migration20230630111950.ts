import { Migration } from '@mikro-orm/migrations';

export class Migration20230630111950 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "off"."product_ingredient" ("product_id" varchar(255) not null, "sequence" int not null, "parent_product_id" varchar(255) null, "parent_sequence" int null, "text" varchar(255) null, "id" varchar(255) null, "percent_min" int not null, "percent_max" int not null, "percent_estimate" int not null, "ingredient_taxonomy_group_id" varchar(255) null, "ingredient_id" varchar(500) null, constraint "product_ingredient_pkey" primary key ("product_id", "sequence"));');

    this.addSql('alter table "off"."product_ingredient" add constraint "product_ingredient_product_id_foreign" foreign key ("product_id") references "off"."product" ("id") on update cascade;');
    this.addSql('alter table "off"."product_ingredient" add constraint "product_ingredient_parent_product_id_parent_sequence_foreign" foreign key ("parent_product_id", "parent_sequence") references "off"."product_ingredient" ("product_id", "sequence") on update cascade on delete set null;');
    this.addSql('alter table "off"."product_ingredient" add constraint "product_ingredient_ingredient_taxonomy_group_id_i_21439_foreign" foreign key ("ingredient_taxonomy_group_id", "ingredient_id") references "off"."item" ("taxonomy_group_id", "id") on update cascade on delete set null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "off"."product_ingredient" drop constraint "product_ingredient_parent_product_id_parent_sequence_foreign";');

    this.addSql('drop table if exists "off"."product_ingredient" cascade;');
  }

}
