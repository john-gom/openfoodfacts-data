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
      }
    )
  );
  await app.listen(3000);
}
bootstrap();
