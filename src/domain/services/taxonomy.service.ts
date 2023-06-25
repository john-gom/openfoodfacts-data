import { EntityManager } from "@mikro-orm/core";
import { Injectable, Logger } from "@nestjs/common";
import { Taxonomy } from "../entities/taxonomy";
import { TaxonomySynonymRoot } from "../entities/taxonomy-synonym-root";
import { Language } from "../entities/language";
import { TaxonomySynonym } from "../entities/taxonomy-synonym";
import { TaxonomyStopword } from "../entities/taxonomy-stopword";
import { BaseEntity } from "../entities/base-entity";
import { Item } from "../entities/item";
import { ItemVersion } from "../entities/item-version";
import { ItemName } from "../entities/item-name";
import { ItemSynonym } from "../entities/item-synonym";
import { ItemDescription } from "../entities/item-description";
import { ItemProperty } from "../entities/item-property";
import { ItemParent } from "../entities/item-parent";
import { TaxonomyGroup } from "../entities/taxonomy-group";

@Injectable()
export class TaxonomyService {
  logger = new Logger(TaxonomyService.name);

  constructor(private em: EntityManager) { }
  existing = new Map<object, Map<string, BaseEntity>>();

  async importFromGit() {
    await this.em.nativeDelete(ItemProperty, {});
    await this.em.nativeDelete(ItemParent, {});
    await this.em.nativeDelete(ItemSynonym, {});
    await this.em.nativeDelete(ItemDescription, {});
    await this.em.nativeDelete(ItemName, {});
    await this.em.nativeDelete(ItemVersion, {});
    await this.em.nativeDelete(Item, {});

    await this.em.nativeDelete(TaxonomyStopword, {});
    await this.em.nativeDelete(TaxonomySynonym, {});
    await this.em.nativeDelete(TaxonomySynonymRoot, {});
    await this.em.nativeDelete(Taxonomy, {});
    await this.em.nativeDelete(TaxonomyGroup, {});

    await this.em.nativeDelete(Language, {});

    await this.importTaxonomy('additives', 'ingredients');
    await this.importTaxonomy('ingredients', 'ingredients');

    // Assign parents
    for (const parent of Object.values(this.existing[ItemParent.name])) {
      const itemParent = parent as ItemParent;
      // Note we match on anything in the same group
      const parentParts = itemParent.parentItemId.split(':');
      itemParent.parent = this.existing[ItemSynonym.name]
      [`${itemParent.itemVersion.item.taxonomy.group.id}: ${parentParts[0].trim()}: ${parentParts[1].trim()}`]
        ?.itemVersion?.item;
    }
    await this.em.flush();
  }

  async importTaxonomy(id: string, groupId: string) {
    const body = (await fetch(`https://raw.githubusercontent.com/openfoodfacts/openfoodfacts-server/main/taxonomies/${id}.txt`)).body;
    const reader = body.pipeThrough(new TextDecoderStream()).getReader();

    let buffer = "";
    while (true) {
      const { done, value } = await reader.read();
      buffer += value;
      if (done) break;
    }
    const lines = buffer.split('\n');
    let i = 0;
    const self = this;
    function nextLine() {
      while (true) {
        if (i >= lines.length)
          return null;

        const originalLine = lines[i++];
        let line = originalLine.trim();
        if (line.startsWith('#'))
          continue;

        // replace ’ (typographique quote) to simple quote '
        line = line.replace(/’/g, "'");
        // replace commas that have no space around by a lower comma character
        // and do the same for escaped comma (preceded by a \)
        // (to distinguish them from commas acting as tags separators)
        line = line.replace(/(\d),(\d)/g, '$1‚$2');
        line = line.replace(/\\,/g, '\\‚');
        // removes parenthesis for roman numeral
        line = line.replace(/\(([ivx]+)\)/g, '$1');
        return {
          file: id,
          parts: line.split(':'),
          originalLine: originalLine,
          lineNumber: i,
          allLines: lines
        };
      }
    }
    const group = this.upsert(new TaxonomyGroup(groupId), {}, true);
    const taxonomy = this.upsert(new Taxonomy(id, group), {});

    main_loop:
    while (true) {
      let line = nextLine();
      if (line == null) break;
      let parts = line.parts;

      try {
        if (parts.length < 2)
          continue;

        // TODO: Deal with commas in between numbers and escaped commas
        // TODO: Normalise quotes
        if (parts[0] === 'synonyms') {
          const language = this.upsert(new Language(parts[1]), line, false);
          const words = this.remainder(parts, 2).split(',');

          const rootWord = this.upsert(new TaxonomySynonymRoot(group, language, words[0].trim()), line);
          for (const synonym of words.slice(1)) {
            this.upsert(new TaxonomySynonym(group, language, rootWord, synonym.trim()), line);
          }
        } else if (parts[0] === 'stopwords') {
          const language = this.upsert(new Language(parts[1]), line, false);
          const words = this.remainder(parts, 2).split(',');
          for (const stopWord of words) {
            this.upsert(new TaxonomyStopword(group, language, stopWord.trim()), line);
          }
        } else {
          // A taxonomy entry. Read the block until the next blank line
          const entryLines = [];
          let item: Item = null;
          while (parts?.length > 1) {
            if (!item && parts.length === 2 && !parts[0].startsWith('<')) {
              let words = this.remainder(parts, 1).split(',');
              let language = this.upsert(new Language(parts[0]), line, false);
              item = this.upsert(new Item(taxonomy, language, words[0]), line);
              const itemVersion = this.upsert(new ItemVersion(item), line);
              item.currentVersion = itemVersion;
              this.upsert(new ItemName(item.currentVersion, language, words[0].trim()), line);
              for (const synonym of words) {
                this.upsert(new ItemSynonym(item.currentVersion, language, synonym.trim()), line);
              }
            } else {
              entryLines.push(line);
            }
            line = nextLine();
            parts = line?.parts;
            // If we get a blank line but don't have an id yet then skip it as some entries have a description with a space after
            if (parts?.length < 2 && !item) {
              line = nextLine();
              parts = line.parts;
            }
          }
          if (!item) {
            this.logger.error(`No canonical id for group starting '${entryLines[0].originalLine}' at ${entryLines[0].lineNumber} in ${entryLines[0].file}`);
            continue;
          }

          for (line of entryLines) {
            parts = line.parts;
            if (parts[0].startsWith('<')) {
              const language = this.upsert(new Language(parts[0].substring(1)), line, false);
              this.upsert(new ItemParent(item.currentVersion, language, this.remainder(parts, 1)), line);
            } else if (parts.length === 2) {
              const language = this.upsert(new Language(parts[0]), line, false);
              const words = this.remainder(parts, 1).split(',');
              this.upsert(new ItemName(item.currentVersion, language, words[0].trim()), line);
              for (const synonym of words) {
                this.upsert(new ItemSynonym(item.currentVersion, language, synonym.trim()), line);
              }
            } else if (parts[0] === 'description') {
              const language = this.upsert(new Language(parts[1]), line, false);
              this.upsert(new ItemDescription(item.currentVersion, language, this.remainder(parts, 2).trim()), line);
            } else {
              // Must be a property
              this.upsert(new ItemProperty(item.currentVersion, `${parts[0]}:${parts[1]}`, this.remainder(parts, 2).trim()), line);
            }
          }
        }
      } catch (e) {
        console.error(`${e.message}: at line ${line?.lineNumber}: ${line?.originalLine}\n${e.stack}`);
      }
    }

    await this.em.flush();
  }

  private upsert<T extends BaseEntity>(entity: T, line: any, logDuplicates = true): T {
    const entityType = entity.constructor.name;
    const dataString = entity.businessKey().join(':');
    let cache = this.existing[entityType];
    const existingEntity = cache?.[dataString];
    if (existingEntity) {
      if (logDuplicates)
        this.logger.warn(`Duplicate: ${entityType}: '${dataString}' at ${line.lineNumber} in ${line.file}: '${line.originalLine}'`);

      return existingEntity;
    } else {
      if (!cache) {
        cache = this.existing[entityType] = new Map<string, BaseEntity>();
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