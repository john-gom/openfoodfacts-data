import { Migration } from '@mikro-orm/migrations';

export class Migration20230616233607 extends Migration {

  async up(): Promise<void> {
    this.addSql('create schema if not exists "off";');

    this.addSql('create table "off"."language" ("id" varchar(255) not null, constraint "language_pkey" primary key ("id"));');

    this.addSql('create table "off"."taxonomy" ("id" varchar(255) not null, constraint "taxonomy_pkey" primary key ("id"));');

    this.addSql('create table "off"."taxonomy_stopword" ("id" uuid not null, "taxonomy_id" varchar(255) not null, "language_id" varchar(255) not null, "stop_word" varchar(255) not null, constraint "taxonomy_stopword_pkey" primary key ("id"));');
    this.addSql('alter table "off"."taxonomy_stopword" add constraint "taxonomy_stopword_taxonomy_id_language_id_stop_word_unique" unique ("taxonomy_id", "language_id", "stop_word");');

    this.addSql('create table "off"."taxonomy_synonym_root" ("id" uuid not null, "taxonomy_id" varchar(255) not null, "language_id" varchar(255) not null, "root_word" varchar(255) not null, constraint "taxonomy_synonym_root_pkey" primary key ("id"));');
    this.addSql('alter table "off"."taxonomy_synonym_root" add constraint "taxonomy_synonym_root_taxonomy_id_language_id_root_word_unique" unique ("taxonomy_id", "language_id", "root_word");');

    this.addSql('create table "off"."taxonomy_synonym" ("id" uuid not null, "taxonomy_id" varchar(255) not null, "language_id" varchar(255) not null, "synonym" varchar(255) not null, "root_word_id" uuid not null, constraint "taxonomy_synonym_pkey" primary key ("id"));');
    this.addSql('alter table "off"."taxonomy_synonym" add constraint "taxonomy_synonym_taxonomy_id_language_id_synonym_unique" unique ("taxonomy_id", "language_id", "synonym");');

    this.addSql('alter table "off"."taxonomy_stopword" add constraint "taxonomy_stopword_taxonomy_id_foreign" foreign key ("taxonomy_id") references "off"."taxonomy" ("id") on update cascade;');
    this.addSql('alter table "off"."taxonomy_stopword" add constraint "taxonomy_stopword_language_id_foreign" foreign key ("language_id") references "off"."language" ("id") on update cascade;');

    this.addSql('alter table "off"."taxonomy_synonym_root" add constraint "taxonomy_synonym_root_taxonomy_id_foreign" foreign key ("taxonomy_id") references "off"."taxonomy" ("id") on update cascade;');
    this.addSql('alter table "off"."taxonomy_synonym_root" add constraint "taxonomy_synonym_root_language_id_foreign" foreign key ("language_id") references "off"."language" ("id") on update cascade;');

    this.addSql('alter table "off"."taxonomy_synonym" add constraint "taxonomy_synonym_taxonomy_id_foreign" foreign key ("taxonomy_id") references "off"."taxonomy" ("id") on update cascade;');
    this.addSql('alter table "off"."taxonomy_synonym" add constraint "taxonomy_synonym_language_id_foreign" foreign key ("language_id") references "off"."language" ("id") on update cascade;');
    this.addSql('alter table "off"."taxonomy_synonym" add constraint "taxonomy_synonym_root_word_id_foreign" foreign key ("root_word_id") references "off"."taxonomy_synonym_root" ("id") on update cascade;');
  }

}
