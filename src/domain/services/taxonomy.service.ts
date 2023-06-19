import { EntityManager } from "@mikro-orm/core";
import { Injectable } from "@nestjs/common";
import { Taxonomy } from "../entities/taxonomy";
import { TaxonomySynonymRoot } from "../entities/taxonomy-synonym-root";
import { Language } from "../entities/language";
import { TaxonomySynonym } from "../entities/taxonomy-synonym";
import { TaxonomyStopword } from "../entities/taxonomy-stopword";
import { BaseEntity } from "../entities/base-entity";

@Injectable()
export class TaxonomyService {
  constructor(private em: EntityManager) { }
  existing = new Map<object, Map<string, BaseEntity>>();

  async importFromGit(id: string) {
    await this.em.nativeDelete(TaxonomyStopword, {});
    await this.em.nativeDelete(TaxonomySynonym, {});
    await this.em.nativeDelete(TaxonomySynonymRoot, {});
    await this.em.nativeDelete(Taxonomy, {});
    await this.em.nativeDelete(Language, {});

    const body = (await fetch(`https://raw.githubusercontent.com/openfoodfacts/openfoodfacts-server/main/taxonomies/${id}.txt`)).body;
    const reader = body.pipeThrough(new TextDecoderStream()).getReader();

    let buffer = "";
    while (true) {
      const { done, value } = await reader.read();
      buffer += value;
      if (done) break;
    }
    const lines = buffer.split('\n');
    const taxonomy = this.upsert(new Taxonomy(id));
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];

      if (line.trim() === '' || line.startsWith('#'))
        continue;

      // TODO: Deal with commas in between numbers and escaped commas
      // TODO: Normalise quotes
      const parts = line.split(':');
      if (parts[0] === 'synonyms') {
        const language = this.upsert(new Language(parts[1]), false);
        const words = this.remainder(parts, 2).split(',');

        const rootWord = this.upsert(new TaxonomySynonymRoot(taxonomy, language, words[0].trim()));
        for (const synonym of words.slice(1)) {
          this.upsert(new TaxonomySynonym(taxonomy, language, rootWord, synonym.trim()));
        }
      } else if (parts[0] === 'stopwords') {
        const language = this.upsert(new Language(parts[1]), false);
        const words = this.remainder(parts, 2).split(',');
        for (const stopWord of words) {
          this.upsert(new TaxonomyStopword(taxonomy, language, stopWord.trim()));
        }
      } else {
        // A taxonomy entry
        const parents = [];
        while (line.startsWith('<') || line.startsWith('#')) {
          if (line.startsWith('<')) {
            parents.push(line.substring(1));
          }
          line = lines[++i];
        }

        // Canonical id line


        do {

        } while (line.trim() !== '')
      }
    }
    await this.em.flush();
  }

  private upsert<T extends BaseEntity>(entity: T, logDuplicates = true): T {
    const taxonomy = entity.constructor.name;
    const dataString = entity.businessKey().join(': ');
    let cache = this.existing[taxonomy];
    const existingEntity = cache?.[dataString];
    if (existingEntity) {
      if (logDuplicates)
        console.log(`Ignoring Duplicate ${taxonomy}: ${dataString}`);

      return existingEntity;
    } else {
      if (!cache) {
        cache = this.existing[taxonomy] = new Map<string, BaseEntity>();
      }
      cache[dataString] = entity;
      this.em.persist(entity);
    }
    return entity;
  }

  private remainder(parts: string[], index: number) {
    if (parts[index].trim() === '' && (index + 1) < parts.length)
      index++;
    return parts.slice(index).join(':');
  }
}