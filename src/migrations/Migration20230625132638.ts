import { Migration } from '@mikro-orm/migrations';

export class Migration20230625132638 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "off"."product" ("id" varchar(255) not null, "data" jsonb not null, constraint "product_pkey" primary key ("id"));');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "off"."product" cascade;');
  }

}
