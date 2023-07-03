import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import postgraphile from 'postgraphile';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    postgraphile(
      "postgres://postgres:cactus789@127.0.0.1:5432/postgres",
      "off",
      {
        watchPg: true,
        graphiql: true,
        enhanceGraphiql: true,
        allowExplain: true,
        simpleCollections: 'only',
        disableDefaultMutations: true,
        appendPlugins: [
          require('@graphile-contrib/pg-simplify-inflector'),
          require('postgraphile-plugin-connection-filter'),
          require('@pyramation/postgraphile-plugin-fulltext-filter'),
        ],
        graphileBuildOptions: {
          pgOmitListSuffix: true,
          pgSimplifyAllRows: true,
          connectionFilterRelations: true,
          connectionFilterUseListInflectors: true,
        },
      }
    )
  );
  await app.listen(3000);
}
bootstrap();
