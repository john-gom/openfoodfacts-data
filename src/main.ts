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
        simpleCollections: 'only',
        appendPlugins: [require("@graphile-contrib/pg-simplify-inflector")],
        graphileBuildOptions: {
          pgOmitListSuffix: true,
          /*
           * Uncomment if you want 'userPatch' instead of 'patch' in update
           * mutations.
           */
          //pgSimplifyPatch: false,
          /*
           * Uncomment if you want 'allUsers' instead of 'users' at root level.
           */
          //pgSimplifyAllRows: false,
          /*
           * Uncomment if you want primary key queries and mutations to have
           * `ById` (or similar) suffix; and the `nodeId` queries/mutations
           * to lose their `ByNodeId` suffix.
           */
          // pgShortPk: true,
        },
      }
    )
  );
  await app.listen(3000);
}
bootstrap();
