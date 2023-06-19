import { Test } from "@nestjs/testing";
import { DomainModule } from "../domain.module";
import { TaxonomyService } from "./taxonomy.service";
import { MikroORM, RequestContext } from "@mikro-orm/core";

describe('importFromGit', () => {
  jest.setTimeout(60000);
  it('imports a taxonomy', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [DomainModule],
    }).compile();

    const taxonomyService = moduleRef.get(TaxonomyService);
    const orm = moduleRef.get(MikroORM);
    try {
      await RequestContext.createAsync(orm.em, async () => {
        await taxonomyService.importFromGit();
      });
    } finally {
      orm.close();
    }
  });
});