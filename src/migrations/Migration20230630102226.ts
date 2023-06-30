import { Migration } from '@mikro-orm/migrations';

export class Migration20230630102226 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "off"."product" alter column "name" type varchar(255) using ("name"::varchar(255));');
    this.addSql('alter table "off"."product" alter column "name" drop not null;');
    this.addSql('alter table "off"."product" alter column "code" type varchar(255) using ("code"::varchar(255));');
    this.addSql('alter table "off"."product" alter column "code" drop not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "off"."product" alter column "name" type varchar(255) using ("name"::varchar(255));');
    this.addSql('alter table "off"."product" alter column "name" set not null;');
    this.addSql('alter table "off"."product" alter column "code" type varchar(255) using ("code"::varchar(255));');
    this.addSql('alter table "off"."product" alter column "code" set not null;');
  }

}
