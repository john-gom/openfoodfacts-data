import { Migration } from '@mikro-orm/migrations';

export class Migration20230619115108 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "off"."item" drop constraint "item_current_version_id_foreign";');

    this.addSql('alter table "off"."item" alter column "current_version_id" drop default;');
    this.addSql('alter table "off"."item" alter column "current_version_id" type uuid using ("current_version_id"::text::uuid);');
    this.addSql('alter table "off"."item" alter column "current_version_id" drop not null;');
    this.addSql('alter table "off"."item" add constraint "item_current_version_id_foreign" foreign key ("current_version_id") references "off"."item_version" ("id") on update cascade on delete set null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "off"."item" drop constraint "item_current_version_id_foreign";');

    this.addSql('alter table "off"."item" alter column "current_version_id" drop default;');
    this.addSql('alter table "off"."item" alter column "current_version_id" type uuid using ("current_version_id"::text::uuid);');
    this.addSql('alter table "off"."item" alter column "current_version_id" set not null;');
    this.addSql('alter table "off"."item" add constraint "item_current_version_id_foreign" foreign key ("current_version_id") references "off"."item_version" ("id") on update cascade;');
  }

}
