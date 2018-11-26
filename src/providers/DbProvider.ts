import { createConnection } from 'typeorm';
import * as path from 'path';
import { logger, TypeormLogger } from '../logger';
import { Boot, BOOTSTRAP_PROVIDER } from 'nest-boot';
import { ConsulService, CONSUL_SERVICE_PROVIDER } from 'nest-consul-service';
// import { EntitySubscriber } from '../libs/EntitySubscriber';

export const DatabaseProvider = {
  provide: 'connection',
  useFactory: async (service: ConsulService, boot: Boot) => {
    const services = await service.getServices('mysql-external-service', { passing: true });
    const dataSource = services[0] || boot.get('dataSource') || {};

    return await createConnection({
      type: 'mysql',
      host: dataSource.address || boot.get('dataSource.host', 'localhost'),
      port: dataSource.port || boot.get('dataSource.port', 3306),
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
  inject: [CONSUL_SERVICE_PROVIDER, BOOTSTRAP_PROVIDER],
};
