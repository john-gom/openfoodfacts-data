import { Migration } from '@mikro-orm/migrations';

export class Migration20230619123425 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "off"."item_description" ("item_version_id" uuid not null, "language_id" varchar(255) not null, "description" varchar(8000) not null, constraint "item_description_pkey" primary key ("item_version_id", "language_id"));');

    this.addSql('alter table "off"."item_description" add constraint "item_description_item_version_id_foreign" foreign key ("item_version_id") references "off"."item_version" ("id") on update cascade;');
    this.addSql('alter table "off"."item_description" add constraint "item_description_language_id_foreign" foreign key ("language_id") references "off"."language" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "off"."item_description" cascade;');
  }

}
