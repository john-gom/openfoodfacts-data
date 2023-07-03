import { Migration } from '@mikro-orm/migrations';

export class Migration20230703172647 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "off"."taxonomy_comment" ("taxonomy_id" text not null, "original_line" int not null, "original_position" int null, "value" text null, constraint "taxonomy_comment_pkey" primary key ("taxonomy_id", "original_line"));');

    this.addSql('alter table "off"."taxonomy_comment" add constraint "taxonomy_comment_taxonomy_id_foreign" foreign key ("taxonomy_id") references "off"."taxonomy" ("id") on update cascade;');

    this.addSql('alter table "off"."taxonomy_stopword" add column "original_line" int null, add column "original_position" int null;');

    this.addSql('alter table "off"."taxonomy_synonym" add column "original_line" int null, add column "original_position" int null;');

    this.addSql('alter table "off"."text_content" add column "original_line" int null, add column "original_position" int null;');

    this.addSql('alter table "off"."tag_synonym" add column "original_line" int null, add column "original_position" int null;');

    this.addSql('alter table "off"."tag_property" add column "original_line" int null, add column "original_position" int null;');

    this.addSql('alter table "off"."tag_parent" add column "original_line" int null, add column "original_position" int null;');

    this.addSql('alter table "off"."text_translation" add column "original_line" int null, add column "original_position" int null;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "off"."taxonomy_comment" cascade;');

    this.addSql('alter table "off"."taxonomy_stopword" drop column "original_line";');
    this.addSql('alter table "off"."taxonomy_stopword" drop column "original_position";');

    this.addSql('alter table "off"."taxonomy_synonym" drop column "original_line";');
    this.addSql('alter table "off"."taxonomy_synonym" drop column "original_position";');

    this.addSql('alter table "off"."text_content" drop column "original_line";');
    this.addSql('alter table "off"."text_content" drop column "original_position";');

    this.addSql('alter table "off"."tag_synonym" drop column "original_line";');
    this.addSql('alter table "off"."tag_synonym" drop column "original_position";');

    this.addSql('alter table "off"."tag_property" drop column "original_line";');
    this.addSql('alter table "off"."tag_property" drop column "original_position";');

    this.addSql('alter table "off"."tag_parent" drop column "original_line";');
    this.addSql('alter table "off"."tag_parent" drop column "original_position";');

    this.addSql('alter table "off"."text_translation" drop column "original_line";');
    this.addSql('alter table "off"."text_translation" drop column "original_position";');
  }

}
