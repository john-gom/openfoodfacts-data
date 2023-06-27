import { Migration } from '@mikro-orm/migrations';

export class Migration20230627154124 extends Migration {

  async up(): Promise<void> {
    this.addSql('create index "item_parent_parent_taxonomy_group_id_parent_id_index" on "off"."item_parent" ("parent_taxonomy_group_id", "parent_id");');
  }

  async down(): Promise<void> {
    this.addSql('drop index "off"."item_parent_parent_taxonomy_group_id_parent_id_index";');
  }

}
