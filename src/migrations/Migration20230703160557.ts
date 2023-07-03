import { Migration } from '@mikro-orm/migrations';

export class Migration20230703160557 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "off"."product" add column "searchable_name" tsvector null;');
    this.addSql('create index "product_searchable_name_index" on "off"."product" using gin("searchable_name");');
  }

  async down(): Promise<void> {
    this.addSql('drop index "off"."product_searchable_name_index";');
    this.addSql('alter table "off"."product" drop column "searchable_name";');
  }

}
