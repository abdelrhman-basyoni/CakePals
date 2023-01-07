import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { logger } from './logger';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const method = request.method;
        const url = request.url;
        const now = Date.now();
        return next
            .handle()
            .pipe(
                tap(() => {
                    logger.info(
                        `${method} ${url} ${new Date().toISOString()} ${Date.now() - now}ms`
                      )
                    
                }
                ),
            );
    }
}