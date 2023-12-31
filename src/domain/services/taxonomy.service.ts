import { EntityManager } from "@mikro-orm/core";
import { Injectable } from "@nestjs/common";
import { Taxonomy } from "../entities/taxonomy";
import { TaxonomySynonymRoot } from "../entities/taxonomy-synonym-root";
import { Language } from "../entities/language";
import { TaxonomySynonym } from "../entities/taxonomy-synonym";
import { TaxonomyStopword } from "../entities/taxonomy-stopword";
import { BaseEntity } from "../entities/base-entity";
import { Tag } from "../entities/tag";
import { TagSynonym } from "../entities/tag-synonym";
import { TagProperty } from "../entities/tag-property";
import { TagParent } from "../entities/tag-parent";
import { TaxonomyGroup } from "../entities/taxonomy-group";
import { TextTranslation } from "../entities/text-translation";
import { TextContent } from "../entities/text-content";
import { TaxonomyComment } from "../entities/taxonomy-comment";
import { ProductService } from "./product.service";

export const TAXONOMY_GROUPS = {
  'traces': ['allergens'],
  'amino_acids': ['amino_acids'],
  'categories': ['categories'],
  'data_quality': ['data_quality'],
  'food_groups': ['food_groups'],
  'improvements': ['improvements'],
  'ingredients_analysis': ['ingredients_analysis'],
  'ingredients_processing': ['ingredients_processing'],
  'ingredients': ['ingredients', 'additives_classes', 'additives', 'minerals', 'vitamins', 'nucleotides', 'other_nutritional_substances'],
  'labels': ['labels'],
  'languages': ['languages'],
  'misc': ['misc'],
  'nova_groups': ['nova_groups'],
  'nutrient_levels': ['nutrient_levels'],
  'nutrients': ['nutrients'],
  'origins': ['origins', 'countries'],
  'packaging': ['packaging_materials', 'packaging_shapes', 'packaging_recycling', 'preservation'],
  'periods_after_opening': ['periods_after_opening'],
  'states': ['states'],
}

@Injectable()
export class TaxonomyService {
  constructor(private em: EntityManager, private productService: ProductService) { }
  existing = new Map<object, Map<string, BaseEntity>>();

  start = Date.now();
  log(message: string) {
    console.log(`${Date.now() - this.start}: ${message}`);
  }
  async importFromGit() {
    await this.productService.deleteProductChildren();

    await this.productService.deleteAndFlush(TagProperty);
    await this.productService.deleteAndFlush(TagParent);
    await this.productService.deleteAndFlush(TagSynonym);
    await this.productService.deleteAndFlush(Tag);

    await this.productService.deleteAndFlush(TextTranslation);
    await this.productService.deleteAndFlush(TextContent);

    await this.productService.deleteAndFlush(TaxonomyStopword);
    await this.productService.deleteAndFlush(TaxonomySynonym);
    await this.productService.deleteAndFlush(TaxonomySynonymRoot);
    await this.productService.deleteAndFlush(TaxonomyComment);
    await this.productService.deleteAndFlush(Taxonomy);
    await this.productService.deleteAndFlush(TaxonomyGroup);
    await this.productService.deleteAndFlush(Language);

    for (const [taxonomyGroup, taxonomies] of Object.entries(TAXONOMY_GROUPS)) {
      for (const taxonomy of taxonomies) {
        await this.importTaxonomy(taxonomy, taxonomyGroup);
      }
    }

    // Assign parents
    for (const parent of Object.values(this.existing[TagParent.name])) {
      const tagParent = parent as TagParent;
      // Note we match on anything in the same group
      const parentParts = tagParent.parentValue.split(':');
      tagParent.parent = this.existing[TagSynonym.name]
      [`${tagParent.tag.taxonomy.group.id}:${parentParts[0].trim()}:${parentParts[1].trim()}`]
        ?.tagVersion?.tag;
    }
    await this.em.flush();
  }

  async importTaxonomy(id: string, groupId: string) {
    const group = this.upsert(new TaxonomyGroup(groupId), {}, false);
    const taxonomy = this.upsert(new Taxonomy(id, group), {});
    const self = this;

    const languagePrefix = /^[a-zA-Z][a-zA-Z][a-zA-Z]?([-_][a-zA-Z][a-zA-Z][a-zA-Z]?)?:/;

    this.log(`Importing: ${id}`);
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
    function nextLine() {
      while (true) {
        if (i >= lines.length)
          return null;

        const originalLine = lines[i++];
        let line = originalLine.trim();
        if (line.startsWith('#')) {
          self.em.persist(new TaxonomyComment(taxonomy, originalLine, i));
          continue;
        }

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

    main_loop:
    while (true) {
      let line = nextLine();
      if (line == null) break;
      let parts = line.parts;

      try {
        if (parts.length < 2) {
          this.em.persist(new TaxonomyComment(taxonomy, line.originalLine, line.lineNumber));
          continue;
        }

        // TODO: Deal with commas in between numbers and escaped commas
        // TODO: Normalise quotes
        if (parts[0] === 'synonyms') {
          const language = this.upsert(new Language(parts[1]), line, false);
          const words = this.remainder(parts, 2).split(',');

          const rootWord = this.upsert(new TaxonomySynonymRoot(group, language, words[0].trim()), line);
          let i = 0;
          for (const synonym of words.slice(1)) {
            this.upsert(new TaxonomySynonym(group, language, rootWord, synonym.trim(), line.lineNumber, i++), line);
          }
        } else if (parts[0] === 'stopwords') {
          const language = this.upsert(new Language(parts[1]), line, false);
          const words = this.remainder(parts, 2).split(',');
          let i = 0;
          for (const stopWord of words) {
            this.upsert(new TaxonomyStopword(group, language, stopWord.trim(), line.lineNumber, i++), line);
          }
        } else {
          // A taxonomy entry. Read the block until the next blank line
          const entryLines = [];
          let tag: Tag = null;
          while (parts?.length > 1) {
            if (!tag && languagePrefix.test(line.originalLine)) {
              let words = this.remainder(parts, 1).split(',');
              let language = this.upsert(new Language(parts[0]), line, false);
              const name = new TextContent(id, language, words[0], line.lineNumber);
              tag = this.upsert(new Tag(taxonomy, language, words[0], name), line);
              this.upsert(new TextTranslation(name, language, words[0].trim(), line.lineNumber), line);
              let i = 0;
              for (const synonym of words) {
                this.upsert(new TagSynonym(tag, language, synonym.trim(), line.lineNumber, i++), line);
              }
            } else {
              entryLines.push(line);
            }
            line = nextLine();
            parts = line?.parts;
            // If we get a blank line but don't have an id yet then skip it as some entries have a description with a space after
            if (parts?.length < 2 && !tag) {
              this.em.persist(new TaxonomyComment(taxonomy, line.originalLine, line.lineNumber));
              line = nextLine();
              parts = line.parts;
            }
          }
          if (!tag) {
            this.log(`No canonical id for group starting '${entryLines[0].originalLine}' at ${entryLines[0].lineNumber} in ${entryLines[0].file}`);
            continue;
          }

          for (line of entryLines) {
            parts = line.parts;
            if (parts[0].startsWith('<')) {
              const language = this.upsert(new Language(parts[0].substring(1)), line, false);
              this.upsert(new TagParent(tag, language, this.remainder(parts, 1), line.lineNumber), line);
            } else if (languagePrefix.test(line.originalLine) || parts.length === 2) {
              const language = this.upsert(new Language(parts[0]), line, false);
              const words = this.remainder(parts, 1).split(',');
              this.upsert(new TextTranslation(tag.name, language, words[0].trim(), line.lineNumber), line);
              let i = 0;
              for (const synonym of words) {
                this.upsert(new TagSynonym(tag, language, synonym.trim(), line.lineNumber, i++), line);
              }
            } else if (parts[0] === 'description') {
              const language = this.upsert(new Language(parts[1]), line, false);
              const text = this.remainder(parts, 2).trim();
              if (!tag.description) {
                tag.description = new TextContent(tag.name.asSubject(), language, text, line.lineNumber);
              }
              this.upsert(new TextTranslation(tag.description, language, text, line.lineNumber), line);
            } else {
              // Must be a property
              this.upsert(new TagProperty(tag, `${parts[0]}:${parts[1]}`, this.remainder(parts, 2).trim(), line.lineNumber), line);
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
        this.log(`Duplicate: ${entityType}: '${entity.friendlyKey()}' at ${line.lineNumber} in ${line.file}: '${line.originalLine}'`);

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