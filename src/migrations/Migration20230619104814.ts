import { Migration } from '@mikro-orm/migrations';

export class Migration20230619104814 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "off"."item" ("taxonomy_id" varchar(255) not null, "id" varchar(255) not null, "current_version_id" uuid not null, constraint "item_pkey" primary key ("taxonomy_id", "id"));');
    this.addSql('alter table "off"."item" add constraint "item_current_version_id_unique" unique ("current_version_id");');

    this.addSql('create table "off"."item_version" ("id" uuid not null, "item_taxonomy_id" varchar(255) not null, "item_id" varchar(255) not null, "created_on" timestamptz(0) not null, "valid_fron" timestamptz(0) null, "valid_to" timestamptz(0) null, constraint "item_version_pkey" primary key ("id"));');

    this.addSql('create table "off"."item_synonym" ("id" uuid not null, "taxonomy_id" varchar(255) not null, "language_id" varchar(255) not null, "item_version_id" uuid not null, "synonym" varchar(255) not null, constraint "item_synonym_pkey" primary key ("id"));');
    this.addSql('alter table "off"."item_synonym" add constraint "item_synonym_taxonomy_id_language_id_synonym_unique" unique ("taxonomy_id", "language_id", "synonym");');

    this.addSql('create table "off"."item_name" ("item_version_id" uuid not null, "language_id" varchar(255) not null, "name" varchar(255) not null, constraint "item_name_pkey" primary key ("item_version_id", "language_id"));');

    this.addSql('alter table "off"."item" add constraint "item_taxonomy_id_foreign" foreign key ("taxonomy_id") references "off"."taxonomy" ("id") on update cascade;');
    this.addSql('alter table "off"."item" add constraint "item_current_version_id_foreign" foreign key ("current_version_id") references "off"."item_version" ("id") on update cascade;');

    this.addSql('alter table "off"."item_version" add constraint "item_version_item_taxonomy_id_item_id_foreign" foreign key ("item_taxonomy_id", "item_id") references "off"."item" ("taxonomy_id", "id") on update cascade;');

    this.addSql('alter table "off"."item_synonym" add constraint "item_synonym_taxonomy_id_foreign" foreign key ("taxonomy_id") references "off"."taxonomy" ("id") on update cascade;');
    this.addSql('alter table "off"."item_synonym" add constraint "item_synonym_language_id_foreign" foreign key ("language_id") references "off"."language" ("id") on update cascade;');
    this.addSql('alter table "off"."item_synonym" add constraint "item_synonym_item_version_id_foreign" foreign key ("item_version_id") references "off"."item_version" ("id") on update cascade;');

    this.addSql('alter table "off"."item_name" add constraint "item_name_item_version_id_foreign" foreign key ("item_version_id") references "off"."item_version" ("id") on update cascade;');
    this.addSql('alter table "off"."item_name" add constraint "item_name_language_id_foreign" foreign key ("language_id") references "off"."language" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "off"."item_version" drop constraint "item_version_item_taxonomy_id_item_id_foreign";');

    this.addSql('alter table "off"."item" drop constraint "item_current_version_id_foreign";');

    this.addSql('alter table "off"."item_synonym" drop constraint "item_synonym_item_version_id_foreign";');

    this.addSql('alter table "off"."item_name" drop constraint "item_name_item_version_id_foreign";');

    this.addSql('drop table if exists "off"."item" cascade;');

    this.addSql('drop table if exists "off"."item_version" cascade;');

    this.addSql('drop table if exists "off"."item_synonym" cascade;');

    this.addSql('drop table if exists "off"."item_name" cascade;');
  }

}
