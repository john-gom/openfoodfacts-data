import { Migration } from '@mikro-orm/migrations';

export class Migration20230703081402 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "off"."tag" drop constraint "tag_current_version_id_foreign";');

    this.addSql('alter table "off"."tag_synonym" drop constraint "tag_synonym_tag_version_id_foreign";');

    this.addSql('alter table "off"."tag_property" drop constraint "tag_property_tag_version_id_foreign";');

    this.addSql('alter table "off"."tag_parent" drop constraint "tag_parent_tag_version_id_foreign";');

    this.addSql('drop table if exists "off"."tag_version" cascade;');

    this.addSql('alter table "off"."tag" drop constraint "tag_current_version_id_unique";');
    this.addSql('alter table "off"."tag" drop column "current_version_id";');

    this.addSql('alter table "off"."tag_synonym" add column "tag_taxonomy_group_id" text not null, add column "tag_id" text not null;');
    this.addSql('alter table "off"."tag_synonym" drop column "tag_version_id";');
    this.addSql('alter table "off"."tag_synonym" add constraint "tag_synonym_tag_taxonomy_group_id_tag_id_foreign" foreign key ("tag_taxonomy_group_id", "tag_id") references "off"."tag" ("taxonomy_group_id", "id") on update cascade;');

    this.addSql('alter table "off"."tag_property" add column "tag_taxonomy_group_id" text not null, add column "tag_id" text not null;');
    this.addSql('alter table "off"."tag_property" drop constraint "tag_property_pkey";');
    this.addSql('alter table "off"."tag_property" drop column "tag_version_id";');
    this.addSql('alter table "off"."tag_property" add constraint "tag_property_tag_taxonomy_group_id_tag_id_foreign" foreign key ("tag_taxonomy_group_id", "tag_id") references "off"."tag" ("taxonomy_group_id", "id") on update cascade;');
    this.addSql('alter table "off"."tag_property" add constraint "tag_property_pkey" primary key ("tag_taxonomy_group_id", "tag_id", "property_id");');

    this.addSql('alter table "off"."tag_parent" add column "tag_id" text not null, add column "parent_value" text not null;');
    this.addSql('alter table "off"."tag_parent" drop constraint "tag_parent_pkey";');
    this.addSql('alter table "off"."tag_parent" drop column "tag_version_id";');
    this.addSql('alter table "off"."tag_parent" rename column "parent_tag_id" to "tag_taxonomy_group_id";');
    this.addSql('alter table "off"."tag_parent" add constraint "tag_parent_tag_taxonomy_group_id_tag_id_foreign" foreign key ("tag_taxonomy_group_id", "tag_id") references "off"."tag" ("taxonomy_group_id", "id") on update cascade;');
    this.addSql('alter table "off"."tag_parent" add constraint "tag_parent_pkey" primary key ("tag_taxonomy_group_id", "tag_id", "parent_value");');
  }

  async down(): Promise<void> {
    this.addSql('create table "off"."tag_version" ("id" uuid not null, "tag_taxonomy_group_id" text not null, "tag_id" text not null, "created_on" timestamptz(0) not null, "valid_fron" timestamptz(0) null, "valid_to" timestamptz(0) null, constraint "tag_version_pkey" primary key ("id"));');

    this.addSql('alter table "off"."tag_version" add constraint "tag_version_tag_taxonomy_group_id_tag_id_foreign" foreign key ("tag_taxonomy_group_id", "tag_id") references "off"."tag" ("taxonomy_group_id", "id") on update cascade;');

    this.addSql('alter table "off"."tag_synonym" drop constraint "tag_synonym_tag_taxonomy_group_id_tag_id_foreign";');

    this.addSql('alter table "off"."tag_property" drop constraint "tag_property_tag_taxonomy_group_id_tag_id_foreign";');

    this.addSql('alter table "off"."tag_parent" drop constraint "tag_parent_tag_taxonomy_group_id_tag_id_foreign";');

    this.addSql('alter table "off"."tag" add column "current_version_id" uuid null;');
    this.addSql('alter table "off"."tag" add constraint "tag_current_version_id_foreign" foreign key ("current_version_id") references "off"."tag_version" ("id") on update cascade on delete set null;');
    this.addSql('alter table "off"."tag" add constraint "tag_current_version_id_unique" unique ("current_version_id");');

    this.addSql('alter table "off"."tag_synonym" add column "tag_version_id" uuid not null;');
    this.addSql('alter table "off"."tag_synonym" add constraint "tag_synonym_tag_version_id_foreign" foreign key ("tag_version_id") references "off"."tag_version" ("id") on update cascade;');
    this.addSql('alter table "off"."tag_synonym" drop column "tag_taxonomy_group_id";');
    this.addSql('alter table "off"."tag_synonym" drop column "tag_id";');

    this.addSql('alter table "off"."tag_property" add column "tag_version_id" uuid not null;');
    this.addSql('alter table "off"."tag_property" drop constraint "tag_property_pkey";');
    this.addSql('alter table "off"."tag_property" add constraint "tag_property_tag_version_id_foreign" foreign key ("tag_version_id") references "off"."tag_version" ("id") on update cascade;');
    this.addSql('alter table "off"."tag_property" drop column "tag_taxonomy_group_id";');
    this.addSql('alter table "off"."tag_property" drop column "tag_id";');
    this.addSql('alter table "off"."tag_property" add constraint "tag_property_pkey" primary key ("tag_version_id", "property_id");');

    this.addSql('alter table "off"."tag_parent" add column "tag_version_id" uuid not null, add column "parent_tag_id" text not null;');
    this.addSql('alter table "off"."tag_parent" drop constraint "tag_parent_pkey";');
    this.addSql('alter table "off"."tag_parent" add constraint "tag_parent_tag_version_id_foreign" foreign key ("tag_version_id") references "off"."tag_version" ("id") on update cascade;');
    this.addSql('alter table "off"."tag_parent" drop column "tag_taxonomy_group_id";');
    this.addSql('alter table "off"."tag_parent" drop column "tag_id";');
    this.addSql('alter table "off"."tag_parent" drop column "parent_value";');
    this.addSql('alter table "off"."tag_parent" add constraint "tag_parent_pkey" primary key ("tag_version_id", "parent_tag_id");');
  }

}
