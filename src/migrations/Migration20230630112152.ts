import { Migration } from '@mikro-orm/migrations';

export class Migration20230630112152 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "off"."product_ingredient" alter column "percent_min" type int using ("percent_min"::int);');
    this.addSql('alter table "off"."product_ingredient" alter column "percent_min" drop not null;');
    this.addSql('alter table "off"."product_ingredient" alter column "percent_max" type int using ("percent_max"::int);');
    this.addSql('alter table "off"."product_ingredient" alter column "percent_max" drop not null;');
    this.addSql('alter table "off"."product_ingredient" alter column "percent_estimate" type int using ("percent_estimate"::int);');
    this.addSql('alter table "off"."product_ingredient" alter column "percent_estimate" drop not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "off"."product_ingredient" alter column "percent_min" type int using ("percent_min"::int);');
    this.addSql('alter table "off"."product_ingredient" alter column "percent_min" set not null;');
    this.addSql('alter table "off"."product_ingredient" alter column "percent_max" type int using ("percent_max"::int);');
    this.addSql('alter table "off"."product_ingredient" alter column "percent_max" set not null;');
    this.addSql('alter table "off"."product_ingredient" alter column "percent_estimate" type int using ("percent_estimate"::int);');
    this.addSql('alter table "off"."product_ingredient" alter column "percent_estimate" set not null;');
  }

}
