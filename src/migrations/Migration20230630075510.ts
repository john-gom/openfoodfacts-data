import { Migration } from '@mikro-orm/migrations';

export class Migration20230630075510 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "off"."item_name" drop constraint "item_name_item_version_id_foreign";');

    this.addSql('alter table "off"."item_description" drop constraint "item_description_item_version_id_foreign";');

    this.addSql('alter table "off"."item_name" add column "item_taxonomy_group_id" varchar(255) not null, add column "item_id" varchar(500) not null;');
    this.addSql('alter table "off"."item_name" drop constraint "item_name_pkey";');
    this.addSql('alter table "off"."item_name" drop column "item_version_id";');
    this.addSql('alter table "off"."item_name" add constraint "item_name_item_taxonomy_group_id_item_id_foreign" foreign key ("item_taxonomy_group_id", "item_id") references "off"."item" ("taxonomy_group_id", "id") on update cascade;');
    this.addSql('alter table "off"."item_name" add constraint "item_name_pkey" primary key ("item_taxonomy_group_id", "item_id", "language_id");');

    this.addSql('alter table "off"."item_description" add column "item_taxonomy_group_id" varchar(255) not null, add column "item_id" varchar(500) not null;');
    this.addSql('alter table "off"."item_description" drop constraint "item_description_pkey";');
    this.addSql('alter table "off"."item_description" drop column "item_version_id";');
    this.addSql('alter table "off"."item_description" add constraint "item_description_item_taxonomy_group_id_item_id_foreign" foreign key ("item_taxonomy_group_id", "item_id") references "off"."item" ("taxonomy_group_id", "id") on update cascade;');
    this.addSql('alter table "off"."item_description" add constraint "item_description_pkey" primary key ("item_taxonomy_group_id", "item_id", "language_id");');
  }

  async down(): Promise<void> {
    this.addSql('alter table "off"."item_name" drop constraint "item_name_item_taxonomy_group_id_item_id_foreign";');

    this.addSql('alter table "off"."item_description" drop constraint "item_description_item_taxonomy_group_id_item_id_foreign";');

    this.addSql('alter table "off"."item_name" add column "item_version_id" uuid not null;');
    this.addSql('alter table "off"."item_name" drop constraint "item_name_pkey";');
    this.addSql('alter table "off"."item_name" add constraint "item_name_item_version_id_foreign" foreign key ("item_version_id") references "off"."item_version" ("id") on update cascade;');
    this.addSql('alter table "off"."item_name" drop column "item_taxonomy_group_id";');
    this.addSql('alter table "off"."item_name" drop column "item_id";');
    this.addSql('alter table "off"."item_name" add constraint "item_name_pkey" primary key ("item_version_id", "language_id");');

    this.addSql('alter table "off"."item_description" add column "item_version_id" uuid not null;');
    this.addSql('alter table "off"."item_description" drop constraint "item_description_pkey";');
    this.addSql('alter table "off"."item_description" add constraint "item_description_item_version_id_foreign" foreign key ("item_version_id") references "off"."item_version" ("id") on update cascade;');
    this.addSql('alter table "off"."item_description" drop column "item_taxonomy_group_id";');
    this.addSql('alter table "off"."item_description" drop column "item_id";');
    this.addSql('alter table "off"."item_description" add constraint "item_description_pkey" primary key ("item_version_id", "language_id");');
  }

}
