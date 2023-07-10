import { Migration } from '@mikro-orm/migrations';

export class Migration20230710145907 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "off"."taxonomy_stopword" drop constraint "taxonomy_stopword_taxonomy_group_id_language_id_stop_word_uniqu";');
    this.addSql('alter table "off"."taxonomy_stopword" add constraint "taxonomy_stopword_taxonomy_group_id_language_id_stop_word_unique" unique ("taxonomy_group_id", "language_id", "stop_word");');
  }

  async down(): Promise<void> {
    this.addSql('alter table "off"."taxonomy_stopword" drop constraint "taxonomy_stopword_taxonomy_group_id_language_id_stop_word_unique";');
    this.addSql('alter table "off"."taxonomy_stopword" add constraint "taxonomy_stopword_taxonomy_group_id_language_id_stop_word_uniqu" unique ("taxonomy_group_id", "language_id", "stop_word");');
  }

}
