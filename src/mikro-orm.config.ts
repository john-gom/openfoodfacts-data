import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { Platform, TextType, Type } from '@mikro-orm/core';

export default {
  entities: ['./dist/domain/entities'],
  entitiesTs: ['./src/domain/entities'],
  metadataProvider: TsMorphMetadataProvider,
  //dbName: 'postgres',
  dbName: 'full',
  user: 'productopener',
  password: 'productopener',
  port: 5512,
  schema: 'off',
  type: 'postgresql',
  discovery: {
    getMappedType(type: string, platform: Platform) {
      // override the mapping for string properties only
      if (type === 'string') {
        return Type.getType(TextType);
      }

      return platform.getDefaultMappedType(type);
    },
  },
};
