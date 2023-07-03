import { Migration } from '@mikro-orm/migrations';

export class Migration20230703105308 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "off"."product" add column "ingredients_text" text null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "off"."product" drop column "ingredients_text";');
  }

}
