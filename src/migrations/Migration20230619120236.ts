import { Migration } from '@mikro-orm/migrations';

export class Migration20230619120236 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "off"."item" alter column "id" type varchar(500) using ("id"::varchar(500));');

    this.addSql('alter table "off"."item_version" alter column "item_id" type varchar(500) using ("item_id"::varchar(500));');
  }

  async down(): Promise<void> {
    this.addSql('alter table "off"."item" alter column "id" type varchar(255) using ("id"::varchar(255));');

    this.addSql('alter table "off"."item_version" alter column "item_id" type varchar(255) using ("item_id"::varchar(255));');
  }

}
