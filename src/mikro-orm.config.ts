import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
export default {
  entities: ['./dist/domain/entities'],
  entitiesTs: ['./src/domain/entities'],
  metadataProvider: TsMorphMetadataProvider,
  dbName: 'postgres',
  user: 'postgres',
  password: 'cactus789',
  schema: 'off',
  type: 'postgresql',
};
