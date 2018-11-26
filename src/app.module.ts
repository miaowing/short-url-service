import { Module } from '@nestjs/common';
import * as controllers from './controllers';
import * as filters from './filters';
import * as repos from './repositories';
import * as services from './services';
import { DatabaseProvider, getCustomRepo } from './providers';
import { ConsulModule, CONSUL_ADAPTER } from 'nest-consul';
import { BootModule, BOOT_ADAPTER } from 'nest-boot';
import { ConsulConfigModule } from 'nest-consul-config';
import { ConsulServiceModule } from 'nest-consul-service';
import { LoadbalanceModule } from 'nest-consul-loadbalance';
import { FeignModule, CONSUL_LOADBALANCE } from 'nest-feign';

const env = process.env.NODE_ENV || 'development';

@Module({
  imports: [
    BootModule.register(__dirname, `bootstrap-${ env }.yml`),
    ConsulModule.register({ adapter: BOOT_ADAPTER }),
    ConsulConfigModule.register({ adapter: BOOT_ADAPTER }),
    ConsulServiceModule.register({ adapter: BOOT_ADAPTER }),
    LoadbalanceModule.register({ adapter: CONSUL_ADAPTER }),
    FeignModule.register({ adapter: CONSUL_LOADBALANCE }),
  ],
  controllers: components(controllers),
  providers: components(DatabaseProvider, doRepo(repos), services, filters),
})
export class AppModule {
}

function components(...components: any[]) {
  const results = [];
  components.forEach(component => {
    if (typeof component === 'function') {
      results.push(component);
    } else if (!!(typeof component === 'object' && component.provide)) {
      results.push(component);
    } else if (typeof component === 'object') {
      for (const key in component) {
        if (!component.hasOwnProperty(key)) {
          continue;
        }
        results.push(component[key]);
      }
    }
  });
  return results;
}

function doRepo(...repositories: any[]) {
  const results = [];
  repositories.forEach(repo => {
    if (typeof repo === 'function') {
      results.push(getCustomRepo(repo.name, repo));
    } else if (typeof repo === 'object') {
      for (const key in repo) {
        if (!repo.hasOwnProperty(key)) {
          continue;
        }
        results.push(getCustomRepo(repo[key].name, repo[key]));
      }
    }
  });

  return results;
}
