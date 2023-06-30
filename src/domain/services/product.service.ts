import { EntityManager } from "@mikro-orm/core";
import { Injectable } from "@nestjs/common";
import { MongoClient } from "mongodb";
import { Product } from "../entities/product";
import * as fs from 'fs';
import * as readline from 'readline';
import { Ulid } from "id128";
import { ProductDataQualityTag } from "../entities/product-data-quality-tag";
import { Item } from "../entities/item";
import { off } from "process";
import { ProductIngredient } from "../entities/product-ingredient";

@Injectable()
export class ProductService {
  dataQualityTags: Item[];
  ingredientTags: Item[];

  constructor(private em: EntityManager) { }

  async cacheTags() {
    this.dataQualityTags = await this.em.find(Item, { taxonomy: { id: 'data_quality' } });
    this.ingredientTags = await this.em.find(Item, { taxonomyGroup: { id: 'ingredients' } });
  }

  async importFromFile() {
    const rl = readline.createInterface({
      input: fs.createReadStream('data/openfoodfacts-products.jsonl')
    });

    await this.deleteProducts();
    await this.cacheTags();
    const start = new Date().getTime();
    let i = 0;
    for await (const line of rl) {
      try {
        i++;
        const product = JSON.parse(line.replace(/\\u0000/g, ''));
        this.em.persist(this.createProduct(product));
        // Lowish batch size seems to work best, probably due to the size of the product document
        if (!(i % 10)) {
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

  async importFromMongo() {
    const start = new Date().getTime();
    await this.deleteProducts();
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
      const product = await cursor.next();
      if (!product) break;

      this.em.persist(this.createProduct(product));
      // Lowish batch size seems to work best, probably due to the size of the product document
      if (!(++i % 20)) {
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

  async deleteProducts() {
    console.log('Deleting old products');
    await this.em.nativeDelete(ProductDataQualityTag, {});
    await this.em.nativeDelete(ProductIngredient, {});
    await this.em.nativeDelete(Product, {});
  }

  createProduct(offProduct: any): Product {
    const product = this.em.create(Product, {
      id: Ulid.generate().toCanonical(),
      data: offProduct,
      name: offProduct.product_name,
      code: offProduct.code
    });
    for (const tag of offProduct.data_quality_tags ?? []) {
      product.dataQualityTags.add(this.em.create(ProductDataQualityTag, {
        tag: tag,
        item: this.dataQualityTags.find((item) => item.id === tag)
      }));
    }

    this.createIngredients(product, 0, offProduct.ingredients);

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
        ingredient: this.ingredientTags.find((item) => item.id === offIngredient.id)
      });
      product.ingredients.add(ingredient);
      if (offIngredient.ingredients) {
        sequence = this.createIngredients(product, sequence, offIngredient.ingredients, ingredient);
      }
    }
    return sequence;
  }
}