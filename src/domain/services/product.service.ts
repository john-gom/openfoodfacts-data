import { EntityManager } from "@mikro-orm/core";
import { Injectable } from "@nestjs/common";
import { MongoClient } from "mongodb";
import { Product } from "../entities/product";
import * as fs from 'fs';
import * as readline from 'readline';
import { Ulid } from "id128";
import { ProductDataQualityTag } from "../entities/product-data-quality-tag";
import { Item } from "../entities/item";

@Injectable()
export class ProductService {
  dataQualityTags: Item[];
  constructor(private em: EntityManager) { }

  async cacheTags() {
    this.dataQualityTags = await this.em.find(Item, { taxonomy: { id: 'data_quality' } });
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
        this.em.persist(await this.createProduct(product));
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

      this.em.persist(await this.createProduct(product));
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
    await this.em.nativeDelete(Product, {});
  }

  async createProduct(offProduct: any): Promise<Product> {
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
    return product;
  }
}