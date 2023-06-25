import { EntityManager } from "@mikro-orm/core";
import { Injectable } from "@nestjs/common";
import { MongoClient } from "mongodb";
import { Product } from "../entities/product";
import * as fs from 'fs';
import * as readline from 'readline';

@Injectable()
export class ProductService {
  constructor(private em: EntityManager) { }

  async importFromFile() {
    const rl = readline.createInterface({
      input: fs.createReadStream('data/openfoodfacts-products.jsonl')
    });

    const start = new Date().getTime();
    await this.em.nativeDelete(Product, {});
    let i = 0;
    for await (const line of rl) {
      const product = JSON.parse(line);
      this.em.persist(new Product(product._id.toString(), product));
      // Lowish batch size seems to work best, probably due to the size of the product document
      if (!(++i % 10)) {
        await this.em.flush();
        this.em.clear();
        console.log((new Date().getTime() - start) + ': ' + i);
      }
      if (i > 2320) break;
    }
    await this.em.flush();
    console.log((new Date().getTime() - start) + ': ' + i);
  }

  async importFromMongo() {
    const start = new Date().getTime();
    await this.em.nativeDelete(Product, {});
    const client = new MongoClient('mongodb://127.0.0.1:27017');
    await client.connect();
    const db = client.db('off');
    const products = db.collection('products');
    const cursor = products.find();
    let i = 0;
    while (true) {
      const product = await cursor.next();
      if (!product) break;

      this.em.persist(new Product(product._id.toString(), product));
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
}