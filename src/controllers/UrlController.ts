import { Body, Controller, Get, Header, NotFoundException, Param, Post, Res } from '@nestjs/common';
import { UrlRepository } from '../repositories';
import { UrlService } from '../services';
import { Boot, InjectBoot } from 'nest-boot';

@Controller('')
export class UrlController {
  constructor(
    private readonly urlRepo: UrlRepository,
    private readonly urlService: UrlService,
    @InjectBoot() private readonly boot: Boot,
  ) {
  }

  @Get('api/urls/:id')
  @Header('Access-Control-Allow-Origin', '*')
  async getUrl(@Param('id') id: string) {
    const url = await this.urlRepo.findUrlById(id);
    if (!url) {
      throw new NotFoundException(`The short url ${id} is not exist`);
    }
    url.shortUrl = this.boot.get('web.host', 'https://zf.ink') + url.shortUrl;
    return url;
  }

  @Post('api/urls')
  @Header('Access-Control-Allow-Origin', '*')
  async createUrl(@Body('url') url: string) {
    const urlObj = await this.urlService.shortUrl(url);
    if (urlObj) {
      urlObj.shortUrl = this.boot.get('web.host', 'https://zf.ink') + urlObj.shortUrl;
    }
    return urlObj;
  }

  @Get(':id')
  @Header('Access-Control-Allow-Origin', '*')
  async forward(@Param('id') id: string, @Res() res) {
    const url = await this.urlRepo.findUrlById(id);
    if (!url) {
      res.writeHead(302, { location: `${this.boot.get('web.host', 'https://zf.ink')}/short-url` });
    } else {
      res.writeHead(302, { location: url.url });
    }
    res.end();
  }
}