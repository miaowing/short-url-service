import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestLogger } from './logger';
import { Boot } from 'nest-boot';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

async function bootstrap() {
    const boot = new Boot(__dirname);
    const app = await NestFactory.create(AppModule, { logger: new NestLogger() });
    const options = new DocumentBuilder()
        .setTitle(boot.get('web.serviceName'))
        .setDescription(boot.get('web.serviceName') + ' api documents')
        .setVersion('1.0.0')
        .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('/documents', app, document);
    await app.listen(boot.get('web.port', 4444));
}

bootstrap();
