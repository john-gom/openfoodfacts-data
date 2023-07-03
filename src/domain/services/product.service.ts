import { EntityManager, QueryOrder } from "@mikro-orm/core";
import { Injectable } from "@nestjs/common";
import { MongoClient } from "mongodb";
import { Product } from "../entities/product";
import * as fs from 'fs';
import * as readline from 'readline';
import { ProductTag } from "../entities/product-tag";
import { Tag } from "../entities/tag";
import { ProductIngredient } from "../entities/product-ingredient";
import { Taxonomy } from "../entities/taxonomy";

@Injectable()
export class ProductService {
  dataQualityTags: Tag[];
  ingredientTags: Tag[];

  // Lowish batch size seems to work best, probably due to the size of the product document
  importBatchSize = 20;
  constructor(private em: EntityManager) { }

  async cacheTags() {
    this.dataQualityTags = await this.em.find(Tag, { taxonomy: { id: 'data_quality' } });
    this.ingredientTags = await this.em.find(Tag, { taxonomyGroup: { id: 'ingredients' } });
  }

  async importFromFile(update = false) {
    const rl = readline.createInterface({
      input: fs.createReadStream('data/openfoodfacts-products.jsonl')
    });

    await this.deleteProducts(update);
    await this.cacheTags();
    const start = new Date().getTime();
    let i = 0;
    for await (const line of rl) {
      try {
        i++;
        const data = JSON.parse(line.replace(/\\u0000/g, ''));

        this.em.persist(this.fixupProduct(await this.findOrNewProduct(update, data), data));
        if (!(i % this.importBatchSize)) {
          await this.em.flush();
          this.em.clear();
          console.log((new Date().getTime() - start) + ': ' + i);
        }
      } catch (e) {
        console.log(e.message + ': ' + line);
      }
    }
    await this.em.flush();
    console.log((new Date().getTime() - start) + ': ' + i);
  }

  private async findOrNewProduct(update: boolean, data: any) {
    let product: Product;
    if (update) {
      const code = data.code;
      if (code) product = await this.em.findOne(Product, { code: code });
    }
    if (!product) product = new Product();
    return product;
  }

  async importFromMongo(update = false) {
    const start = new Date().getTime();
    await this.deleteProducts(update);
    await this.cacheTags();
    console.log((new Date().getTime() - start) + ': Connecting to MongoDB');
    const client = new MongoClient('mongodb://127.0.0.1:27017');
    await client.connect();
    const db = client.db('off');
    const products = db.collection('products');
    const cursor = products.find();
    let i = 0;
    console.log((new Date().getTime() - start) + ': Starting import');
    while (true) {
      const data = await cursor.next();
      if (!data) break;

      this.em.persist(this.fixupProduct(await this.findOrNewProduct(update, data), data));
      if (!(++i % this.importBatchSize)) {
        await this.em.flush();
        this.em.clear();
        console.log((new Date().getTime() - start) + ': ' + i);
      }
    }
    await this.em.flush();
    console.log((new Date().getTime() - start) + ': ' + i);
    await cursor.close();
    await client.close();
  }

  async deleteProducts(update) {
    await this.deleteProductChildren();
    if (!update) {
      console.log('Deleting old products');
      await this.em.nativeDelete(Product, {});
    }
  }

  async deleteProductChildren() {
    console.log('Deleting product child data');
    await this.em.nativeDelete(ProductTag, {});
    await this.em.nativeDelete(ProductIngredient, {});
  }

  fixupProduct(product: Product, data: any): Product {
    //product.data = data;
    product.name = data.product_name;
    product.code = data.code;

    //product.dataQualityTags.removeAll();
    let i = 0;
    for (const value of data.data_quality_tags ?? []) {
      this.em.persist(this.em.create(ProductTag, {
        product: product,
        sequence: i++,
        value: value,
        taxonomy: this.em.getReference(Taxonomy, 'data_quality'),
        tag: this.dataQualityTags.find((tag) => tag.id === value)
      }));
    }

    //product.ingredients.removeAll();
    this.createIngredients(product, 0, data.ingredients);

    return product;
  }

  createIngredients(product: Product, sequence: number, ingredients: any[], parent?: ProductIngredient) {
    for (const offIngredient of ingredients ?? []) {
      const ingredient = this.em.create(ProductIngredient, {
        product: product,
        sequence: sequence++,
        id: offIngredient.id,
        text: offIngredient.text,
        percentMin: offIngredient.percent_min,
        percentMax: offIngredient.percent_max,
        percentEstimate: offIngredient.percent_estimate,
        parent: parent,
        ingredient: this.ingredientTags.find((tag) => tag.id === offIngredient.id)
      });
      this.em.persist(ingredient);
      if (offIngredient.ingredients) {
        sequence = this.createIngredients(product, sequence, offIngredient.ingredients, ingredient);
      }
    }
    return sequence;
  }
}