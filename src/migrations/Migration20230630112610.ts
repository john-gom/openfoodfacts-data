import { Migration } from '@mikro-orm/migrations';

export class Migration20230630112610 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "off"."product_ingredient" alter column "percent_min" type double precision using ("percent_min"::double precision);');
    this.addSql('alter table "off"."product_ingredient" alter column "percent_max" type double precision using ("percent_max"::double precision);');
    this.addSql('alter table "off"."product_ingredient" alter column "percent_estimate" type double precision using ("percent_estimate"::double precision);');
  }

  async down(): Promise<void> {
    this.addSql('alter table "off"."product_ingredient" alter column "percent_min" type int using ("percent_min"::int);');
    this.addSql('alter table "off"."product_ingredient" alter column "percent_max" type int using ("percent_max"::int);');
    this.addSql('alter table "off"."product_ingredient" alter column "percent_estimate" type int using ("percent_estimate"::int);');
  }

}
