import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { logger } from '../logger';

@Catch()
class AnyExceptionFilterCls implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        if (!(exception instanceof HttpException)) {
            logger.error(`Some unexpected exception was happened.`, exception);
            response.status(400).json({
                code: 400,
                message: exception.message,
                timestamp: new Date().toISOString(),
                path: request.url,
            });
        } else {
            logger.warn(`Request fail.`, exception);

            const e = exception as HttpException;
            response.status(e.getStatus()).json({
                code: e.getStatus(),
                message: e.message.message,
                timestamp: new Date().toISOString(),
                path: request.url,
            });
        }
    }
}

export const AnyExceptionsFilter = {
    provide: APP_FILTER,
    useClass: AnyExceptionFilterCls,
};