import { Migration } from '@mikro-orm/migrations';

export class Migration20230619132701 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "off"."item_property" ("item_version_id" uuid not null, "property_id" varchar(500) not null, "value" varchar(500) null, constraint "item_property_pkey" primary key ("item_version_id", "property_id"));');

    this.addSql('create table "off"."item_parent" ("item_version_id" uuid not null, "parent_item_id" varchar(500) not null, "parent_taxonomy_id" varchar(255) null, "parent_id" varchar(500) null, constraint "item_parent_pkey" primary key ("item_version_id", "parent_item_id"));');

    this.addSql('alter table "off"."item_property" add constraint "item_property_item_version_id_foreign" foreign key ("item_version_id") references "off"."item_version" ("id") on update cascade;');

    this.addSql('alter table "off"."item_parent" add constraint "item_parent_item_version_id_foreign" foreign key ("item_version_id") references "off"."item_version" ("id") on update cascade;');
    this.addSql('alter table "off"."item_parent" add constraint "item_parent_parent_taxonomy_id_parent_id_foreign" foreign key ("parent_taxonomy_id", "parent_id") references "off"."item" ("taxonomy_id", "id") on update cascade on delete set null;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "off"."item_property" cascade;');

    this.addSql('drop table if exists "off"."item_parent" cascade;');
  }

}
