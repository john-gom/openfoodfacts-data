import { Migration } from '@mikro-orm/migrations';

export class Migration20230703084432 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "off"."text_content" ("id" uuid not null, "subject" text not null, "original_language_id" text not null, "original_text" text not null, constraint "text_content_pkey" primary key ("id"));');

    this.addSql('create table "off"."text_translation" ("text_content_id" uuid not null, "language_id" text not null, "translated_text" text not null, constraint "text_translation_pkey" primary key ("text_content_id", "language_id"));');

    this.addSql('alter table "off"."text_content" add constraint "text_content_original_language_id_foreign" foreign key ("original_language_id") references "off"."language" ("id") on update cascade;');

    this.addSql('alter table "off"."text_translation" add constraint "text_translation_text_content_id_foreign" foreign key ("text_content_id") references "off"."text_content" ("id") on update cascade;');
    this.addSql('alter table "off"."text_translation" add constraint "text_translation_language_id_foreign" foreign key ("language_id") references "off"."language" ("id") on update cascade;');

    this.addSql('drop table if exists "off"."tag_name" cascade;');

    this.addSql('drop table if exists "off"."tag_description" cascade;');

    this.addSql('alter table "off"."tag" add column "name_id" uuid not null, add column "description_id" uuid null;');
    this.addSql('alter table "off"."tag" add constraint "tag_name_id_foreign" foreign key ("name_id") references "off"."text_content" ("id") on update cascade;');
    this.addSql('alter table "off"."tag" add constraint "tag_description_id_foreign" foreign key ("description_id") references "off"."text_content" ("id") on update cascade on delete set null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "off"."tag" drop constraint "tag_name_id_foreign";');

    this.addSql('alter table "off"."tag" drop constraint "tag_description_id_foreign";');

    this.addSql('alter table "off"."text_translation" drop constraint "text_translation_text_content_id_foreign";');

    this.addSql('create table "off"."tag_name" ("tag_taxonomy_group_id" text not null, "tag_id" text not null, "language_id" text not null, "name" text not null, constraint "tag_name_pkey" primary key ("tag_taxonomy_group_id", "tag_id", "language_id"));');

    this.addSql('create table "off"."tag_description" ("tag_taxonomy_group_id" text not null, "tag_id" text not null, "language_id" text not null, "description" text not null, constraint "tag_description_pkey" primary key ("tag_taxonomy_group_id", "tag_id", "language_id"));');

    this.addSql('alter table "off"."tag_name" add constraint "tag_name_tag_taxonomy_group_id_tag_id_foreign" foreign key ("tag_taxonomy_group_id", "tag_id") references "off"."tag" ("taxonomy_group_id", "id") on update cascade;');
    this.addSql('alter table "off"."tag_name" add constraint "tag_name_language_id_foreign" foreign key ("language_id") references "off"."language" ("id") on update cascade;');

    this.addSql('alter table "off"."tag_description" add constraint "tag_description_tag_taxonomy_group_id_tag_id_foreign" foreign key ("tag_taxonomy_group_id", "tag_id") references "off"."tag" ("taxonomy_group_id", "id") on update cascade;');
    this.addSql('alter table "off"."tag_description" add constraint "tag_description_language_id_foreign" foreign key ("language_id") references "off"."language" ("id") on update cascade;');

    this.addSql('drop table if exists "off"."text_content" cascade;');

    this.addSql('drop table if exists "off"."text_translation" cascade;');

    this.addSql('alter table "off"."tag" drop column "name_id";');
    this.addSql('alter table "off"."tag" drop column "description_id";');
  }

}
