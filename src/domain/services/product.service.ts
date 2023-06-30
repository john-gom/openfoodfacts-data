import { EntityManager } from "@mikro-orm/core";
import { Injectable } from "@nestjs/common";
import { MongoClient } from "mongodb";
import { Product } from "../entities/product";
import * as fs from 'fs';
import * as readline from 'readline';
import { Ulid } from "id128";

@Injectable()
export class ProductService {
  constructor(private em: EntityManager) { }

  async importFromFile() {
    const rl = readline.createInterface({
      input: fs.createReadStream('data/openfoodfacts-products.jsonl')
    });

    await this.em.nativeDelete(Product, {});
    const start = new Date().getTime();
    let i = 0;
    for await (const line of rl) {
      try {
        i++;
        const product = JSON.parse(line.replace(/\\u0000/g, ''));
        this.em.persist(new Product(Ulid.generate().toCanonical(), product));
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
    console.log((new Date().getTime() - start) + ': Deleting old products');
    await this.em.nativeDelete(Product, {});
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

      this.em.persist(new Product(Ulid.generate().toCanonical(), product));
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