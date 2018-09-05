import * as MD5 from 'blueimp-md5';
import { Injectable } from '@nestjs/common';
import { logger } from '../logger';

@Injectable()
export class ShortService {
  private key: string = 'dwz_key';
  private chars: string[] = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h',
    'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
    'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5',
    '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
    'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
    'U', 'V', 'W', 'X', 'Y', 'Z',
  ];
  private rChars: string[];

  constructor() {
    this.rChars = this.shuffle(this.chars);
  }

  public generateShortUrl(url: string, force?: boolean): string[] {
    if (force) {
      this.rChars = this.shuffle(this.chars);
    }

    const hex = MD5(this.key + url);
    const results = [];
    for (let i = 0; i < 4; i++) {
      const partial = hex.substring(i * 8, i * 8 + 8);
      let lHexLong = 0x3FFFFFFF & parseInt(partial, 16);
      let output = '';

      for (let j = 0; j < 6; j++) {
        const index = 0x0000003D & lHexLong;
        output += (this.rChars[index]);
        lHexLong = lHexLong >> 5;
      }

      results[i] = output.toString();
    }

    logger.info(`url: ${url} keys: ${JSON.stringify(results)}`);
    return results;
  }

  private shuffle(pokers, times?, scope?) {
    times = times === undefined ? 15 : times;
    scope = scope === undefined ? 5 : scope;

    let index0;
    let index1;
    const len = pokers.length;
    let i = 0;
    let temp;
    let r0;
    let r1;

    while (times > 0) {
      index0 = Math.floor(Math.random() * len);
      index1 = Math.floor(Math.random() * len);

      while (index0 === index1) {
        index1 = Math.floor(Math.random() * len);
      }
      for (i = 0; i < scope; i++) {
        r0 = index0 % len;
        r1 = index1 % len;
        temp = pokers[r0];
        pokers[r0] = pokers[r1];
        pokers[r1] = temp;
        index0++;
        index1++;
      }
      times--;
    }

    return pokers;
  }
}