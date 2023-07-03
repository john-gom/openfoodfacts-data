import { Migration } from '@mikro-orm/migrations';

export class Migration20230703080652 extends Migration {

  async up(): Promise<void> {
    this.addSql('create schema if not exists "off";');

    this.addSql('create table "off"."language" ("id" text not null, constraint "language_pkey" primary key ("id"));');

    this.addSql('create table "off"."product" ("id" uuid not null, "data" jsonb null, "name" text null, "code" text null, constraint "product_pkey" primary key ("id"));');
    this.addSql('create index "product_code_index" on "off"."product" ("code");');

    this.addSql('create table "off"."taxonomy_group" ("id" text not null, constraint "taxonomy_group_pkey" primary key ("id"));');

    this.addSql('create table "off"."taxonomy" ("id" text not null, "group_id" text not null, constraint "taxonomy_pkey" primary key ("id"));');

    this.addSql('create table "off"."tag" ("taxonomy_group_id" text not null, "id" text not null, "taxonomy_id" text not null, "current_version_id" uuid null, constraint "tag_pkey" primary key ("taxonomy_group_id", "id"));');
    this.addSql('alter table "off"."tag" add constraint "tag_current_version_id_unique" unique ("current_version_id");');

    this.addSql('create table "off"."tag_version" ("id" uuid not null, "tag_taxonomy_group_id" text not null, "tag_id" text not null, "created_on" timestamptz(0) not null, "valid_fron" timestamptz(0) null, "valid_to" timestamptz(0) null, constraint "tag_version_pkey" primary key ("id"));');

    this.addSql('create table "off"."tag_synonym" ("id" uuid not null, "taxonomy_group_id" text not null, "language_id" text not null, "tag_version_id" uuid not null, "synonym" text not null, constraint "tag_synonym_pkey" primary key ("id"));');
    this.addSql('alter table "off"."tag_synonym" add constraint "tag_synonym_taxonomy_group_id_language_id_synonym_unique" unique ("taxonomy_group_id", "language_id", "synonym");');

    this.addSql('create table "off"."tag_property" ("tag_version_id" uuid not null, "property_id" text not null, "value" text null, constraint "tag_property_pkey" primary key ("tag_version_id", "property_id"));');

    this.addSql('create table "off"."tag_parent" ("tag_version_id" uuid not null, "parent_tag_id" text not null, "parent_taxonomy_group_id" text null, "parent_id" text null, constraint "tag_parent_pkey" primary key ("tag_version_id", "parent_tag_id"));');
    this.addSql('create index "tag_parent_parent_taxonomy_group_id_parent_id_index" on "off"."tag_parent" ("parent_taxonomy_group_id", "parent_id");');

    this.addSql('create table "off"."tag_name" ("tag_taxonomy_group_id" text not null, "tag_id" text not null, "language_id" text not null, "name" text not null, constraint "tag_name_pkey" primary key ("tag_taxonomy_group_id", "tag_id", "language_id"));');

    this.addSql('create table "off"."tag_description" ("tag_taxonomy_group_id" text not null, "tag_id" text not null, "language_id" text not null, "description" text not null, constraint "tag_description_pkey" primary key ("tag_taxonomy_group_id", "tag_id", "language_id"));');

    this.addSql('create table "off"."product_tag" ("product_id" uuid not null, "sequence" int not null, "taxonomy_id" text null, "value" text not null, "tag_taxonomy_group_id" text null, "tag_id" text null, constraint "product_tag_pkey" primary key ("product_id", "sequence"));');

    this.addSql('create table "off"."product_ingredient" ("product_id" uuid not null, "sequence" int not null, "parent_product_id" uuid null, "parent_sequence" int null, "text" text null, "id" text null, "percent_min" double precision null, "percent_max" double precision null, "percent_estimate" double precision null, "ingredient_taxonomy_group_id" text null, "ingredient_id" text null, constraint "product_ingredient_pkey" primary key ("product_id", "sequence"));');
    this.addSql('create index "product_ingredient_parent_product_id_parent_sequence_index" on "off"."product_ingredient" ("parent_product_id", "parent_sequence");');

    this.addSql('create table "off"."taxonomy_stopword" ("id" uuid not null, "taxonomy_group_id" text not null, "language_id" text not null, "stop_word" text not null, constraint "taxonomy_stopword_pkey" primary key ("id"));');
    this.addSql('alter table "off"."taxonomy_stopword" add constraint "taxonomy_stopword_taxonomy_group_id_language_id_stop_word_unique" unique ("taxonomy_group_id", "language_id", "stop_word");');

    this.addSql('create table "off"."taxonomy_synonym_root" ("id" uuid not null, "taxonomy_group_id" text not null, "language_id" text not null, "root_word" text not null, constraint "taxonomy_synonym_root_pkey" primary key ("id"));');
    this.addSql('alter table "off"."taxonomy_synonym_root" add constraint "taxonomy_synonym_root_taxonomy_group_id_language_i_b2ae4_unique" unique ("taxonomy_group_id", "language_id", "root_word");');

    this.addSql('create table "off"."taxonomy_synonym" ("id" uuid not null, "taxonomy_group_id" text not null, "language_id" text not null, "synonym" text not null, "root_word_id" uuid not null, constraint "taxonomy_synonym_pkey" primary key ("id"));');
    this.addSql('alter table "off"."taxonomy_synonym" add constraint "taxonomy_synonym_taxonomy_group_id_language_id_synonym_unique" unique ("taxonomy_group_id", "language_id", "synonym");');

    this.addSql('alter table "off"."taxonomy" add constraint "taxonomy_group_id_foreign" foreign key ("group_id") references "off"."taxonomy_group" ("id") on update cascade;');

    this.addSql('alter table "off"."tag" add constraint "tag_taxonomy_group_id_foreign" foreign key ("taxonomy_group_id") references "off"."taxonomy_group" ("id") on update cascade;');
    this.addSql('alter table "off"."tag" add constraint "tag_taxonomy_id_foreign" foreign key ("taxonomy_id") references "off"."taxonomy" ("id") on update cascade;');
    this.addSql('alter table "off"."tag" add constraint "tag_current_version_id_foreign" foreign key ("current_version_id") references "off"."tag_version" ("id") on update cascade on delete set null;');

    this.addSql('alter table "off"."tag_version" add constraint "tag_version_tag_taxonomy_group_id_tag_id_foreign" foreign key ("tag_taxonomy_group_id", "tag_id") references "off"."tag" ("taxonomy_group_id", "id") on update cascade;');

    this.addSql('alter table "off"."tag_synonym" add constraint "tag_synonym_taxonomy_group_id_foreign" foreign key ("taxonomy_group_id") references "off"."taxonomy_group" ("id") on update cascade;');
    this.addSql('alter table "off"."tag_synonym" add constraint "tag_synonym_language_id_foreign" foreign key ("language_id") references "off"."language" ("id") on update cascade;');
    this.addSql('alter table "off"."tag_synonym" add constraint "tag_synonym_tag_version_id_foreign" foreign key ("tag_version_id") references "off"."tag_version" ("id") on update cascade;');

    this.addSql('alter table "off"."tag_property" add constraint "tag_property_tag_version_id_foreign" foreign key ("tag_version_id") references "off"."tag_version" ("id") on update cascade;');

    this.addSql('alter table "off"."tag_parent" add constraint "tag_parent_tag_version_id_foreign" foreign key ("tag_version_id") references "off"."tag_version" ("id") on update cascade;');
    this.addSql('alter table "off"."tag_parent" add constraint "tag_parent_parent_taxonomy_group_id_parent_id_foreign" foreign key ("parent_taxonomy_group_id", "parent_id") references "off"."tag" ("taxonomy_group_id", "id") on update cascade on delete set null;');

    this.addSql('alter table "off"."tag_name" add constraint "tag_name_tag_taxonomy_group_id_tag_id_foreign" foreign key ("tag_taxonomy_group_id", "tag_id") references "off"."tag" ("taxonomy_group_id", "id") on update cascade;');
    this.addSql('alter table "off"."tag_name" add constraint "tag_name_language_id_foreign" foreign key ("language_id") references "off"."language" ("id") on update cascade;');

    this.addSql('alter table "off"."tag_description" add constraint "tag_description_tag_taxonomy_group_id_tag_id_foreign" foreign key ("tag_taxonomy_group_id", "tag_id") references "off"."tag" ("taxonomy_group_id", "id") on update cascade;');
    this.addSql('alter table "off"."tag_description" add constraint "tag_description_language_id_foreign" foreign key ("language_id") references "off"."language" ("id") on update cascade;');

    this.addSql('alter table "off"."product_tag" add constraint "product_tag_product_id_foreign" foreign key ("product_id") references "off"."product" ("id") on update cascade;');
    this.addSql('alter table "off"."product_tag" add constraint "product_tag_taxonomy_id_foreign" foreign key ("taxonomy_id") references "off"."taxonomy" ("id") on update cascade on delete set null;');
    this.addSql('alter table "off"."product_tag" add constraint "product_tag_tag_taxonomy_group_id_tag_id_foreign" foreign key ("tag_taxonomy_group_id", "tag_id") references "off"."tag" ("taxonomy_group_id", "id") on update cascade on delete set null;');

    this.addSql('alter table "off"."product_ingredient" add constraint "product_ingredient_product_id_foreign" foreign key ("product_id") references "off"."product" ("id") on update cascade;');
    this.addSql('alter table "off"."product_ingredient" add constraint "product_ingredient_parent_product_id_parent_sequence_foreign" foreign key ("parent_product_id", "parent_sequence") references "off"."product_ingredient" ("product_id", "sequence") on update cascade on delete set null;');
    this.addSql('alter table "off"."product_ingredient" add constraint "product_ingredient_ingredient_taxonomy_group_id_i_21439_foreign" foreign key ("ingredient_taxonomy_group_id", "ingredient_id") references "off"."tag" ("taxonomy_group_id", "id") on update cascade on delete set null;');

    this.addSql('alter table "off"."taxonomy_stopword" add constraint "taxonomy_stopword_taxonomy_group_id_foreign" foreign key ("taxonomy_group_id") references "off"."taxonomy_group" ("id") on update cascade;');
    this.addSql('alter table "off"."taxonomy_stopword" add constraint "taxonomy_stopword_language_id_foreign" foreign key ("language_id") references "off"."language" ("id") on update cascade;');

    this.addSql('alter table "off"."taxonomy_synonym_root" add constraint "taxonomy_synonym_root_taxonomy_group_id_foreign" foreign key ("taxonomy_group_id") references "off"."taxonomy_group" ("id") on update cascade;');
    this.addSql('alter table "off"."taxonomy_synonym_root" add constraint "taxonomy_synonym_root_language_id_foreign" foreign key ("language_id") references "off"."language" ("id") on update cascade;');

    this.addSql('alter table "off"."taxonomy_synonym" add constraint "taxonomy_synonym_taxonomy_group_id_foreign" foreign key ("taxonomy_group_id") references "off"."taxonomy_group" ("id") on update cascade;');
    this.addSql('alter table "off"."taxonomy_synonym" add constraint "taxonomy_synonym_language_id_foreign" foreign key ("language_id") references "off"."language" ("id") on update cascade;');
    this.addSql('alter table "off"."taxonomy_synonym" add constraint "taxonomy_synonym_root_word_id_foreign" foreign key ("root_word_id") references "off"."taxonomy_synonym_root" ("id") on update cascade;');
  }

}
