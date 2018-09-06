import { Body, Controller, Get, Header, NotFoundException, Param, Post, Query, Res } from '@nestjs/common';
import { UrlRepository } from '../repositories';
import { UrlService } from '../services';
import { Boot, InjectBoot } from 'nest-boot';
import { IsURL } from 'nest-validations';

@Controller('')
export class UrlController {
    private readonly prefix;

    constructor(
        private readonly urlRepo: UrlRepository,
        private readonly urlService: UrlService,
        @InjectBoot() private readonly boot: Boot,
    ) {
        this.prefix = this.boot.get('web.host', 'https://zf.ink');
        ;
    }

    @Get('api/urls')
    async getUrls(@Query('url') url) {
        const id = url.replace(this.prefix, '');
        const urlObj = await this.urlRepo.findUrlById(id);
        if (urlObj) {
            urlObj.shortUrl = this.prefix + urlObj.shortUrl;
        }
        return urlObj;
    }

    @Get('api/urls/:id')
    @Header('Access-Control-Allow-Origin', '*')
    async getUrl(@Param('id') id: string) {
        const url = await this.urlRepo.findUrlById(id);
        if (!url) {
            throw new NotFoundException(`The short url ${id} is not exist`);
        }
        url.shortUrl = this.prefix + url.shortUrl;
        return url;
    }

    @Post('api/urls')
    @Header('Access-Control-Allow-Origin', '*')
    async createUrl(@Body('url', new IsURL()) url: string) {
        const urlObj = await this.urlService.shortUrl(url);
        if (urlObj) {
            urlObj.shortUrl = this.prefix + urlObj.shortUrl;
        }
        return urlObj;
    }

    @Get(':id')
    @Header('Access-Control-Allow-Origin', '*')
    async forward(@Param('id') id: string, @Res() res) {
        const url = await this.urlRepo.findUrlById(id);
        if (!url) {
            res.writeHead(302, { location: `${this.prefix}/short-url` });
        } else {
            res.writeHead(302, { location: url.url });
        }
        res.end();
    }
}