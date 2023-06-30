import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { TaxonomyService } from "./services/taxonomy.service";
import { ProductService } from "./services/product.service";

@Module({
  imports: [
    MikroOrmModule.forRoot()
  ],
  providers: [TaxonomyService, ProductService]
})
export class DomainModule { }