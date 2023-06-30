import { Migration } from '@mikro-orm/migrations';

export class Migration20230630101054 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "off"."product_data_quality_tag" ("product_id" varchar(255) not null, "tag" varchar(255) not null, "item_taxonomy_group_id" varchar(255) not null, "item_id" varchar(500) not null, constraint "product_data_quality_tag_pkey" primary key ("product_id", "tag"));');

    this.addSql('alter table "off"."product_data_quality_tag" add constraint "product_data_quality_tag_product_id_foreign" foreign key ("product_id") references "off"."product" ("id") on update cascade;');
    this.addSql('alter table "off"."product_data_quality_tag" add constraint "product_data_quality_tag_item_taxonomy_group_id_item_id_foreign" foreign key ("item_taxonomy_group_id", "item_id") references "off"."item" ("taxonomy_group_id", "id") on update cascade;');

    this.addSql('alter table "off"."product" add column "name" varchar(255) not null, add column "code" varchar(255) not null;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "off"."product_data_quality_tag" cascade;');

    this.addSql('alter table "off"."product" drop column "name";');
    this.addSql('alter table "off"."product" drop column "code";');
  }

}
