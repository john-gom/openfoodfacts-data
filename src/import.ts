import { NestFactory } from '@nestjs/core';
import { TaxonomyService } from './domain/services/taxonomy.service';
import { MikroORM, RequestContext } from '@mikro-orm/core';
import { DomainModule } from './domain/domain.module';

async function bootstrap() {
  const app = await NestFactory.create(DomainModule);
  const taxonomyService = app.get(TaxonomyService);
  const orm = app.get(MikroORM);
  try {
    await RequestContext.createAsync(orm.em, async () => {
      await taxonomyService.importFromGit();
    });
  } finally {
    await orm.close();
  }
}
bootstrap();
