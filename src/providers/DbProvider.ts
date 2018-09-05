import { createConnection } from 'typeorm';
import * as path from 'path';
import { TypeormLogger } from '../logger';
import { Boot } from 'nest-boot';
// import { EntitySubscriber } from '../libs/EntitySubscriber';

export const DatabaseProvider = {
  provide: 'connection',
  useFactory: async (boot: Boot) => {
    return await createConnection({
      type: 'mysql',
      host: boot.get('dataSource.host', 'localhost'),
      port: boot.get('dataSource.port', 3306),
      username: boot.get('dataSource.username', 'root'),
      password: boot.get('dataSource.password', ''),
      database: boot.get('dataSource.database', 'cloud-service'),
      entities: [path.resolve(__dirname, '../') + '/domains/*{.ts,.js}'],
      synchronize: boot.get('dataSource.synchronize', false),
      maxQueryExecutionTime: boot.get('dataSource.maxQueryExecutionTime', 1000),
      logging: ['error', 'warn'],
      logger: new TypeormLogger(),
      // subscribers: [EntitySubscriber],
    });
  },
  inject: ['BootstrapProvider'],
};