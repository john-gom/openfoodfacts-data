import { Migration } from '@mikro-orm/migrations';

export class Migration20230627174000 extends Migration {

  async up(): Promise<void> {
    this.addSql('COMMENT ON CONSTRAINT item_parent_parent_taxonomy_group_id_parent_id_foreign ON "off".item_parent IS \'@foreignSimpleFieldName children\';');
  }
}
