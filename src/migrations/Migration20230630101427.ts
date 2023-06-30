import { Migration } from '@mikro-orm/migrations';

export class Migration20230630101427 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "off"."product_data_quality_tag" drop constraint "product_data_quality_tag_item_taxonomy_group_id_item_id_foreign";');

    this.addSql('alter table "off"."product_data_quality_tag" alter column "item_taxonomy_group_id" type varchar(255) using ("item_taxonomy_group_id"::varchar(255));');
    this.addSql('alter table "off"."product_data_quality_tag" alter column "item_taxonomy_group_id" drop not null;');
    this.addSql('alter table "off"."product_data_quality_tag" alter column "item_id" type varchar(500) using ("item_id"::varchar(500));');
    this.addSql('alter table "off"."product_data_quality_tag" alter column "item_id" drop not null;');
    this.addSql('alter table "off"."product_data_quality_tag" add constraint "product_data_quality_tag_item_taxonomy_group_id_item_id_foreign" foreign key ("item_taxonomy_group_id", "item_id") references "off"."item" ("taxonomy_group_id", "id") on update cascade on delete set null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "off"."product_data_quality_tag" drop constraint "product_data_quality_tag_item_taxonomy_group_id_item_id_foreign";');

    this.addSql('alter table "off"."product_data_quality_tag" alter column "item_taxonomy_group_id" type varchar(255) using ("item_taxonomy_group_id"::varchar(255));');
    this.addSql('alter table "off"."product_data_quality_tag" alter column "item_taxonomy_group_id" set not null;');
    this.addSql('alter table "off"."product_data_quality_tag" alter column "item_id" type varchar(500) using ("item_id"::varchar(500));');
    this.addSql('alter table "off"."product_data_quality_tag" alter column "item_id" set not null;');
    this.addSql('alter table "off"."product_data_quality_tag" add constraint "product_data_quality_tag_item_taxonomy_group_id_item_id_foreign" foreign key ("item_taxonomy_group_id", "item_id") references "off"."item" ("taxonomy_group_id", "id") on update cascade;');
  }

}
