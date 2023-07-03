import { Migration } from '@mikro-orm/migrations';

export class Migration20230703163543 extends Migration {

  async up(): Promise<void> {
    this.addSql('drop index "off"."product_searchable_name_index";');
    this.addSql('alter table "off"."product" rename column "searchable_name" to "search";');
    this.addSql('create index "product_search_index" on "off"."product" using gin("search");');
  }

  async down(): Promise<void> {
    this.addSql('drop index "off"."product_search_index";');
    this.addSql('alter table "off"."product" rename column "search" to "searchable_name";');
    this.addSql('create index "product_searchable_name_index" on "off"."product" using gin("searchable_name");');
  }

}
