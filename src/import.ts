import { NestFactory } from '@nestjs/core';
import { TaxonomyService } from './domain/services/taxonomy.service';
import { MikroORM, RequestContext } from '@mikro-orm/core';
import { DomainModule } from './domain/domain.module';
import { ProductService } from './domain/services/product.service';

async function bootstrap() {
  const app = await NestFactory.create(DomainModule);
  const orm = app.get(MikroORM);
  try {
    await RequestContext.createAsync(orm.em, async () => {
      //await app.get(TaxonomyService).importFromGit();
      await app.get(ProductService).importFromFile(true);
      //await app.get(ProductService).importFromMongo();
      //await app.get(ProductService).fixupProducts();
    });
  } finally {
    await orm.close();
  }
}
bootstrap();
