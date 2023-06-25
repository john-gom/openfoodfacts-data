import { EntityManager } from "@mikro-orm/core";
import { Injectable } from "@nestjs/common";
import { MongoClient } from "mongodb";
import { Product } from "../entities/product";

@Injectable()
export class ProductService {
  constructor(private em: EntityManager) { }

  async import() {
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
      // Lowish batch size seems to work best, probably du to the size of the product document
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