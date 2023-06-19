import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { TaxonomyService } from "./services/taxonomy.service";

@Module({ imports: [MikroOrmModule.forRoot()], providers: [TaxonomyService] })
export class DomainModule { }