import { Migration } from '@mikro-orm/migrations';

export class Migration20230701131729 extends Migration {

  async up(): Promise<void> {
    this.addSql('create schema if not exists "off";');

    this.addSql('create table "off"."language" ("id" text not null, constraint "language_pkey" primary key ("id"));');

    this.addSql('create table "off"."product" ("id" uuid not null, "data" jsonb null, "name" text null, "code" text null, constraint "product_pkey" primary key ("id"));');
    this.addSql('create index "product_code_index" on "off"."product" ("code");');

    this.addSql('create table "off"."taxonomy_group" ("id" text not null, constraint "taxonomy_group_pkey" primary key ("id"));');

    this.addSql('create table "off"."taxonomy" ("id" text not null, "group_id" text not null, constraint "taxonomy_pkey" primary key ("id"));');

    this.addSql('create table "off"."item" ("taxonomy_group_id" text not null, "id" text not null, "taxonomy_id" text not null, "current_version_id" uuid null, constraint "item_pkey" primary key ("taxonomy_group_id", "id"));');
    this.addSql('alter table "off"."item" add constraint "item_current_version_id_unique" unique ("current_version_id");');

    this.addSql('create table "off"."product_ingredient" ("product_id" uuid not null, "sequence" int not null, "parent_product_id" uuid null, "parent_sequence" int null, "text" text null, "id" text null, "percent_min" double precision null, "percent_max" double precision null, "percent_estimate" double precision null, "ingredient_taxonomy_group_id" text null, "ingredient_id" text null, constraint "product_ingredient_pkey" primary key ("product_id", "sequence"));');
    this.addSql('create index "product_ingredient_parent_product_id_parent_sequence_index" on "off"."product_ingredient" ("parent_product_id", "parent_sequence");');

    this.addSql('create table "off"."product_data_quality_tag" ("product_id" uuid not null, "sequence" int not null, "tag" text not null, "item_taxonomy_group_id" text null, "item_id" text null, constraint "product_data_quality_tag_pkey" primary key ("product_id", "sequence"));');

    this.addSql('create table "off"."item_version" ("id" uuid not null, "item_taxonomy_group_id" text not null, "item_id" text not null, "created_on" timestamptz(0) not null, "valid_fron" timestamptz(0) null, "valid_to" timestamptz(0) null, constraint "item_version_pkey" primary key ("id"));');

    this.addSql('create table "off"."item_synonym" ("id" uuid not null, "taxonomy_group_id" text not null, "language_id" text not null, "item_version_id" uuid not null, "synonym" text not null, constraint "item_synonym_pkey" primary key ("id"));');
    this.addSql('alter table "off"."item_synonym" add constraint "item_synonym_taxonomy_group_id_language_id_synonym_unique" unique ("taxonomy_group_id", "language_id", "synonym");');

    this.addSql('create table "off"."item_property" ("item_version_id" uuid not null, "property_id" text not null, "value" text null, constraint "item_property_pkey" primary key ("item_version_id", "property_id"));');

    this.addSql('create table "off"."item_parent" ("item_version_id" uuid not null, "parent_item_id" text not null, "parent_taxonomy_group_id" text null, "parent_id" text null, constraint "item_parent_pkey" primary key ("item_version_id", "parent_item_id"));');
    this.addSql('create index "item_parent_parent_taxonomy_group_id_parent_id_index" on "off"."item_parent" ("parent_taxonomy_group_id", "parent_id");');

    this.addSql('create table "off"."item_name" ("item_taxonomy_group_id" text not null, "item_id" text not null, "language_id" text not null, "name" text not null, constraint "item_name_pkey" primary key ("item_taxonomy_group_id", "item_id", "language_id"));');

    this.addSql('create table "off"."item_description" ("item_taxonomy_group_id" text not null, "item_id" text not null, "language_id" text not null, "description" text not null, constraint "item_description_pkey" primary key ("item_taxonomy_group_id", "item_id", "language_id"));');

    this.addSql('create table "off"."taxonomy_stopword" ("id" uuid not null, "taxonomy_group_id" text not null, "language_id" text not null, "stop_word" text not null, constraint "taxonomy_stopword_pkey" primary key ("id"));');
    this.addSql('alter table "off"."taxonomy_stopword" add constraint "taxonomy_stopword_taxonomy_group_id_language_id_stop_word_unique" unique ("taxonomy_group_id", "language_id", "stop_word");');

    this.addSql('create table "off"."taxonomy_synonym_root" ("id" uuid not null, "taxonomy_group_id" text not null, "language_id" text not null, "root_word" text not null, constraint "taxonomy_synonym_root_pkey" primary key ("id"));');
    this.addSql('alter table "off"."taxonomy_synonym_root" add constraint "taxonomy_synonym_root_taxonomy_group_id_language_i_b2ae4_unique" unique ("taxonomy_group_id", "language_id", "root_word");');

    this.addSql('create table "off"."taxonomy_synonym" ("id" uuid not null, "taxonomy_group_id" text not null, "language_id" text not null, "synonym" text not null, "root_word_id" uuid not null, constraint "taxonomy_synonym_pkey" primary key ("id"));');
    this.addSql('alter table "off"."taxonomy_synonym" add constraint "taxonomy_synonym_taxonomy_group_id_language_id_synonym_unique" unique ("taxonomy_group_id", "language_id", "synonym");');

    this.addSql('alter table "off"."taxonomy" add constraint "taxonomy_group_id_foreign" foreign key ("group_id") references "off"."taxonomy_group" ("id") on update cascade;');

    this.addSql('alter table "off"."item" add constraint "item_taxonomy_group_id_foreign" foreign key ("taxonomy_group_id") references "off"."taxonomy_group" ("id") on update cascade;');
    this.addSql('alter table "off"."item" add constraint "item_taxonomy_id_foreign" foreign key ("taxonomy_id") references "off"."taxonomy" ("id") on update cascade;');
    this.addSql('alter table "off"."item" add constraint "item_current_version_id_foreign" foreign key ("current_version_id") references "off"."item_version" ("id") on update cascade on delete set null;');

    this.addSql('alter table "off"."product_ingredient" add constraint "product_ingredient_product_id_foreign" foreign key ("product_id") references "off"."product" ("id") on update cascade;');
    this.addSql('alter table "off"."product_ingredient" add constraint "product_ingredient_parent_product_id_parent_sequence_foreign" foreign key ("parent_product_id", "parent_sequence") references "off"."product_ingredient" ("product_id", "sequence") on update cascade on delete set null;');
    this.addSql('alter table "off"."product_ingredient" add constraint "product_ingredient_ingredient_taxonomy_group_id_i_21439_foreign" foreign key ("ingredient_taxonomy_group_id", "ingredient_id") references "off"."item" ("taxonomy_group_id", "id") on update cascade on delete set null;');

    this.addSql('alter table "off"."product_data_quality_tag" add constraint "product_data_quality_tag_product_id_foreign" foreign key ("product_id") references "off"."product" ("id") on update cascade;');
    this.addSql('alter table "off"."product_data_quality_tag" add constraint "product_data_quality_tag_item_taxonomy_group_id_item_id_foreign" foreign key ("item_taxonomy_group_id", "item_id") references "off"."item" ("taxonomy_group_id", "id") on update cascade on delete set null;');

    this.addSql('alter table "off"."item_version" add constraint "item_version_item_taxonomy_group_id_item_id_foreign" foreign key ("item_taxonomy_group_id", "item_id") references "off"."item" ("taxonomy_group_id", "id") on update cascade;');

    this.addSql('alter table "off"."item_synonym" add constraint "item_synonym_taxonomy_group_id_foreign" foreign key ("taxonomy_group_id") references "off"."taxonomy_group" ("id") on update cascade;');
    this.addSql('alter table "off"."item_synonym" add constraint "item_synonym_language_id_foreign" foreign key ("language_id") references "off"."language" ("id") on update cascade;');
    this.addSql('alter table "off"."item_synonym" add constraint "item_synonym_item_version_id_foreign" foreign key ("item_version_id") references "off"."item_version" ("id") on update cascade;');

    this.addSql('alter table "off"."item_property" add constraint "item_property_item_version_id_foreign" foreign key ("item_version_id") references "off"."item_version" ("id") on update cascade;');

    this.addSql('alter table "off"."item_parent" add constraint "item_parent_item_version_id_foreign" foreign key ("item_version_id") references "off"."item_version" ("id") on update cascade;');
    this.addSql('alter table "off"."item_parent" add constraint "item_parent_parent_taxonomy_group_id_parent_id_foreign" foreign key ("parent_taxonomy_group_id", "parent_id") references "off"."item" ("taxonomy_group_id", "id") on update cascade on delete set null;');

    this.addSql('alter table "off"."item_name" add constraint "item_name_item_taxonomy_group_id_item_id_foreign" foreign key ("item_taxonomy_group_id", "item_id") references "off"."item" ("taxonomy_group_id", "id") on update cascade;');
    this.addSql('alter table "off"."item_name" add constraint "item_name_language_id_foreign" foreign key ("language_id") references "off"."language" ("id") on update cascade;');

    this.addSql('alter table "off"."item_description" add constraint "item_description_item_taxonomy_group_id_item_id_foreign" foreign key ("item_taxonomy_group_id", "item_id") references "off"."item" ("taxonomy_group_id", "id") on update cascade;');
    this.addSql('alter table "off"."item_description" add constraint "item_description_language_id_foreign" foreign key ("language_id") references "off"."language" ("id") on update cascade;');

    this.addSql('alter table "off"."taxonomy_stopword" add constraint "taxonomy_stopword_taxonomy_group_id_foreign" foreign key ("taxonomy_group_id") references "off"."taxonomy_group" ("id") on update cascade;');
    this.addSql('alter table "off"."taxonomy_stopword" add constraint "taxonomy_stopword_language_id_foreign" foreign key ("language_id") references "off"."language" ("id") on update cascade;');

    this.addSql('alter table "off"."taxonomy_synonym_root" add constraint "taxonomy_synonym_root_taxonomy_group_id_foreign" foreign key ("taxonomy_group_id") references "off"."taxonomy_group" ("id") on update cascade;');
    this.addSql('alter table "off"."taxonomy_synonym_root" add constraint "taxonomy_synonym_root_language_id_foreign" foreign key ("language_id") references "off"."language" ("id") on update cascade;');

    this.addSql('alter table "off"."taxonomy_synonym" add constraint "taxonomy_synonym_taxonomy_group_id_foreign" foreign key ("taxonomy_group_id") references "off"."taxonomy_group" ("id") on update cascade;');
    this.addSql('alter table "off"."taxonomy_synonym" add constraint "taxonomy_synonym_language_id_foreign" foreign key ("language_id") references "off"."language" ("id") on update cascade;');
    this.addSql('alter table "off"."taxonomy_synonym" add constraint "taxonomy_synonym_root_word_id_foreign" foreign key ("root_word_id") references "off"."taxonomy_synonym_root" ("id") on update cascade;');
  }

}
