import { Migration } from '@mikro-orm/migrations';

export class Migration20230619154024 extends Migration {

  async up(): Promise<void> {
    this.addSql('create schema if not exists "off";');

    this.addSql('create table "off"."language" ("id" varchar(255) not null, constraint "language_pkey" primary key ("id"));');

    this.addSql('create table "off"."taxonomy_group" ("id" varchar(255) not null, constraint "taxonomy_group_pkey" primary key ("id"));');

    this.addSql('create table "off"."taxonomy" ("id" varchar(255) not null, "group_id" varchar(255) not null, constraint "taxonomy_pkey" primary key ("id"));');

    this.addSql('create table "off"."item" ("taxonomy_group_id" varchar(255) not null, "id" varchar(500) not null, "taxonomy_id" varchar(255) not null, "current_version_id" uuid null, constraint "item_pkey" primary key ("taxonomy_group_id", "id"));');
    this.addSql('alter table "off"."item" add constraint "item_current_version_id_unique" unique ("current_version_id");');

    this.addSql('create table "off"."item_version" ("id" uuid not null, "item_taxonomy_group_id" varchar(255) not null, "item_id" varchar(500) not null, "created_on" timestamptz(0) not null, "valid_fron" timestamptz(0) null, "valid_to" timestamptz(0) null, constraint "item_version_pkey" primary key ("id"));');

    this.addSql('create table "off"."item_synonym" ("id" uuid not null, "taxonomy_group_id" varchar(255) not null, "language_id" varchar(255) not null, "item_version_id" uuid not null, "synonym" varchar(255) not null, constraint "item_synonym_pkey" primary key ("id"));');
    this.addSql('alter table "off"."item_synonym" add constraint "item_synonym_taxonomy_group_id_language_id_synonym_unique" unique ("taxonomy_group_id", "language_id", "synonym");');

    this.addSql('create table "off"."item_property" ("item_version_id" uuid not null, "property_id" varchar(500) not null, "value" varchar(8000) null, constraint "item_property_pkey" primary key ("item_version_id", "property_id"));');

    this.addSql('create table "off"."item_name" ("item_version_id" uuid not null, "language_id" varchar(255) not null, "name" varchar(255) not null, constraint "item_name_pkey" primary key ("item_version_id", "language_id"));');

    this.addSql('create table "off"."item_description" ("item_version_id" uuid not null, "language_id" varchar(255) not null, "description" varchar(8000) not null, constraint "item_description_pkey" primary key ("item_version_id", "language_id"));');

    this.addSql('create table "off"."item_parent" ("item_version_id" uuid not null, "parent_item_id" varchar(500) not null, "parent_taxonomy_group_id" varchar(255) null, "parent_id" varchar(500) null, constraint "item_parent_pkey" primary key ("item_version_id", "parent_item_id"));');

    this.addSql('create table "off"."taxonomy_stopword" ("id" uuid not null, "taxonomy_group_id" varchar(255) not null, "language_id" varchar(255) not null, "stop_word" varchar(255) not null, constraint "taxonomy_stopword_pkey" primary key ("id"));');
    this.addSql('alter table "off"."taxonomy_stopword" add constraint "taxonomy_stopword_taxonomy_group_id_language_id_stop_word_unique" unique ("taxonomy_group_id", "language_id", "stop_word");');

    this.addSql('create table "off"."taxonomy_synonym_root" ("id" uuid not null, "taxonomy_group_id" varchar(255) not null, "language_id" varchar(255) not null, "root_word" varchar(255) not null, constraint "taxonomy_synonym_root_pkey" primary key ("id"));');
    this.addSql('alter table "off"."taxonomy_synonym_root" add constraint "taxonomy_synonym_root_taxonomy_group_id_language_i_b2ae4_unique" unique ("taxonomy_group_id", "language_id", "root_word");');

    this.addSql('create table "off"."taxonomy_synonym" ("id" uuid not null, "taxonomy_group_id" varchar(255) not null, "language_id" varchar(255) not null, "synonym" varchar(255) not null, "root_word_id" uuid not null, constraint "taxonomy_synonym_pkey" primary key ("id"));');
    this.addSql('alter table "off"."taxonomy_synonym" add constraint "taxonomy_synonym_taxonomy_group_id_language_id_synonym_unique" unique ("taxonomy_group_id", "language_id", "synonym");');

    this.addSql('alter table "off"."taxonomy" add constraint "taxonomy_group_id_foreign" foreign key ("group_id") references "off"."taxonomy_group" ("id") on update cascade;');

    this.addSql('alter table "off"."item" add constraint "item_taxonomy_group_id_foreign" foreign key ("taxonomy_group_id") references "off"."taxonomy_group" ("id") on update cascade;');
    this.addSql('alter table "off"."item" add constraint "item_taxonomy_id_foreign" foreign key ("taxonomy_id") references "off"."taxonomy" ("id") on update cascade;');
    this.addSql('alter table "off"."item" add constraint "item_current_version_id_foreign" foreign key ("current_version_id") references "off"."item_version" ("id") on update cascade on delete set null;');

    this.addSql('alter table "off"."item_version" add constraint "item_version_item_taxonomy_group_id_item_id_foreign" foreign key ("item_taxonomy_group_id", "item_id") references "off"."item" ("taxonomy_group_id", "id") on update cascade;');

    this.addSql('alter table "off"."item_synonym" add constraint "item_synonym_taxonomy_group_id_foreign" foreign key ("taxonomy_group_id") references "off"."taxonomy_group" ("id") on update cascade;');
    this.addSql('alter table "off"."item_synonym" add constraint "item_synonym_language_id_foreign" foreign key ("language_id") references "off"."language" ("id") on update cascade;');
    this.addSql('alter table "off"."item_synonym" add constraint "item_synonym_item_version_id_foreign" foreign key ("item_version_id") references "off"."item_version" ("id") on update cascade;');

    this.addSql('alter table "off"."item_property" add constraint "item_property_item_version_id_foreign" foreign key ("item_version_id") references "off"."item_version" ("id") on update cascade;');

    this.addSql('alter table "off"."item_name" add constraint "item_name_item_version_id_foreign" foreign key ("item_version_id") references "off"."item_version" ("id") on update cascade;');
    this.addSql('alter table "off"."item_name" add constraint "item_name_language_id_foreign" foreign key ("language_id") references "off"."language" ("id") on update cascade;');

    this.addSql('alter table "off"."item_description" add constraint "item_description_item_version_id_foreign" foreign key ("item_version_id") references "off"."item_version" ("id") on update cascade;');
    this.addSql('alter table "off"."item_description" add constraint "item_description_language_id_foreign" foreign key ("language_id") references "off"."language" ("id") on update cascade;');

    this.addSql('alter table "off"."item_parent" add constraint "item_parent_item_version_id_foreign" foreign key ("item_version_id") references "off"."item_version" ("id") on update cascade;');
    this.addSql('alter table "off"."item_parent" add constraint "item_parent_parent_taxonomy_group_id_parent_id_foreign" foreign key ("parent_taxonomy_group_id", "parent_id") references "off"."item" ("taxonomy_group_id", "id") on update cascade on delete set null;');

    this.addSql('alter table "off"."taxonomy_stopword" add constraint "taxonomy_stopword_taxonomy_group_id_foreign" foreign key ("taxonomy_group_id") references "off"."taxonomy_group" ("id") on update cascade;');
    this.addSql('alter table "off"."taxonomy_stopword" add constraint "taxonomy_stopword_language_id_foreign" foreign key ("language_id") references "off"."language" ("id") on update cascade;');

    this.addSql('alter table "off"."taxonomy_synonym_root" add constraint "taxonomy_synonym_root_taxonomy_group_id_foreign" foreign key ("taxonomy_group_id") references "off"."taxonomy_group" ("id") on update cascade;');
    this.addSql('alter table "off"."taxonomy_synonym_root" add constraint "taxonomy_synonym_root_language_id_foreign" foreign key ("language_id") references "off"."language" ("id") on update cascade;');

    this.addSql('alter table "off"."taxonomy_synonym" add constraint "taxonomy_synonym_taxonomy_group_id_foreign" foreign key ("taxonomy_group_id") references "off"."taxonomy_group" ("id") on update cascade;');
    this.addSql('alter table "off"."taxonomy_synonym" add constraint "taxonomy_synonym_language_id_foreign" foreign key ("language_id") references "off"."language" ("id") on update cascade;');
    this.addSql('alter table "off"."taxonomy_synonym" add constraint "taxonomy_synonym_root_word_id_foreign" foreign key ("root_word_id") references "off"."taxonomy_synonym_root" ("id") on update cascade;');
  }

}
