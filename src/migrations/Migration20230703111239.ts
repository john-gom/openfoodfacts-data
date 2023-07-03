import { Migration } from '@mikro-orm/migrations';

export class Migration20230703111239 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "off"."product_tag" drop constraint "product_tag_taxonomy_id_foreign";');

    this.addSql('alter table "off"."product_tag" add column "tag_type" text not null;');
    this.addSql('alter table "off"."product_tag" drop constraint "product_tag_pkey";');
    this.addSql('alter table "off"."product_tag" drop column "taxonomy_id";');
    this.addSql('alter table "off"."product_tag" add constraint "product_tag_pkey" primary key ("product_id", "tag_type", "sequence");');
  }

  async down(): Promise<void> {
    this.addSql('alter table "off"."product_tag" add column "taxonomy_id" text null;');
    this.addSql('alter table "off"."product_tag" drop constraint "product_tag_pkey";');
    this.addSql('alter table "off"."product_tag" add constraint "product_tag_taxonomy_id_foreign" foreign key ("taxonomy_id") references "off"."taxonomy" ("id") on update cascade on delete set null;');
    this.addSql('alter table "off"."product_tag" drop column "tag_type";');
    this.addSql('alter table "off"."product_tag" add constraint "product_tag_pkey" primary key ("product_id", "sequence");');
  }

}
