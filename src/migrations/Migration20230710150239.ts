import { Migration } from '@mikro-orm/migrations';

export class Migration20230710150239 extends Migration {

  async up(): Promise<void> {
    this.addSql('create index "product_tag_tag_type_value_product_id_index" on "off"."product_tag" ("tag_type", "value", "product_id");');
  }

  async down(): Promise<void> {
    this.addSql('drop index "off"."product_tag_tag_type_value_product_id_index";');
  }

}
