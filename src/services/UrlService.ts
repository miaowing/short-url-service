import { Injectable } from '@nestjs/common';
import { ShortService } from './ShortService';
import { Url } from '../domains';
import { UrlRepository } from '../repositories';

@Injectable()
export class UrlService {
  constructor(
    private readonly shortService: ShortService,
    private readonly urlRepo: UrlRepository,
  ) {
  }

  async shortUrl(address: string) {
    const isExist = await this.urlRepo.findUrlByAddress(address);
    if (isExist) {
      return isExist;
    }

    let url = null;
    let keys = this.shortService.generateShortUrl(address);

    let index = 0;
    while (true) {
      try {
        url = new Url(keys[index], address, '/' + keys[index]);
        url.createdAt = new Date().getTime();
        await this.urlRepo.insert(url);
        break;
      } catch (e) {
        index++;
        if (index === 4) {
          keys = this.shortService.generateShortUrl(address, true);
          index = 0;
        }
      }
    }

    return url;
  }
}